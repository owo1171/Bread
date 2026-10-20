import type { Metadata } from "next";
import Link from "next/link";
import SpecCalculator from "@/components/SpecCalculator";
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
  const orgId = `${SITE_URL}/#organization`;
  // Only facts that exist: no address, phone, logo file or social profile is
  // published anywhere on the site, so none is claimed here.
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: "KiteCalc",
        url: SITE_URL,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "KiteCalc",
        url: SITE_URL,
        publisher: { "@id": orgId },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <h1 className="mt-8 text-3xl font-bold leading-tight sm:text-4xl">Free Mortgage Calculators</h1>
      <p className="measure mt-3 text-slate-700">
        Ten calculators for the questions a mortgage actually raises — what the payment is, how much
        cash it takes to get in, when the loan ends, what each payment is made of, whether a refinance
        or a recast pays, and what price your income can carry. Every one of them answers on the page
        itself: no account, no email, no result held behind a form.
      </p>

      <h2 id="quick" className="scroll-mt-16 mt-8 text-2xl font-bold">
        Start with the monthly payment
      </h2>
      <p className="measure mt-3 text-slate-700">
        A loan amount, a rate and a term are enough to price the principal-and-interest payment on any
        fixed-rate mortgage. The figures below update as you type, on this device.
      </p>
      <div className="mt-6">
        <SpecCalculator slug="mortgage-payment-calculator" />
      </div>

      <h2 id="how" className="scroll-mt-16 mt-8 text-2xl font-bold">
        How these numbers are produced
      </h2>
      <p className="measure mt-3 text-slate-700">
        Every result comes from closed-form loan arithmetic, run in your browser — the same formula a
        servicer amortises with, not a look-up table and not an average borrowed from another site. The
        payment is <span className="font-mono text-sm">B × r ÷ (1 − (1 + r)^−n)</span>, where B is the
        balance, r the monthly rate and n the number of payments left; a payoff date inverts that
        formula; amortisation walks it month by month, charging interest on the balance and applying the
        rest to principal.
      </p>
      <p className="measure mt-3 text-slate-700">
        That arithmetic is deliberately narrow. What it models is principal and interest on a fixed-rate
        loan, paid on time. What it leaves out — property tax, homeowners insurance, mortgage insurance,
        HOA dues, escrow shortages, servicer fees, prepayment terms and the interest-accrual method a
        particular servicer uses — is written down formula by formula on the{" "}
        <Link href="/methodology" className="text-blue-700 hover:underline">
          methodology page
        </Link>
        , along with the rounding rules and the inputs each tool refuses to answer.
      </p>

      <h2 id="examples" className="scroll-mt-16 mt-8 text-2xl font-bold">
        Three figures worth knowing before you borrow
      </h2>
      <ul className="measure mt-3 list-disc space-y-2 pl-5 text-slate-700">
        <li>
          <strong>$320,000 at 6.5% over 25 years is $2,161 a month.</strong> The first payment splits
          into $1,733 of interest and $427 of principal — 80% of it is the cost of the money, not the
          house. By month 173 the split has inverted, which is why early overpayments matter so much.
        </li>
        <li>
          <strong>Half a point of rate is not a rounding error.</strong> On that same balance over 25
          years, 6.0% costs $2,062 a month and 7.5% costs $2,365 — a $204 monthly spread, and about
          $61,200 more interest across the term for the higher rate.
        </li>
        <li>
          <strong>Twenty percent down is a pricing threshold, not a legal one.</strong> It is where
          conventional mortgage insurance stops: at 10% down on a $400,000 home the payment is $2,431
          plus $150 of PMI, and that $150 runs for roughly 69 months, about $10,330 in total.
        </li>
      </ul>

      <h2 id="all" className="scroll-mt-16 mt-8 text-2xl font-bold">
        All ten calculators
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
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
          Browse all mortgage calculators with guidance on which to use →
        </Link>
      </p>

      <ContentMeta className="mt-6" />

      <p className="mt-3 text-sm">
        <Link href="/blog" className="text-blue-700 hover:underline">
          Mortgage guides
        </Link>{" "}
        ·{" "}
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
