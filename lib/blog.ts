import type { Faq } from "./content";

/**
 * Blog index. Article prose lives in components/BlogBodies.tsx; this module holds
 * the metadata the index, sitemap and JSON-LD need, so the blog stays a plain
 * data-driven section like lib/tools.ts. Keep `wordCount` in step with the body —
 * scripts check it against the rendered <article>.
 */
export interface BlogPost {
  slug: string;
  /** <title> source; the layout template appends "| KiteCalc" */
  title: string;
  /** visible <h1> */
  h1: string;
  description: string;
  /** card copy on /blog */
  excerpt: string;
  published: string;
  updated: string;
  readingMinutes: number;
  /** words in the rendered <article> body (FAQ and cards excluded) */
  wordCount: number;
  faqs: Faq[];
  /** calculators referenced by the article, reused for the closing card list */
  links: { href: string; label: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-lower-your-mortgage-payment",
    title: "How to Lower Your Monthly Mortgage Payment (6 Real Levers)",
    h1: "How to Lower Your Monthly Mortgage Payment",
    description:
      "Six ways to cut a monthly mortgage payment — PMI, escrow, extra payments, recast, refinance and term length — with a calculator to check each one.",
    excerpt:
      "The payment is the biggest fixed bill most households have and the least examined. Six levers actually move it, and the first two cost nothing to check.",
    published: "2026-10-05",
    updated: "2026-10-05",
    readingMinutes: 4,
    wordCount: 780,
    links: [
      { href: "/pmi-calculator", label: "PMI Calculator" },
      { href: "/property-tax-calculator", label: "Property Tax Calculator" },
      { href: "/mortgage-payoff-calculator", label: "Mortgage Payoff Calculator" },
      { href: "/mortgage-recast-calculator", label: "Mortgage Recast Calculator" },
      { href: "/refinance-break-even-calculator", label: "Refinance Break-Even Calculator" },
      { href: "/mortgage-payment-calculator", label: "Mortgage Payment Calculator" },
      { href: "/down-payment-calculator", label: "Down Payment Calculator" },
      { href: "/rent-vs-buy-calculator", label: "Rent vs Buy Calculator" },
    ],
    faqs: [
      {
        q: "What lowers a mortgage payment the most?",
        a: "If you put less than 20% down, removing PMI lowers the payment most because the charge disappears entirely. After that, the term of the loan is the biggest dial: shortening it raises the payment but cuts lifetime interest, while lengthening it eases the payment and piles interest back up.",
      },
      {
        q: "Do extra payments lower my monthly payment?",
        a: "Not by themselves. An extra payment each month goes to principal, so the loan ends sooner and total interest falls, but the required payment stays the same. To turn a lump sum into a smaller payment you need a recast, which re-amortises the loan.",
      },
      {
        q: "Why did my payment go up when my rate did not change?",
        a: "Usually escrow. The lender collects a twelfth of your property tax and homeowners insurance with every payment, so a county reassessment or a higher insurance premium raises the monthly figure. When the escrow account runs short, the deficit is spread across the next year, so the payment steps up again.",
      },
      {
        q: "Is refinancing worth it at today's rates?",
        a: "Only past the break-even point: closing costs divided by the monthly saving. Work that out before comparing rates, because a lower rate on a longer term can leave the payment higher than it is today.",
      },
      {
        q: "Is a 15-year mortgage better than a 30-year?",
        a: "It saves a great deal of interest and builds equity faster, but the payment is substantially higher for the same loan — about $765 a month higher on a $320,000 loan at 6.5%. Price both before deciding, because the gap surprises most people.",
      },
    ],
  },
  {
    slug: "15-year-vs-30-year-mortgage",
    title: "15-Year vs 30-Year Mortgage: What Each Choice Costs",
    h1: "15-Year vs 30-Year Mortgage",
    description:
      "A 15-year mortgage costs about 38% more per month and roughly 55% less interest than a 30-year on the same loan. Here is how to choose, with the maths.",
    excerpt:
      "The interest saving is real and so is the payment shock. What the two terms cost on the same $320,000 loan, and the $765 trick that gets you both.",
    published: "2026-10-05",
    updated: "2026-10-05",
    readingMinutes: 5,
    wordCount: 706,
    links: [
      { href: "/mortgage-payment-calculator", label: "Mortgage Payment Calculator" },
      { href: "/amortization-calculator", label: "Amortization Calculator" },
      { href: "/mortgage-payoff-calculator", label: "Mortgage Payoff Calculator" },
      { href: "/how-much-house-can-i-afford", label: "Home Affordability Calculator" },
      { href: "/rent-vs-buy-calculator", label: "Rent vs Buy Calculator" },
      { href: "/pmi-calculator", label: "PMI Calculator" },
    ],
    faqs: [
      {
        q: "Is the interest rate on a 15-year mortgage always lower?",
        a: "No — usually, but not always. The gap between 15-year and 30-year rates has been thin for years and occasionally inverts, so ask for both quotes on the same day. On a $320,000 loan the difference between 6.5% and 6.0% over 15 years is $2,788 versus $2,700 a month and roughly $16,000 of interest.",
      },
      {
        q: "Is a 15-year mortgage worth it if I might move in five years?",
        a: "It can be, but you are paying for it in cash flow. Over five years the 15-year borrower pays about $45,900 more than the 30-year borrower while retiring about $54,100 more principal — roughly $8,200 ahead on paper, and $765 a month poorer in the meantime.",
      },
      {
        q: "Can I get 15-year results from a 30-year loan?",
        a: "Yes. Pay the 30-year payment plus the difference — $765 on a $320,000 loan at 6.5% — and the loan retires in the same 15 years with the same interest, as long as the servicer applies the extra money to principal. You keep the right to drop back to the required payment when money is tight.",
      },
      {
        q: "Does the term affect anything besides the payment and interest?",
        a: "Indirectly, yes. Faster principal paydown reaches the 80% loan-to-value line sooner, which is where PMI cancellation lives — the PMI Calculator shows how many months that takes on your numbers. A shorter term also means a smaller approved loan for the same income. Property tax and insurance are the same either way, and the calculators here cover principal and interest only.",
      },
      {
        q: "Which term do most American buyers choose?",
        a: "The 30-year fixed remains the default for most purchases because it is the version a first-time budget qualifies for. Fifteen-year loans are chosen mainly by buyers with larger down payments or higher incomes, and refinancing can move you between the two later.",
      },
    ],
  },
];

export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
