/**
 * Marketplace landing page that composes the install instructions and skill catalog UI.
 *
 * Responsibilities:
 * - request marketplace page data from the domain layer
 * - render plugin summary cards for the published plugin repos
 * - pass normalized skill data into the interactive grid component
 *
 * Dependency rules:
 * - delegates aggregation logic to src/lib/marketplace
 * - keeps JSX composition local and avoids inline business transformations
 */
import type { Metadata } from "next";
import InstallBanner from "@/components/InstallBanner";
import { GitHubIcon } from "@/components/SiteIcons";
import StructuredData from "@/components/StructuredData";
import SkillGrid from "@/components/SkillGrid";
import { MARKETPLACE } from "@/lib/catalog";
import { getMarketplacePageData } from "@/lib/marketplace";
import {
  buildCollectionPageStructuredData,
  buildPluginItemListStructuredData,
  getHomeDescription,
  getHomeUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";

/**
 * Route metadata for the marketplace landing page.
 */
export const metadata: Metadata = {
  title: MARKETPLACE.title,
  description: getHomeDescription(),
  alternates: {
    canonical: getHomeUrl(),
  },
  openGraph: {
    type: "website",
    url: getHomeUrl(),
    title: MARKETPLACE.title,
    description: getHomeDescription(),
    images: [getSocialPreviewImageUrl()],
  },
  twitter: {
    card: "summary_large_image",
    title: MARKETPLACE.title,
    description: getHomeDescription(),
    images: [getSocialPreviewImageUrl()],
  },
};

/**
 * Renders the statically generated marketplace home page.
 *
 * @returns The landing page for browsing installable plugins and bundled skills.
 */
export default async function MarketplacePage() {
  const { allSkills, pluginSummaries } = await getMarketplacePageData();

  return (
    <div>
      <StructuredData
        data={[
          buildCollectionPageStructuredData(),
          buildPluginItemListStructuredData(
            pluginSummaries.map(({ plugin, meta, skillCount }) => ({
              plugin,
              description: meta?.description ?? plugin.siteDescription,
              skillCount,
            }))
          ),
        ]}
      />

      <section className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{MARKETPLACE.title}</h1>
        <p className="max-w-4xl text-lg text-gray-600 dark:text-gray-300">
          This marketplace publishes two installable Claude Code plugins, exposes their bundled
          skills as static searchable pages, and ships machine-readable artifacts like
          marketplace.json, rss.xml, and sitemap.xml for discovery.
        </p>
      </section>

      <InstallBanner />

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {pluginSummaries.map(({ plugin, installCommand, meta, repoUrl, skillCount }) => (
          <div key={plugin.repo} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950">
            <div className="mb-3 flex items-center gap-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${plugin.color}`}>
                {plugin.label}
              </span>
              {meta?.version ? <span className="text-xs text-gray-400 dark:text-gray-500">v{meta.version}</span> : null}
            </div>

            <h2 className="mb-1 font-semibold text-gray-900 dark:text-white">{plugin.pluginName}</h2>
            <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
              {meta?.description ?? plugin.siteDescription}
            </p>

            <div className="mb-3 rounded-xl bg-stone-50 px-3 py-2 dark:bg-stone-900/80">
              <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Install</div>
              <code className="block text-sm text-gray-800 dark:text-gray-100">{installCommand}</code>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{skillCount} included skills</span>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-brand-700 dark:hover:text-brand-200"
              >
                <GitHubIcon className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        ))}
      </section>

      <SkillGrid skills={allSkills} repos={pluginSummaries.map(({ plugin }) => plugin)} />
    </div>
  );
}
