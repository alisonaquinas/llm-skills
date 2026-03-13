/**
 * Skill detail route for statically exported skill pages.
 *
 * Responsibilities:
 * - derive owner, repo, and skill name from the catch-all route segments
 * - resolve the owning plugin and the corresponding skill content
 * - render install guidance and raw SKILL.md contents for the selected skill
 *
 * Dependency rules:
 * - route parsing and plugin lookup live in src/lib
 * - page composition remains thin and delegates business rules outward
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "@/components/CopyButton";
import StructuredData from "@/components/StructuredData";
import { findPluginByRepo, getPluginRepoUrl, type PluginConfig } from "@/lib/catalog";
import { getPluginInstallCommand, getSkillInvocation } from "@/lib/commands";
import { getAllSkills, getSkillDetail } from "@/lib/github";
import { createSkillRouteParams, parseSkillRoute } from "@/lib/routes";
import {
  buildSkillDescription,
  buildSkillStructuredData,
  buildSkillTitle,
  buildSkillUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";

/**
 * Generates all static route parameters for published skill pages.
 *
 * @returns A list of catch-all slug objects for Next.js static generation.
 */
export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map(createSkillRouteParams);
}

/**
 * Next.js page props for the catch-all skill route.
 */
interface PageProps {
  /** Deferred route parameters provided by the App Router. */
  params: Promise<{ slug: string[] }>;
}

/**
 * Resolves a configured plugin or terminates the request with a 404.
 *
 * @param owner GitHub owner segment from the route.
 * @param repo GitHub repository segment from the route.
 * @returns The matching plugin configuration.
 */
function requirePlugin(owner: string, repo: string): PluginConfig {
  const plugin = findPluginByRepo(owner, repo);
  if (!plugin) {
    notFound();
  }

  return plugin;
}

/**
 * Renders the statically generated skill detail page.
 *
 * @param params Deferred route parameters for the selected skill.
 * @returns The skill detail experience or a 404 when the route is invalid.
 */
export default async function SkillPage({ params }: PageProps) {
  const resolvedParams = await params;
  const route = parseSkillRoute(resolvedParams.slug);
  if (!route) {
    notFound();
  }

  const plugin = requirePlugin(route.owner, route.repo);
  const skill = await getSkillDetail(plugin, route.skillName);
  if (skill.files.length === 0 && !skill.readme) {
    notFound();
  }

  const installCommand = getPluginInstallCommand(plugin);
  const invokeCommand = getSkillInvocation(plugin, route.skillName);
  const pluginRepoUrl = getPluginRepoUrl(plugin);

  return (
    <div className="max-w-3xl">
      <StructuredData data={buildSkillStructuredData(skill)} />
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
          Marketplace
        </Link>
        <span>/</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${plugin.color}`}>
          {plugin.label}
        </span>
        <span>/</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">{route.skillName}</span>
      </nav>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{route.skillName}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>Included in plugin</span>
          <code className="rounded bg-gray-100 px-2 py-0.5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">{plugin.pluginName}</code>
          <span>·</span>
          <a
            href={`${pluginRepoUrl}/tree/main/skills/${route.skillName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-300"
          >
            View on GitHub ↗
          </a>
        </div>
      </div>

      {skill.files.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Files</h2>
          <div className="flex flex-wrap gap-2">
            {skill.files.map((file) => (
              <span
                key={file}
                className={`rounded px-2 py-1 font-mono text-xs ${
                  file === "SKILL.md"
                    ? "bg-brand-100 font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-100"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {file}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-8 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Install</h2>

        <div className="rounded-xl bg-gray-900 p-4 dark:bg-black">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-gray-400">Install the containing plugin</span>
            <CopyButton text={installCommand} />
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-green-400">
            {installCommand}
          </pre>
        </div>

        <div className="rounded-xl bg-gray-900 p-4 dark:bg-black">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-gray-400">Invoke this skill after installation</span>
            <CopyButton text={invokeCommand} label="Copy" />
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-green-400">
            {invokeCommand}
          </pre>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          This skill is bundled inside <strong className="text-gray-800 dark:text-white">{plugin.pluginName}</strong>.
          Install the plugin once, then Claude Code can use any of its included skills. Browse the
          full plugin repository at{" "}
          <a
            href={pluginRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            github.com/{plugin.owner}/{plugin.repo}
          </a>
          .
        </div>
      </section>

      {skill.readme ? (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SKILL.md</h2>
            <CopyButton text={skill.readme} label="Copy raw" />
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              {skill.readme}
            </pre>
          </div>
        </section>
      ) : null}

      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        ← Back to marketplace
      </Link>
    </div>
  );
}

/**
 * Generates page metadata for the selected skill route.
 *
 * @param params Deferred route parameters for the active skill page.
 * @returns Route-specific metadata for the selected skill page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const route = parseSkillRoute(resolvedParams.slug);
  if (!route) {
    return {
      title: buildSkillTitle("Skill"),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const plugin = findPluginByRepo(route.owner, route.repo);
  if (!plugin) {
    return {
      title: buildSkillTitle(route.skillName),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const skill = await getSkillDetail(plugin, route.skillName);
  const description = buildSkillDescription(plugin, route.skillName);
  const canonicalUrl = buildSkillUrl(route.owner, route.repo, route.skillName);
  const isIndexable = skill.files.length > 0 || Boolean(skill.readme);

  return {
    title: buildSkillTitle(route.skillName),
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: isIndexable,
      follow: isIndexable,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: buildSkillTitle(route.skillName),
      description,
      images: [getSocialPreviewImageUrl()],
    },
    twitter: {
      card: "summary_large_image",
      title: buildSkillTitle(route.skillName),
      description,
      images: [getSocialPreviewImageUrl()],
    },
  };
}
