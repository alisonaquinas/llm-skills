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
import { getAllSkills, getPluginMeta } from "@/lib/github";

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

  return PLUGINS.map((plugin, index) => ({
    plugin,
    installCommand: getPluginInstallCommand(plugin),
    repoUrl: getPluginRepoUrl(plugin),
    meta: metas[index] ?? null,
    skillCount: skillCounts.get(plugin.repo) ?? 0,
  }));
}

/**
 * Loads the complete data model for the marketplace landing page.
 *
 * @returns Aggregated page data for the home route.
 */
export async function getMarketplacePageData(): Promise<MarketplacePageData> {
  const [allSkills, metas] = await Promise.all([
    getAllSkills(),
    Promise.all(PLUGINS.map(getPluginMeta)),
  ]);

  return {
    allSkills,
    pluginSummaries: buildMarketplacePluginSummaries(allSkills, metas),
  };
}
