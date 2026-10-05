import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_BODIES } from "@/components/BlogBodies";
import { ContentMeta } from "@/components/ToolSections";
import { BLOG_POSTS, findPost } from "@/lib/blog";
import { SITE_URL, pageOpenGraph } from "@/lib/content";

export function generateStaticParams(): { slug: string }[] {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = findPost(params.slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { ...pageOpenGraph(url), type: "article", title: post.h1, description: post.description },
    twitter: { card: "summary_large_image", title: post.h1, description: post.description },
  };
}

export default function BlogArticle({ params }: { params: { slug: string } }) {
  const post = findPost(params.slug);
  const Body = post ? BLOG_BODIES[post.slug] : undefined;
  // Metadata without a finished body is treated as no page at all.
  if (!post || !Body) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const longDate = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.h1,
        description: post.description,
        url,
        datePublished: post.published,
        dateModified: post.updated,
        inLanguage: "en-US",
        wordCount: post.wordCount,
        author: { "@type": "Organization", name: "KiteCalc", url: SITE_URL },
        publisher: { "@type": "Organization", name: "KiteCalc", url: SITE_URL },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.h1 },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

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
        ›{" "}
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>{" "}
        › <span>{post.h1}</span>
      </nav>

      <article className="mt-3">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{post.h1}</h1>
        <p className="mt-2 text-xs text-slate-500">
          {post.readingMinutes} min read · updated {longDate(post.updated)}
        </p>
        <Body />
      </article>

      <h2 id="faq" className="scroll-mt-16 mt-8 text-2xl font-bold">
        {post.h1} FAQ
      </h2>
      <div className="mt-2 divide-y divide-slate-200">
        {post.faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p className="measure mt-2 text-slate-700">{f.a}</p>
          </details>
        ))}
      </div>

      <h2 className="mt-8 text-2xl font-bold">Calculators mentioned in this guide</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {post.links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-2xl border border-slate-200 p-4 hover:border-blue-700"
            >
              <span className="font-semibold text-blue-700">{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <ContentMeta className="mt-8" />

      <p className="mt-3 text-sm">
        <Link href="/blog" className="text-blue-700 hover:underline">
          ← Back to the blog
        </Link>{" "}
        ·{" "}
        <Link href="/mortgage-calculators" className="text-blue-700 hover:underline">
          All ten mortgage calculators →
        </Link>
      </p>
    </>
  );
}
