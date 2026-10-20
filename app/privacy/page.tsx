import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageOpenGraph, SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What this mortgage calculator site stores: your inputs stay in your browser, and that is mostly it.",
  alternates: { canonical: "/privacy" },
  openGraph: pageOpenGraph(`${SITE_URL}/privacy`),
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <h2>Your numbers stay in your browser</h2>
      <p>
        The calculators run on your device: balance, rate and payment are used to produce a result in
        the page, and nothing is posted to a server just to calculate. There is no account to create,
        no signup form in front of a result, and no server-side copy of the figures you type.
      </p>
      <p>
        Nothing is collected for a calculation, and this site does not run its own analytics script
        that profiles you.
      </p>

      <h2>What is kept, and only when you act</h2>
      <p>
        On the payoff page your inputs also sit in the page address, so reopening or sharing that link
        restores the same numbers. Pressing <strong>Save results</strong> writes those inputs to this
        browser&rsquo;s local storage; pressing <strong>Copy link</strong> puts the address on your
        clipboard. Both are actions you take, and clearing site data in your browser removes the
        stored copy.
      </p>
      <p>
        No email address is requested anywhere on this site. There is no newsletter, no PDF delivery
        and no mailing list.
      </p>

      <h2>Cookies and advertising</h2>
      <p>
        The site loads Google AdSense, which lets Google serve ads on these pages. Third-party
        vendors, including Google, use cookies to serve ads based on your prior visits to this and
        other websites. Google&rsquo;s use of advertising cookies enables it and its partners to serve
        ads based on your visit here and elsewhere.
      </p>
      <p>
        You can opt out of personalised advertising in{" "}
        <a href="https://adssettings.google.com/" rel="noopener">
          Google Ads Settings
        </a>{" "}
        and review how Google uses data from partner sites in its own policy. This site does not run
        its own cookie banner: if a consent message appears, it is Google&rsquo;s and it comes with the
        ad script. The calculators themselves set no cookies.
      </p>

      <h2>Third-party links</h2>
      <p>
        Pages link out to lenders and comparison sites. Once you follow one of those links you are on
        that company&rsquo;s site, under its privacy policy — this one no longer applies. Your
        calculator inputs are not attached to those links.
      </p>

      <h2>No financial advice</h2>
      <p>
        Results are estimates based on the figures you enter, not a lender quote. Actual payoff
        figures depend on your loan documents and the date funds reach the servicer.
      </p>

      <h2>Questions</h2>
      <p>
        Corrections and data questions go to the contact address on the{" "}
        <Link href="/about">About &amp; contact</Link> page.
      </p>
    </LegalPage>
  );
}
