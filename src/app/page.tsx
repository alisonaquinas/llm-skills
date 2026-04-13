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
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import InstallBanner from "@/components/InstallBanner";
import { DownloadIcon, GitHubIcon } from "@/components/SiteIcons";
import StructuredData from "@/components/StructuredData";
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
  const totalSkills = allSkills.length;

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

      <section className="mb-8">
        <h1 className="mb-3 max-w-4xl text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          LLM Skills Marketplace for Claude Code and Codex
        </h1>
        <p className="mb-6 text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          Reusable agent skills for coding, CI/CD, documentation, software
          design, and web development — installable in Claude Code and portable
          to Codex. Teach your agent real engineering practices instead of
          reinventing them every session.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <li className="rounded-xl border border-stone-200 bg-white p-4 text-sm leading-6 text-gray-700 shadow-sm dark:border-stone-800 dark:bg-stone-950 dark:text-gray-300">
            <span className="mb-1 block text-lg" aria-hidden="true">🚀</span>
            <span className="font-medium text-gray-900 dark:text-white">Ship a Kubernetes-ready CI/CD playbook</span>
            {" "}— Helm, kubectl, Terraform, GitHub Actions, and more, wired
            together so your agent can draft and troubleshoot real pipelines.
          </li>
          <li className="rounded-xl border border-stone-200 bg-white p-4 text-sm leading-6 text-gray-700 shadow-sm dark:border-stone-800 dark:bg-stone-950 dark:text-gray-300">
            <span className="mb-1 block text-lg" aria-hidden="true">🏛️</span>
            <span className="font-medium text-gray-900 dark:text-white">Enforce SOLID, DDD, and language best practices</span>
            {" "}— design-pattern and per-language guidance that keeps code
            reviewable instead of clever.
          </li>
          <li className="rounded-xl border border-stone-200 bg-white p-4 text-sm leading-6 text-gray-700 shadow-sm dark:border-stone-800 dark:bg-stone-950 dark:text-gray-300">
            <span className="mb-1 block text-lg" aria-hidden="true">📄</span>
            <span className="font-medium text-gray-900 dark:text-white">Generate diagrams and docs that actually render</span>
            {" "}— PlantUML, Mermaid, Pandoc, LaTeX, Markdown, and Office
            skills for design docs, runbooks, and deliverables.
          </li>
        </ul>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <a
          href={buildAllPluginsBundleUrl()}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700 transition hover:border-brand-400 hover:bg-brand-100 dark:border-brand-900/70 dark:bg-brand-950/40 dark:text-brand-200 dark:hover:border-brand-700 dark:hover:bg-brand-950/70"
          aria-label="Download every skill bundle as a single ZIP"
        >
          <DownloadIcon className="h-4 w-4 shrink-0" />
          <span>Download all skill bundles</span>
        </a>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          One ZIP containing every skill bundle — install offline at any time
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
                <Link
                  href={`/bundles/${plugin.pluginName}`}
                  className="hover:text-brand-700 dark:hover:text-brand-200"
                >
                  {plugin.pluginName}
                </Link>
              </h2>
              <p className="mb-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {meta?.description ?? plugin.siteDescription}
              </p>

              <div className="mb-3 rounded-xl bg-stone-50 px-3 py-3 dark:bg-stone-900/80">
                <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Install
                </div>
                <div className="flex items-center gap-2">
                  <code
                    className="min-w-0 flex-1 truncate text-sm text-gray-800 dark:text-gray-100"
                    title={installCommand}
                  >
                    {installCommand}
                  </code>
                  <div className="shrink-0">
                    <CopyButton
                      text={installCommand}
                      label="Copy install command"
                      ariaLabel={`Copy install command for ${plugin.label}`}
                      variant="icon"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Link
                  href={`/bundles/${plugin.pluginName}`}
                  className="inline-flex min-h-11 items-center gap-1.5 font-medium text-brand-700 hover:text-brand-800 dark:text-brand-200 dark:hover:text-brand-100"
                >
                  <span>{skillCount} skills →</span>
                </Link>
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

      <section className="mb-10 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950 sm:p-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Browse skills
        </h2>
        <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
          The full catalog is searchable and filterable by bundle. Or start with one
          of the five bundles above if you already know the domain you need.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/skills"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700 transition hover:border-brand-400 hover:bg-brand-100 dark:border-brand-900/70 dark:bg-brand-950/40 dark:text-brand-200 dark:hover:border-brand-700 dark:hover:bg-brand-950/70"
          >
            View all {totalSkills} skills →
          </Link>
          <Link
            href="/what-are-skills"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-gray-600 hover:text-brand-700 dark:text-gray-300 dark:hover:text-brand-200"
          >
            What are agent skills?
          </Link>
          <Link
            href="/claude-vs-codex"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-gray-600 hover:text-brand-700 dark:text-gray-300 dark:hover:text-brand-200"
          >
            Claude Code vs Codex
          </Link>
        </div>
      </section>
    </div>
  );
}
