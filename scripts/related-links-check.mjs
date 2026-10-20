// 回归检查：lib/tools.ts 的结构与「每页 4 个相关工具」配置。
// 防止两类回归：(1) 某个工具规格丢了 guide/faq/example；(2) 两页的关联工具集合完全相同。
//   node scripts/related-links-check.mjs   （在 app 目录下运行）
import fs from "node:fs";

const src = fs.readFileSync("lib/tools.ts", "utf8");
const problems = [];

const slugs = [...new Set([...src.matchAll(/^\s{4}slug: "([a-z0-9-]+)",$/gm)].map((m) => m[1]))];
console.log(`工具规格 = ${slugs.length} 个：${slugs.join(", ")}`);
if (slugs.length !== 9) problems.push(`期望 9 个工具规格，实际 ${slugs.length}`);

const counts = {
  guide: (src.match(/^\s{4}guide: \{$/gm) || []).length,
  howItWorks: (src.match(/^\s{4}howItWorks: \[$/gm) || []).length,
  faqs: (src.match(/^\s{4}faqs: \[$/gm) || []).length,
  example: (src.match(/^\s{4}example: \{$/gm) || []).length,
};
console.log(`guide=${counts.guide} howItWorks=${counts.howItWorks} faqs=${counts.faqs} example=${counts.example}（应各为 9）`);
for (const [k, v] of Object.entries(counts)) if (v !== 9) problems.push(`${k} 数量 ${v} ≠ 9`);

const block = src.match(/export const RELATED_BY_SLUG: Record<string, string\[\]> = \{([\s\S]*?)\n\};/);
if (!block) problems.push("找不到 RELATED_BY_SLUG");
else {
  const entries = [...block[1].matchAll(/"([a-z0-9-]+)": \[([\s\S]*?)\],/g)].map((m) => ({
    key: m[1],
    targets: [...m[2].matchAll(/"([a-z0-9-]+)"/g)].map((x) => x[1]),
  }));
  console.log(`RELATED_BY_SLUG 页面数 = ${entries.length}`);
  if (entries.length !== 10) problems.push(`RELATED 页面数 ${entries.length} ≠ 10`);

  const known = new Set([...slugs, "mortgage-payoff-calculator"]);
  const keys = new Set();
  for (const e of entries) {
    if (keys.has(e.key)) problems.push(`RELATED 重复键 ${e.key}`);
    keys.add(e.key);
    if (e.targets.length !== 4) problems.push(`${e.key} 有 ${e.targets.length} 个目标（应为 4）`);
    if (new Set(e.targets).size !== e.targets.length) problems.push(`${e.key} 目标内部重复`);
    if (e.targets.includes(e.key)) problems.push(`${e.key} 指向自己`);
    for (const t of e.targets) if (!known.has(t)) problems.push(`${e.key} → 未知目标 ${t}`);
  }

  const inbound = new Map([...known].map((k) => [k, 0]));
  for (const e of entries) for (const t of e.targets) inbound.set(t, (inbound.get(t) ?? 0) + 1);
  for (const [k, v] of inbound) if (v < 1) problems.push(`${k} 没有被任何工具页引用`);

  const sigs = new Map();
  for (const e of entries) {
    const sig = [...e.targets].sort().join(",");
    sigs.set(sig, [...(sigs.get(sig) ?? []), e.key]);
  }
  const dup = [...sigs.values()].filter((v) => v.length > 1);
  console.log(`不同目标集合 = ${sigs.size}/10`);
  if (dup.length) problems.push(`目标集合完全相同：${dup.map((v) => v.join(" = ")).join(" | ")}`);
}

console.log(problems.length ? `\n⚠️ ${problems.length} 个问题：\n - ` + problems.join("\n - ") : "\n✅ 结构与关联链接检查通过");
process.exit(problems.length ? 1 : 0);
