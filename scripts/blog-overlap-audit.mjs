// 博客重复度审查 v2：先剥掉 <article> 头部的标题/阅读时长/更新日期，只比较正文。
import fs from "node:fs";
import path from "node:path";

const DIR = "F:/gjz/tool-site-plan/app/.next/server/app/blog";
const SLUGS = [
  "how-to-lower-your-mortgage-payment",
  "15-year-vs-30-year-mortgage",
  "first-time-homebuyer-mistakes",
  "how-much-cash-to-buy-a-house",
  "credit-score-and-mortgage-rates",
  "amortization-schedule-explained",
  "pros-cons-larger-down-payment",
  "how-to-get-pre-approved",
];

const bodyOf = (html) => {
  const art = (html.match(/<article[\s\S]*?<\/article>/) || [""])[0];
  const text = art.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ").replace(/[“”"'’]/g, "").replace(/\s+/g, " ").trim();
  // 文章头：H1 + "N min read" + "Updated Month DD, YYYY"，正文从其后的第一句开始
  const cut = text.search(/Updated [A-Z][a-z]+ \d{1,2}, \d{4}/);
  return cut >= 0 ? text.slice(cut + 24).trim() : text;
};
const words = (t) => t.toLowerCase().match(/[a-z0-9$%][a-z0-9$%.,()\-]*/g) || [];

const docs = {};
for (const s of SLUGS) {
  const text = bodyOf(fs.readFileSync(path.join(DIR, `${s}.html`), "utf8"));
  const tok = words(text);
  const sh = new Set();
  for (let i = 0; i + 6 <= tok.length; i++) sh.add(tok.slice(i, i + 6).join(" "));
  docs[s] = { text, tok, sh };
}

console.log("=== 正文规模（已剥掉标题/日期头）===");
for (const s of SLUGS) console.log(`  ${s.padEnd(34)} ${String(docs[s].tok.length).padStart(4)} 词`);

const pairs = [];
for (let i = 0; i < SLUGS.length; i++) {
  for (let j = i + 1; j < SLUGS.length; j++) {
    const a = docs[SLUGS[i]], b = docs[SLUGS[j]];
    let shared = 0;
    for (const k of a.sh) if (b.sh.has(k)) shared++;
    pairs.push({ a: SLUGS[i], b: SLUGS[j], shared, pct: (shared / Math.min(a.sh.size, b.sh.size)) * 100 });
  }
}
pairs.sort((x, y) => y.pct - x.pct);
console.log("\n=== 两两重合（正文 6-gram，占较短篇比例）===");
for (const p of pairs.slice(0, 8)) console.log(`  ${p.pct.toFixed(2).padStart(5)}%  (${String(p.shared).padStart(3)})  ${p.a} ↔ ${p.b}`);

console.log("\n=== 整句完全相同（>=8 词）===");
const sents = (t) => t.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => words(x).length >= 8);
let dupCount = 0;
for (const p of pairs) {
  const A = new Set(sents(docs[p.a].text));
  const dups = [...new Set(sents(docs[p.b].text).filter((s) => A.has(s)))];
  if (dups.length) {
    dupCount += dups.length;
    console.log(`\n  ${p.a} ↔ ${p.b}`);
    dups.forEach((d) => console.log(`    · ${d}`));
  }
}
if (!dupCount) console.log("  无");

console.log("\n=== PMI 那句在各篇的实际措辞 ===");
for (const s of ["how-to-lower-your-mortgage-payment", "pros-cons-larger-down-payment"]) {
  const m = docs[s].text.match(/[^.]*protects the lender rather than you[^.]*\./);
  console.log(`  ${s}\n    ${m ? m[0].trim() : "(未找到)"}`);
}

console.log("\n=== 单篇页内重复句 ===");
let inner = 0;
for (const s of SLUGS) {
  const c = new Map();
  for (const x of sents(docs[s].text)) c.set(x, (c.get(x) ?? 0) + 1);
  for (const [x, n] of c) if (n > 1) { console.log(`  ${s} ×${n}: ${x.slice(0, 120)}`); inner++; }
}
if (!inner) console.log("  无");
