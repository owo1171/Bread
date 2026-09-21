import type { Metadata } from "next";
import { OG_IMAGE_ALT, OG_IMAGE_URL } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Mortgage Payoff Calculator: Extra Payments & Payoff Date",
    template: "%s | Tool Site",
  },
  description:
    "Find your exact mortgage payoff date and the interest you save with extra payments. Free calculator — no signup, results in 10 seconds.",
  openGraph: {
    type: "website",
    siteName: "Tool Site",
    locale: "en_US",
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3">
            <a href="/" className="text-sm font-bold text-slate-900">
              Tool Site
            </a>
            <nav className="text-sm text-slate-600">
              <a href="/mortgage-calculators" className="hover:underline">
                Mortgage Calculators
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-content px-4 pb-16">{children}</main>

        <footer className="border-t border-slate-200 bg-slate-50 py-6 text-center text-xs text-slate-500">
          <p>Estimates only — not financial advice.</p>
          <p className="mt-1">
            <a href="/privacy" className="underline">Privacy</a> · <a href="/terms" className="underline">Terms</a> ·{" "}
            <a href="/affiliate-disclosure" className="underline">Affiliate disclosure</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
