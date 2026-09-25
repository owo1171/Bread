export type Frequency = "monthly" | "biweekly";

export interface PayoffInput {
  /** outstanding principal, USD */
  balance: number;
  /** annual rate in percent, e.g. 6.5 */
  ratePct: number;
  /** remaining term in years */
  years: number;
  /** extra amount aimed at principal, expressed per MONTH */
  extraMonthly: number;
  frequency: Frequency;
}

export interface PayoffResult {
  ok: boolean;
  /** regular payment per period (month, or half-month when biweekly) */
  payment: number;
  periodLabel: string;
  /** months until payoff, with the extra payment applied */
  months: number;
  /** months until payoff on the original schedule */
  baselineMonths: number;
  totalInterest: number;
  baselineInterest: number;
  interestSaved: number;
  monthsSaved: number;
}

const paymentFor = (B: number, r: number, n: number): number =>
  r === 0 ? B / n : (B * r) / (1 - Math.pow(1 + r, -n));

const periodsFor = (B: number, r: number, p: number): number => {
  if (B <= 0 || p <= 0) return Infinity;
  if (r === 0) return B / p;
  const headroom = 1 - (r * B) / p;
  if (headroom <= 0) return Infinity; // payment does not cover interest
  return -Math.log(headroom) / Math.log(1 + r);
};

/** Payments left = -ln(1 - r*B/P) / ln(1 + r) */
/**
 * Monthly mode: pay the contract payment plus the extra, 12 periods a year.
 * Biweekly mode: pay HALF of the monthly payment (plus half of the extra) every
 * two weeks, i.e. 26 periods a year = 13 monthly-equivalents a year, so the
 * annual outlay is about 8% higher and the loan ends sooner. The periodic rate
 * is the annual rate divided by the periods per year — an approximation, which
 * is why the page labels every figure an estimate.
 */
export function computePayoff(input: PayoffInput): PayoffResult {
  const { balance, ratePct, years, extraMonthly, frequency } = input;

  const monthlyPayment = paymentFor(balance, ratePct / 100 / 12, years * 12);
  const baselineMonths = years * 12;
  const baselineInterest = monthlyPayment * baselineMonths - balance;

  const perYear = frequency === "biweekly" ? 26 : 12;
  const periodRate = ratePct / 100 / perYear;
  const periodPayment =
    frequency === "biweekly"
      ? (monthlyPayment + extraMonthly) / 2
      : monthlyPayment + extraMonthly;

  const np = periodsFor(balance, periodRate, periodPayment);
  const totalInterest = Number.isFinite(np) ? periodPayment * np - balance : NaN;
  const months = (np * 12) / perYear;

  return {
    ok: Number.isFinite(np) && totalInterest >= 0 && balance > 0 && years > 0,
    payment: frequency === "biweekly" ? periodPayment : monthlyPayment,
    periodLabel: frequency === "biweekly" ? "biweekly" : "monthly",
    months,
    baselineMonths,
    totalInterest,
    baselineInterest,
    interestSaved: baselineInterest - totalInterest,
    monthsSaved: baselineMonths - months,
  };
}

const usdFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const usd = (n: number): string =>
  Number.isFinite(n) ? usdFmt.format(n) : "—";

export function duration(months: number): string {
  if (!Number.isFinite(months)) return "—";
  // A genuine zero (break-even of zero months, nothing saved) should read "0 mo".
  // The amortization loop can hand a zero a tiny float residue (baseline − paid),
  // so anything inside a thousandth of a month counts as zero; clearly negative
  // still means "no result" and stays a dash.
  if (Math.abs(months) < 1e-3) return "0 mo";
  if (months < 0) return "—";
  const y = Math.floor(months / 12);
  const m = Math.round(months % 12);
  return [y ? `${y} yr` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ") || "0 mo";
}

export function payoffLabel(months: number, from: Date = new Date()): string {
  if (!Number.isFinite(months)) return "—";
  const d = new Date(from.getFullYear(), from.getMonth() + Math.round(months), 1);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}
