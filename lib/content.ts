/**
 * Canonical absolute origin. Override per environment with
 * NEXT_PUBLIC_SITE_URL (e.g. once a .com domain is attached); the default
 * below is the current Vercel production alias.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bread-nine-iota.vercel.app";
export const SLUG = "mortgage-payoff-calculator";

/**
 * Content review date — the single source for every "Last updated" line on the
 * site. Update it when page copy or a formula changes; do not backdate it.
 */
export const LAST_UPDATED = "2026-09-21";

const longDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});
const monthYearDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  timeZone: "UTC",
});
const updatedAt = new Date(`${LAST_UPDATED}T00:00:00Z`);

/** "September 21, 2026" */
export const LAST_UPDATED_LABEL = longDate.format(updatedAt);
/** "September 2026" — used by the legal pages */
export const LAST_UPDATED_MONTH = monthYearDate.format(updatedAt);

/** Contact address shown on /about. Swap when a real mailbox exists. */
export const CONTACT_EMAIL = "hello@bread-nine-iota.vercel.app";

/**
 * Shared social card. Real photo, 1200x630, Unsplash License (free to use,
 * attribution not required) — see public/og/CREDITS.md to swap or remove it.
 */
export const OG_IMAGE_URL = `${SITE_URL}/og/cover.jpg`;
export const OG_IMAGE_ALT =
  "House with a front yard — mortgage payoff and amortization calculators";

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "How do I calculate my mortgage payoff?",
    a: "Multiply the balance by the yearly rate divided by 12 to get one month of interest, subtract that from your payment to see how much principal you actually paid, then repeat until the balance hits zero. A fixed extra payment each month shortens the term and cuts total interest.",
  },
  {
    q: "Is the payoff amount the same as my balance?",
    a: "No. The payoff amount is the balance plus interest that keeps accruing until the funds clear, usually quoted with a daily per-diem figure.",
  },
  {
    q: "How much does an extra $100 a month really save?",
    a: "On a $300,000 balance at 6.5% with 30 years left, an extra $100 a month takes about four years off the loan and saves roughly $61,000 in interest, as long as it is applied to principal.",
  },
  {
    q: "What is the formula for a mortgage payoff with extra payments?",
    a: "Payments left = -ln(1 - r * B / P) / ln(1 + r), where B is the balance, r is the periodic interest rate and P is your regular payment plus the extra payment.",
  },
  {
    q: "Is it better to refinance or make extra payments?",
    a: "Refinance when the rate drop pays back your closing costs before your break-even month. Extra payments are usually better if you are staying put and want to avoid new fees.",
  },
  {
    q: "Do extra payments have to go to principal?",
    a: "Yes. Money applied to principal reduces the balance interest is charged on. Money held in a suspense account saves little or nothing.",
  },
  {
    q: "What is a mortgage recast, and is it better than paying extra?",
    a: "A recast re-amortizes the loan after a lump sum, so the monthly payment drops but the end date stays put. Extra payments shorten the end date and usually save more interest.",
  },
  {
    q: "Does biweekly payment really pay off a mortgage faster?",
    a: "Yes, mainly because 26 half-payments equal 13 full monthly payments a year, roughly one extra payment annually.",
  },
  {
    q: "What is per-diem interest, and why does my payoff total change daily?",
    a: "Per-diem is the interest the loan accrues each day, so every day of delay adds that amount to the payoff quote.",
  },
  {
    q: "Can I use this for an interest-only or jumbo loan?",
    a: "Yes for the balance, rate and payment maths. Interest-only periods and balloon payments need a full amortization schedule for an exact end date.",
  },
];

export interface RelatedTool {
  label: string;
  href: string;
  note: string;
}

export const RELATED_TOOLS: RelatedTool[] = [
  { label: "Amortization Calculator", href: "/amortization-calculator", note: "See every payment split between interest and principal." },
  { label: "Refinance Break-Even Calculator", href: "/refinance-break-even-calculator", note: "How many months until a new rate pays off?" },
  { label: "How Much House Can I Afford?", href: "/how-much-house-can-i-afford", note: "Work the other direction, from income to budget." },
  { label: "Mortgage Recast Calculator", href: "/mortgage-recast-calculator", note: "Lump sum in, lower monthly payment out." },
  { label: "Property Tax Calculator", href: "/property-tax-calculator", note: "Turn an assessed value into a monthly number." },
];

export interface Affiliate {
  id: string;
  anchor: string;
  href: string;
  note: string;
}

export const AFFILIATES: Affiliate[] = [
  {
    id: "refi-rates",
    anchor: "Compare today's refinance rates",
    href: "https://www.lendingtree.com/",
    note: "see if a lower rate beats paying extra.",
  },
  {
    id: "no-closing-cost",
    anchor: "Refinance with no closing costs",
    href: "https://rocketmortgage.com/",
    note: "keep cash in hand instead of paying points.",
  },
  {
    id: "budget-app",
    anchor: "Track your payoff progress in an app",
    href: "https://www.monarchmoney.com/",
    note: "make the extra payment stick.",
  },
];

export function faqSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        name: "Mortgage Payoff Calculator",
        url: baseUrl,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Extra payment modeling",
          "Payoff date estimate",
          "Total and saved interest",
          "Biweekly payment option",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Mortgage Calculators", item: `${SITE_URL}/mortgage-calculators` },
          { "@type": "ListItem", position: 3, name: "Mortgage Payoff Calculator" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
