"use client";

import { useMemo, useState } from "react";
import { duration, usd } from "@/lib/payoff";
import { findTool } from "@/lib/tools";

const DEFAULTS: Record<string, string> = {
  balance: "320000",
  ratePct: "6.5",
  years: "25",
  extraMonthly: "200",
  closingCosts: "4500",
  currentPayment: "2160",
  newPayment: "1890",
  annualIncome: "95000",
  downPaymentPct: "20",
  dtiPct: "28",
  lumpSum: "25000",
  homeValue: "420000",
  taxRatePct: "1.1",
};

const num = (v: string): number => {
  const n = Number(v.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export default function SpecCalculator({ slug }: { slug: string }) {
  // Tool specs carry functions (compute / schedule), which cannot cross the
  // server -> client prop boundary. Resolve the spec inside the client instead.
  const spec = findTool(slug);

  const initial = useMemo(
    () =>
      Object.fromEntries(
        (spec?.fields ?? []).map((f) => [f.key, DEFAULTS[f.key] ?? "0"]),
      ),
    [spec],
  );

  const [values, setValues] = useState<Record<string, string>>(initial);

  const parsed = useMemo(() => {
    const out: Record<string, number> = {};
    for (const f of spec?.fields ?? []) out[f.key] = num(values[f.key] ?? "0");
    return out;
  }, [values, spec]);

  if (!spec) return null;

  const result = spec.compute(parsed);
  const invalid = spec.invalid(parsed) || result.ok === 0;
  const rows = spec.schedule && !invalid ? spec.schedule(parsed) : undefined;

  const set =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="rounded-2xl border border-slate-200 p-4 shadow-sm sm:p-6"
      >
        <div className={`grid grid-cols-1 gap-4 ${spec.fields.length > 2 ? "sm:grid-cols-2" : ""}`}>
          {spec.fields.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">{f.label}</span>
              <span className="relative block">
                {f.prefix && (
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    {f.prefix}
                  </span>
                )}
                <input
                  inputMode={f.inputMode ?? "decimal"}
                  value={values[f.key] ?? ""}
                  onChange={set(f.key)}
                  className={`h-12 w-full rounded-xl border border-slate-300 bg-white ${f.prefix ? "pl-7" : "px-3"} ${f.suffix ? "pr-9 text-right" : f.prefix ? "px-3" : ""}`}
                  aria-label={f.label}
                />
                {f.suffix && (
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    {f.suffix}
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="mt-5 h-14 w-full rounded-xl bg-blue-700 text-lg font-semibold text-white active:bg-blue-800 sm:w-auto sm:px-10"
        >
          Calculate
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">Results update as you type.</p>

      {invalid && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          Check the inputs — these numbers do not produce a result (for example, a new payment that
          is not lower than the current one).
        </p>
      )}

      {!invalid && (
        <div className="mt-5" aria-live="polite">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {spec.outputs.map((o) => {
              const raw = result[o.key];
              const value =
                o.format === "usd"
                  ? usd(raw)
                  : o.format === "durationMonths"
                    ? duration(raw)
                    : o.format === "months"
                      ? `${Math.round(raw)} months`
                      : new Intl.NumberFormat("en-US").format(Math.round(raw));
              return (
                <div
                  key={o.key}
                  className={`rounded-2xl border border-slate-200 p-4 ${o.highlight ? "bg-emerald-50" : "bg-slate-50"}`}
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {o.label}
                  </div>
                  <div
                    className={`mt-1 text-2xl font-bold ${o.highlight ? "text-emerald-700" : "text-slate-900"}`}
                  >
                    {Number.isFinite(raw) ? value : "—"}
                  </div>
                  {o.hint && <div className="text-xs text-slate-500">{o.hint}</div>}
                </div>
              );
            })}
          </div>

          {rows && rows.length > 0 && (
            <>
              <h3 className="mt-6 text-base font-semibold">{spec.scheduleTitle ?? "Schedule"}</h3>
              <div className="-mx-4 mt-2 overflow-x-auto px-4">
                <table className="w-full min-w-[22rem] text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-2 pr-3 font-medium">Period</th>
                      <th className="py-2 px-3 text-right font-medium">Interest</th>
                      <th className="py-2 px-3 text-right font-medium">Principal</th>
                      <th className="py-2 pl-3 text-right font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.period} className="border-t border-slate-200">
                        <td className="py-2 pr-3">{row.period}</td>
                        <td className="py-2 px-3 text-right">{usd(row.interest)}</td>
                        <td className="py-2 px-3 text-right">{usd(row.principal)}</td>
                        <td className="py-2 pl-3 text-right">{usd(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
