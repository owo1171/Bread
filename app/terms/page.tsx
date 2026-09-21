import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using the mortgage calculators: estimates only, no warranty, and you own the numbers you enter.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <h2>Use of the tools</h2>
      <p>
        These calculators are provided free of charge for personal and internal business use. You may
        share results and print them; reselling the tool itself or scraping it at commercial scale
        requires attribution.
      </p>

      <h2>Estimates, not quotes</h2>
      <p>
        Results assume fixed rate, no escrow and constant payments unless stated on the page. Prepayment
        rules, servicing fees and interest accrual methods vary by lender, so treat any figure here as a
        close estimate rather than a payoff statement.
      </p>

      <h2>No warranty</h2>
      <p>
        The tools are provided &ldquo;as is&rdquo; without warranty of any kind. We are not liable for
        decisions made from a calculation, including refinances that turn out differently than modeled.
      </p>
    </LegalPage>
  );
}
