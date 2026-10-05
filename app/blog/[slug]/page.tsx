import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  if (!post) notFound();

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
        // Measured from the rendered <article> body (FAQ and cards excluded).
        wordCount: 771,
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

  const link = (href: string, label: string) => (
    <Link href={href} className="text-blue-700 hover:underline">
      {label}
    </Link>
  );

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

        <p className="measure mt-4 text-slate-700">
          Your mortgage payment is the largest fixed bill most American households have and, by a wide
          margin, the least examined. It leaves your account automatically every month, so most people
          only look at it on the occasion it goes up.
        </p>
        <p className="measure mt-3 text-slate-700">
          Six levers actually move it. Two cost nothing to check, one can delete a charge outright, and
          one is the only lever with a price tag attached. Here they are in the order most borrowers
          should try them.
        </p>

        <h2 id="pmi" className="scroll-mt-16 mt-8 text-2xl font-bold">
          1. Check whether you are still paying PMI
        </h2>
        <p className="measure mt-3 text-slate-700">
          Private mortgage insurance is what a lender charges when your down payment left less than 20%
          equity in the house. It protects the lender rather than you, and it is priced on the amount
          you originally borrowed, so it does not shrink as the balance falls. On a $400,000 home bought
          with 10% down at a 0.5% PMI rate that is{" "}
          <strong className="text-slate-900">$150 a month</strong> — roughly $10,330 over the five years
          and nine months until the loan reaches 80% loan-to-value, the point where cancellation
          normally opens ({link("/pmi-calculator", "PMI Calculator")}).
        </p>
        <p className="measure mt-3 text-slate-700">
          Check it first. It costs nothing, and if you have reached 20% equity the whole charge can come
          off the payment.
        </p>

        <h2 id="escrow" className="scroll-mt-16 mt-8 text-2xl font-bold">
          2. Look at escrow before you blame the loan
        </h2>
        <p className="measure mt-3 text-slate-700">
          When the payment rises and the interest rate did not move, the culprit is usually escrow: the
          twelfth of your property tax and homeowners insurance that the lender collects with each
          payment. County reassessments push the tax line up after a sale or a district revaluation, and
          insurance premiums have climbed sharply in the past few years. A shortfall is then spread
          across the following twelve months, so the payment can step up twice ({link(
            "/property-tax-calculator",
            "Property Tax Calculator",
          )}).
        </p>

        <h2 id="extra-payments" className="scroll-mt-16 mt-8 text-2xl font-bold">
          3. Extra payments shorten the loan — they do not shrink the payment
        </h2>
        <p className="measure mt-3 text-slate-700">
          This is the most common misunderstanding. Sending an extra $200 every month sends it to
          principal, so the loan ends sooner and total interest falls, but the required payment stays
          where it was. On a $300,000 balance at 6.5% with 30 years left, an extra $100 a month takes
          about four years off and saves roughly $61,000 in interest — both figures come out of the{" "}
          {link("/mortgage-payoff-calculator", "Mortgage Payoff Calculator")}. Decide first whether you
          are buying a cheaper month or a cheaper loan.
        </p>

        <h2 id="recast" className="scroll-mt-16 mt-8 text-2xl font-bold">
          4. The underused lever: a recast
        </h2>
        <p className="measure mt-3 text-slate-700">
          If you have a lump sum — a bonus, an inheritance, savings you were not going to spend — and you
          like the rate you already have, a recast re-amortises the loan once that money goes in. The
          payment drops, the end date stays where it was, and there is no fresh stack of closing costs
          the way a refinance brings. Servicers usually charge a few hundred dollars or nothing. Weigh it
          against plain extra payments in the{" "}
          {link("/mortgage-recast-calculator", "Mortgage Recast Calculator")}.
        </p>

        <h2 id="refinance" className="scroll-mt-16 mt-8 text-2xl font-bold">
          5. Refinance, but only past break-even
        </h2>
        <p className="measure mt-3 text-slate-700">
          Refinancing is the lever with a price tag, because closing costs run a few percent of the loan.
          So the question is not whether the new rate is lower but how long the saving takes to repay the
          cost: closing costs divided by the monthly saving, which the{" "}
          {link("/refinance-break-even-calculator", "Refinance Break-Even Calculator")}
          does in seconds. Below roughly two years it usually works; beyond that you are paying for the
          move itself. It is also why a no-closing-cost refinance is not free — the lender prices it into
          the rate or the balance instead.
        </p>

        <h2 id="term" className="scroll-mt-16 mt-8 text-2xl font-bold">
          6. Term length is the biggest dial
        </h2>
        <p className="measure mt-3 text-slate-700">
          Nothing moves a payment like the number of years it is spread over. On the same $320,000 loan
          at 6.5%, the {link("/mortgage-payment-calculator", "Mortgage Payment Calculator")} prices 30
          years at about $2,023 a month, 25 years at $2,161 and 15 years at $2,784. The 15-year version
          saves a great deal of interest, but that extra $623 a month has to be comfortable before it is
          a plan rather than a strain.
        </p>

        <h2 id="before-you-buy" className="scroll-mt-16 mt-8 text-2xl font-bold">
          If you have not bought yet
        </h2>
        <p className="measure mt-3 text-slate-700">
          For buyers the lever comes earlier: every additional 1% put down on a $400,000 purchase trims
          roughly $27 a month for the life of the loan ({link("/down-payment-calculator", "Down Payment Calculator")}). The question before that one is
          whether the payment beats renting at all in your city, which is what the{" "}
          {link("/rent-vs-buy-calculator", "Rent vs Buy Calculator")}
          answers — on its default figures a $400,000 home against $2,000 rent favours owning by about
          $45,428 over seven years, yet with zero appreciation the same inputs side with the renter.
        </p>

        <h2 id="order" className="scroll-mt-16 mt-8 text-2xl font-bold">
          The order to try them in
        </h2>
        <p className="measure mt-3 text-slate-700">
          Cheapest checks first: PMI, then escrow. Then decide what you actually want — a cheaper loan
          through extra payments, or a cheaper month through a recast. Refinance last, and only past
          break-even.
        </p>
      </article>

      <h2 id="faq" className="scroll-mt-16 mt-8 text-2xl font-bold">
        Mortgage payment FAQ
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
