// Focused check: set only the rate field to 0 and read the live results region.
// Verifies the r = 0 branch prints real numbers (0% is a legitimate input)
// and that duration(0) now reads "0 mo" rather than "—".
const DEBUG = "http://127.0.0.1:9333";
const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGES = [
  "/mortgage-payoff-calculator",
  "/amortization-calculator",
  "/mortgage-recast-calculator",
  "/how-much-house-can-i-afford",
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

for (const path of PAGES) {
  await send("Page.navigate", { url: BASE + path });
  await sleep(1400);
  const out = await js(`(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    const rate = [...document.querySelectorAll("input[inputmode]")].find((i) => /rate/i.test(i.getAttribute("aria-label") || ""));
    if (!rate) return "NO RATE FIELD";
    setter.call(rate, "0");
    rate.dispatchEvent(new Event("input", { bubbles: true }));
    document.querySelector('button[type="submit"]')?.click();
    return "ok";
  })()`);
  await sleep(400);
  const live = String((await js(`document.querySelector('[aria-live="polite"]')?.innerText ?? "(no live region)"`)) ?? "");
  console.log(`--- ${path}  (rate=0, ${out})`);
  console.log("    " + live.replace(/\s+/g, " ").slice(0, 260));
}

console.log("");
console.log("未捕获异常:", exceptions.length);
ws.close();
process.exit(0);
