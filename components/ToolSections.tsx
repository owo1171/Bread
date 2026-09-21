import Link from "next/link";
import { LAST_UPDATED_LABEL } from "@/lib/content";

/**
 * Shared content sections for the six calculator pages, so every page carries
 * the same ⑤ How it works / ⑥ Example / last-updated structure. Server
 * components — no client JS.
 */

export function HowItWorks({ items, title = "How it works" }: { items: string[]; title?: string }) {
  return (
    <>
      <h2 id="how-it-works" className="scroll-mt-16 mt-8 text-2xl font-bold">
        {title}
      </h2>
      {items.map((p) => (
        <p key={p.slice(0, 24)} className="measure mt-3 text-slate-700">
          {p}
        </p>
      ))}
    </>
  );
}

export function ExampleBlock({
  inputs,
  results,
  title = "Example",
}: {
  inputs: string;
  results: string[];
  title?: string;
}) {
  return (
    <>
      <h2 id="example" className="scroll-mt-16 mt-8 text-2xl font-bold">
        {title}
      </h2>
      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="font-semibold text-slate-900">{inputs}</p>
        <ul className="measure mt-2 list-disc space-y-1 pl-5 text-slate-700">
          {results.map((r) => (
            <li key={r.slice(0, 24)}>{r}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Worked example using the figures above &mdash; an illustration, not financial advice. Your
          loan documents decide the real numbers.
        </p>
      </div>
    </>
  );
}

/** Content freshness plus the methodology link, shown at the foot of every page. */
export function ContentMeta({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm text-slate-500 ${className}`.trim()}>
      Last updated {LAST_UPDATED_LABEL}. Every figure is an estimate produced in your browser &mdash;{" "}
      <Link href="/methodology" className="text-blue-700 hover:underline">
        see the methodology and its limits
      </Link>
      .
    </p>
  );
}
