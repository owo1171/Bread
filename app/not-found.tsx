import Link from "next/link";
import { SLUG } from "@/lib/content";
import { SIBLING_TOOLS } from "@/lib/tools";

const LINKS = [
  { name: "Mortgage Payoff Calculator", href: `/${SLUG}` },
  ...SIBLING_TOOLS.map((t) => ({ name: t.name, href: `/${t.slug}` })),
];

/** Custom 404 — Next serves this with a 404 status for unknown routes. */
export default function NotFound() {
  return (
    <div className="pt-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">Page not found</h1>
      <p className="measure mt-3 text-slate-700">
        That address does not match a calculator on this site. The six tools below are the whole set —
        or start from the calculator index.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-2xl border border-slate-200 p-4 hover:border-blue-700"
            >
              <span className="font-semibold text-blue-700">{l.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm">
        <Link href="/mortgage-calculators" className="text-blue-700 hover:underline">
          Calculator index →
        </Link>{" "}
        ·{" "}
        <Link href="/" className="text-blue-700 hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
