# Tool Site — Mortgage calculators (Next.js 14 + Tailwind + TS)

1 个主工具页 + 5 个兄弟工具页 + 1 个 hub + 3 个法务页，全部静态输出（SSG），只有一个客户端计算组件家族。

## File structure

```
app/
├─ app/
│  ├─ globals.css                      # Tailwind + tap-target / focus-visible / measure / tnum
│  ├─ layout.tsx                       # metadataBase、OG 默认值（含 OG 图）、header/footer
│  ├─ page.tsx                         # 首页 = 6 个工具卡片 + WebSite Schema
│  ├─ sitemap.ts                       # → /sitemap.xml：主工具 + 5 兄弟页 + hub + 首页 + 3 法务页
│  ├─ robots.ts                        # → /robots.txt：Sitemap 行由 SITE_URL 生成，与 sitemap 同源
│  ├─ icon.svg                         # 站点图标（Next 14 app/icon.svg）
│  ├─ mortgage-payoff-calculator/
│  │  └─ page.tsx                      # 主工具页（metadata + 10 FAQ + JSON-LD）
│  ├─ [slug]/
│  │  └─ page.tsx                      # 5 个兄弟工具页（generateStaticParams + 各自 FAQ + Schema）
│  ├─ mortgage-calculators/page.tsx     # hub（ItemList Schema + "该用哪个"引导）
│  ├─ about/page.tsx                    # About & Contact（谁在做 / 怎么变现 / 怎么联系）
│  ├─ methodology/page.tsx              # 公式、假设、排除项、舍入与日期规则
│  ├─ privacy/page.tsx
│  ├─ terms/page.tsx
│  ├─ affiliate-disclosure/page.tsx
│  └─ not-found.tsx                     # 自定义 404（HTTP 404 + 六个工具入口）
├─ components/
│  ├─ AdSlot.tsx                       # 广告位占位 div（固定 id + min-height 保 CLS）
│  ├─ PayoffCalculator.tsx             # "use client"：主计算器（URL 状态 + localStorage + 场景表）
│  ├─ SpecCalculator.tsx               # "use client"：spec 驱动的兄弟计算器（即时出结果）
│  ├─ EmailCapture.tsx                 # "use client"：单字段邮件捕获（localStorage 记录）
│  ├─ LegalPage.tsx                    # 法务 / About / Methodology 共用模板（含 Last updated）
│  └─ ToolSections.tsx                 # 6 个工具页共用：How it works / Example / Last updated
├─ lib/
│  ├─ payoff.ts                        # 主计算纯函数 + usd()/duration()/payoffLabel()
│  ├─ tools.ts                         # 5 个兄弟工具的 spec：字段 + 计算 + 校验 + FAQ
│  └─ content.ts                       # SITE_URL / OG_IMAGE_URL / FAQ / 内链 / 联盟 / faqSchema()
├─ public/
│  └─ og/cover.jpg                     # 1200×630 真实图（见 og/CREDITS.md：Unsplash License）
├─ docs/
│  └─ adsense-setup.md                 # AdSense 接入说明（3 个 div 怎么贴 <ins>、加哪个 script）
├─ scripts/
│  ├─ make-og.mjs                      # 旧渐变占位图生成器（现在用真实照片，脚本仍可用）
│  ├─ cdp-check.mjs                    # 主页面 7 项真浏览器回归（点击/双周/邮箱/水合）
│  ├─ edge-check.mjs                   # 6 个计算器 × 6 组边界输入 → 查 NaN/Infinity/undefined/坏日期
│  ├─ site-audit.mjs                   # HTTP 状态 / canonical / OG / Schema↔可见FAQ / 死链 / 图alt
│  ├─ mobile-check.mjs                 # 390×844 横向溢出 + 零成本再融资（0 mo）
│  └─ rate-zero-check.mjs              # 0% 利率分支：应给出真实数字而不是 —
├─ next.config.mjs · postcss.config.mjs · tailwind.config.ts
└─ package.json · tsconfig.json · .gitignore · README.md
```

## Pages

| Route | 内容 | JSON-LD |
| --- | --- | --- |
| `/mortgage-payoff-calculator` | 主工具：月供/还清日期/省多少利息 + 场景表 + 邮件捕获 | `WebApplication` + `BreadcrumbList` + `FAQPage`（10 条） |
| `/amortization-calculator` | 逐年利息/本金/余额表（前 10 年） | 同上结构，FAQPage 5 条 |
| `/refinance-break-even-calculator` | 回本月份 + 5 年净省 | 同上结构，FAQPage 5 条 |
| `/mortgage-recast-calculator` | 一次性还本后的新月供与降幅 | 同上结构，FAQPage 5 条 |
| `/property-tax-calculator` | 年税 / 月 escrow / 10 年总额 | 同上结构，FAQPage 5 条 |
| `/how-much-house-can-i-afford` | 收入 → 可负担房价（28/36 规则） | 同上结构，FAQPage 5 条 |
| `/mortgage-calculators` | hub 页，6 个工具索引 | `ItemList` |
| `/about` | About & Contact：谁在做、怎么变现、怎么联系 | `AboutPage` + `BreadcrumbList` |
| `/methodology` | 公式 / 假设 / 排除项 / 舍入与日期规则 | `WebPage` + `BreadcrumbList` |
| `/_not-found`（任意未知路径） | 自定义 404，列出 6 个工具 + 索引入口 | — |
| `/` · `/privacy` · `/terms` · `/affiliate-disclosure` | 首页与法务页 | `WebSite`（仅首页） |

## Run / deploy

```bash
npm install
npm run dev        # http://localhost:3000/mortgage-payoff-calculator
npm run build      # SSG：12 个静态页
npm run start
npm run lint       # ESLint = next/core-web-vitals（.eslintrc.json）
vercel --prod      # Framework preset = Next.js
```

仓库：**https://github.com/owo1171/Bread** ｜ 生产地址：**https://bread-nine-iota.vercel.app**
已连接 Vercel Git 集成 —— push 到 `main` 会自动部署生产环境（不用再跑 `vercel --prod`）。

> `npm run start` 需要先 `npm run build`：`.next` 被 dev 覆盖后没有 `BUILD_ID`，
> 直接 start 会报 `Could not find a production build in the '.next' directory`。

真浏览器回归检查（需要先用 `--remote-debugging-port=9333` 启动 Edge/Chrome）：

```bash
node scripts/cdp-check.mjs        # 7 项：加载报错 / Calculate / Biweekly / 邮箱 / 兄弟页 / Link 跳转 / query 水合
node scripts/edge-check.mjs       # 6 计算器 × 6 组边界输入（默认/0/空/负数/极大/小数）+ 双周
node scripts/site-audit.mjs       # 13 路由状态、canonical/OG 唯一性、Schema↔可见FAQ、死链、图 alt
node scripts/mobile-check.mjs     # 390×844 无横向溢出 + closing costs = 0 → "0 mo"
node scripts/rate-zero-check.mjs  # rate = 0 分支输出真实数字（0% 是合法输入）
```

域名唯一来源是 `SITE_URL`（`lib/content.ts`）：默认值 = 当前 Vercel 生产域名
`https://bread-nine-iota.vercel.app`，可用环境变量 `NEXT_PUBLIC_SITE_URL` 覆盖。
`metadataBase`、`app/sitemap.ts`、`app/robots.ts` 全部引用它 → 以后换 .com 域名只需在
Vercel 项目里加一个 `NEXT_PUBLIC_SITE_URL` 环境变量并重新部署，canonical / og:url /
sitemap / robots 会一起跟上，不必改代码。

## AdSense

3 个占位 div 已在每页就位（`#ad-results` / `#ad-hero` / `#ad-faq`），**目前不加载任何 Google 脚本**。
接入步骤、`<ins>` 代码、script 参数、`ads.txt` 和验收清单见 **`docs/adsense-setup.md`**。

## Notes

- 只有 3 个客户端组件（`PayoffCalculator` / `SpecCalculator` / `EmailCapture`），其余全是 Server Component → 静态输出、LCP 快。
- 计算全在 `lib/payoff.ts` 与 `lib/tools.ts`，纯函数、零依赖，可直接加 Vitest/Jest 单测。
- `ToolSpec` 里带函数（`compute`/`schedule`），**不能整体当 props 传给客户端组件**（RSC 序列化不了），
  所以 `SpecCalculator` 只收 `slug`，在客户端内部 `findTool(slug)`。
- 联盟链接带 `rel="sponsored nofollow noopener"`，并把用户输入拼进 query 做转化归因。
- 主工具页输入状态写入 query string（`history.replaceState`，不触发 Next 路由），可分享；
  `Save results` 存 localStorage（key `mpc:v1`）。
- 兄弟工具页即时出结果（无需先点按钮）；`Calculate` 按钮保留给习惯点一下的用户。

## Benchmarks (verified with Node + browser)

| Case | 结果 |
| --- | --- |
| $320,000 / 6.5% / 25 yr | 月供 $2,161（首月利息 $1,733、本金 $427），基线总利息 $328,199 |
| +$200/月 | 20 yr 5 mo 还清（提前 4 yr 7 mo），总利息 $259,116，**省 $69,083** |
| Biweekly 同输入 | 17 yr 5 mo 还清（提前 7 yr 7 mo），总利息 $215,362，省 $112,837 |
| Amortization 本金反超利息 | 第 173 期（约第 14 年） |
| Refinance $4,500 costs / 省 $270 | 回本 16.7 个月，5 年净省 $11,700 |
| Recast $25,000 on $320,000/6.5%/25yr | 新余额 $295,000，月供 $2,161 → $1,992（降 $169） |
| Afford $95,000 / 28% / 6.5% / 25 yr / 20% down | 月供 $2,217 → 房价约 $410,368，首付 $82,074 |
| Property tax $420,000 @ 1.1% | 年税 $4,620，月 escrow $385，10 年 $46,200 |
| 月供 ≤ 当期利息 | `ok=false`，显示警告，UI 不出现 NaN/Infinity |
