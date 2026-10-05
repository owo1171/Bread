import type { Metadata } from "next";
import Link from "next/link";
import { ContentMeta } from "@/components/ToolSections";
import { BLOG_POSTS } from "@/lib/blog";
import { SITE_NAME, SITE_URL, pageOpenGraph } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mortgage Blog: Guides, Comparisons and Money Calls",
  description:
    "Plain-English mortgage guides for US borrowers — how to lower a payment, what a recast does, when refinancing pays — each with a calculator to check.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: pageOpenGraph(`${SITE_URL}/blog`),
};

/** Newest first on the index and in the ItemList, so the list order matches the schema. */
const NEWEST_FIRST = [...BLOG_POSTS].reverse();

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog`,
      name: "Mortgage Blog",
      url: `${SITE_URL}/blog`,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog" },
      ],
    },
    {
      "@type": "ItemList",
      itemListElement: NEWEST_FIRST.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.h1,
        url: `${SITE_URL}/blog/${p.slug}`,
      })),
    },
  ],
};

export default function BlogIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav aria-label="Breadcrumb" className="pt-4 text-xs text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        › <span>Blog</span>
      </nav>

      <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Mortgage Blog</h1>
      <p className="measure mt-3 text-slate-700">
        Short guides on the money questions behind a mortgage. Every claim that needs a number comes with
        the calculator that produces it, so you can put your own figures in rather than take our word for
        it.
      </p>

      <h2 className="mt-8 text-2xl font-bold">All guides</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {NEWEST_FIRST.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="block h-full rounded-2xl border border-slate-200 p-4 hover:border-blue-700"
            >
              <span className="font-semibold text-blue-700">{p.h1}</span>
              <span className="mt-1 block text-sm text-slate-600">{p.excerpt}</span>
              <span className="mt-2 block text-xs text-slate-500">
                {p.readingMinutes} min read · updated{" "}
                {new Date(`${p.updated}T00:00:00Z`).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm">
        <Link href="/mortgage-calculators" className="text-blue-700 hover:underline">
          All ten mortgage calculators →
        </Link>
      </p>

      <ContentMeta className="mt-8" />
    </>
  );
}
