import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import PayoffCalculator from "@/components/PayoffCalculator";
import { AFFILIATES, FAQS, OG_IMAGE_ALT, OG_IMAGE_URL, RELATED_TOOLS, SITE_URL, SLUG, faqSchema } from "@/lib/content";

const TITLE = "Mortgage Payoff Calculator: Extra Payments & Payoff Date";
const DESCRIPTION =
  "Find your exact mortgage payoff date and the interest you save with extra payments. Free calculator — no signup, results in 10 seconds.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/${SLUG}`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Tool Site",
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Mortgage payoff calculator showing payoff date and interest saved",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
};

export default function MortgagePayoffCalculatorPage() {
  const url = `${SITE_URL}/${SLUG}`;

  return (
    <>
      {/* FAQ + App + Breadcrumb schema, server-rendered */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(url)) }}
      />

      <nav aria-label="Breadcrumb" className="pt-4 text-xs text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        ›{" "}
        <Link href="/mortgage-calculators" className="hover:underline">
          Mortgage Calculators
        </Link>{" "}
        › <span>Mortgage Payoff Calculator</span>
      </nav>

      {/* ---- Screen 1: above the fold ---- */}
      <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{TITLE.split(":")[0]}</h1>
      <p className="mt-2 max-w-prose text-slate-600">
        Know the day your mortgage actually ends. Enter what you owe, your rate and what you can
        pay extra each month — get the payoff date, total interest, and how much sooner you are free.
      </p>

      <div className="mt-6">
        <PayoffCalculator />
      </div>

      {/* Ad slot: directly under the results area */}
      <AdSlot id="ad-results" note="Ad slot — results area (300x250 / in-article)" minHeight={120} />

      {/* Affiliate block: href stays clean in HTML, params are added client-side */}
      <ul className="space-y-2 text-sm">
        {AFFILIATES.map((a) => (
          <li key={a.id}>
            <a
              href={a.href}
              data-affiliate
              data-base={a.href}
              rel="sponsored nofollow noopener"
              target="_blank"
              className="font-medium text-blue-700 hover:underline"
            >
              {a.anchor}
            </a>{" "}
            <span className="text-slate-500">&mdash; {a.note}</span>
          </li>
        ))}
      </ul>

      {/* Ad slot: below the fold (mobile "首屏下方") */}
      <AdSlot id="ad-hero" note="Ad slot — below the fold (fluid / 336x280 mobile)" minHeight={140} />

      {/* ---- Screen 2: what it solves ---- */}
      <h2 className="mt-8 text-2xl font-bold">What this actually solves</h2>
      <p className="measure mt-3 text-slate-700">
        Most people look at a mortgage balance and have no idea what it means in time. The statement
        says $318,400 — it does not say &ldquo;that is 19 more years and $96,000 of interest if nothing
        changes.&rdquo; It certainly does not answer the question you actually have: if I squeeze out
        another $100 or $200 a month, does it even matter?
      </p>
      <p className="measure mt-3 text-slate-700">
        It does — but only if the extra money hits the principal. Then every dollar you add skips the
        interest line, so the loan shrinks faster than the original schedule expects. That is the whole
        trick, and why a payoff calculator beats guessing.
      </p>
      <p className="measure mt-3 text-slate-700">
        Use it before you refinance, before you sell, and before you decide where this year&rsquo;s bonus
        goes. Formula used: payments left = &minus;ln(1 &minus; r&middot;B/P) &divide; ln(1 + r).
      </p>

      {/* ---- Screen 3: three steps ---- */}
      <h2 className="mt-8 text-2xl font-bold">Three steps</h2>
      <ol className="mt-3 grid gap-3 sm:grid-cols-3">
        {[
          ["Enter balance and rate", "Copy both from your latest statement. Skip escrow."],
          ["Add what you can really pay", "Or switch to biweekly and see the 13-payments effect."],
          ["Read your payoff date", "Total interest and savings update instantly, on your device."],
        ].map(([title, body], i) => (
          <li key={title} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
              {i + 1}
            </div>
            <div className="mt-2 font-semibold">{title}</div>
            <p className="mt-1 text-sm text-slate-600">{body}</p>
          </li>
        ))}
      </ol>

      {/* Ad slot: above the FAQs */}
      <AdSlot id="ad-faq" note="Ad slot — above FAQs (in-article, reserve 250px)" minHeight={250} />

      {/* ---- Screen 4: FAQ ---- */}
      <h2 id="faq" className="scroll-mt-16 text-2xl font-bold">FAQs</h2>
      <div className="mt-3 divide-y divide-slate-200">
        {FAQS.map((f) => (
          <details key={f.q} className="py-3">
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="mt-2 text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>

      {/* ---- Screen 5: internal links ---- */}
      <h2 className="mt-8 text-2xl font-bold">Related tools</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {RELATED_TOOLS.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block rounded-2xl border border-slate-200 p-4 hover:border-blue-700"
            >
              <span className="font-semibold text-blue-700">{t.label}</span>
              <span className="mt-1 block text-sm text-slate-600">{t.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
