// 逐页驱动计算器：默认值、全 0、负数、超大值、非数字，检查是否出现 NaN/Infinity/崩溃，
// 并核对一个已知输入是否给出已知结果。需要先 npm run start 与 Edge --remote-debugging-port。
const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const DEBUG = "http://127.0.0.1:9333";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGES = [
  { path: "/mortgage-payment-calculator", known: ["320000", "6.5", "25"], expect: "$2,161" },
  { path: "/down-payment-calculator", known: ["400000", "20", "6.5", "25"], expect: "$80,000" },
  { path: "/amortization-calculator", known: ["320000", "6.5", "25", "200"], expect: "$69,083" },
  { path: "/refinance-break-even-calculator", known: ["4500", "2160", "1890"], expect: "$270" },
  { path: "/mortgage-recast-calculator", known: ["320000", "6.5", "25", "25000"], expect: "$1,992" },
  { path: "/property-tax-calculator", known: ["420000", "1.1"], expect: "$4,620" },
  { path: "/how-much-house-can-i-afford", known: ["95000", "20", "6.5", "25", "28"], expect: "$410,368" },
  { path: "/pmi-calculator", known: ["400000", "10", "6.5", "0.5", "25"], expect: "$150" },
  { path: "/rent-vs-buy-calculator", known: ["400000", "20", "6.5", "25", "2000", "3", "1", "1.1", "7", "3", "7"], expect: "$1,900" },
  { path: "/mortgage-payoff-calculator", known: ["320000", "6.5", "25", "200"], expect: "$69,083", needsClick: true },
];

const tab = await (await fetch(`${DEBUG}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((res) => (ws.onopen = res));
let id = 0;
const pending = new Map();
const consoleErrors = [];
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") {
    consoleErrors.push(m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 160));
  }
  if (m.method === "Runtime.exceptionThrown") {
    consoleErrors.push("EXCEPTION: " + (m.params.exceptionDetails?.text ?? "").slice(0, 160));
  }
};
const send = (method, params = {}) =>
  new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true, touch: true });

const problems = [];
for (const page of PAGES) {
  await send("Page.navigate", { url: BASE + page.path });
  await sleep(1800);

  const script = `(async () => {
    const inputs = [...document.querySelectorAll("form input")];
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    const wait = () => new Promise((r) => setTimeout(r, 120));
    const setAll = async (vals) => {
      for (let i = 0; i < inputs.length; i++) {
        const v = vals[String(i)] ?? vals.all ?? "";
        setter.call(inputs[i], v);
        inputs[i].dispatchEvent(new Event("input", { bubbles: true }));
      }
      await wait(); await wait();
    };
    const snap = () => {
      const t = document.body.innerText;
      return { bad: /NaN|Infinity|undefined/.test(t), alert: /Check the inputs|Heads up/.test(t), t: t };
    };
    const out = {};
    out.defaults = snap();
    await setAll({ all: "0" });        out.zero = snap();
    await setAll({ all: "-5" });       out.negative = snap();
    await setAll({ all: "999999999" });out.huge = snap();
    await setAll({ all: "abc" });      out.text = snap();
    return JSON.stringify({ count: inputs.length, out, inner: document.body.innerText.slice(0, 4000) });
  })()`;
  const r = await send("Runtime.evaluate", { expression: script, awaitPromise: true, returnByValue: true });
  let data;
  try { data = JSON.parse(r.result?.result?.value ?? "{}"); } catch { data = {}; }
  const out = data.out ?? {};
  const label = page.path.padEnd(36);

  if (!data.count) { problems.push(`${page.path}: 未找到输入框`); console.log(`${label} ✗ 无输入框`); continue; }

  const scen = ["defaults", "zero", "negative", "huge", "text"];
  const badScenes = scen.filter((s) => out[s]?.bad);
  if (badScenes.length) problems.push(`${page.path}: NaN/Infinity/undefined 出现于 [${badScenes.join(", ")}]`);

  // 已知输入
  let knownOk = "—";
  if (page.known) {
    const knownScript = `(async () => {
      const inputs = [...document.querySelectorAll("form input")];
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      const vals = ${JSON.stringify(page.known)};
      for (let i = 0; i < inputs.length && i < vals.length; i++) {
        setter.call(inputs[i], vals[i]);
        inputs[i].dispatchEvent(new Event("input", { bubbles: true }));
      }
      ${page.needsClick ? 'const btn = [...document.querySelectorAll("button")].find(b => /Calculate/i.test(b.textContent)); btn && btn.click();' : ""}
      await new Promise((r) => setTimeout(r, 300));
      return document.body.innerText;
    })()`;
    const k = await send("Runtime.evaluate", { expression: knownScript, awaitPromise: true, returnByValue: true });
    const text = k.result?.result?.value ?? "";
    knownOk = text.includes(page.expect) ? "OK" : `期望 ${page.expect} 未出现`;
    if (!text.includes(page.expect)) problems.push(`${page.path}: 已知输入未得到 ${page.expect}`);
  }

  const overflow = await send("Runtime.evaluate", {
    expression: `JSON.stringify({ over: document.documentElement.scrollWidth - document.documentElement.clientWidth, wide: [...new Set([...document.querySelectorAll("body *")].filter(e => e.getBoundingClientRect().right > 391).map(e => e.tagName))].slice(0, 3) })`,
    returnByValue: true,
  });
  const ov = JSON.parse(overflow.result?.result?.value ?? "{}");
  if (ov.over > 0) problems.push(`${page.path}: 移动端横向溢出 ${ov.over}px (${(ov.wide || []).join(",")})`);

  console.log(`${label} 输入 ${data.count} | 默认 ${out.defaults?.bad ? "NaN✗" : "ok"} | 0 ${out.zero?.bad ? "NaN✗" : "ok"} | 负 ${out.negative?.bad ? "NaN✗" : "ok"} | 超大 ${out.huge?.bad ? "NaN✗" : "ok"} | 文本 ${out.text?.bad ? "NaN✗" : "ok"} | 已知值 ${knownOk} | 溢出 ${ov.over}px`);
}

console.log("");
console.log(consoleErrors.length ? `控制台错误 ${consoleErrors.length} 条：` : "控制台无错误");
consoleErrors.slice(0, 8).forEach((e) => console.log("   - " + e));
if (consoleErrors.length) problems.push(`控制台错误 ${consoleErrors.length} 条`);

console.log("");
if (!problems.length) console.log("✅ 全部计算器通过：无 NaN、已知输入正确、移动端无溢出、无控制台错误");
else { console.log(`⚠️ ${problems.length} 个问题：`); problems.forEach((p) => console.log("   - " + p)); }
ws.close();
process.exit(problems.length ? 1 : 0);
