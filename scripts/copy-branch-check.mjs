// Verifies the three wordings of the payoff summary sentence, including the
// two zero cases (extra = 0, rate = 0) so the copy never reads "on $0 less".
//   npm run start  →  node scripts/copy-branch-check.mjs [baseUrl]
const DEBUG = "http://127.0.0.1:9333";
const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const tab = await (await fetch(`${DEBUG}/json/new?${encodeURIComponent(BASE + "/mortgage-payoff-calculator")}`, { method: "PUT" })).json();
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

const setFields = (pairs) => `(() => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  const byLabel = (re) => [...document.querySelectorAll("input[inputmode]")].find((i) => re.test(i.getAttribute("aria-label") || ""));
  ${JSON.stringify(pairs)}.forEach(([re, v]) => { const el = byLabel(new RegExp(re, "i")); if (el) { setter.call(el, v); el.dispatchEvent(new Event("input", { bubbles: true })); } });
  document.querySelector('button[type="submit"]')?.click();
  return 1;
})()`;

const SCENARIOS = [
  { name: "正常（6.5% / +$200）", pairs: [["rate", "6.5"], ["extra", "200"]] },
  { name: "额外还款 = 0", pairs: [["rate", "6.5"], ["extra", "0"]] },
  { name: "利率 = 0%", pairs: [["rate", "0"], ["extra", "200"]] },
];

for (const s of SCENARIOS) {
  await send("Page.navigate", { url: BASE + "/mortgage-payoff-calculator" });
  await sleep(1500);
  await js(setFields(s.pairs));
  await sleep(450);
  const text = String(await js(`[...document.querySelectorAll("p")].map((p) => p.innerText.trim()).find((t) => /^(Paying|With no extra payment)/i.test(t)) ?? "(找不到总结句)"`));
  console.log(`  ${s.name}\n    ${text.replace(/\s+/g, " ")}`);
}

console.log("");
console.log("未捕获异常:", exceptions.length);
ws.close();
process.exit(exceptions.length ? 1 : 0);
