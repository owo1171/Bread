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
    invalid: (v) => !(v.closingCosts > 0 && v.currentPayment > 0),
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
    ],
  },
];

export function findTool(slug: string): ToolSpec | undefined {
  return SIBLING_TOOLS.find((t) => t.slug === slug);
}
