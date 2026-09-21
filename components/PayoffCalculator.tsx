"use client";

import { useEffect, useMemo, useState } from "react";
import EmailCapture from "@/components/EmailCapture";
import { computePayoff, duration, payoffLabel, usd, type Frequency } from "@/lib/payoff";

type Form = { balance: string; rate: string; years: string; extra: string };

const DEFAULTS: Form = { balance: "320000", rate: "6.5", years: "25", extra: "200" };
const STORAGE_KEY = "***";
const SCENARIOS = [0, 100, 200, 500];

const num = (v: string): number => {
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function PayoffCalculator() {
  const [form, setForm] = useState<Form>(DEFAULTS);
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [touched, setTouched] = useState(false);
  const [note, setNote] = useState<string>("");
  const [initialSearch] = useState(() =>
    typeof window === "undefined" ? "" : window.location.search,
  );

  // Hydrate from ?bal=&rate=&yrs=&extra=&freq= first, localStorage second.
  useEffect(() => {
    let stored: Partial<Form & { freq: string }> = {};
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      stored = {};
    }
    const q = new URLSearchParams(initialSearch || window.location.search);
    const pick = (urlKey: string, storeKey: keyof typeof stored, fallback: string) =>
      q.get(urlKey) ?? (stored[storeKey] as string | undefined) ?? fallback;

    setForm({
      balance: pick("bal", "balance", DEFAULTS.balance),
      rate: pick("rate", "rate", DEFAULTS.rate),
      years: pick("yrs", "years", DEFAULTS.years),
      extra: pick("extra", "extra", DEFAULTS.extra),
    });
    const freqParam = q.get("freq") ?? (stored.freq as string | undefined);
    if (freqParam === "bw" || freqParam === "biweekly") setFrequency("biweekly");
    if (["bal", "rate", "yrs", "extra"].some((k) => q.get(k)) || Object.keys(stored).length > 0) {
      setTouched(true);
    }
  }, [initialSearch]);

  const input = useMemo(
    () => ({
      balance: num(form.balance),
      ratePct: num(form.rate),
      years: num(form.years),
      extraMonthly: num(form.extra),
      frequency,
    }),
    [form, frequency],
  );

  const result = useMemo(() => computePayoff(input), [input]);
  const scenarios = useMemo(
    () => SCENARIOS.map((extra) => ({ extra, ...computePayoff({ ...input, extraMonthly: extra }) })),
    [input],
  );

  // Keep a shareable URL without triggering a navigation (no SSR impact), and
  // carry the user's numbers into the affiliate links for attribution.
  useEffect(() => {
    const qs = `?bal=${input.balance}&rate=${input.ratePct}&yrs=${input.years}&extra=${input.extraMonthly}&freq=${frequency}`;
    window.history.replaceState(null, "", qs);

    document.querySelectorAll<HTMLAnchorElement>("a[data-affiliate]").forEach((a) => {
      const base = (a.dataset.base ?? a.getAttribute("href") ?? "").replace(/\/$/, "");
      a.href = `${base}?bal=${input.balance}&rate=${input.ratePct}&extra=${input.extraMonthly}`;
    });
  }, [input, frequency]);

  const set =
    (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setNote("");
    };

  const show = touched && result.ok;

  return (
    <section aria-labelledby="calc-heading">
      <h2 id="calc-heading" className="sr-only">
        Mortgage payoff calculator inputs
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
        }}
        className="rounded-2xl border border-slate-200 p-4 shadow-sm sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Current balance" prefix="$">
            <input
              inputMode="decimal"
              value={form.balance}
              onChange={set("balance")}
              className="h-12 w-full rounded-xl border border-slate-300 px-3 pl-7"
              aria-label="Current balance in dollars"
            />
          </Field>
          <Field label="Interest rate" suffix="%">
            <input
              inputMode="decimal"
              value={form.rate}
              onChange={set("rate")}
              className="h-12 w-full rounded-xl border border-slate-300 px-3 pr-8 text-right"
              aria-label="Interest rate percent"
            />
          </Field>
          <Field label="Years remaining" suffix="yr">
            <input
              inputMode="numeric"
              value={form.years}
              onChange={set("years")}
              className="h-12 w-full rounded-xl border border-slate-300 px-3 pr-9 text-right"
              aria-label="Years remaining"
            />
          </Field>
          <Field label="Extra payment / month" prefix="$">
            <input
              inputMode="decimal"
              value={form.extra}
              onChange={set("extra")}
              className="h-12 w-full rounded-xl border border-slate-300 px-3 pl-7"
              aria-label="Extra payment per month in dollars"
            />
          </Field>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">Frequency</span>
          <div className="inline-flex overflow-hidden rounded-xl border border-slate-300">
            {(["monthly", "biweekly"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={frequency === f}
                onClick={() => setFrequency(f)}
                className={`h-11 px-4 text-sm font-medium capitalize ${
                  frequency === f ? "bg-blue-700 text-white" : "bg-white text-slate-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {frequency === "biweekly" && (
          <p className="mt-2 text-xs text-slate-500">
            Biweekly means half your monthly payment every two weeks &mdash; about 13 payments a
            year, so you pay roughly 8% more per year and finish sooner.
          </p>
        )}

        {/* Big tap target: 100% width on mobile, >= 48px tall */}
        <button
          type="submit"
          className="mt-5 h-14 w-full rounded-xl bg-blue-700 text-lg font-semibold text-white active:bg-blue-800 sm:w-auto sm:px-10"
        >
          Calculate payoff
        </button>
        <div className="mt-3 flex flex-wrap gap-2">
          <SmallButton
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...form, freq: frequency }));
                setNote("Saved on this device.");
              } catch {
                setNote("Storage unavailable.");
              }
            }}
          >
            Save results
          </SmallButton>
          <SmallButton onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => setNote("Link copied."))}>
            Copy link
          </SmallButton>
          <SmallButton
            onClick={() => {
              setForm(DEFAULTS);
              setFrequency("monthly");
              setTouched(false);
              setNote("");
            }}
          >
            Reset
          </SmallButton>
        </div>
      </form>

      {!show && (
        <p className="mt-4 text-sm text-slate-500">
          {result.payment > 0 && !touched
            ? `Your regular ${result.periodLabel} payment would be about ${usd(result.payment)}. Tap Calculate payoff to see the end date.`
            : "Enter your balance, rate and years left, then tap Calculate payoff."}
        </p>
      )}

      {show && (
        <div className="mt-5" aria-live="polite">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Result label="Payoff date" value={payoffLabel(result.months)} />
            <Result label="Total interest" value={usd(result.totalInterest)} />
            <Result
              label="You save"
              value={usd(result.interestSaved)}
              hint={`${duration(result.monthsSaved)} sooner`}
              highlight
            />
          </div>

          <p className="measure mt-4 text-slate-700">
            Paying <strong>{usd(input.extraMonthly)}</strong> extra each month has you finished in{" "}
            <strong>{payoffLabel(result.months)}</strong> — about{" "}
            <strong>{duration(result.monthsSaved)}</strong> sooner — on{" "}
            <strong>{usd(result.interestSaved)}</strong> less interest than the original schedule.
          </p>

          <div className="tnum -mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[24rem] text-sm">
              <caption className="sr-only">Interest saved by extra monthly payment amount</caption>
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 font-medium">Extra / mo</th>
                  <th className="py-2 text-right font-medium">Payoff in</th>
                  <th className="py-2 text-right font-medium">Total interest</th>
                  <th className="py-2 text-right font-medium">Saved</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s) => (
                  <tr
                    key={s.extra}
                    className={`border-t border-slate-200 ${s.extra === input.extraMonthly ? "bg-blue-50 font-semibold" : ""}`}
                  >
                    <td className="py-2">{usd(s.extra)}</td>
                    <td className="py-2 text-right">{s.ok ? duration(s.months) : "—"}</td>
                    <td className="py-2 text-right">{s.ok ? usd(s.totalInterest) : "—"}</td>
                    <td className="py-2 text-right">{s.ok ? usd(Math.max(0, s.interestSaved)) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <EmailCapture label="Get the PDF payoff plan — your numbers plus the $50/$100/$200/$500 savings cheat sheet" />
        </div>
      )}

      {touched && !result.ok && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          Heads up: your payment barely covers the interest, so this loan never ends. Add an extra
          payment, or check the balance and rate.
        </p>
      )}

      {note && <p className="mt-3 text-sm text-slate-500">{note}</p>}
    </section>
  );
}

function Field({
  label,
  prefix,
  suffix,
  children,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <span className="relative block">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}
        {children}
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </span>
    </label>
  );
}

function Result({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-4 ${highlight ? "bg-emerald-50" : "bg-slate-50"} border border-slate-200`}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${highlight ? "text-emerald-700" : "text-slate-900"}`}>{value}</div>
      {hint && <div className="text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

function SmallButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700"
    >
      {children}
    </button>
  );
}
