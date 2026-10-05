import type { Faq } from "@/lib/content";

export type FormatKind = "usd" | "durationMonths" | "months" | "number";

export interface FieldSpec {
  key: string;
  label: string;
  prefix?: string;
  suffix?: string;
  inputMode?: "decimal" | "numeric";
}

export interface OutputSpec {
  key: string;
  label: string;
  format: FormatKind;
  highlight?: boolean;
  hint?: string;
}

export interface ToolValues {
  [key: string]: number;
}

export interface ToolExample {
  /** The inputs the worked example uses — match the defaults shown on load. */
  inputs: string;
  /** Result sentences, each one a figure the calculator itself produces. */
  results: string[];
}

/**
 * A "how to use it" guide: what the tool does, a numbered walkthrough of the
 * input boxes, then the caveats. Optional so older pages keep their current
 * length while newer pages carry a fuller guide.
 */
export interface GuideSpec {
  heading: string;
  intro: string[];
  steps: string[];
  note: string[];
}

export interface ToolSpec {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string[];
  fields: FieldSpec[];
  outputs: OutputSpec[];
  compute: (v: ToolValues) => Record<string, number>;
  invalid: (v: ToolValues) => boolean;
  faqs: Faq[];
  /** Plain-English walkthrough of the maths, rendered below the calculator. */
  howItWorks: string[];
  /** Worked example, using the same defaults the calculator loads with. */
  example: ToolExample;
  /** Optional longer usage guide with per-field filling instructions. */
  guide?: GuideSpec;
  scheduleTitle?: string;
  schedule?: (v: ToolValues) => { period: string; interest: number; principal: number; balance: number }[];
}

const pmt = (B: number, r: number, n: number): number =>
  r === 0 ? B / n : (B * r) / (1 - Math.pow(1 + r, -n));

const nOf = (B: number, r: number, P: number): number => {
  if (B <= 0 || P <= 0) return Infinity;
  if (r === 0) return B / P;
  const headroom = 1 - (r * B) / P;
  if (headroom <= 0) return Infinity;
  return -Math.log(headroom) / Math.log(1 + r);
};

const presentValue = (payment: number, r: number, n: number): number =>
  r === 0 ? payment * n : (payment * (1 - Math.pow(1 + r, -n))) / r;

export const SIBLING_TOOLS: ToolSpec[] = [
  {
    slug: "mortgage-payment-calculator",
    name: "Mortgage Payment Calculator",
    title: "Mortgage Payment Calculator: What Is My Monthly Payment?",
    description:
      "Enter a loan amount, interest rate and term to get the monthly payment, total interest and full cost. Free mortgage payment calculator, no signup.",
    intro: [
      "A mortgage payment calculator answers the most basic question first: what leaves your bank account every month. Enter the amount you are borrowing, the interest rate and the length of the loan, and it returns the principal-and-interest payment along with what the loan costs in total.",
      "It is the starting point for the other tools on this site. The payoff calculator takes this payment and asks when the loan ends; the refinance calculator asks whether a new payment ever clears its closing costs.",
    ],
    fields: [
      { key: "loanAmount", label: "Loan amount", prefix: "$", inputMode: "decimal" },
      { key: "ratePct", label: "Interest rate", suffix: "%", inputMode: "decimal" },
      { key: "years", label: "Loan term", suffix: "yr", inputMode: "numeric" },
    ],
    outputs: [
      { key: "monthlyPayment", label: "Monthly payment (P&I)", format: "usd", highlight: true },
      { key: "totalInterest", label: "Total interest", format: "usd" },
      { key: "totalPaid", label: "Total of payments", format: "usd" },
    ],
    invalid: (v) => !(v.loanAmount > 0 && v.years > 0 && v.ratePct >= 0),
    compute: (v) => {
      const r = v.ratePct / 100 / 12;
      const n = v.years * 12;
      const payment = pmt(v.loanAmount, r, n);
      const total = payment * n;
      return {
        monthlyPayment: payment,
        totalInterest: total - v.loanAmount,
        totalPaid: total,
        ok: 1,
      };
    },
    guide: {
      heading: "Using this mortgage payment calculator",
      intro: [
        "Enter three numbers and the calculator returns the payment a fixed-rate loan actually requires each month, plus two figures people forget to ask for: the total interest over the whole term, and the total of every payment combined. Those last two are where a long term quietly charges you.",
        "The payment shown is principal and interest only — the P&I line on your statement. Property taxes, homeowners insurance, mortgage insurance and HOA dues sit outside it, which is why your real monthly outlay is usually higher than the number on this page.",
      ],
      steps: [
        "Loan amount is the money you are borrowing, not the price of the house. Take the purchase price and subtract your down payment — $400,000 less $80,000 is a $320,000 loan. If you already own the home, enter the balance you are refinancing. Type digits; the box ignores commas.",
        "Interest rate is the annual rate written as a percentage, so 6.5 means 6.5% rather than 0.065. The calculator divides it by twelve itself. Shopping two offers? Run it twice and compare the monthly payment and the total interest column, not the rate alone.",
        "Loan term is the number of years until the balance reaches zero: 15, 20, 25 and 30 are the usual US options. A shorter term raises the payment and cuts the total interest, which is exactly the trade the third result box makes visible.",
      ],
      note: [
        "Two assumptions are baked in: the rate never changes, and every payment is made on schedule with nothing skipped. That makes the answer clean arithmetic rather than a forecast — an ARM, a forbearance or one missed month all move the real total.",
        "If your question is what happens when you put extra money at the balance each month, take the payment this page produces into the mortgage payoff calculator. If you are still deciding how much cash to put down, the down payment calculator turns a purchase price into the loan you are pricing here.",
      ],
    },
    howItWorks: [
      "Payment = B × r ÷ (1 − (1 + r)^−n). B is the loan amount, r is the monthly rate (your annual rate ÷ 12) and n is the number of monthly payments (years × 12). At a 0% rate that formula divides by zero, so the calculator falls back to the simple case: loan ÷ months.",
      "Total of payments is the payment multiplied by the number of payments, and total interest is that figure minus the amount borrowed. Both are arithmetic, not a forecast: they assume no missed payments, no refinancing and no extra money applied to principal.",
      "The result is principal and interest only. Taxes, homeowners insurance, mortgage insurance and HOA dues are excluded on purpose — they move on their own schedule, and mixing them in hides what the loan itself costs.",
    ],
    example: {
      inputs: "$320,000 loan · 6.5% rate · 25-year term",
      results: [
        "Monthly payment: $2,161 in principal and interest.",
        "First payment split: about $1,733 interest and $427 principal.",
        "Total of payments across 300 months: $648,199.",
        "Total interest: $328,199. Stretch the same loan to 30 years and the payment falls to $2,023 while the interest climbs to about $408,000.",
      ],
    },
    faqs: [
      {
        q: "What is the monthly payment on a $320,000 mortgage?",
        a: "At 6.5% over 25 years it is $2,161 a month in principal and interest. About $1,733 of that first payment is interest and only $427 goes to principal — the split flips later in the term.",
      },
      {
        q: "What is included in the payment this calculator shows?",
        a: "Principal and interest only. Property tax, homeowners insurance, mortgage insurance below 20% down, HOA dues and servicer fees all sit outside it, which is why the payment on your statement is usually larger.",
      },
      {
        q: "Does the loan term change the total cost much?",
        a: "It dominates it. A $320,000 loan at 6.5% costs $328,199 in interest over 25 years at $2,161 a month. Stretch it to 30 years and the payment drops to $2,023 while interest rises to roughly $408,000.",
      },
      {
        q: "What is the difference between this and a mortgage payoff calculator?",
        a: "This page prices the payment for a loan you are taking out or refinancing. The payoff calculator starts from a payment and answers when the loan ends and what an extra payment each month saves — they are meant to be used in that order.",
      },
      {
        q: "Why is my real mortgage payment higher than this number?",
        a: "Escrow. Taxes and insurance are collected monthly alongside the P&I, and a loan above 80% of the value usually carries mortgage insurance too. On a $400,000 home those extras commonly add a few hundred dollars a month.",
      },
    ],
  },
  {
    slug: "down-payment-calculator",
    name: "Down Payment Calculator",
    title: "Down Payment Calculator: How Much Should You Put Down?",
    description:
      "See the cash you need at closing, the loan it leaves behind and the payment that follows. Free down payment calculator for US buyers. No signup.",
    intro: [
      "A down payment is three decisions at once: the cash you hand over at closing, the loan you leave behind, and the payment that loan carries for the next twenty or thirty years. This calculator shows all three from the same inputs, so you can see the trade before you commit.",
      "Enter the price of the home and the size of your down payment as a percentage. Add a rate and term and it prices the loan that remains, so the payment shown is the one a lender would underwrite — not a rough guess.",
    ],
    fields: [
      { key: "homePrice", label: "Home price", prefix: "$", inputMode: "decimal" },
      { key: "downPaymentPct", label: "Down payment", suffix: "%", inputMode: "decimal" },
      { key: "ratePct", label: "Interest rate", suffix: "%", inputMode: "decimal" },
      { key: "years", label: "Loan term", suffix: "yr", inputMode: "numeric" },
    ],
    outputs: [
      { key: "downPayment", label: "Down payment", format: "usd", highlight: true },
      { key: "loanAmount", label: "Loan amount", format: "usd" },
      { key: "monthlyPayment", label: "Monthly payment (P&I)", format: "usd" },
    ],
    invalid: (v) => !(v.homePrice > 0 && v.downPaymentPct >= 0 && v.downPaymentPct < 100 && v.years > 0),
    compute: (v) => {
      const down = v.homePrice * (v.downPaymentPct / 100);
      const loan = v.homePrice - down;
      const r = v.ratePct / 100 / 12;
      return {
        downPayment: down,
        loanAmount: loan,
        monthlyPayment: pmt(loan, r, v.years * 12),
        ltv: (loan / v.homePrice) * 100,
        ok: 1,
      };
    },
    guide: {
      heading: "Using this down payment calculator",
      intro: [
        "Enter a home price and a down payment percentage and you get the three numbers that actually decide the purchase: the cash required, the loan that remains, and the monthly payment attached to it. Change the percentage and all three move together, which is the fastest way to see what a bigger down payment buys you.",
        "Adding a rate and a term is what turns a loan figure into a payment. Keep them at the figures you have been quoted, and the payment shown here lines up with the figures on a Loan Estimate.",
      ],
      steps: [
        "Home price is the purchase price, not an estimate you saw months ago. If you are refinancing rather than buying, use the appraised value the lender used.",
        "Down payment is entered as a percentage, not dollars. Twenty is the working benchmark because at 20% equity most lenders stop charging monthly mortgage insurance, while US programmes go as low as 3.5% for FHA and 0% for VA and USDA.",
        "Interest rate is the annual rate as a percentage, and loan term is the years over which the remaining balance amortises. Move the term and you can see how much of the payment is a rate decision rather than a down-payment decision.",
      ],
      note: [
        "Two figures deserve more attention than the headline number. Loan-to-value — the loan divided by the price — is what lenders price, and 80% is the usual cut-off where better pricing begins. Cash left in reserve matters just as much: a bigger down payment that empties your emergency fund tends to come back as a credit-card balance within a year.",
        "Closing costs are not included. They are separate from the down payment and commonly run a few percent of the price on top of it. The property tax calculator covers the tax line, and the mortgage payment calculator prices any loan figure you land on.",
      ],
    },
    howItWorks: [
      "Down payment = home price × percentage ÷ 100. The loan is simply what is left: price minus down payment. Loan-to-value is that loan divided by the price, so a 20% down payment is an 80% loan-to-value.",
      "The payment line re-uses the standard amortising formula, payment = B × r ÷ (1 − (1 + r)^−n), where B is the loan you are left with, r is the annual rate ÷ 12 and n is years × 12. Nothing about the down payment changes the formula — it only changes B.",
      "A down payment of 100% leaves no loan to price, so the calculator asks for a figure below 100. Mortgage insurance, closing costs, taxes and HOA dues sit outside this model, which is why the payment is a P&I figure rather than your total monthly housing cost.",
    ],
    example: {
      inputs: "$400,000 home price · 20% down · 6.5% rate · 25-year term",
      results: [
        "Down payment: $80,000 in cash at closing.",
        "Loan amount: $320,000, which is 80% loan-to-value.",
        "Payment on that loan: $2,161 a month in principal and interest.",
        "Put down 15% instead and it is $60,000 cash, a $340,000 loan and $2,296 a month — before any mortgage insurance.",
        "Each extra 1% down on this price is $4,000 less borrowed, worth about $27 a month.",
      ],
    },
    faqs: [
      {
        q: "How much down payment do I need?",
        a: "Conventional loans start around 3% to 5% for qualifying buyers, FHA takes 3.5%, and VA and USDA can reach zero. Twenty percent is the working benchmark because it is where monthly mortgage insurance usually disappears.",
      },
      {
        q: "What does putting down less than 20% cost me?",
        a: "On a $400,000 home at 6.5% over 25 years, 20% down means $80,000 cash and a $2,161 payment. At 15% down it is $60,000 cash, a $340,000 loan and $2,296 a month — plus mortgage insurance on top while your equity is under 20%.",
      },
      {
        q: "What is loan-to-value?",
        a: "The loan divided by the property value. A $320,000 loan on a $400,000 home is 80% loan-to-value, which is where most lenders stop adding risk premiums to your rate.",
      },
      {
        q: "Is every extra point of down payment worth it?",
        a: "Each point on a $400,000 home is $4,000 less borrowed, worth roughly $27 a month at 6.5% over 25 years. It is only worth it if the cash you keep in reserve still covers a job loss or a new roof.",
      },
      {
        q: "Are closing costs part of the down payment?",
        a: "No, they are separate money. The down payment is equity you put into the purchase, while closing costs pay the lender, title and local recording, and commonly run a few percent of the price on top of it.",
      },
    ],
  },
  {
    slug: "amortization-calculator",
    name: "Amortization Calculator",
    title: "Amortization Calculator: See Every Payment Split",
    description:
      "See how each mortgage payment splits between interest and principal, plus your payoff date and total interest. Free, no signup.",
    intro: [
      "An amortization schedule shows the truth about a mortgage: early payments are mostly interest, late payments are mostly principal. This page shows the yearly split so you can see when the crossover happens.",
      "Add an extra payment and every extra dollar goes straight to principal, which pulls the crossover forward and cuts the tail of the loan.",
    ],
    fields: [
      { key: "balance", label: "Current balance", prefix: "$", inputMode: "decimal" },
      { key: "ratePct", label: "Interest rate", suffix: "%", inputMode: "decimal" },
      { key: "years", label: "Years remaining", suffix: "yr", inputMode: "numeric" },
      { key: "extraMonthly", label: "Extra payment / month", prefix: "$", inputMode: "decimal" },
    ],
    outputs: [
      { key: "payoffMonths", label: "Payoff in", format: "durationMonths" },
      { key: "totalInterest", label: "Total interest", format: "usd" },
      { key: "interestSaved", label: "Interest saved", format: "usd", highlight: true, hint: "vs no extra payment" },
    ],
    invalid: (v) => !(v.balance > 0 && v.years > 0),
    compute: (v) => {
      const r = v.ratePct / 100 / 12;
      const n = v.years * 12;
      const base = pmt(v.balance, r, n);
      const withExtra = base + v.extraMonthly;
      const np = nOf(v.balance, r, withExtra);
      const baseInt = base * n - v.balance;
      const totalInt = Number.isFinite(np) ? withExtra * np - v.balance : NaN;
      return {
        payoffMonths: np,
        totalInterest: totalInt,
        interestSaved: baseInt - totalInt,
        ok: Number.isFinite(np) ? 1 : 0,
      };
    },
    scheduleTitle: "First 10 years",
    schedule: (v) => {
      const r = v.ratePct / 100 / 12;
      const n = v.years * 12;
      const payment = pmt(v.balance, r, n) + v.extraMonthly;
      let bal = v.balance;
      const rows: { period: string; interest: number; principal: number; balance: number }[] = [];
      for (let year = 1; year <= Math.min(10, Math.ceil(v.years)) && bal > 0.5; year++) {
        let yearInterest = 0;
        let yearPrincipal = 0;
        for (let m = 0; m < 12 && bal > 0.5; m++) {
          const interest = bal * r;
          const principal = Math.min(payment - interest, bal);
          yearInterest += interest;
          yearPrincipal += principal;
          bal -= principal;
        }
        rows.push({
          period: `Year ${year}`,
          interest: yearInterest,
          principal: yearPrincipal,
          balance: Math.max(0, bal),
        });
      }
      return rows;
    },
    howItWorks: [
      "First the scheduled payment comes from the standard amortizing formula: payment = B × r ÷ (1 − (1 + r)^−n), where B is the balance, r is the monthly rate (annual rate ÷ 12) and n is the number of payments left.",
      "Then the loan is walked month by month. Interest for the month is balance × r; everything in the payment above that is principal; the balance falls by the principal part only. An extra payment is added to the principal line, so it never earns interest and the balance drops faster.",
      "The table groups that loop by year. It assumes a fixed rate, payments applied on time, and no escrow, mortgage insurance or servicer fees — those sit outside the schedule.",
    ],
    example: {
      inputs: "$320,000 balance · 6.5% rate · 25 years left · $200 extra a month",
      results: [
        "Scheduled payment: $2,161 a month.",
        "First payment split: about $1,733 interest and $427 principal.",
        "Payoff in 20 yr 5 mo instead of 25 yr.",
        "Total interest $259,116, which is $69,083 less than staying on schedule.",
      ],
    },
    faqs: [
      {
        q: "What is an amortization schedule?",
        a: "A table that splits every payment between interest and principal and shows the balance left afterwards. On a $320,000 loan at 6.5% over 25 years, the first $2,161 payment pays $1,733 of interest and only $427 of principal.",
      },
      {
        q: "When do most of my payment go to principal?",
        a: "Once the balance falls below roughly half the original, the split flips. On that $320,000 loan at 6.5% with 25 years left it happens around month 173 — year 14. Any extra principal you pay moves that month earlier.",
      },
      {
        q: "Does an extra payment change the amortization schedule?",
        a: "Yes. Money applied to principal shrinks the balance immediately, so next month's interest is smaller and the whole schedule compresses. On that same loan, $200 a month cuts 4 years 7 months off the term and saves $69,083 in interest.",
      },
      {
        q: "What is the difference between amortization and a payoff calculation?",
        a: "A payoff calculation answers when the loan ends and what the interest costs. An amortization schedule answers what happens inside each individual payment. Same maths, different question.",
      },
      {
        q: "Why is my real amortization schedule a few dollars different?",
        a: "Servicers differ on interest accrual (30/360 versus actual/365), on payment posting dates, and on whether extra money sits in suspense before it hits principal. Match to the dollar only against your own servicer's method.",
      },
      {
        q: "Is this schedule the same as the one on my statement?",
        a: "Close, not identical. This one compounds monthly and applies every payment on time. Your servicer may accrue interest on an actual/365 basis, post payments on a different day, or hold partial payments in suspense — expect a few dollars of difference per month, not a different payoff year.",
      },
    ],
  },
  {
    slug: "refinance-break-even-calculator",
    name: "Refinance Break-Even Calculator",
    title: "Refinance Break-Even Calculator: How Long to Recoup Costs?",
    description:
      "Enter closing costs and your old and new payments to see how many months until refinancing pays for itself. Free, no signup.",
    intro: [
      "Refinancing only wins if you stay put long enough to cover the closing costs. This calculator gives you the break-even month so you can compare it with your plans.",
      "Moving before break-even usually means the refinance lost money, no matter how good the new rate looked.",
    ],
    fields: [
      { key: "closingCosts", label: "Closing costs", prefix: "$", inputMode: "decimal" },
      { key: "currentPayment", label: "Current monthly payment", prefix: "$", inputMode: "decimal" },
      { key: "newPayment", label: "New monthly payment", prefix: "$", inputMode: "decimal" },
    ],
    outputs: [
      { key: "monthlySaving", label: "Monthly saving", format: "usd" },
      { key: "breakEvenMonths", label: "Break-even", format: "durationMonths", highlight: true },
      { key: "netFiveYears", label: "Net after 5 years", format: "usd" },
    ],
    invalid: (v) => !(v.closingCosts >= 0 && v.currentPayment > 0 && v.newPayment >= 0),
    compute: (v) => {
      const saving = v.currentPayment - v.newPayment;
      const months = saving > 0 ? v.closingCosts / saving : Infinity;
      return {
        monthlySaving: saving,
        breakEvenMonths: months,
        netFiveYears: saving * 60 - v.closingCosts,
        ok: saving > 0 ? 1 : 0,
      };
    },
    howItWorks: [
      "Monthly saving = current payment − new payment. Break-even months = closing costs ÷ monthly saving. That is the whole calculation, deliberately undiscounted: a dollar saved in month 30 is treated the same as a dollar saved in month 3.",
      "Net after 5 years = (monthly saving × 60) − closing costs. It answers the question break-even alone cannot: if you stay the full five years, is the deal actually worth it after the costs?",
      "If the new payment is not lower, there is nothing to break even on and the calculator flags the inputs instead of dividing by zero. Costs paid later (a lender credit, or a higher balance) still belong in the closing-costs box, because they are still money you pay.",
    ],
    example: {
      inputs: "$4,500 closing costs · payment falls from $2,160 to $1,890",
      results: [
        "Monthly saving: $270.",
        "Break-even: 1 yr 5 mo (16.7 months).",
        "Net after 5 years: +$11,700.",
        "If you sell at 12 months instead, you are roughly $1,260 short of covering the costs.",
      ],
    },
    faqs: [
      {
        q: "How do I calculate break-even on a refinance?",
        a: "Divide the total closing costs by the drop in your monthly payment. With $4,500 of costs and a payment that falls $270, you break even in 16.7 months.",
      },
      {
        q: "What is a good break-even point for refinancing?",
        a: "Under 24 months is comfortable if you expect to stay five years or longer. Past 36 months the deal depends on certainty about staying put, which most people overestimate.",
      },
      {
        q: "What happens if I sell before break-even?",
        a: "You lose the costs you have not recouped yet, so treat break-even as the minimum time you must stay. A safer test is to require your planned stay to be about 1.5 times the break-even month.",
      },
      {
        q: "Are closing costs the only cost to include?",
        a: "No. Put prepayment penalties, title insurance, appraisal and any points you pay to buy down the rate into the same number. Escrow and prepaid interest get re-collected rather than added, so leave them out.",
      },
      {
        q: "Does dropping PMI count as savings?",
        a: "Yes — count it in the payment drop. If more equity removes $95 a month of mortgage insurance, that is $95 a month saved from month one, and it pulls your break-even closer.",
      },
      {
        q: "What about a no-cost refinance?",
        a: "A no-cost refinance does not remove the cost, it moves it — usually into a higher rate or a bigger balance. There is no up-front figure left to divide, so run the calculation with the lender credit added back to see what you really paid for the rate.",
      },
    ],
  },
  {
    slug: "mortgage-recast-calculator",
    name: "Mortgage Recast Calculator",
    title: "Mortgage Recast Calculator: New Payment After a Lump Sum",
    description:
      "See your new monthly payment after a lump sum recast, and how much the payment drops. Free, no signup.",
    intro: [
      "A recast re-amortizes your loan after a lump-sum payment: the term stays the same, but the monthly payment drops. That is different from paying extra, which shortens the term instead.",
      "Pick a recast when monthly cash flow matters more than total interest saved.",
    ],
    fields: [
      { key: "balance", label: "Current balance", prefix: "$", inputMode: "decimal" },
      { key: "ratePct", label: "Interest rate", suffix: "%", inputMode: "decimal" },
      { key: "years", label: "Years remaining", suffix: "yr", inputMode: "numeric" },
      { key: "lumpSum", label: "Lump sum payment", prefix: "$", inputMode: "decimal" },
    ],
    outputs: [
      { key: "newBalance", label: "Balance after lump sum", format: "usd" },
      { key: "newPayment", label: "New monthly payment", format: "usd", highlight: true },
      { key: "paymentDrop", label: "Payment drops by", format: "usd" },
    ],
    invalid: (v) => !(v.balance > 0 && v.years > 0 && v.lumpSum > 0 && v.lumpSum < v.balance),
    compute: (v) => {
      const r = v.ratePct / 100 / 12;
      const n = v.years * 12;
      const oldPayment = pmt(v.balance, r, n);
      const newBalance = v.balance - v.lumpSum;
      const newPayment = pmt(newBalance, r, n);
      return {
        newBalance,
        newPayment,
        paymentDrop: oldPayment - newPayment,
        ok: newBalance > 0 ? 1 : 0,
      };
    },
    howItWorks: [
      "The calculator prices your current balance as one payment, then prices the balance-after-the-lump-sum with the same rate and the same number of months left. The difference is the payment drop.",
      "Formula in both cases: payment = B × r ÷ (1 − (1 + r)^−n). Only B changes, so the end date moves not at all — that is the definition of a recast rather than a payoff strategy.",
      "The lump-sum entry must sit between zero and the balance; a lump sum equal to the balance would retire the loan outright, which is a payoff, not a recast. Servicer recast fees (commonly $100 to $500) are not deducted here.",
    ],
    example: {
      inputs: "$320,000 balance · 6.5% rate · 25 years left · $25,000 lump sum",
      results: [
        "Balance after the lump sum: $295,000.",
        "New monthly payment: $1,992, down from $2,161.",
        "Payment drops by $169 a month — and the payoff year stays the same.",
        "Compare with the payoff calculator: putting that same $25,000 into extra payments instead cuts the term rather than the payment.",
      ],
    },
    faqs: [
      {
        q: "What is a mortgage recast?",
        a: "You pay a lump sum toward principal and the servicer re-amortizes what remains over the same term at the same rate. On a $320,000 loan at 6.5% with 25 years left, a $25,000 recast takes the payment from $2,161 to $1,992.",
      },
      {
        q: "Does a recast shorten the loan?",
        a: "No — the end date stays put, and that is the trade. You buy a permanently lower required payment, not an earlier payoff.",
      },
      {
        q: "Is a recast better than making extra payments?",
        a: "Extra payments save more interest, because they shorten the loan. A recast saves less interest but lowers the payment you are obliged to make, which is the better tool when income has just dropped.",
      },
      {
        q: "What does a mortgage recast cost?",
        a: "Most servicers charge about $100 to $500 and some charge nothing. That is well below refinance closing costs, and unlike a refinance you keep your existing rate — important when current rates are higher than yours.",
      },
      {
        q: "Can I recast my mortgage more than once?",
        a: "Usually yes. Lenders commonly set a minimum lump sum, often $5,000, and some limit you to one recast a year. Ask for the recast fee and the minimum in writing before you send the money.",
      },
      {
        q: "When does a recast actually make sense?",
        a: "Right after a one-time inflow — a bonus, an inheritance, the sale of another asset — when monthly cash flow is the tight constraint and your existing rate is better than anything on offer today. If the goal is finishing the loan fastest, extra payments beat a recast.",
      },
    ],
  },
  {
    slug: "property-tax-calculator",
    name: "Property Tax Calculator",
    title: "Property Tax Calculator: Annual and Monthly Cost",
    description:
      "Turn an assessed home value and a local tax rate into an annual and monthly property tax number. Free, no signup.",
    intro: [
      "Property tax is usually quoted as a rate on assessed value, but you pay it monthly inside your escrow. This converts one into the other.",
      "Use the monthly number when comparing two houses in different districts — the annual difference is easy to underestimate.",
    ],
    fields: [
      { key: "homeValue", label: "Assessed home value", prefix: "$", inputMode: "decimal" },
      { key: "taxRatePct", label: "Annual tax rate", suffix: "%", inputMode: "decimal" },
    ],
    outputs: [
      { key: "annualTax", label: "Annual property tax", format: "usd", highlight: true },
      { key: "monthlyTax", label: "Monthly escrow amount", format: "usd" },
      { key: "tenYearTotal", label: "10-year total", format: "usd" },
    ],
    invalid: (v) => !(v.homeValue > 0 && v.taxRatePct >= 0),
    compute: (v) => {
      const annual = v.homeValue * (v.taxRatePct / 100);
      return {
        annualTax: annual,
        monthlyTax: annual / 12,
        tenYearTotal: annual * 10,
        ok: 1,
      };
    },
    howItWorks: [
      "Annual tax = assessed value × the rate as a decimal (so 1.1% is 0.011). Monthly = annual ÷ 12, which is the amount a servicer collects into escrow each month.",
      "The ten-year figure holds today's rate and today's assessment flat, then multiplies by ten. It is a budgeting yardstick, not a forecast: reassessments and rate votes are what move it in real life.",
      "This is the tax line only. Homeowners insurance, mortgage insurance and any escrow shortage are separate amounts on the same monthly payment.",
    ],
    example: {
      inputs: "$420,000 assessed value · 1.1% annual rate",
      results: [
        "Annual property tax: $4,620.",
        "Monthly escrow collection: $385.",
        "Ten years at today's rate: $46,200.",
        "A 0.1 percentage point difference on the same house is $420 a year, or $35 a month.",
      ],
    },
    faqs: [
      {
        q: "How is property tax calculated?",
        a: "Assessed value multiplied by the local tax rate. A $420,000 assessment at 1.1% comes to $4,620 a year, or $385 a month collected inside your escrow.",
      },
      {
        q: "What is a normal property tax rate?",
        a: "U.S. effective rates run roughly 0.3% to 2.2% of value depending on state and county, with a large share of places clustered near 1%. Always price the county, not the state average.",
      },
      {
        q: "Is assessed value the same as market value?",
        a: "No. The assessor's figure is what taxes are levied on, and it often lags the market or applies a fixed assessment ratio. That is why your bill can move on a different schedule from your neighbours' sale prices.",
      },
      {
        q: "Why did my mortgage payment change if my rate is fixed?",
        a: "Because taxes and insurance sit in escrow, not in the rate. When the annual tax bill rises, the servicer re-escrows and your monthly payment goes up with it — no rate change involved.",
      },
      {
        q: "Do I still pay property tax after the mortgage is paid off?",
        a: "Yes, permanently. Only the escrow goes away. You then pay the county directly, usually once or twice a year, which is why a paid-off house is not a no-housing-cost house.",
      },
      {
        q: "Does this calculator include homeowners insurance?",
        a: "No — it covers the tax line only. Insurance and any mortgage insurance sit on top, so your real monthly escrow figure is higher than the number shown here. Add them before comparing two houses.",
      },
    ],
  },
  {
    slug: "how-much-house-can-i-afford",
    name: "How Much House Can I Afford?",
    title: "How Much House Can I Afford Calculator",
    description:
      "Enter income, down payment, rate, term and your comfort zone to estimate the house price you can carry. Free, no signup.",
    intro: [
      "This works the other direction: instead of a loan you already have, it starts with your income and asks what payment you can carry, then what price that payment buys.",
      "It uses a debt-to-income cap on the housing payment only, so property tax and insurance still need room in your budget.",
    ],
    fields: [
      { key: "annualIncome", label: "Annual income", prefix: "$", inputMode: "decimal" },
      { key: "downPaymentPct", label: "Down payment", suffix: "%", inputMode: "decimal" },
      { key: "ratePct", label: "Interest rate", suffix: "%", inputMode: "decimal" },
      { key: "years", label: "Loan term", suffix: "yr", inputMode: "numeric" },
      { key: "dtiPct", label: "Max housing payment (% of gross)", suffix: "%", inputMode: "decimal" },
    ],
    outputs: [
      { key: "maxPayment", label: "Monthly payment used", format: "usd" },
      { key: "maxPrice", label: "Approx. home price", format: "usd", highlight: true },
      { key: "downPayment", label: "Down payment", format: "usd" },
    ],
    invalid: (v) => !(v.annualIncome > 0 && v.years > 0 && v.downPaymentPct >= 0 && v.downPaymentPct < 100),
    compute: (v) => {
      const maxPayment = (v.annualIncome / 12) * (v.dtiPct / 100);
      const r = v.ratePct / 100 / 12;
      const loan = presentValue(maxPayment, r, v.years * 12);
      const price = loan / (1 - v.downPaymentPct / 100);
      return {
        maxPayment,
        maxPrice: price,
        downPayment: (price * v.downPaymentPct) / 100,
        ok: loan > 0 ? 1 : 0,
      };
    },
    howItWorks: [
      "Step one turns income into a payment: monthly payment cap = (annual income ÷ 12) × your chosen percentage of gross income. The 28% default is the old front-end housing rule lenders still quote.",
      "Step two asks what loan that payment supports — the present value of the payment stream: loan = payment × (1 − (1 + r)^−n) ÷ r. Step three grosses it up to a purchase price by dividing by (1 − down payment %).",
      "The result covers principal and interest only. Property tax, homeowners insurance and mortgage insurance below 20% down all come out of the same monthly budget, so the realistic price is lower than the number shown.",
    ],
    example: {
      inputs: "$95,000 income · 20% down · 6.5% rate · 25-year term · 28% of gross cap",
      results: [
        "Payment used: $2,217 a month.",
        "Approximate home price: $410,368, with an $82,074 down payment.",
        "Raise the cap to 36% of gross and the same income points at about $527,000 — which is roughly how lenders reach their approved maximum.",
        "Add roughly $300 a month of tax and insurance and the realistic price drops by over $50,000.",
      ],
    },
    faqs: [
      {
        q: "How much house can I afford on a $95,000 salary?",
        a: "Capping housing at 28% of gross income gives a $2,217 payment, which supports roughly a $410,000 home at 6.5% over 25 years with 20% down — before tax and insurance.",
      },
      {
        q: "What is the 28/36 rule?",
        a: "Spend no more than 28% of gross monthly income on housing and no more than 36% on all debt together. Lenders still quote it, while many approval systems stretch the combined figure to 43–50%.",
      },
      {
        q: "Does this calculator include taxes and insurance?",
        a: "No — it models principal and interest only. Add property tax, homeowners insurance and mortgage insurance if you put down less than 20%, and the realistic price drops by a meaningful amount.",
      },
      {
        q: "How does the down payment change what I can buy?",
        a: "A bigger down payment raises the price reachable on the same payment, because less of the price needs financing. It is also the lever that removes mortgage insurance, which below 20% down is charged every month.",
      },
      {
        q: "Should I borrow the maximum I qualify for?",
        a: "Rarely. The approved maximum assumes nothing else in your spending changes. A payment nearer 25% of gross income survives a job change, a new roof and one car repair.",
      },
      {
        q: "Does the calculator use gross or take-home income?",
        a: "Gross. The cap is applied to annual income ÷ 12, which is what lenders quote. Take-home pay is lower after tax, insurance and retirement contributions, so check the resulting payment against your real budget before you trust it.",
      },
    ],
  },
  {
    slug: "rent-vs-buy-calculator",
    name: "Rent vs Buy Calculator",
    title: "Rent vs Buy Calculator: Which Costs Less Over Time?",
    description:
      "A rent vs buy comparison from your own numbers: month-one cost and total cost across your stay, with rent growth, upkeep and investment return.",
    intro: [
      "Renting and buying are two different cost structures, so comparing a rent cheque with a mortgage payment is misleading. This page prices both sides from your numbers: what each costs in the first month, and what each costs across the years you expect to stay.",
      "Only money you cannot get back is counted. The principal half of your payment and the down payment itself build equity rather than being spent, so they stay out. Interest, upkeep, property tax and the return your cash could earn elsewhere stay in, and price appreciation is netted off the buy side.",
    ],
    fields: [
      { key: "homePrice", label: "Home price", prefix: "$", inputMode: "decimal" },
      { key: "downPaymentPct", label: "Down payment", suffix: "%", inputMode: "decimal" },
      { key: "ratePct", label: "Interest rate", suffix: "%", inputMode: "decimal" },
      { key: "years", label: "Loan term", suffix: "yr", inputMode: "numeric" },
      { key: "monthlyRent", label: "Current rent / month", prefix: "$", inputMode: "decimal" },
      { key: "rentGrowthPct", label: "Rent growth / year", suffix: "%", inputMode: "decimal" },
      { key: "maintPct", label: "Maintenance / year", suffix: "%", inputMode: "decimal" },
      { key: "taxRatePct", label: "Property tax / year", suffix: "%", inputMode: "decimal" },
      { key: "returnPct", label: "Investment return", suffix: "%", inputMode: "decimal" },
      { key: "apprPct", label: "Price appreciation", suffix: "%", inputMode: "decimal" },
      { key: "holdYears", label: "Years you plan to stay", suffix: "yr", inputMode: "numeric" },
    ],
    outputs: [
      {
        key: "buyMonthly",
        label: "Owning, net cost (month 1)",
        format: "usd",
        highlight: true,
        hint: "interest + upkeep + tax + opportunity cost − appreciation",
      },
      {
        key: "monthlyGap",
        label: "Gap vs renting (month 1)",
        format: "usd",
        hint: "positive = renting is cheaper now",
      },
      {
        key: "netOverTerm",
        label: "Gap across your stay",
        format: "usd",
        hint: "positive = buying costs more overall",
      },
    ],
    invalid: (v) =>
      !(v.homePrice > 0 && v.downPaymentPct >= 0 && v.downPaymentPct < 100 && v.years > 0 && v.years <= 50 && v.holdYears > 0 && v.holdYears <= 50 && v.monthlyRent >= 0),
    compute: (v) => {
      const price = v.homePrice;
      const down = price * (v.downPaymentPct / 100);
      const loan = price - down;
      const r = v.ratePct / 100 / 12;
      const payment = pmt(loan, r, v.years * 12);
      const upkeep = (price * v.maintPct) / 100 / 12;
      const tax = (price * v.taxRatePct) / 100 / 12;
      const opportunity = (down * v.returnPct) / 100 / 12;
      const appreciation = (price * v.apprPct) / 100 / 12;
      const buyMonthly = loan * r + upkeep + tax + opportunity - appreciation;
      // Ceil the horizon so a garbage "years to stay" cannot spin the loop: compute()
      // runs before the invalid check in SpecCalculator. 1200 covers any valid input.
      const months = Math.min(Math.max(0, Math.round(v.holdYears * 12) || 0), 1200);
      let balance = loan;
      let interestSum = 0;
      let rentSum = 0;
      let appreciationSum = 0;
      for (let m = 0; m < months; m++) {
        const interest = balance * r;
        interestSum += interest;
        const principal = Math.min(payment - interest, balance);
        balance = Math.max(0, balance - principal);
        rentSum += v.monthlyRent * Math.pow(1 + v.rentGrowthPct / 100, m / 12);
        const priceAtM = price * Math.pow(1 + v.apprPct / 100, m / 12);
        appreciationSum += (priceAtM * v.apprPct) / 100 / 12;
      }
      const buyTotal = interestSum + (upkeep + tax) * months + opportunity * months - appreciationSum;
      return {
        buyMonthly,
        monthlyGap: buyMonthly - v.monthlyRent,
        netOverTerm: buyTotal - rentSum,
        loanAmount: loan,
        ok: 1,
      };
    },
    guide: {
      heading: "Using this rent vs buy calculator",
      intro: [
        "Renting and buying are two different cost structures, so comparing a rent cheque with a mortgage payment misleads. This page prices both sides from your numbers: what each costs in the first month, and what each costs across the years you expect to stay.",
        "Only money you cannot get back is counted. The principal half of your payment and the down payment itself build equity rather than being spent, so they stay out. Interest, upkeep, property tax and the return your cash could earn elsewhere stay in, and price appreciation is netted off the buy side.",
      ],
      steps: [
        "Home price, down payment and interest rate are the buy side. The loan and the scheduled payment are worked out from them, so enter the price you are actually shopping and the rate you were quoted, not an optimistic pair.",
        "Loan term is the amortisation period of that purchase loan — 15, 20, 25 or 30 years. It sets how much of every payment is interest, which is the largest single line in the whole comparison.",
        "Current rent and rent growth are the rent side. Growth compounds every month, so it quietly decides the long-run answer: 3% a year lifts a $2,000 rent to about $2,388 after six years.",
        "Maintenance and property tax are charged as yearly percentages of the purchase price, with 1% and 1.1% as the working defaults. They hit the owner only, and that is where the two sides genuinely diverge.",
        "Investment return, price appreciation and your length of stay are the honest variables. Return is what the down payment could earn elsewhere, appreciation is what the house gains, and the stay is how long both get to compound — 7 years is the usual planning figure, and anything beyond 50 is out of range.",
      ],
      note: [
        "That is why the owning figure can come out smaller than your real cheque. On the default inputs the payment is $2,161 in principal and interest, yet the modelled first-month cost of owning is $1,900, because $1,000 a month of assumed appreciation is subtracted and the principal part counts as equity rather than cost.",
        "Expect the answer to turn on two variables. Set appreciation to 0% and these same defaults make renting about $47,779 cheaper; plan to stay 3 years instead of 7 and buying's advantage shrinks to roughly $9,946. Closing costs, selling costs, insurance and PMI sit outside the model, and all of them push the other way.",
      ],
    },
    howItWorks: [
      "Owning, month 1 = interest + maintenance + property tax + opportunity cost − appreciation. Interest is balance × annual rate ÷ 12; maintenance and tax are percentages of the purchase price ÷ 12; opportunity cost is your down payment × the investment return ÷ 12; appreciation is price × the appreciation rate ÷ 12.",
      "Across your stay the loan is amortised month by month, so the interest line falls as the balance falls. Maintenance and tax stay flat on the purchase price, the opportunity cost stays flat on the down payment, rent is stepped each month by its growth rate, and appreciation compounds on the price.",
      "Deliberately excluded: closing costs when you buy and the roughly 5–6% of the price it costs to sell, homeowners insurance, the mortgage-interest deduction, and PMI if you put down less than 20% (the PMI calculator prices that separately). Utilities and HOA dues on either side are outside it too.",
    ],
    example: {
      inputs:
        "$400,000 price · 20% down · 6.5% rate · 25-year loan · $2,000 rent · 3% rent growth · 1% upkeep · 1.1% tax · 7% return · 3% appreciation · 7-year stay",
      results: [
        "Loan $320,000, with a payment of $2,161 in principal and interest.",
        "Owning, net cost in month 1: $1,900 — interest $1,733 plus $333 upkeep, $367 tax and $467 opportunity cost, minus $1,000 of appreciation.",
        "Gap in month 1: −$100 in favour of buying. Across the 7-year stay: −$45,428 in favour of buying.",
        "Set appreciation to 0% and the same inputs flip: buying costs about $47,779 more.",
        "Stay only 3 years and buying's advantage falls to roughly $9,946, because interest is heaviest early and rent growth has had less time to compound.",
      ],
    },
    faqs: [
      {
        q: "Is it cheaper to rent or to buy?",
        a: "It depends mainly on price appreciation and how long you stay. On the defaults here — a $400,000 home against $2,000 rent with 3% appreciation — buying comes out about $45,428 cheaper across 7 years. Set appreciation to 0% and renting is about $47,779 cheaper instead.",
      },
      {
        q: "Why is the cost of owning shown as less than my mortgage payment?",
        a: "Because principal repayment and the down payment are equity, not cost. The model charges the interest, upkeep, tax and the return your cash could earn elsewhere, and nets appreciation off — which produces a smaller figure than the cheque you write.",
      },
      {
        q: "How much does the length of stay matter?",
        a: "It is the biggest lever after price. The example's advantage falls from $45,428 over 7 years to about $9,946 over 3 years, because interest is largest in the early years and rent growth has had less time to compound.",
      },
      {
        q: "What is the investment return variable actually doing?",
        a: "It prices the money tied up in the purchase. At a 7% return, an $80,000 down payment is charged to the buy side at $467 a month. A higher return assumption favours renting; a lower one favours buying.",
      },
      {
        q: "What is not included in this comparison?",
        a: "Closing costs when you buy, roughly 5–6% of the price to sell, homeowners insurance, the mortgage-interest deduction, and PMI when you put down less than 20%. Utilities and HOA dues on either side are also outside the model, so add them if they differ between your two options.",
      },
    ],
  },
  {
    slug: "pmi-calculator",
    name: "PMI Calculator",
    title: "PMI Calculator: Monthly Cost and When It Ends",
    description:
      "Work out the monthly private mortgage insurance below 20% down, how long it runs and what it costs in total. Free PMI calculator, no signup.",
    intro: [
      "PMI — private mortgage insurance — is what a lender charges when your down payment leaves less than 20% equity in the home. It protects the lender against a loss if you default, not you, and it sits on top of your monthly payment.",
      "The figure most buyers miss is the total. PMI is priced on the original loan amount and stays flat while the balance falls, so it does not shrink month by month; it switches off once the loan is small enough relative to what you paid for the house.",
    ],
    fields: [
      { key: "homePrice", label: "Home price", prefix: "$", inputMode: "decimal" },
      { key: "downPct", label: "Down payment", suffix: "%", inputMode: "decimal" },
      { key: "ratePct", label: "Interest rate", suffix: "%", inputMode: "decimal" },
      { key: "pmiRatePct", label: "PMI rate / year", suffix: "%", inputMode: "decimal" },
      { key: "years", label: "Loan term", suffix: "yr", inputMode: "numeric" },
    ],
    outputs: [
      { key: "monthlyPmi", label: "Monthly PMI", format: "usd", highlight: true, hint: "0 means no PMI at 20% down or more" },
      { key: "cancelMonths", label: "PMI ends after", format: "durationMonths", hint: "80% LTV by request, 79% automatically" },
      { key: "totalPmi", label: "Total PMI paid", format: "usd" },
    ],
    invalid: (v) => !(v.homePrice > 0 && v.downPct >= 0 && v.downPct < 100 && v.years > 0 && v.pmiRatePct >= 0),
    compute: (v) => {
      const price = v.homePrice;
      const loan = price * (1 - v.downPct / 100);
      const ltv = (loan / price) * 100;
      const r = v.ratePct / 100 / 12;
      const payment = pmt(loan, r, v.years * 12);
      const charged = ltv > 80;
      const monthly = charged ? (loan * (v.pmiRatePct / 100)) / 12 : 0;
      const target = price * (ltv <= 90 ? 0.8 : 0.79);
      let months = 0;
      if (charged) {
        months =
          r === 0
            ? payment > 0
              ? (loan - target) / payment
              : Infinity
            : Math.log((payment - r * target) / (payment - r * loan)) / Math.log(1 + r);
      }
      return {
        monthlyPmi: monthly,
        cancelMonths: months,
        totalPmi: monthly * months,
        ltv,
        ok: 1,
      };
    },
    guide: {
      heading: "Using this PMI calculator",
      intro: [
        "PMI — private mortgage insurance — is what a conventional lender requires when your down payment leaves less than 20% equity. It insures the lender, not you, and it is charged monthly on top of principal, interest, tax and insurance.",
        "Two things make it worth modelling properly. First, the premium is calculated on the original loan amount, so it stays flat rather than shrinking with the balance. Second, it ends on a schedule you can predict, which is why this page shows both the removal date and the total you pay while it lasts.",
      ],
      steps: [
        "Home price and down payment decide whether PMI applies at all. At 20% down or more the answer is zero. Below that, the loan is the remaining percentage of the price, and that loan is what the premium is priced on.",
        "Interest rate and loan term do not change the monthly premium, but they decide how fast the balance falls and therefore how many months of PMI you actually pay. A longer term keeps you under 20% equity for longer.",
        "PMI rate is the annual percentage the lender charges — commonly between 0.3% and 1.5% of the loan each year. Use 0.5% as a middle figure; your credit score and loan-to-value move it more than anything else does.",
        "Read the monthly figure, then the removal date, then the total. On a $360,000 loan at 0.5% the premium is only $150 a month, but five and a half years of it is roughly $10,330 — the number that should decide whether a small down payment is worth it.",
        "If your loan is FHA rather than conventional, treat this as an indication only. FHA charges an upfront premium plus annual MIP with its own, longer cancellation rules, and that is not PMI.",
      ],
      note: [
        "Two rules set the removal date. At 80% loan-to-value you can normally request cancellation, provided the account is current and, in many cases, an appraisal supports the value. At 79% of the original value the Homeowners Protection Act requires the lender to terminate it automatically. Start above 90% loan-to-value and you should plan around the automatic date.",
        "This model does not know your servicer's paperwork, your credit tier, or whether the county reassessed your home. Before sending a lump sum to force PMI off early, compare that lump sum against the remaining total the calculator shows you.",
      ],
    },
    howItWorks: [
      "Monthly PMI = original loan amount × annual PMI rate ÷ 12. Because it is priced on what you borrowed rather than the shrinking balance, the figure stays flat, and the total is simply that monthly premium multiplied by the number of months until removal.",
      "The removal date comes from the amortisation schedule: the calculator finds the first month in which the balance falls to 80% of the purchase price, the usual point where you may request cancellation. If you started above 90% loan-to-value it targets 79% instead, which is where the Homeowners Protection Act terminates the insurance automatically.",
      "At 20% down or more the result is zero, because conventional lending does not require mortgage insurance at 80% loan-to-value or below. FHA premiums work differently — an upfront charge plus annual MIP — so this page models conventional PMI only.",
    ],
    example: {
      inputs: "$400,000 price · 10% down · 6.5% rate · 0.5% PMI rate · 25-year term",
      results: [
        "Loan: $360,000, which is 90% loan-to-value, so PMI applies.",
        "Monthly PMI: $150, or $1,800 a year.",
        "PMI ends after about 5 yr 9 mo, when the balance reaches 80% of the purchase price.",
        "Total PMI while it lasts: $10,330.",
        "Put 20% down instead and there is no PMI at all, and the payment is $2,161 rather than $2,431.",
      ],
    },
    faqs: [
      {
        q: "When do I stop paying PMI?",
        a: "At 80% loan-to-value you can usually request cancellation, and at 79% of the original value it must end automatically. On a $400,000 home with 10% down at 6.5% over 25 years, that is about 5 years and 9 months.",
      },
      {
        q: "How much is PMI per month?",
        a: "Typically 0.3% to 1.5% of the loan per year, priced on the original balance. At 0.5% a $360,000 loan costs $150 a month; at 1.0% the same loan costs $300.",
      },
      {
        q: "Is PMI worth paying to buy with a smaller down payment?",
        a: "Compare the whole picture: at 10% down on a $400,000 home the payment is $2,431 plus $150 of PMI, while at 20% down it is $2,161 with none — a $420 a month difference, of which the PMI portion totals about $10,330 before it ends.",
      },
      {
        q: "Does PMI get cheaper as I pay the balance down?",
        a: "No. It is set on the original loan amount and stays flat until it is removed, which is why the total matters more than the monthly figure and why a lump sum that reaches 80% loan-to-value can delete the whole line.",
      },
      {
        q: "Is PMI the same as FHA mortgage insurance?",
        a: "No. FHA charges an upfront premium plus an annual MIP, and on higher loan-to-value FHA coverage often runs for the life of the loan. This calculator models conventional PMI, so treat FHA figures as approximate.",
      },
    ],
  },
];

export function findTool(slug: string): ToolSpec | undefined {
  return SIBLING_TOOLS.find((t) => t.slug === slug);
}
