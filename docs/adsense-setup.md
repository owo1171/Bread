# AdSense 接入说明（现在是 3 个占位 div）

当前状态：`components/AdSlot.tsx` 只渲染一个**带固定 id + 预留高度**的空 div，**没有加载任何 Google 脚本**。
页面上的灰色虚线框 = 还没接广告；但布局已经按最终状态占好位，所以贴上广告后 CLS 接近 0。

---

## 1. 三个位置（id 不要改，脚本按 id 找位置）

| id | 位置 | 建议单元格式 | 已预留高度 |
| --- | --- | --- | --- |
| `#ad-results` | 结果卡正下方（首屏紧邻结果） | Responsive / In-article（320×100 ~ 300×250） | 120px |
| `#ad-hero` | 首屏下方（移动端约第 2 屏顶部） | Fluid；移动端 336×280 | 140px |
| `#ad-faq` | FAQ 上方 | Rectangle 300×250 | 主工具页 250px / 兄弟页 140px |

代码位置：

- 主工具页：`app/mortgage-payoff-calculator/page.tsx`（3 个 `<AdSlot />`）
- 5 个兄弟工具页：`app/[slug]/page.tsx`（一处定义、5 页共用同一组 id；AdSense 单元按页面统计，不冲突）

---

## 2. 需要加的 script：只有 1 个

推荐用 `next/script` + `afterInteractive`，改 `app/layout.tsx`：

```tsx
import Script from "next/script";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // ca-pub-XXXXXXXXXXXXXXXX

<html lang="en">
  <head>
    <Script
      id="adsbygoogle"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      data-ad-client={ADSENSE_CLIENT}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  </head>
  ...
```

要点：

- `data-ad-client` 必须和 URL 里的 `client=` 一致，否则新版 loader 会报 warning。
- 不需要 `beforeInteractive`：本页 LCP 是文字标题，不是广告。
- **全站只加载这一份** `adsbygoogle.js`，别再复制第二份（会重复请求、重复计费信号）。
- 本地跑：新建 `.env.local` 写 `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXX`；
  **Vercel 上要单独在 Project Settings → Environment Variables 加同名变量**，否则线上变成 `client=undefined`。

---

## 3. 把 `<ins>` 贴进 3 个 div（React 下的正确姿势）

Next 里 `<ins class="adsbygoogle">` 必须**手动 push 一次**，否则永远是空白框。
最省事的方案：把 `AdSlot` 升级为客户端组件、接收 children，挂载后 push 一次。

```tsx
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  id: string;
  note?: string;
  minHeight?: number;
  children?: React.ReactNode;
}

export default function AdSlot({ id, note = "Ad slot", minHeight = 120, children }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!children || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* loader 还没就绪：留空位，不影响布局 */
    }
  }, [children]);

  return (
    <div id={id} aria-label={`Advertisement: ${note}`} style={{ minHeight }} className="my-6">
      {children ?? note}
    </div>
  );
}
```

调用处（`data-ad-slot` 用 AdSense 后台给你的数字）：

```tsx
<AdSlot id="ad-results" note="results area" minHeight={120}>
  <ins
    className="adsbygoogle"
    style={{ display: "block" }}
    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
    data-ad-slot="1234567890"
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
</AdSlot>
```

`#ad-faq` 建议改成固定矩形，避免高度跳动：

```tsx
data-ad-format="rectangle"
data-ad-slot="3333333333"
style={{ display: "block", width: 300, margin: "0 auto" }}
```

> 不想改组件的话：也可以在 `public/` 放一个脚本，在 `DOMContentLoaded` 后对 3 个 id 各 push 一次。
> 但组件版更稳——Next 客户端路由切换后不会漏 push。

---

## 4. 拿到账号后要填的 3 样东西

1. **publisher id** `ca-pub-XXXXXXXXXXXXXXXX` → script 的 `client=`、`data-ad-client`、以及每个 `<ins>`。
2. **3 个 ad unit 的 `data-ad-slot` 数字**：后台 Ads units 里建 3 个，命名建议
   `payoff-results` / `payoff-hero` / `payoff-faq`（兄弟页可复用同一组，或后面再拆）。
3. **`public/ads.txt`**（现在还没有，AdSense 会检查这个文件）：

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

---

## 5. 开关与红线

- **Auto ads 关**、**Anchor ads 关**（或只留桌面）。这两个功能会突然插广告，把 CLS 打到 0.1+；我们只想要这 3 个手动位。
- 每页单元数 ≤ 3。我们的目标是 RPM，不是广告密度。
- 移动端 `#ad-results` 紧贴 Calculate 按钮下方，**min-height 一定要保留**，否则用户点按钮时页面会跳。
- Google Consent Manager（CMP）在后台打开即可，代码不用改。
- 审核阶段：AdSense 需要**公网地址**才能审核。本地 localhost 不算，先部署到 Vercel 再提交。

---

## 6. 上线后验收清单

- [ ] `https://你的域名/ads.txt` 返回 200，内容正确
- [ ] 3 个位置都渲染出 iframe：控制台执行
      `document.querySelectorAll("ins.adsbygoogle iframe").length` → 应为 `3`
- [ ] DevTools → Performance：CLS < 0.05（移动端重点看，滚动到底再测）
- [ ] AdSense 后台 "Pages shown with ads" 24 小时内有数据
- [ ] 用无痕模式打开主页，确认没有第 4 个广告被 Auto ads 偷偷插进来
