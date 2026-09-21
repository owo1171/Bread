import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What this mortgage calculator site stores: your inputs stay in your browser, and that is mostly it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <h2>Your numbers stay local</h2>
      <p>
        The calculators run in your browser: balance, rate and payment are used to produce a result on
        this device, and nothing is posted to a server just to calculate. No tool asks for an account,
        and no tool files your figures away on its own.
      </p>
      <p>
        Two things can persist, both only after you act. On the payoff page your figures also sit in
        the page address, so reopening or sharing that link restores the same inputs; tapping{" "}
        <strong>Save results</strong> keeps a copy in this browser&rsquo;s local storage, and the email
        address you submit for the payoff plan is kept there too. Clearing site data removes them, and
        we do not hold a server-side record of the values you typed.
      </p>

      <h2>Cookies and advertising</h2>
      <p>
        Advertising partners may use cookies to serve relevant ads, and a consent platform may store
        a preference cookie. Third-party vendors, including Google, may use prior browsing history
        to place ads based on your visit to this and other sites.
      </p>

      <h2>Email</h2>
      <p>
        If you submit an email address for the payoff plan PDF, we use it to send that document and
        occasional calculator updates. One click unsubscribes, and we do not sell the address.
      </p>

      <h2>No financial advice</h2>
      <p>
        Results are estimates based on the figures you enter, not a lender quote. Actual payoff
        figures depend on your loan documents and the date funds reach the servicer.
      </p>
    </LegalPage>
  );
}
