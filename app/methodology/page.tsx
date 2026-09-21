import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Methodology: Formulas, Assumptions and Limits",
  description:
    "The exact formulas behind these mortgage calculators, what they assume, and what they leave out — so you know how far to trust a result.",
  alternates: { canonical: "/methodology" },
};

const FORMULAS: { name: string; body: string }[] = [
  {
    name: "Scheduled payment (payoff, amortization, recast)",
    body: "payment = B × r ÷ (1 − (1 + r)^−n). B is the balance, r is the monthly rate (annual rate ÷ 12), n is the number of monthly payments left.",
  },
  {
    name: "Payments left (payoff date)",
    body: "n = −ln(1 − r·B ÷ P) ÷ ln(1 + r), where P is the payment actually applied each month. If P does not exceed the first month's interest, n has no solution and the tool reports that the loan never ends.",
  },
  {
    name: "Break-even months (refinance)",
    body: "closing costs ÷ (current payment − new payment). Undiscounted by design: no present-value adjustment, no tax effects.",
  },
  {
    name: "Affordable price",
    body: "payment cap = (annual gross income ÷ 12) × your chosen percentage; loan = payment × (1 − (1 + r)^−n) ÷ r; price = loan ÷ (1 − down payment %).",
  },
  {
    name: "Property tax",
    body: "annual = assessed value × rate; monthly = annual ÷ 12; the ten-year figure holds value and rate flat.",
  },
  {
    name: "Biweekly mode",
    body: "Half the monthly payment every two weeks, 26 periods a year — about 13 monthly equivalents, so roughly 8% more paid per year. The periodic rate is the annual rate ÷ 26, an approximation.",
  },
];

export default function MethodologyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/methodology`,
        name: "Methodology",
        url: `${SITE_URL}/methodology`,
        isPartOf: { "@type": "WebSite", name: "Tool Site", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Methodology" },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <LegalPage title="Methodology">
        <p>
          Every number on this site comes from closed-form loan maths, not a look-up table and not a
          guess. Nothing you type is sent anywhere: the arithmetic runs in your browser, which is why
          a result appears as fast as you can type.
        </p>

        <h2>The formulas</h2>
        <dl className="space-y-3">
          {FORMULAS.map((f) => (
            <div key={f.name}>
              <dt className="font-semibold text-slate-900">{f.name}</dt>
              <dd className="mt-1 text-slate-700">{f.body}</dd>
            </div>
          ))}
        </dl>

        <h2>What we assume</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>A fixed interest rate for the whole remaining term — no ARM, no rate step-ups.</li>
          <li>Payments are applied on time, monthly (or every two weeks in biweekly mode).</li>
          <li>Any extra money goes straight to principal and stays there.</li>
          <li>The balance you enter is the principal balance, excluding any accrued interest.</li>
          <li>Payoff dates are counted in whole months from the current month.</li>
        </ul>

        <h2>What we leave out</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Property tax, homeowners insurance, mortgage insurance and escrow changes — except on the
            property tax calculator, where tax is the whole point.
          </li>
          <li>Servicer fees, prepayment penalties and the one-off fee a recast usually carries.</li>
          <li>
            Interest-accrual method. Real servicers use 30/360 or actual/365 and post payments on
            their own schedule, which is why a statement can differ by a few dollars a month from a
            calculated schedule.
          </li>
          <li>Inflation, discounting, and what you could have earned on the money instead.</li>
        </ul>

        <h2>Rounding and dates</h2>
        <p>
          Money is displayed rounded to the nearest dollar; the maths keeps full precision. Duration
          is shown as years and months, so a payoff that lands mid-month may read as the month
          before or after the exact one. Where an input cannot produce a result — a payment that does
          not cover the interest, a zero term, a lump sum larger than the balance — the calculator
          flags it instead of printing a number.
        </p>

        <h2>Not a quote</h2>
        <p>
          These are estimates for planning. Your note rate, the date funds reach the servicer, and how
          your extra payments are applied will decide the real figures. Nothing here is financial
          advice, and no calculator result is an offer of credit.
        </p>
      </LegalPage>
    </>
  );
}
