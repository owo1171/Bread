import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageOpenGraph, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using the mortgage calculators: estimates only, no warranty, no account, and you own the numbers you enter.",
  alternates: { canonical: "/terms" },
  openGraph: pageOpenGraph(`${SITE_URL}/terms`),
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <h2>Use of the tools</h2>
      <p>
        These calculators are provided free of charge for personal and internal business use. You may
        run them as often as you like, print a result, and share a link that carries your inputs. No
        account is created, no licence fee is due, and nothing you enter is sent to this site&rsquo;s
        server to produce a result.
      </p>
      <p>
        Reselling a calculator as your own product, or scraping the site at commercial scale, needs
        written permission. Quoting a figure with a link back to the page it came from does not.
      </p>

      <h2>Estimates, not quotes</h2>
      <p>
        Results assume a fixed rate, no escrow and constant payments unless the page states otherwise.
        Prepayment rules, servicing fees, interest-accrual methods and the date funds reach a servicer
        all vary by lender, so treat any figure here as a close estimate rather than a payoff statement
        or an offer of credit.
      </p>

      <h2>No warranty</h2>
      <p>
        The tools are provided &ldquo;as is&rdquo;, without warranty of any kind, express or implied,
        including fitness for a particular purpose. We are not liable for decisions made from a
        calculation, including refinances, recasts or purchases that turn out differently from a model.
      </p>

      <h2>Advertising and third-party links</h2>
      <p>
        Pages may carry advertising served by Google, and may link to lenders and comparison sites. We
        do not control those destinations, their offers or their availability, and a link is not an
        endorsement. Once you follow one, that company&rsquo;s terms and privacy policy apply — see the{" "}
        <Link href="/affiliate-disclosure">affiliate disclosure</Link> for which links, if any, involve
        compensation.
      </p>

      <h2>Content and corrections</h2>
      <p>
        Explanations, formulas and worked examples are written to be checked: if a figure looks wrong,
        recompute it and tell us. The site is maintained by one person rather than a desk, so a
        correction may take a few days, and pages carry the date they were last reviewed.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        These terms may change as the site does, and the &ldquo;last updated&rdquo; line above is what
        applies. Continuing to use the calculators after a change means the current version governs the
        use.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms go to the address on the{" "}
        <Link href="/about">About &amp; contact</Link> page.
      </p>
    </LegalPage>
  );
}
