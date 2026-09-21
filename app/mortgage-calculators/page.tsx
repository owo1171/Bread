import type { Metadata } from "next";
import Link from "next/link";
import { OG_IMAGE_ALT, OG_IMAGE_URL, SITE_URL, SLUG } from "@/lib/content";
import { SIBLING_TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Mortgage Calculators: Payoff, Amortization, Refinance and More",
  description:
    "Six free mortgage calculators — payoff date, amortization schedule, refinance break-even, affordability, recast and property tax. No signup.",
  alternates: { canonical: "/mortgage-calculators" },
  openGraph: {
    title: "Mortgage Calculators: Payoff, Amortization, Refinance and More",
    description:
      "Six free mortgage calculators — payoff date, amortization schedule, refinance break-even, affordability, recast and property tax.",
    url: `${SITE_URL}/mortgage-calculators`,
    type: "website",
    siteName: "Tool Site",
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Calculators: Payoff, Amortization, Refinance and More",
    description:
      "Six free mortgage calculators — payoff date, amortization schedule, refinance break-even, affordability, recast and property tax.",
    images: [OG_IMAGE_URL],
  },
};

const TOOLS = [
  {
    name: "Mortgage Payoff Calculator",
    href: `/${SLUG}`,
    note: "Your payoff date and how much an extra payment saves.",
  },
  ...SIBLING_TOOLS.map((t) => ({
    name: t.name,
    href: `/${t.slug}`,
    note: t.description.split(".")[0] + ".",
  })),
];

export default function MortgageCalculatorsHub() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mortgage Calculators",
    itemListElement: TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `${SITE_URL}${t.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav aria-label="Breadcrumb" className="pt-4 text-xs text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        › <span>Mortgage Calculators</span>
      </nav>

      <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Mortgage Calculators</h1>
      <p className="mt-3 measure text-slate-700">
        Six calculators for the questions people actually ask about a mortgage: when it ends, what
        each payment really pays for, whether refinancing clears its costs, and what a house costs
        you every month after tax.
      </p>

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

      <h2 className="mt-8 text-2xl font-bold">Which one do you need?</h2>
      <ul className="mt-3 space-y-2 measure text-slate-700">
        <li>
          <strong>Keeping the loan, adding money each month?</strong> Start with the payoff
          calculator — it answers &ldquo;when am I done and what does it save me.&rdquo;
        </li>
        <li>
          <strong>Being offered a new rate?</strong> Use break-even before anything else; a lower
          rate that never recoups closing costs is a loss.
        </li>
        <li>
          <strong>Got a lump sum?</strong> Recast lowers the payment, extra payments shorten the
          term — the two calculators show the difference side by side.
        </li>
      </ul>
    </>
  );
}
