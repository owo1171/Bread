import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

// Served at /robots.txt. Kept as code (not public/robots.txt) so the Sitemap
// line can never drift from SITE_URL / sitemap.xml.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
