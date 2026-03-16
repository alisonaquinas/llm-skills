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
import { DownloadIcon, GitHubIcon } from "@/components/SiteIcons";
import StructuredData from "@/components/StructuredData";
import SkillGrid from "@/components/SkillGrid";
import { MARKETPLACE, buildAllPluginsBundleUrl } from "@/lib/catalog";
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
            })),
          ),
        ]}
      />

      <section className="mb-8 max-w-4xl">
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {MARKETPLACE.title}
        </h1>
        <p className="text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          This is a personal project of mine focused on helping LLMs become
          better partners in coding and software engineering. I’m building
          practical skills, tools, and guidance that make models more useful for
          real development work, not just demos. The goal is to help them
          produce better code, make better engineering decisions, and fit more
          naturally into modern software workflows. It’s designed to be useful
          across both Claude and Codex, with an emphasis on capabilities that
          actually matter to developers.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <a
          href={buildAllPluginsBundleUrl()}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700 transition hover:border-brand-400 hover:bg-brand-100 dark:border-brand-900/70 dark:bg-brand-950/40 dark:text-brand-200 dark:hover:border-brand-700 dark:hover:bg-brand-950/70"
          aria-label="Download all plugin bundles as a single ZIP"
        >
          <DownloadIcon className="h-4 w-4 shrink-0" />
          <span>Download all plugins</span>
        </a>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          One ZIP containing every plugin bundle — install offline at any time
        </span>
      </div>

      <InstallBanner />

      <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pluginSummaries.map(
          ({ plugin, installCommand, meta, repoUrl, skillCount, bundleUrl }) => (
            <div
              key={plugin.repo}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950 sm:p-5"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
                {plugin.icon ? (
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {plugin.icon}
                  </span>
                ) : null}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${plugin.color}`}
                >
                  {plugin.label}
                </span>
                {meta?.version ? (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    v{meta.version}
                  </span>
                ) : null}
              </div>

              <h2 className="mb-1 font-semibold text-gray-900 dark:text-white">
                {plugin.pluginName}
              </h2>
              <p className="mb-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {meta?.description ?? plugin.siteDescription}
              </p>

              <div className="mb-3 rounded-xl bg-stone-50 px-3 py-3 dark:bg-stone-900/80">
                <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Install
                </div>
                <div className="overflow-x-auto">
                  <code className="block min-w-max whitespace-nowrap text-sm text-gray-800 dark:text-gray-100">
                    {installCommand}
                  </code>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{skillCount} included skills</span>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 hover:text-brand-700 dark:hover:text-brand-200"
                >
                  <GitHubIcon className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
                {bundleUrl ? (
                  <a
                    href={bundleUrl}
                    aria-label={`Download all ${plugin.label} skills as a ZIP bundle`}
                    className="inline-flex min-h-11 items-center gap-1.5 hover:text-brand-700 dark:hover:text-brand-200"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    <span>Bundle</span>
                  </a>
                ) : null}
              </div>
            </div>
          ),
        )}
      </section>

      <SkillGrid
        skills={allSkills}
        repos={pluginSummaries.map(({ plugin }) => plugin)}
      />
    </div>
  );
}
