import type { MetadataRoute } from "next";
import { RELATED_TOOLS, SITE_URL, SLUG } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/${SLUG}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/mortgage-calculators`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...["/privacy", "/terms", "/affiliate-disclosure"].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
    ...RELATED_TOOLS.map((tool) => ({
      url: `${SITE_URL}${tool.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
