import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { CONTACT_EMAIL, pageOpenGraph, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "About & Contact",
  description:
    "Who runs these mortgage calculators, how they are funded, and how to reach a human. Free tools, no account, no data collected to show a result.",
  alternates: { canonical: "/about" },
  openGraph: pageOpenGraph(`${SITE_URL}/about`),
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${SITE_URL}/about`,
        name: "About & Contact",
        url: `${SITE_URL}/about`,
        email: CONTACT_EMAIL,
        isPartOf: { "@type": "WebSite", name: "KiteCalc", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "About & Contact" },
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
      <LegalPage title="About &amp; Contact">
        <p>
          This is a small set of mortgage calculators built for one narrow purpose: answering a
          specific money question in about ten seconds, without making you create an account first.
          Ten tools cover the questions people actually ask a mortgage — what a payment costs, how
          much cash to put down, when the loan ends, what each payment really pays for, whether a
          refinance clears its costs, what a lump sum does, what tax costs you monthly, and what
          price you can carry.
        </p>

        <h2>How the tools behave</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Free, with no signup required to see a result.</li>
          <li>
            The maths runs in your browser. Typing a balance does not send it to a server, so there is
            no account, no tracking of your loan, and no queue.
          </li>
          <li>
            On the payoff page your numbers also sit in the page address, so you can bookmark or paste
            the link and the same figures come back.
          </li>
          <li>Mobile first: big inputs, big tap targets, results readable without zooming.</li>
        </ul>

        <h2>How the site is funded</h2>
        <p>
          Advertising: Google serves ads on these pages. No ad code sits inside the calculator
          components, and there are no pop-ups or interstitial pages in front of a result.
        </p>
        <p>
          Outbound links: some pages link to lenders and comparison sites so you can check a quoted
          rate against the calculation. KiteCalc does not currently receive a commission for those
          links. If that ever changes, the affected link will be marked and named on the{" "}
          <Link href="/affiliate-disclosure">affiliate disclosure</Link> page.
        </p>

        <h2>Who maintains it</h2>
        <p>
          KiteCalc is maintained by one person, working under the site name rather than publishing a
          personal profile. There is no editorial board, no independent audit and no named outside
          expert reviewing these pages. What can be checked instead is the arithmetic: the site
          documents its formulas, default inputs and key limitations on the calculator and methodology
          pages, and each worked example can be reproduced with the inputs printed beside it.
        </p>

        <h2>How a page is checked</h2>
        <p>
          Formulas live in one place and are documented on the{" "}
          <Link href="/methodology">methodology page</Link>. The worked example on each calculator page
          is written out by hand using the same closed-form formula, with the inputs the page loads with,
          so its figures can be reproduced by entering them. Because that text is maintained separately
          from the code, it has to be re-checked whenever a formula changes.
        </p>
        <p>
          The repository also holds automated checks. An audit loads the published routes and tests
          status codes, canonical URLs, FAQ markup against the visible questions, internal links and
          image alt text. A calculator test drives all ten tools through their defaults and through zero,
          negative, oversized and non-numeric values, and asserts a documented result for each. A phone
          pass loads the routes at 390 pixels wide and flags horizontal overflow or an uncaught script
          error. These checks are run during development and maintenance; they are not a deployment gate,
          and they do not replace a review of every possible input or browser.
        </p>
        <p>
          When a figure is wrong, the repair follows the cause. A stale or mistyped example is corrected
          on the page and the review date moves with it. A wrong formula belongs in three places at the
          same time — the calculator, the methodology entry and every example that quotes it — because
          fixing only one leaves the site half-corrected.
        </p>

        <h2>Reporting a mistake</h2>
        <p>
          Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the calculator you used and the
          figures you entered. A number is far quicker to reproduce when the inputs are in the message.
          Broken links, stale policy text and unclear explanations are equally welcome.
        </p>
        <p>
          Reports are read and investigated. This is not a support desk: there is no ticket system and
          no promised response time, and any reply is about the calculation, not personal mortgage, tax
          or legal advice.
        </p>

        <h2>Read next</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <Link href="/methodology">Methodology</Link> — the formulas, the assumptions and what the
            calculators leave out.
          </li>
          <li>
            <Link href="/privacy">Privacy policy</Link> — what is stored, which is very little.
          </li>
          <li>
            <Link href="/mortgage-calculators">All ten calculators</Link>.
          </li>
        </ul>
      </LegalPage>
    </>
  );
}
