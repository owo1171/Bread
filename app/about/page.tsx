import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "About & Contact",
  description:
    "Who runs these mortgage calculators, how they are funded, and how to reach a human. Free tools, no account, no data collected to show a result.",
  alternates: { canonical: "/about" },
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
        isPartOf: { "@type": "WebSite", name: "Tool Site", url: SITE_URL },
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
          Six tools cover the questions people actually ask a mortgage — when it ends, what each
          payment really pays for, whether a refinance clears its costs, what a lump sum does, what
          tax costs you monthly, and what price you can carry.
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
          Display ads occupy three reserved slots per page — none of them inside the calculator, and
          there are no pop-ups. Some links to lenders are affiliate links: if you apply through one,
          the site may earn a commission and your price does not change. Those links carry a{" "}
          <code className="rounded bg-slate-100 px-1">sponsored</code> relationship in the HTML, and
          they are listed on the{" "}
          <Link href="/affiliate-disclosure">affiliate disclosure</Link> page.
        </p>

        <h2>Who maintains it</h2>
        <p>
          One person, who got tired of calculators that demanded an email address before showing a
          number. Corrections and missing cases are welcome — if a result looks wrong to you, it is
          worth asking.
        </p>

        <h2>Contact</h2>
        <p>
          Write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Include which calculator you used
          and the figures you entered, and you will get a reply from whoever maintains the tool rather
          than a ticket number.
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
            <Link href="/mortgage-calculators">All six calculators</Link>.
          </li>
        </ul>
      </LegalPage>
    </>
  );
}
