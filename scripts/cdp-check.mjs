// scripts/cdp-check.mjs
// Real-browser interaction check against a running dev/prod server.
// Requires Edge/Chrome started with --remote-debugging-port=9333.
//   node scripts/cdp-check.mjs [baseUrl]
// Prints console errors, uncaught exceptions, failed network requests,
// and the result text after actually clicking Calculate / Biweekly / email submit.

const CDP = "http://127.0.0.1:9333";
const BASE = process.argv[2] ?? "http://localhost:3000";

const list = await (await fetch(`${CDP}/json/list`)).json();
const page =
  list.find((t) => t.type === "page" && t.url.includes("localhost:3000")) ??
  list.find((t) => t.type === "page");
if (!page) {
  console.log("no page target");
  process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = () => rej(new Error("ws connect failed"));
});

let seq = 0;
const pending = new Map();
const events = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method) {
    events.push(msg);
  }
};

const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++seq;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ev = async (expression) => {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  const d = r.result ?? {};
  if (d.exceptionDetails) {
    return "THROW: " + (d.exceptionDetails.exception?.description ?? d.exceptionDetails.text);
  }
  return d.result?.value;
};

const text = async (chars = 260) => {
  const t = await ev(
    "(() => { const m = document.querySelector('main'); return m ? m.innerText.replace(/\\n{2,}/g,' | ') : 'NO MAIN'; })()",
  );
  return typeof t === "string" ? t.slice(0, chars) : String(t);
};

const report = (label) => {
  const bad = events.filter((e) => {
    if (e.method === "Runtime.exceptionThrown") return true;
    if (e.method === "Runtime.consoleAPICalled") return ["error", "warning", "warn", "assert"].includes(e.params.type);
    if (e.method === "Log.entryAdded") {
      const en = e.params.entry;
      return en.level === "error" || (en.source === "network" && en.level !== "info");
    }
    return false;
  });
  const lines = bad.map((e) => {
    if (e.method === "Runtime.exceptionThrown") {
      const d = e.params.exceptionDetails;
      return "EXCEPTION: " + (d.exception?.description ?? d.text).split("\n")[0];
    }
    if (e.method === "Runtime.consoleAPICalled") {
      const t = (e.params.args ?? [])
        .map((a) => a.value ?? a.description ?? a.type)
        .join(" ")
        .split("\n")[0];
      return `console.${e.params.type}: ` + String(t).slice(0, 220);
    }
    const en = e.params.entry;
    return `log(${en.source}/${en.level}): ` + String(en.text).slice(0, 220);
  });
  console.log(`\n[${label}] ${lines.length} issue(s)`);
  for (const l of [...new Set(lines)].slice(0, 10)) console.log("   " + l);
  events.length = 0;
};

await send("Runtime.enable");
await send("Log.enable");
await send("Page.enable");
// Always start from the main tool page so the Biweekly / email checks have their controls.
await send("Page.navigate", { url: `${BASE}/mortgage-payoff-calculator` });
await sleep(2600);
events.length = 0;
await sleep(600);
await sleep(3000);
report("1. page load");

console.log("\nBEFORE click:\n   " + (await text(200)));

await ev(`document.querySelector('button[type="submit"]').click()`);
await sleep(1200);
report("2. after Calculate click");
console.log("\nAFTER Calculate:\n   " + (await text(430)));

const before = await ev(
  "(() => { const c = document.querySelector('[aria-live]'); return c ? c.innerText.replace(/\\n+/g,' ') : 'no live region'; })()",
);
await ev(`(() => { const b = [...document.querySelectorAll('button')].find(x => /^biweekly$/i.test(x.textContent.trim())); if (!b) return 'no biweekly button'; b.click(); return 'clicked'; })()`);
await sleep(1200);
report("3. after Biweekly click");
const after = await ev(
  "(() => { const c = document.querySelector('[aria-live]'); return c ? c.innerText.replace(/\\n+/g,' ') : 'no live region'; })()",
);
console.log("\nmonthly results: " + String(before).slice(0, 180));
console.log("biweekly results: " + String(after).slice(0, 180));
console.log("results changed  : " + (before !== after));

await ev(
  `(() => { const el = document.getElementById('lead-email'); if (!el) return 'no email field';
     const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
     set.call(el, 'check@example.com'); el.dispatchEvent(new Event('input', { bubbles: true })); return 'typed'; })()`,
);
await ev(
  `(() => { const b = [...document.querySelectorAll('button')].find(x => /email it to me/i.test(x.textContent)); if (!b) return 'no email button'; b.click(); return 'clicked'; })()`,
);
await sleep(900);
report("4. after email submit");
console.log("\nemail status element: " + String(await ev(
  "(() => { const s = document.querySelector('p[role=status]'); return s ? 'STATUS: ' + s.innerText.replace(/\\n+/g,' ') : 'NO status element (submit did not confirm)'; })()",
)).slice(0, 240));

const dev = await ev(
  `(() => { const f = document.querySelector('nextjs-portal'); if (!f || !f.shadowRoot) return 'no dev overlay';
     const t = f.shadowRoot.textContent.replace(/\\s+/g,' ').trim(); return 'overlay: ' + t.slice(0, 200); })()`,
);
console.log("\n" + dev);

await send("Page.navigate", { url: `${BASE}/amortization-calculator` });
await sleep(2600);
report("5. navigate to /amortization-calculator");
console.log("\namortization page:\n   " + (await text(300)));

// Client-side navigation (Link click) — this is where RSC prefetch errors show up.
await send("Page.navigate", { url: `${BASE}/mortgage-payoff-calculator` });
await sleep(2200);
events.length = 0;
await ev(
  `(() => { const a = [...document.querySelectorAll('a')].find(x => x.getAttribute('href') === '/mortgage-recast-calculator'); if (!a) return 'no such link'; a.click(); return 'clicked'; })()`,
);
await sleep(2200);
report("6. client-side Link click → /mortgage-recast-calculator");
console.log(
  "url now: " +
    String(await ev("window.location.pathname")) +
    " | h1: " +
    String(await ev("(() => { const h = document.querySelector('h1'); return h ? h.innerText : 'NO H1'; })()")),
);

// Query-string hydration: results must appear without any click.
await send("Page.navigate", { url: `${BASE}/mortgage-payoff-calculator?bal=285000&rate=5.75&yrs=22&extra=300&freq=biweekly` });
await sleep(2400);
report("7. query-string hydration (?bal=285000&rate=5.75&yrs=22&extra=300&freq=biweekly)");
console.log(
  "  inputs: " +
    String(await ev(
      "(() => [...document.querySelectorAll('input')].map(i => i.value).join(' / '))()",
    )) +
    "\n  results: " +
    String(await ev(
      "(() => { const c = document.querySelector('[aria-live]'); return c ? c.innerText.replace(/\\n+/g,' ') : 'NO RESULTS SHOWN'; })()",
    )).slice(0, 190),
);

ws.close();
