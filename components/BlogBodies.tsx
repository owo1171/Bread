import Link from "next/link";

/**
 * Article bodies for the blog. Metadata, FAQs and schema live in lib/blog.ts;
 * the prose lives here as plain server-rendered JSX so links can sit inside
 * sentences rather than being appended as a list.
 */

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-blue-700 hover:underline">
    {children}
  </Link>
);

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-16 mt-8 text-2xl font-bold">
    {children}
  </h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="measure mt-3 text-slate-700">{children}</p>
);

/** /blog/how-to-lower-your-mortgage-payment */
export function LowerPaymentGuide() {
  return (
    <>
      <p className="measure mt-4 text-slate-700">
        Your mortgage payment is the largest fixed bill most American households have and, by a wide
        margin, the least examined. It leaves your account automatically every month, so most people
        only look at it on the occasion it goes up.
      </p>
      <P>
        Six levers actually move it. Two cost nothing to check, one can delete a charge outright, and
        one is the only lever with a price tag attached. Here they are in the order most borrowers
        should try them.
      </P>

      <H2 id="pmi">1. Check whether you are still paying PMI</H2>
      <P>
        Private mortgage insurance is what a lender charges when your down payment left less than 20%
        equity in the house. It protects the lender rather than you, and it is priced on the amount you
        originally borrowed, so it does not shrink as the balance falls. On a $400,000 home bought with
        10% down at a 0.5% PMI rate that is{" "}
        <strong className="text-slate-900">$150 a month</strong> — roughly $10,330 over the five years
        and nine months until the loan reaches 80% loan-to-value, the point where cancellation normally
        opens (<A href="/pmi-calculator">PMI Calculator</A>).
      </P>
      <P>
        Check it first. It costs nothing, and if you have reached 20% equity the whole charge can come
        off the payment.
      </P>

      <H2 id="escrow">2. Look at escrow before you blame the loan</H2>
      <P>
        When the payment rises and the interest rate did not move, the culprit is usually escrow: the
        twelfth of your property tax and homeowners insurance that the lender collects with each
        payment. County reassessments push the tax line up after a sale or a district revaluation, and
        insurance premiums have climbed sharply. A shortfall is then spread across
        the following twelve months, so the payment can step up twice (<A href="/property-tax-calculator">Property Tax Calculator</A>).
      </P>

      <H2 id="extra-payments">3. Extra payments shorten the loan — they do not shrink the payment</H2>
      <P>
        This is the most common misunderstanding. Sending an extra $200 every month sends it to
        principal, so the loan ends sooner and total interest falls, but the required payment stays
        where it was. On a $300,000 balance at 6.5% with 30 years left, an extra $100 a month takes
        about four years off and saves roughly $61,000 in interest — both figures come out of the{" "}
        <A href="/mortgage-payoff-calculator">Mortgage Payoff Calculator</A>. Decide first whether you
        are buying a cheaper month or a cheaper loan.
      </P>

      <H2 id="recast">4. The underused lever: a recast</H2>
      <P>
        If you have a lump sum — a bonus, an inheritance, savings you were not going to spend — and you
        like the rate you already have, a recast re-amortises the loan once that money goes in. The
        payment drops, the end date stays where it was, and there is no fresh stack of closing costs the
        way a refinance brings. Servicers usually charge a few hundred dollars or nothing. Weigh it
        against plain extra payments in the{" "}
        <A href="/mortgage-recast-calculator">Mortgage Recast Calculator</A>.
      </P>

      <H2 id="refinance">5. Refinance, but only past break-even</H2>
      <P>
        Refinancing is the lever with a price tag, because closing costs run a few percent of the loan.
        So the question is not whether the new rate is lower but how long the saving takes to repay the
        cost: closing costs divided by the monthly saving, which the{" "}
        <A href="/refinance-break-even-calculator">Refinance Break-Even Calculator</A> does in seconds.
        Below roughly two years it usually works; beyond that you are paying for the move itself. It is
        also why a no-closing-cost refinance is not free — the lender prices it into the rate or the
        balance instead.
      </P>

      <H2 id="term">6. Term length is the biggest dial</H2>
      <P>
        Nothing moves a payment like the number of years it is spread over. On the same $320,000 loan at
        6.5%, the <A href="/mortgage-payment-calculator">Mortgage Payment Calculator</A> prices 30 years
        at about $2,023 a month, 25 years at $2,161 and 15 years at $2,788. That is $765 a month between
        the two ends of the range, and the full comparison — what each term does to interest, equity and
        what you can qualify for — is the subject of{" "}
        <A href="/blog/15-year-vs-30-year-mortgage">our 15-year versus 30-year guide</A>.
      </P>

      <H2 id="before-you-buy">If you have not bought yet</H2>
      <P>
        For buyers the lever comes earlier: every additional 1% put down on a $400,000 purchase trims
        roughly $27 a month for the life of the loan (
        <A href="/down-payment-calculator">Down Payment Calculator</A>). The question before that one is
        whether the payment beats renting at all in your city, which is what the{" "}
        <A href="/rent-vs-buy-calculator">Rent vs Buy Calculator</A> answers — on its default figures a
        $400,000 home against $2,000 rent favours owning by about $45,428 over seven years, yet with zero
        appreciation the same inputs side with the renter. If this is your first purchase, start with the{" "}
        <A href="/blog/first-time-homebuyer-mistakes">five mistakes worth pricing first</A>.
      </P>

      <H2 id="order">The order to try them in</H2>
      <P>
        Cheapest checks first: PMI, then escrow. Then decide what you actually want — a cheaper loan
        through extra payments, or a cheaper month through a recast. Refinance last, and only past
        break-even.
      </P>
    </>
  );
}

/** /blog/15-year-vs-30-year-mortgage */
export function FifteenVsThirtyGuide() {
  return (
    <>
      <p className="measure mt-4 text-slate-700">
        Ask two people which term they chose and you will get two confident answers. The 15-year and the
        30-year are the two default products in the American mortgage market, and each comes with an
        argument that sounds decisive: one saves a fortune in interest, the other leaves money in your
        pocket every month.
      </p>
      <P>
        Both claims are true, which is why this is a cash-flow decision wearing the costume of an
        arithmetic decision. Here are the actual numbers on one loan, so you can see which constraint
        you actually live with.
      </P>

      <H2 id="payment-gap">The payment gap is bigger than it sounds</H2>
      <P>
        On a $320,000 loan at 6.5%, the{" "}
        <A href="/mortgage-payment-calculator">Mortgage Payment Calculator</A> prices the 30-year at
        about <strong className="text-slate-900">$2,023</strong> a month, the 25-year at $2,161 and the
        15-year at <strong className="text-slate-900">$2,788</strong>. That is $765 more every month,
        roughly 38% higher, and on a $400,000 loan the same comparison opens the gap to $956. Very little
        else you can change after you sign moves a payment that much — apart from the balance itself.
      </P>

      <H2 id="interest-gap">Where the interest actually goes</H2>
      <P>
        Over the full term that $765 buys something real. The 30-year costs about $408,000 in interest;
        the 15-year costs about $182,000, so you save roughly <strong className="text-slate-900">$226,000</strong>{" "}
        — about 55% less interest. The saving is not spread evenly, though. After five years a 30-year
        borrower has retired only about $20,400 of principal while the 15-year borrower has retired about
        $74,500, and after ten years the figures are $48,700 against $177,500. An{" "}
        <A href="/amortization-calculator">amortization schedule</A> shows this month by month, and it is
        why people who move early feel cheated by a 30-year loan when nothing actually went wrong.
      </P>

      <H2 id="rate">Do not assume the 15-year rate</H2>
      <P>
        Textbooks say a 15-year mortgage carries a lower rate, and it usually does. But the spread
        between the two has been thin for years and occasionally inverts, so treat half a point as a
        question for your lender rather than a fact. When the discount is there it is worth real money:
        the same $320,000 at 6.0% over 15 years prices at $2,700 a month with about $166,000 of interest
        instead of $182,000.
      </P>

      <H2 id="qualify">The same budget buys you less house</H2>
      <P>
        Term also decides what a lender will approve. At a $2,023 monthly payment the 30-year supports a
        $320,000 loan; the 15-year supports roughly $232,000 — about $88,000 less house for exactly the
        same cheque. Put your own income into the{" "}
        <A href="/how-much-house-can-i-afford">How Much House Can I Afford Calculator</A> before you fall
        for a 15-year you cannot qualify for.
      </P>

      <H2 id="middle-path">The trick that gets you both</H2>
      <P>
        A 30-year loan with a regular extra payment can imitate the 15-year. Add $765 to the 30-year
        payment and the loan retires in 15 years with the same interest paid — while the{" "}
        <em>required</em> payment stays at $2,023, ready to fall back on when income dips or a new child
        arrives. The <A href="/mortgage-payoff-calculator">Mortgage Payoff Calculator</A> gives you the
        earlier payoff date and the interest saved. One caveat that decides everything: it only works if
        the servicer applies the extra money to principal, which is worth confirming in writing rather
        than assuming.
      </P>

      <H2 id="twenty-five">The middle ground nobody mentions</H2>
      <P>
        Twenty-five years is the quiet compromise. It prices at $2,161 a month — only $138 more than the
        30-year — and cuts roughly $80,000 of interest. It sits on the useful part of the curve, which is
        why it is the default term across the calculators on this site.
      </P>

      <H2 id="verdict">So which one?</H2>
      <P>
        Take the 15-year if the payment is comfortable without straining, you intend to stay put, and you
        would rather be forced to save than trust yourself to. Take the 30-year and invest the difference
        if cash flow matters more than lifetime interest, if there is a real chance you move within a few
        years, or if you have somewhere better to put $765 a month. If the bigger question is whether
        owning beats renting in your city at all, settle that first with the{" "}
        <A href="/rent-vs-buy-calculator">Rent vs Buy Calculator</A>.
      </P>

      <H2 id="after">Once the term is settled</H2>
      <P>
        The term is one decision, not the last one. What you can still do about the payment on a loan you
        already have — PMI, escrow, recasts and the break-even test before refinancing — is the subject of{" "}
        <A href="/blog/how-to-lower-your-mortgage-payment">how to lower your monthly mortgage payment</A>.
      </P>
    </>
  );
}

/** /blog/first-time-homebuyer-mistakes */
export function FirstTimeBuyerMistakesGuide() {
  return (
    <>
      <p className="measure mt-4 text-slate-700">
        First-time buyers almost never fail on the big question. They fail on five small ones, each of
        which looked obvious at the time and none of which had a number attached to it when the decision
        was made.
      </p>
      <P>
        Here are the five, in the order they tend to happen, with the arithmetic that makes each one
        concrete — because a mistake you can price is a mistake you can avoid.
      </P>

      <H2 id="price-vs-payment">1. Shopping by house price instead of monthly payment</H2>
      <P>
        Listings are sorted by price, so buyers browse by price and then discover the bill arrives
        monthly. A $400,000 home is not one number: with 20% down at 6.5% over 25 years it is a{" "}
        <strong className="text-slate-900">$2,161</strong> principal-and-interest payment (
        <A href="/mortgage-payment-calculator">Mortgage Payment Calculator</A>) before tax, insurance and
        any mortgage insurance. Working the other way round is usually wiser: the{" "}
        <A href="/how-much-house-can-i-afford">How Much House Can I Afford Calculator</A> starts at your
        income, turns it into a payment you can carry, and only then into a price — on $95,000 of income at
        the 28% housing cap it points at a $2,217 payment and a home around $410,000, and that estimate is
        before tax and insurance, which is precisely why the realistic figure lands lower.
      </P>

      <H2 id="all-cash-down">2. Spending the entire savings on the down payment</H2>
      <P>
        The down payment is not the cash requirement — it is the visible half of it. Closing costs run
        another 2–5% of the loan, which on a $400,000 purchase is roughly $8,000 to $20,000 paid at the
        table, and the first water heater fails without an appointment. Buyers who put down every dollar
        they own end up owning a house they cannot afford to run. The{" "}
        <A href="/down-payment-calculator">Down Payment Calculator</A> prices that tradeoff directly: on a
        $400,000 purchase, each percentage point you move out of the down payment is about $27 a month for
        the life of the loan.
      </P>

      <H2 id="true-cost">3. Assuming the mortgage payment is the cost of owning</H2>
      <P>
        On that same $400,000 home, property tax at 1.1% adds roughly{" "}
        <strong className="text-slate-900">$367 a month</strong> and maintenance at 1% of the price another
        $333 (<A href="/property-tax-calculator">Property Tax Calculator</A>), with homeowners insurance on
        top. None of it builds equity or comes back when you sell, and that is exactly the distinction the{" "}
        <A href="/rent-vs-buy-calculator">Rent vs Buy Calculator</A> is built around: it counts only what
        you cannot recover.
      </P>

      <H2 id="first-quote">4. Taking the first loan offer as the market</H2>
      <P>
        Many first-time buyers accept the quote from the bank where they have held a checking account since
        college. Half a point is not a rounding error: on a $320,000 loan over 30 years, 6.0% instead of
        6.5% is $1,919 rather than $2,023 a month and about $37,500 less interest across the term. If you
        are below 20% down, ask the same questions about mortgage insurance — at 10% down on a $400,000
        home it is $150 a month until you reach 80% loan-to-value (
        <A href="/pmi-calculator">PMI Calculator</A>). That is a five-figure decision sitting inside a line
        item, and the <A href="/refinance-break-even-calculator">Refinance Break-Even Calculator</A> is what
        keeps a later fix honest.
      </P>

      <H2 id="horizon">5. Buying for the wrong time horizon</H2>
      <P>
        Nobody plans to move, and yet first homes change hands sooner than owners expect. Selling costs
        about 5–6% of the price — $20,000 to $24,000 on a $400,000 house — and in the early years most of
        each payment is interest rather than equity: five years into a 30-year loan at 6.5%, roughly
        $20,000 of a $320,000 principal has been retired (
        <A href="/amortization-calculator">Amortization Calculator</A>, and the full story in{" "}
        <A href="/blog/15-year-vs-30-year-mortgage">our 15-year versus 30-year guide</A>). If your honest
        plan is shorter than five years, renting is a legitimate answer rather than a consolation prize.
      </P>

      <H2 id="checklist">Before you sign</H2>
      <P>
        Price the payment, not the house. Keep two months of salary in reserve after closing, because the
        down payment is only half the cash requirement. Budget tax, insurance and maintenance as their own
        line rather than a surprise. Collect two loan quotes and read the PMI line. And be honest about how
        long you will stay, because that answer changes which of the above matters most. Once you are in the
        house, the six levers in{" "}
        <A href="/blog/how-to-lower-your-mortgage-payment">how to lower your monthly mortgage payment</A> are
        what you will want next.
      </P>
    </>
  );
}

/** slug → article body; a post with no entry here is treated as unfinished. */
export const BLOG_BODIES: Record<string, () => React.ReactElement> = {
  "how-to-lower-your-mortgage-payment": LowerPaymentGuide,
  "15-year-vs-30-year-mortgage": FifteenVsThirtyGuide,
  "first-time-homebuyer-mistakes": FirstTimeBuyerMistakesGuide,
};
