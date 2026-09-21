import Link from "next/link";
import { LAST_UPDATED_MONTH } from "@/lib/content";

interface LegalPageProps {
  title: string;
  updated?: string;
  children: React.ReactNode;
}

export default function LegalPage({
  title,
  updated = LAST_UPDATED_MONTH,
  children,
}: LegalPageProps) {
  return (
    <article className="pt-6">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        › <span>{title}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {updated}</p>

      <div className="mt-5 space-y-4 text-slate-700 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_a]:text-blue-700 [&_a]:underline">
        {children}
      </div>

      <p className="mt-8 text-sm">
        <Link href="/mortgage-calculators" className="text-blue-700 hover:underline">
          ← Back to calculators
        </Link>
      </p>
    </article>
  );
}
