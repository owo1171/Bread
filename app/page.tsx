import type { Metadata } from "next";
import Link from "next/link";
import { ContentMeta } from "@/components/ToolSections";
import { pageOpenGraph, SITE_URL, SLUG } from "@/lib/content";
import { SIBLING_TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  // absolute: the layout's title template is not applied to this root-level
  // page, so the brand suffix is written out here.
  title: { absolute: "Free Mortgage Calculator - No Signup | KiteCalc" },
  description:
    "Free mortgage calculator, no signup: payment, down payment, payoff, amortization, break-even, rent vs buy, PMI, recast, tax and affordability.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: pageOpenGraph(`${SITE_URL}/`),
};

const TOOLS = [
  {
    name: "Mortgage Payoff Calculator",
    href: `/${SLUG}`,
    note: "Payoff date, total interest and what an extra payment saves.",
  },
  ...SIBLING_TOOLS.map((t) => ({
    name: t.name,
    href: `/${t.slug}`,
    note: t.description.split(".")[0] + ".",
  })),
];

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KiteCalc",
    url: SITE_URL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <h1 className="mt-8 text-3xl font-bold leading-tight sm:text-4xl">Free Mortgage Calculators</h1>
      <p className="measure mt-3 text-slate-700">
        Type in your numbers and get an answer in about ten seconds. Everything runs in your browser,
        so nothing you enter leaves this device.
      </p>
      <ul className="measure mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        <li>No account, no email required to see a result.</li>
        <li>Fixed-rate loan maths, with the assumptions written down.</li>
        <li>Built for a phone first — big inputs, readable results.</li>
      </ul>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block rounded-2xl border border-slate-200 p-4 hover:border-blue-700"
            >
              <span className="font-semibold text-blue-700">{t.name}</span>
              <span className="mt-1 block text-sm text-slate-600">{t.note}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm">
        <Link href="/mortgage-calculators" className="text-blue-700 hover:underline">
          Browse all mortgage calculators →
        </Link>
      </p>

      <ContentMeta className="mt-6" />

      <p className="mt-3 text-sm">
        <Link href="/about" className="text-blue-700 hover:underline">
          About &amp; contact
        </Link>{" "}
        ·{" "}
        <Link href="/privacy" className="text-blue-700 hover:underline">
          Privacy
        </Link>{" "}
        ·{" "}
        <Link href="/affiliate-disclosure" className="text-blue-700 hover:underline">
          Affiliate disclosure
        </Link>
      </p>
    </>
  );
}
