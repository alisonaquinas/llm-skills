/**
 * Marketplace aggregation services that compose plugin metadata and skill listings.
 *
 * Responsibilities:
 * - join plugin config, upstream metadata, and skill counts into page-ready summaries
 * - expose a single page-data loader for the marketplace landing page
 * - keep composition logic out of page components
 */
import type { PluginConfig } from "@/lib/catalog";
import type { PluginMeta, SkillEntry } from "@/lib/github";
import { PLUGINS, getPluginRepoUrl } from "@/lib/catalog";
import { getPluginInstallCommand } from "@/lib/commands";
import { buildPluginBundleUrl, getAllSkills, getPluginMeta } from "@/lib/github";

/** Combined view model for a plugin card on the marketplace landing page. */
export interface MarketplacePluginSummary {
  /** Plugin configuration rendered by the UI. */
  plugin: PluginConfig;
  /** Precomputed install command for the plugin. */
  installCommand: string;
  /** Canonical GitHub repository URL for the plugin. */
  repoUrl: string;
  /** Optional upstream plugin metadata when available. */
  meta: PluginMeta | null;
  /** Number of skills published by the plugin. */
  skillCount: number;
  /** Direct download URL for the all-in-one plugin ZIP bundle, or null when unavailable. */
  bundleUrl: string | null;
}

/** Aggregated data required by the marketplace landing page. */
export interface MarketplacePageData {
  /** Flattened set of skills across all configured plugins. */
  allSkills: SkillEntry[];
  /** Summaries used to render the plugin overview cards. */
  pluginSummaries: MarketplacePluginSummary[];
}

/**
 * Counts skills by plugin repository name.
 *
 * @param skills Skill entries to group.
 * @returns A map keyed by repository name with per-plugin skill totals.
 */
export function countSkillsByPlugin(skills: SkillEntry[]): Map<string, number> {
  return skills.reduce((counts, skill) => {
    counts.set(skill.repo.repo, (counts.get(skill.repo.repo) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());
}

/**
 * Collapses duplicate skill names so the marketplace card grid shows one preferred entry.
 *
 * Preference follows plugin catalog order from most specific to most general, which means
 * later plugin entries win over earlier ones when they publish the same skill name.
 *
 * @param skills Flattened skill entries from all configured plugins.
 * @returns Unique skill entries keyed by skill name.
 */
export function preferDistinctSkills(skills: SkillEntry[]): SkillEntry[] {
  const pluginPriority = new Map(PLUGINS.map((plugin, index) => [plugin.repo, index]));
  const preferredByName = new Map<string, SkillEntry>();

  for (const skill of skills) {
    const current = preferredByName.get(skill.name);
    if (!current) {
      preferredByName.set(skill.name, skill);
      continue;
    }

    const currentPriority = pluginPriority.get(current.repo.repo) ?? -1;
    const nextPriority = pluginPriority.get(skill.repo.repo) ?? -1;

    if (nextPriority >= currentPriority) {
      preferredByName.set(skill.name, skill);
    }
  }

  return [...preferredByName.values()].sort((left, right) => left.name.localeCompare(right.name));
}

/**
 * Creates the summary models rendered by the marketplace landing page.
 *
 * @param skills Flattened skill entries from all plugins.
 * @param metas Plugin metadata payloads aligned to configured plugins.
 * @returns Page-ready plugin summaries with skill counts and install commands.
 */
export function buildMarketplacePluginSummaries(
  skills: SkillEntry[],
  metas: Array<PluginMeta | null>
): MarketplacePluginSummary[] {
  const skillCounts = countSkillsByPlugin(skills);

  return PLUGINS.map((plugin, index) => {
    const upstreamMeta = metas[index] ?? null;
    // Prefer the version pinned in catalog.json so the homepage, marketplace.json,
    // and per-plugin bundle URLs share a single source of truth and cannot drift
    // even if the upstream GitHub release tag or plugin.json lags behind.
    const resolvedVersion = plugin.version ?? upstreamMeta?.version;
    const meta: PluginMeta | null = upstreamMeta
      ? { ...upstreamMeta, version: resolvedVersion ?? upstreamMeta.version }
      : resolvedVersion
        ? {
            name: plugin.pluginName,
            version: resolvedVersion,
            description: plugin.siteDescription,
          }
        : null;

    return {
      plugin,
      installCommand: getPluginInstallCommand(plugin),
      repoUrl: getPluginRepoUrl(plugin),
      meta,
      skillCount: skillCounts.get(plugin.repo) ?? 0,
      bundleUrl: buildPluginBundleUrl(plugin, resolvedVersion),
    };
  });
}

/**
 * Loads the complete data model for the marketplace landing page.
 *
 * @returns Aggregated page data for the home route.
 */
export async function getMarketplacePageData(): Promise<MarketplacePageData> {
  const metas = await Promise.all(PLUGINS.map(getPluginMeta));
  const pluginMetaMap = new Map(
    PLUGINS.map((plugin, index) => [`${plugin.owner}/${plugin.repo}`, metas[index] ?? null])
  );
  const allSkills = await getAllSkills(pluginMetaMap);

  return {
    allSkills: preferDistinctSkills(allSkills),
    pluginSummaries: buildMarketplacePluginSummaries(allSkills, metas),
  };
}
