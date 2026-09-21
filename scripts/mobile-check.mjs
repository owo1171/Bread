// Mobile overflow check + the zero-closing-cost break-even case.
//   npm run start  →  node scripts/mobile-check.mjs [baseUrl]
const DEBUG = "http://127.0.0.1:9333";
const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

const tab = await (await fetch(`${DEBUG}/json/new?${encodeURIComponent(BASE + "/")}`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
const exceptions = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  else if (m.method === "Runtime.exceptionThrown") exceptions.push(m.params.exceptionDetails?.exception?.description);
};
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
  return r.result?.result?.value;
};

await send("Page.enable");
await send("Runtime.enable");
// iPhone 14 viewport, DPR 3, mobile chrome
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
await send("Emulation.setTouchEmulationEnabled", { enabled: true });

let overflows = 0;
for (const route of ROUTES) {
  await send("Page.navigate", { url: BASE + route });
  await sleep(1100);
  const m = await js(`JSON.stringify({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
    widest: (() => {
      let worst = null, w = 0;
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > w) { w = r.right; worst = el.tagName + "." + String(el.className).slice(0, 28); }
      });
      return worst;
    })(),
  })`);
  const { sw, iw, widest } = JSON.parse(m);
  const bad = sw > iw + 1;
  if (bad) overflows++;
  console.log(`  ${bad ? "✗" : "✓"} ${route.padEnd(34)} scrollWidth=${sw} viewport=${iw}${bad ? `  widest=${widest}` : ""}`);
}

console.log("");
console.log("--- 再融资：closing costs = 0（应显示 0 mo，而不是 —）---");
await send("Emulation.clearDeviceMetricsOverride");
await send("Page.navigate", { url: `${BASE}/refinance-break-even-calculator` });
await sleep(1200);
await js(`(() => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  const byLabel = (re) => [...document.querySelectorAll("input[inputmode]")].find((i) => re.test(i.getAttribute("aria-label") || ""));
  const set = (el, v) => { setter.call(el, v); el.dispatchEvent(new Event("input", { bubbles: true })); };
  set(byLabel(/closing/i), "0");
  set(byLabel(/current/i), "2160");
  set(byLabel(/new/i), "1890");
  document.querySelector('button[type="submit"]')?.click();
  return 1;
})()`);
await sleep(400);
console.log("  " + String(await js(`document.querySelector('[aria-live="polite"]')?.innerText ?? "(no live region)"`)).replace(/\s+/g, " ").slice(0, 200));

console.log("");
console.log(`横向溢出页面数: ${overflows}`);
console.log(`未捕获异常: ${exceptions.length}`);
ws.close();
process.exit(overflows === 0 && exceptions.length === 0 ? 0 : 1);
