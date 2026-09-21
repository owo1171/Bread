import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import SpecCalculator from "@/components/SpecCalculator";
import { OG_IMAGE_ALT, OG_IMAGE_URL, SITE_URL, SLUG } from "@/lib/content";
import { SIBLING_TOOLS, findTool } from "@/lib/tools";

export function generateStaticParams(): { slug: string }[] {
  return SIBLING_TOOLS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = findTool(params.slug);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: `/${tool.slug}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${tool.slug}`,
      title: tool.title,
      description: tool.description,
      siteName: "Tool Site",
      locale: "en_US",
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
      images: [OG_IMAGE_URL],
    },
  };
}

export default function SiblingToolPage({ params }: { params: { slug: string } }) {
  const tool = findTool(params.slug);
  if (!tool) notFound();

  const url = `${SITE_URL}/${tool.slug}`;
  const related = [
    { name: "Mortgage Payoff Calculator", href: `/${SLUG}`, note: "Find your payoff date and interest saved." },
    ...SIBLING_TOOLS.filter((t) => t.slug !== tool.slug).map((t) => ({
      name: t.name,
      href: `/${t.slug}`,
      note: t.description.split(".")[0] + ".",
    })),
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: tool.name,
        url,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Mortgage Calculators", item: `${SITE_URL}/mortgage-calculators` },
          { "@type": "ListItem", position: 3, name: tool.name },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((f) => ({
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
        <Link href="/mortgage-calculators" className="hover:underline">
          Mortgage Calculators
        </Link>{" "}
        › <span>{tool.name}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{tool.name}</h1>
      <p className="measure mt-3 text-slate-700">{tool.intro[0]}</p>
      {tool.intro[1] && <p className="measure mt-3 text-slate-700">{tool.intro[1]}</p>}

      <div className="mt-6">
        <SpecCalculator slug={tool.slug} />
      </div>

      <AdSlot id="ad-results" note="Ad slot — results area (300x250 / in-article)" minHeight={120} />

      <AdSlot id="ad-hero" note="Ad slot — below the fold (fluid / 336x280 mobile)" minHeight={140} />

      <h2 id="faq" className="scroll-mt-16 text-2xl font-bold">
        {tool.name} FAQ
      </h2>
      <div className="mt-2 divide-y divide-slate-200">
        {tool.faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p className="measure mt-2 text-slate-700">{f.a}</p>
          </details>
        ))}
      </div>

      <AdSlot id="ad-faq" note="Ad slot — above FAQs (300x250)" minHeight={140} />

      <h2 className="text-2xl font-bold">Related tools</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {related.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block rounded-2xl border border-slate-200 p-4 hover:border-blue-700"
            >
              <span className="font-semibold text-blue-700">{t.name}</span>
              <span className="mt-1 block text-sm text-slate-600">{t.note}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm">
        <Link href="/mortgage-calculators" className="text-blue-700 hover:underline">
          All mortgage calculators →
        </Link>
      </p>
    </>
  );
}
