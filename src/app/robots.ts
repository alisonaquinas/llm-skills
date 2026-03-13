/**
 * Metadata route that generates robots.txt for the static marketplace export.
 *
 * Responsibilities:
 * - allow indexing of the public marketplace routes
 * - advertise the published sitemap location to crawlers
 */
import type { MetadataRoute } from "next";
import { getSitemapUrl } from "@/lib/seo";

/** Forces static evaluation for GitHub Pages export. */
export const dynamic = "force-static";

/**
 * Builds the robots.txt directives for the published site.
 *
 * @returns Static crawl rules for the marketplace export.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getSitemapUrl(),
  };
}
