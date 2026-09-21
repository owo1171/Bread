// Edge/Chrome DevTools Protocol stress check for the six calculators.
//
//   1. start a production server:  npm run build && npm run start
//   2. start a browser:            msedge --headless=new --remote-debugging-port=9333
//   3. run:                        node scripts/edge-check.mjs [baseUrl]
//
// For every calculator it drives a set of hostile-but-common inputs
// (defaults / 0 / empty / negative / huge / decimal), then scans the rendered
// text for NaN, Infinity, undefined or Invalid Date. Console errors and
// uncaught exceptions are counted across the whole run.
const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const DEBUG = "http://127.0.0.1:9333";

const PAGES = [
  { path: "/mortgage-payoff-calculator", name: "Mortgage Payoff", toggle: true },
  { path: "/amortization-calculator", name: "Amortization" },
  { path: "/refinance-break-even-calculator", name: "Break-even" },
  { path: "/mortgage-recast-calculator", name: "Recast" },
  { path: "/property-tax-calculator", name: "Property tax" },
  { path: "/how-much-house-can-i-afford", name: "Afford" },
];

const CASES = [
  { label: "normal(default)", fill: null },
  { label: "zeros(0)", fill: "0" },
  { label: "empty('')", fill: "" },
  { label: "negative(-1000)", fill: "-1000" },
  { label: "huge(999999999999)", fill: "999999999999" },
  { label: "decimal(1234.567)", fill: "1234.567" },
];

const BAD = /NaN|Infinity|undefined|Invalid Date/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function newTab(url) {
  const res = await fetch(`${DEBUG}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  return res.json();
}

async function main() {
  const tab = await newTab(`${BASE}${PAGES[0].path}`);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 0;
  const pending = new Map();
  const events = { errors: [], exceptions: [] };
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method === "Runtime.exceptionThrown") {
      const d = msg.params.exceptionDetails;
      events.exceptions.push(d.exception?.description ?? d.text);
    } else if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      events.errors.push(msg.params.args.map((a) => a.value ?? a.description).join(" "));
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const mid = ++id;
      pending.set(mid, resolve);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

  await send("Page.enable");
  await send("Runtime.enable");

  async function navigate(path) {
    await send("Page.navigate", { url: `${BASE}${path}` });
    await sleep(1200);
  }

  async function evalJs(expression) {
    const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
    // CDP shape: { id, result: { result: { type, value }, exceptionDetails? } }
    return r.result?.result?.value;
  }

  const setAll = (value) => `(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    document.querySelectorAll('input[inputmode]').forEach((i) => {
      setter.call(i, ${JSON.stringify(value)});
      i.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const btn = document.querySelector('button[type="submit"]');
    if (btn) btn.click();
    return document.querySelectorAll('input[inputmode]').length;
  })()`;

  const clickBiweekly = `(() => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim().toLowerCase() === "biweekly");
    if (b) b.click();
    return !!b;
  })()`;

  const readText = `document.body.innerText`;

  let failures = 0;
  let checks = 0;

  for (const page of PAGES) {
    await navigate(page.path);
    const nInputs = await evalJs(`document.querySelectorAll('input[inputmode]').length`);
    if (!nInputs) {
      console.log(`✗ ${page.name}: 找不到输入框（页面可能没渲染计算器）`);
      failures++;
      continue;
    }

    for (const c of CASES) {
      if (c.fill !== null) await evalJs(setAll(c.fill));
      else await evalJs(`(() => { const b=document.querySelector('button[type="submit"]'); if(b) b.click(); return 1; })()`);
      await sleep(350);
      const text = String((await evalJs(readText)) ?? "");
      checks++;
      const hit = text.match(/.{0,60}(NaN|Infinity|undefined|Invalid Date).{0,40}/);
      if (hit) {
        failures++;
        console.log(`✗ ${page.name} · ${c.label} → ${hit[0].replace(/\s+/g, " ")}`);
      } else {
        console.log(`✓ ${page.name} · ${c.label}  (${nInputs} inputs, ${text.length} chars text)`);
      }
    }

    if (page.toggle) {
      await evalJs(clickBiweekly);
      await sleep(400);
      const text = String((await evalJs(readText)) ?? "");
      checks++;
      const hit = text.match(/.{0,60}(NaN|Infinity|undefined|Invalid Date).{0,40}/);
      if (hit) {
        failures++;
        console.log(`✗ ${page.name} · biweekly → ${hit[0].replace(/\s+/g, " ")}`);
      } else {
        console.log(`✓ ${page.name} · biweekly`);
      }
    }
  }

  console.log("");
  console.log(`检查组合: ${checks}  问题: ${failures}`);
  console.log(`console error 条数: ${events.errors.length}`);
  events.errors.slice(0, 5).forEach((e) => console.log("   E:", e.slice(0, 160)));
  console.log(`未捕获异常条数: ${events.exceptions.length}`);
  events.exceptions.slice(0, 5).forEach((e) => console.log("   X:", e.slice(0, 200)));

  ws.close();
  process.exit(failures > 0 || events.exceptions.length > 0 || events.errors.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(2);
});
