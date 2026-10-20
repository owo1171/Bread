import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageOpenGraph, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Which outbound links on these calculators go to lenders and comparison sites, and whether the site is paid for them.",
  alternates: { canonical: "/affiliate-disclosure" },
  openGraph: pageOpenGraph(`${SITE_URL}/affiliate-disclosure`),
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage title="Affiliate Disclosure">
      <h2>Outbound links today</h2>
      <p>
        Some pages link out to lenders and comparison sites so you can check a rate against the
        calculation you just ran. At the time of writing those links are plain outbound links: KiteCalc
        does not currently receive commissions from them. If that changes, this disclosure will be
        updated.
      </p>

      <h2>If that changes</h2>
      <p>
        If a compensation arrangement is ever added, the affected links will carry a{" "}
        <code>rel=&quot;sponsored&quot;</code> relationship in the HTML, the partner will be named on
        this page, and the disclosure will sit on the page that carries the link — not only here.
      </p>

      <h2>A commission never changes a result</h2>
      <p>
        Every figure on this site comes from the numbers you type and closed-form loan maths. No
        calculation, ordering or wording is adjusted for a commercial relationship, and nothing here
        is a recommendation to borrow from any particular lender.
      </p>

      <h2>Not an endorsement</h2>
      <p>
        A link is not advice. Compare the annual percentage rate, closing costs and prepayment terms
        against your own plans before you apply, and treat any offer from a lender as the offer that
        counts.
      </p>
      <h2>Questions about a link</h2>
      <p>
        To ask about a particular outbound link, or to ask for one to be removed, use the contact
        address on the <Link href="/about">About &amp; contact</Link> page.
      </p>
    </LegalPage>
  );
}
