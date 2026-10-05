import type { Faq } from "./content";

/**
 * Blog index. Posts are authored as JSX in app/blog/[slug]/page.tsx; this module
 * holds only the metadata the index, sitemap and JSON-LD need, so the blog stays
 * a plain data-driven section like lib/tools.ts.
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
  faqs: Faq[];
  /** calculators the article links to, reused for the "mentioned" block and ItemList */
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
        a: "It saves a lot of interest and builds equity faster, but the payment is substantially higher for the same loan. Price both in the payment calculator before deciding — the gap surprises most people.",
      },
    ],
  },
];

export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
