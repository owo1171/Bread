import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Some outbound links on these calculators are affiliate links. If you apply through them, the site may earn a commission at no cost to you.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage title="Affiliate Disclosure">
      <h2>What this means</h2>
      <p>
        Some links on this site, marked with <code>rel=&quot;sponsored&quot;</code>, are affiliate links.
        If you apply for a loan or open an account through one, we may receive a commission from the
        provider. It never changes the price you pay.
      </p>

      <h2>How we choose partners</h2>
      <p>
        We link to lenders and tools that fit the calculation you just ran — refinancing comparisons
        after a payoff calculation, or an amortization schedule app after a schedule question. We do not
        let a commission change a calculated result, and every figure on the page comes from your inputs.
      </p>

      <h2>Not an endorsement</h2>
      <p>
        A listing is not a recommendation to borrow. Compare the annual percentage rate, closing costs and
        prepayment terms against your own plans before you apply.
      </p>
    </LegalPage>
  );
}
