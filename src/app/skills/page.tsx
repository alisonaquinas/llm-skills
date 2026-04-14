/**
 * Full searchable skill catalog route.
 *
 * Responsibilities:
 * - host the interactive skill grid that was formerly on the home page
 * - provide a narrow-intent landing URL ("all skills") for search engines
 * - delegate aggregation to the marketplace domain layer
 *
 * Dependency rules:
 * - reads page data through src/lib/marketplace
 * - keeps JSX composition local and avoids business logic
 */
import type { Metadata } from "next";
import Link from "next/link";
import SkillGrid from "@/components/SkillGrid";
import StructuredData from "@/components/StructuredData";
import { MARKETPLACE } from "@/lib/catalog";
import { getMarketplacePageData } from "@/lib/marketplace";
import {
  buildCollectionPageStructuredData,
  buildSiteUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";

/** Canonical URL for the browse-all skills page. */
const SKILLS_URL = buildSiteUrl("skills/");

/** Shared description used in metadata and the page intro. */
const SKILLS_DESCRIPTION = `Browse every documented skill published across ${MARKETPLACE.title}. Search by name or filter by skill bundle to find Claude Code and Codex skills for CI/CD, software design, documentation, and web development.`;

/**
 * Route metadata for the full skill catalog page.
 */
export const metadata: Metadata = {
  title: `Browse all skills | ${MARKETPLACE.title}`,
  description: SKILLS_DESCRIPTION,
  alternates: {
    canonical: SKILLS_URL,
  },
  openGraph: {
    type: "website",
    url: SKILLS_URL,
    title: `Browse all skills | ${MARKETPLACE.title}`,
    description: SKILLS_DESCRIPTION,
    images: [getSocialPreviewImageUrl()],
  },
  twitter: {
    card: "summary_large_image",
    title: `Browse all skills | ${MARKETPLACE.title}`,
    description: SKILLS_DESCRIPTION,
    images: [getSocialPreviewImageUrl()],
  },
};

/**
 * Renders the statically generated browse-all-skills page.
 *
 * @returns The full searchable and filterable skill catalog.
 */
export default async function AllSkillsPage() {
  const { allSkills, pluginSummaries } = await getMarketplacePageData();

  return (
    <div>
      <StructuredData data={buildCollectionPageStructuredData()} />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
          Marketplace
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">All skills</span>
      </nav>

      <section className="mb-8 max-w-4xl">
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Browse every skill in the marketplace
        </h1>
        <p className="text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          {allSkills.length} skills across {pluginSummaries.length} bundles. Search by name
          or filter by bundle to find the skills you need for Claude Code or Codex.
        </p>
      </section>

      <SkillGrid
        skills={allSkills}
        repos={pluginSummaries.map(({ plugin }) => plugin)}
      />
    </div>
  );
}
