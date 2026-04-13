/**
 * Per-bundle landing page for each published skill bundle.
 *
 * Responsibilities:
 * - statically generate one indexable route per configured plugin bundle
 * - render bundle-specific install guidance, metadata, and included skills
 * - keep ranking-narrow intents ("ci-cd skills", "doc-skills") on dedicated URLs
 *
 * Dependency rules:
 * - resolves bundle identity through catalog and marketplace namespaces
 * - delegates skill filtering to existing aggregation helpers
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "@/components/CopyButton";
import SkillCard from "@/components/SkillCard";
import { DownloadIcon, GitHubIcon } from "@/components/SiteIcons";
import StructuredData from "@/components/StructuredData";
import {
  MARKETPLACE,
  PLUGINS,
  getPluginRepoUrl,
  type PluginConfig,
} from "@/lib/catalog";
import { getMarketplacePageData } from "@/lib/marketplace";
import {
  buildCollectionPageStructuredData,
  buildSiteUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";

/**
 * Next.js route params for a bundle landing page.
 */
interface BundlePageProps {
  /** Deferred params containing the bundle pluginName slug. */
  params: Promise<{ bundle: string }>;
}

/**
 * Builds the canonical URL for a bundle landing page.
 *
 * @param pluginName Bundle slug used in the route.
 * @returns Absolute canonical URL for the bundle page.
 */
function buildBundleUrl(pluginName: string): string {
  return buildSiteUrl(`bundles/${pluginName}/`);
}

/**
 * Builds a routing-friendly description for a single bundle.
 *
 * @param plugin Plugin configuration for the bundle.
 * @param skillCount Number of skills contained in the bundle.
 * @returns Bundle-specific description used in metadata and JSON-LD.
 */
function buildBundleDescription(plugin: PluginConfig, skillCount: number): string {
  return `${plugin.label}: ${skillCount} skills for Claude Code and Codex. ${plugin.siteDescription}`;
}

/**
 * Enumerates every bundle slug for static export.
 *
 * @returns Route params covering every configured plugin bundle.
 */
export async function generateStaticParams() {
  return PLUGINS.map((plugin) => ({ bundle: plugin.pluginName }));
}

/**
 * Generates per-bundle metadata so each page earns a unique title and canonical URL.
 *
 * @param params Route params for the active bundle page.
 * @returns Bundle-specific metadata for SEO and social sharing.
 */
export async function generateMetadata({
  params,
}: BundlePageProps): Promise<Metadata> {
  const { bundle } = await params;
  const plugin = PLUGINS.find((candidate) => candidate.pluginName === bundle);
  if (!plugin) {
    return {
      title: `Bundle | ${MARKETPLACE.title}`,
      robots: { index: false, follow: false },
    };
  }

  const { allSkills } = await getMarketplacePageData();
  const skillCount = allSkills.filter((skill) => skill.repo.repo === plugin.repo).length;
  const url = buildBundleUrl(plugin.pluginName);
  const title = `${plugin.label} bundle | ${MARKETPLACE.title}`;
  const description = buildBundleDescription(plugin, skillCount);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [getSocialPreviewImageUrl()],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getSocialPreviewImageUrl()],
    },
  };
}

/**
 * Renders the statically generated landing page for a single bundle.
 *
 * @param params Deferred route params with the bundle slug.
 * @returns The bundle landing page or a 404 when the slug is unknown.
 */
export default async function BundlePage({ params }: BundlePageProps) {
  const { bundle } = await params;
  const summaryData = await getMarketplacePageData();
  const summary = summaryData.pluginSummaries.find(
    ({ plugin }) => plugin.pluginName === bundle,
  );
  if (!summary) {
    notFound();
  }

  const { plugin, installCommand, repoUrl, meta, bundleUrl } = summary;
  const bundleSkills = summaryData.allSkills
    .filter((skill) => skill.repo.repo === plugin.repo)
    .sort((left, right) => left.name.localeCompare(right.name));

  return (
    <div>
      <StructuredData data={buildCollectionPageStructuredData()} />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
          Marketplace
        </Link>
        <span>/</span>
        <Link href="/skills" className="hover:text-gray-700 dark:hover:text-gray-200">
          Skills
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">{plugin.label}</span>
      </nav>

      <section className="mb-8 max-w-4xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
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
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {bundleSkills.length} skills
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {plugin.label} for Claude Code and Codex
        </h1>
        <p className="text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          {meta?.description ?? plugin.siteDescription}
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/80 p-4 shadow-sm dark:border-brand-900/70 dark:bg-brand-950/30 sm:p-5">
        <h2 className="mb-1 text-lg font-semibold text-brand-900 dark:text-brand-100">
          Install the {plugin.label} bundle
        </h2>
        <p className="mb-4 max-w-3xl text-sm leading-6 text-brand-800 dark:text-brand-200">
          Add the marketplace once, then install just this bundle. A bundle is a single
          Claude Code plugin that ships all {bundleSkills.length} skills listed below.
        </p>

        <div className="rounded-xl bg-stone-50 px-3 py-3 dark:bg-stone-900/80">
          <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Install command
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

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 hover:text-brand-700 dark:hover:text-brand-200"
          >
            <GitHubIcon className="h-4 w-4" />
            <span>Source on GitHub</span>
          </a>
          {bundleUrl ? (
            <a
              href={bundleUrl}
              className="inline-flex min-h-11 items-center gap-1.5 hover:text-brand-700 dark:hover:text-brand-200"
              aria-label={`Download the ${plugin.label} ZIP bundle`}
            >
              <DownloadIcon className="h-4 w-4" />
              <span>Download ZIP</span>
            </a>
          ) : null}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Category: {plugin.category}
          </span>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Skills included in this bundle
        </h2>
        {bundleSkills.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No skills published yet. Check the{" "}
            <a
              href={getPluginRepoUrl(plugin)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline dark:text-brand-300"
            >
              bundle repository
            </a>{" "}
            for in-progress work.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bundleSkills.map((skill) => (
              <SkillCard key={`${skill.repo.repo}/${skill.name}`} skill={skill} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <Link
          href="/skills"
          className="inline-flex min-h-11 items-center gap-2 hover:text-brand-700 dark:hover:text-brand-200"
        >
          Browse all skills →
        </Link>
        <Link
          href="/what-are-skills"
          className="inline-flex min-h-11 items-center gap-2 hover:text-brand-700 dark:hover:text-brand-200"
        >
          What are agent skills?
        </Link>
        <Link
          href="/guides/install-skills-from-github"
          className="inline-flex min-h-11 items-center gap-2 hover:text-brand-700 dark:hover:text-brand-200"
        >
          How to install skills
        </Link>
        {plugin.pluginName === "ci-cd" ? (
          <Link
            href="/guides/best-ci-cd-skills-for-claude-code"
            className="inline-flex min-h-11 items-center gap-2 hover:text-brand-700 dark:hover:text-brand-200"
          >
            Best CI/CD skills guide
          </Link>
        ) : null}
        {plugin.pluginName === "software-design" ? (
          <Link
            href="/guides/well-documented-case-study"
            className="inline-flex min-h-11 items-center gap-2 hover:text-brand-700 dark:hover:text-brand-200"
          >
            Well-documented case study
          </Link>
        ) : null}
      </section>
    </div>
  );
}
