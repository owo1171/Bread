// Static site audit over the production server: status codes, canonical/OG
// uniqueness, FAQ schema vs visible <details>, internal link health, img alt.
//   npm run build && npm run start  →  node scripts/site-audit.mjs [baseUrl]
const BASE = process.argv[2] ?? "http://127.0.0.1:3000";

const ROUTES = [
  "/",
  "/mortgage-payoff-calculator",
  "/amortization-calculator",
  "/refinance-break-even-calculator",
  "/mortgage-recast-calculator",
  "/property-tax-calculator",
  "/how-much-house-can-i-afford",
  "/mortgage-calculators",
  "/about",
  "/methodology",
  "/privacy",
  "/terms",
  "/affiliate-disclosure",
];

const pick = (html, re) => (html.match(re) || [])[1] ?? null;

const problems = [];
const internal = new Set();
const titles = new Map();
const descriptions = new Map();

for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  const raw = await res.text();
  // Schema / markup detection needs the scripts, so scan the raw HTML for
  // those; the literal-text check below uses `visible` instead.
  const html = raw;
  const visible = raw
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ");

  if (res.status !== 200) problems.push(`${route}: HTTP ${res.status}`);

  const title = pick(html, /<title[^>]*>([^<]*)<\/title>/);
  const desc = pick(html, /<meta name="description" content="([^"]*)"/);
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/);
  const ogTitle = pick(html, /<meta property="og:title" content="([^"]*)"/);
  const ogDesc = pick(html, /<meta property="og:description" content="([^"]*)"/);
  const questions = (html.match(/"@type":"Question"/g) || []).length;
  const hasFaqPage = html.includes('"@type":"FAQPage"');
  const details = (html.match(/<details/g) || []).length;
  const imgs = (html.match(/<img /g) || []).length;
  const imgsWithoutAlt = (html.match(/<img (?![^>]*\balt=)/g) || []).length;

  for (const h of html.match(/href="(\/[^"#?]*)"/g) || []) {
    const clean = h.slice(6, -1);
    if (!clean.startsWith("//")) internal.add(clean);
  }

  if (title) {
    if (titles.has(title)) problems.push(`duplicate <title>: ${route} and ${titles.get(title)}`);
    titles.set(title, route);
  }
  if (desc) {
    if (descriptions.has(desc)) problems.push(`duplicate meta description: ${route}`);
    descriptions.set(desc, route);
  }
  if (!desc) problems.push(`${route}: missing meta description`);
  if (!canonical) problems.push(`${route}: missing canonical`);
  if (canonical && !canonical.startsWith("https://bread-nine-iota.vercel.app")) {
    problems.push(`${route}: canonical not on the production domain → ${canonical}`);
  }
  if (hasFaqPage && questions !== details) {
    problems.push(`${route}: FAQPage has ${questions} Question(s) but page shows ${details} <details>`);
  }
  if (!hasFaqPage && details > 0) problems.push(`${route}: ${details} FAQs but no FAQPage schema`);
  if (imgsWithoutAlt > 0) problems.push(`${route}: ${imgsWithoutAlt} <img> without alt`);
  if (/NaN|Infinity|undefined/.test(visible)) problems.push(`${route}: suspicious literal in visible HTML`);

  const expectedOg = route === "/" || route === "/mortgage-calculators";
  if (expectedOg && !ogTitle) problems.push(`${route}: missing og:title`);
  if (ogTitle && ogDesc && ogTitle === title) {
    // fine, but note only when og description duplicates the meta description exactly
  }
  console.log(
    `${String(res.status)} ${route.padEnd(34)} title=${title ? title.length : 0}ch desc=${desc ? desc.length : 0}ch ogT=${ogTitle ? "y" : "-"} ogD=${ogDesc ? "y" : "-"} faq=${details}/schema=${questions} alt-miss=${imgsWithoutAlt}`,
  );
}

console.log("");
console.log("--- 内部链接健康检查（去重后）---");
const links = [...internal].sort();
for (const link of links) {
  const res = await fetch(BASE + link);
  const ok = res.status === 200;
  console.log(`  ${res.status} ${link}${ok ? "" : "  ← BROKEN"}`);
  if (!ok) problems.push(`broken internal link: ${link} → HTTP ${res.status}`);
}

console.log("");
for (const probe of ["/definitely-not-a-page", "/mortgage-payoff", "/icon.svg", "/robots.txt", "/sitemap.xml"]) {
  const res = await fetch(BASE + probe);
  const expect404 = probe === "/definitely-not-a-page" || probe === "/mortgage-payoff";
  console.log(`  ${res.status} ${probe}${expect404 ? " (期望 404)" : ""}`);
  if (expect404 && res.status !== 404) {
    problems.push(`${probe} should be 404, got ${res.status}`);
  }
  if (!expect404 && res.status !== 200) {
    problems.push(`${probe} should be 200, got ${res.status}`);
  }
}

console.log("");
if (problems.length === 0) {
  console.log("✅ 审计通过：没有发现问题");
} else {
  console.log(`⚠️ 发现 ${problems.length} 个问题：`);
  problems.forEach((p) => console.log("   - " + p));
}
process.exit(problems.length ? 1 : 0);
