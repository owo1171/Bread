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
    updated: "2026-10-06",
    readingMinutes: 4,
    wordCount: 790,
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
  {
    slug: "first-time-homebuyer-mistakes",
    title: "5 First-Time Homebuyer Mistakes to Avoid (With the Numbers)",
    h1: "5 First-Time Homebuyer Mistakes to Avoid",
    description:
      "Five mistakes first-time US homebuyers make — shopping by price instead of payment, spending every dollar on the down payment, and more — priced out.",
    excerpt:
      "The failures are rarely the big decision. They are five small ones with no number attached, so each one is priced here against a calculator you can run.",
    published: "2026-10-06",
    updated: "2026-10-07",
    readingMinutes: 4,
    wordCount: 724,
    links: [
      { href: "/how-much-house-can-i-afford", label: "Home Affordability Calculator" },
      { href: "/mortgage-payment-calculator", label: "Mortgage Payment Calculator" },
      { href: "/down-payment-calculator", label: "Down Payment Calculator" },
      { href: "/property-tax-calculator", label: "Property Tax Calculator" },
      { href: "/rent-vs-buy-calculator", label: "Rent vs Buy Calculator" },
      { href: "/pmi-calculator", label: "PMI Calculator" },
      { href: "/refinance-break-even-calculator", label: "Refinance Break-Even Calculator" },
      { href: "/amortization-calculator", label: "Amortization Calculator" },
    ],
    faqs: [
      {
        q: "How much should a first-time buyer put down?",
        a: "Twenty per cent keeps private mortgage insurance off your payment and is the assumption most quoted rates are built on. Lower down payments work — 3% to 5% is common — but expect PMI and a closer look at your debt-to-income ratio. Whatever you choose, do not spend the whole reserve getting there: on a $400,000 purchase each percentage point is about $27 a month of payment, which is cheap next to a repair you cannot cover.",
      },
      {
        q: "How much house can I afford on a $95,000 salary?",
        a: "At the old 28% housing rule the ceiling is a $2,217 monthly payment, which supports roughly a $410,000 home at 6.5% over 25 years with 20% down — before tax and insurance. Loosen the cap to 36% of gross and the same income points at about $527,000, which is nearer the maximum a lender will approve than the number you should spend to.",
      },
      {
        q: "What is the difference between pre-qualification and pre-approval?",
        a: "Pre-qualification is an estimate built on figures you state. Pre-approval verifies income, assets and credit and commits the lender to a number, which is why sellers take it seriously and mostly ignore the first. Getting it before you shop stops you offering on a house the arithmetic cannot carry.",
      },
      {
        q: "What costs do first-time buyers forget?",
        a: "Closing costs of 2–5% of the loan on top of the down payment, then the ongoing trio: property tax, insurance and maintenance — on a $400,000 home about $367 and $333 a month respectively at 1.1% tax and 1% maintenance. When you eventually sell, 5–6% of the price goes back out as commission and closing costs.",
      },
      {
        q: "Should a first-time buyer take a 15-year or a 30-year loan?",
        a: "Most people are better off starting from the payment they can carry in a bad month, which usually means 30 years, and buying the option to accelerate with a regular extra payment. What each term does to interest and to equity in the first five years is worked through in our 15-year versus 30-year mortgage guide.",
      },
    ],
  },
  {
    slug: "how-much-cash-to-buy-a-house",
    title: "How Much Cash Do You Need to Buy a House? Closing Costs Too",
    h1: "How Much Cash Do You Need to Buy a House?",
    description:
      "Down payment is only half the cash. On a $400,000 purchase, closing costs add $6,400 to $16,000, plus prepaids, earnest money and reserves — line by line.",
    excerpt:
      "Buyers budget the down payment and get surprised at the closing table. What you actually need in cash, line by line, on a $400,000 purchase.",
    published: "2026-10-06",
    updated: "2026-10-06",
    readingMinutes: 4,
    wordCount: 772,
    links: [
      { href: "/down-payment-calculator", label: "Down Payment Calculator" },
      { href: "/pmi-calculator", label: "PMI Calculator" },
      { href: "/mortgage-payment-calculator", label: "Mortgage Payment Calculator" },
      { href: "/refinance-break-even-calculator", label: "Refinance Break-Even Calculator" },
      { href: "/property-tax-calculator", label: "Property Tax Calculator" },
      { href: "/how-much-house-can-i-afford", label: "Home Affordability Calculator" },
    ],
    faqs: [
      {
        q: "How much cash do I need to buy a $400,000 house?",
        a: "With 20% down, about $86,400 to $96,000 before reserves: an $80,000 down payment plus closing costs of 2–5% on the $320,000 loan. Add six months of payments and the honest target is nearer $99,000 to $108,000. With 5% down the same house takes $27,600 to $39,000 to close.",
      },
      {
        q: "Do I really need 20% down?",
        a: "No. Conventional loans start around 3% and FHA around 3.5%, and the price of getting there is private mortgage insurance — $150 a month at 10% down on a $400,000 purchase, $158 at 5% — which falls away once the loan reaches 80% loan-to-value. The PMI Calculator shows how long that takes on your numbers.",
      },
      {
        q: "What is the difference between closing costs and the down payment?",
        a: "The down payment buys equity; closing costs do not. Closing costs are lender, title, appraisal and recording fees plus prepaid interest and escrow funding, typically 2–5% of the loan. They are separate from the figures a payment calculator produces, which is why the bill at the table is larger than the estimate you brought with you.",
      },
      {
        q: "What is earnest money and do I get it back?",
        a: "Earnest money is a deposit with your offer, usually 1–2% of the price — $4,000 to $8,000 on a $400,000 home. It is credited toward the purchase rather than added on top, so it is not an extra cost, but it must be available days after acceptance and it is at risk if you walk away outside a contingency.",
      },
      {
        q: "How much should I keep in reserves after closing?",
        a: "Two to six months of the total payment is the common range, and lenders increasingly ask for it in writing. Six months of a $2,023 principal-and-interest payment is about $12,100 before tax and insurance are added, which is one reason the price you can comfortably afford sits below the price a lender will approve.",
      },
    ],
  },
  {
    slug: "credit-score-and-mortgage-rates",
    title: "Understanding Your Credit Score and Its Impact on Mortgage Rates",
    h1: "Your Credit Score and Its Impact on Mortgage Rates",
    description:
      "Your credit score rarely decides whether a lender says yes — it decides the cost. On a $320,000 loan, half a point is $106 a month and $38,300 over term.",
    excerpt:
      "The one mortgage input you can still change this month. What the score measures, where lenders cut pricing, and what each cut costs per month.",
    published: "2026-10-07",
    updated: "2026-10-07",
    readingMinutes: 4,
    wordCount: 747,
    links: [
      { href: "/mortgage-payment-calculator", label: "Mortgage Payment Calculator" },
      { href: "/pmi-calculator", label: "PMI Calculator" },
      { href: "/how-much-house-can-i-afford", label: "Home Affordability Calculator" },
      { href: "/refinance-break-even-calculator", label: "Refinance Break-Even Calculator" },
      { href: "/mortgage-payoff-calculator", label: "Mortgage Payoff Calculator" },
    ],
    faqs: [
      {
        q: "What credit score do I need to get a mortgage?",
        a: "Conventional loans generally stop around 620, FHA accepts 580 with 3.5% down at many lenders, and the low-down conventional programmes usually want 680 or better. Best pricing typically starts around 760. The bands move by lender and investor, which is why the pricing matrix matters more than the single number quoted to you.",
      },
      {
        q: "How much is half a percentage point worth?",
        a: "On a $320,000 loan over 30 years, moving from 6.5% to 7.0% costs $106 a month and roughly $38,300 of extra interest across the term. That is why a tier improvement you can reach in two months is often worth more than the rate movement you are waiting for — price both figures in the Mortgage Payment Calculator before deciding.",
      },
      {
        q: "Can I raise my score quickly enough to matter?",
        a: "Utilisation is the fast lever: most models read the balance your issuer reports, so paying cards down mid-cycle can show up within weeks. Derogatory history is the slow one — a missed payment stays on the report for years and no amount of rearranging fixes it before closing.",
      },
      {
        q: "Will shopping for a mortgage hurt my score?",
        a: "Each application triggers an inquiry worth a few points, but mortgage rate shopping inside a short window is generally scored as a single inquiry rather than several. The bigger risk to the file is new debt — the store credit opened after approval, not the second lender you called.",
      },
      {
        q: "Should I wait to lock until my score improves?",
        a: "Compare the two payments rather than guessing. If one band is worth $100 or more a month and you can reach it in sixty to ninety days, waiting usually pays; if the gap is small, the market can move further against you in the same period than the tier is worth.",
      },
    ],
  },
];

export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
