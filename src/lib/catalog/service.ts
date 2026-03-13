/**
 * Catalog query helpers and normalized exported configuration.
 *
 * Responsibilities:
 * - expose ready-to-use marketplace, plugin, and feed source collections
 * - provide narrow lookup helpers for common catalog queries
 * - keep config access consistent across UI, data, and script layers
 */
import { CATALOG } from "./data";
import type { FeedSourceConfig, MarketplaceConfig, PluginConfig } from "./types";

/** Top-level marketplace metadata for UI and artifact generation. */
export const MARKETPLACE: MarketplaceConfig = CATALOG.marketplace;
/** Configured installable plugin repositories. */
export const PLUGINS: PluginConfig[] = CATALOG.plugins;
/** Enabled repositories that should contribute entries to the combined RSS feed. */
export const FEED_SOURCES: FeedSourceConfig[] = (CATALOG.feedSources ?? []).filter(
  (source) => source.enabled !== false
);

/**
 * Returns the enabled feed sources from the normalized catalog.
 *
 * @returns Feed source definitions participating in RSS generation.
 */
export function getEnabledFeedSources(): FeedSourceConfig[] {
  return FEED_SOURCES;
}

/**
 * Finds a plugin configuration by owner and repository name.
 *
 * @param owner GitHub owner to match.
 * @param repo GitHub repository name to match.
 * @returns The matching plugin configuration when one exists.
 */
export function findPluginByRepo(
  owner: string,
  repo: string
): PluginConfig | undefined {
  return PLUGINS.find((plugin) => plugin.owner === owner && plugin.repo === repo);
}

/**
 * Builds the canonical GitHub URL for a plugin repository.
 *
 * @param plugin Plugin configuration to convert into a URL.
 * @returns The repository URL on github.com.
 */
export function getPluginRepoUrl(plugin: PluginConfig): string {
  return `https://github.com/${plugin.owner}/${plugin.repo}`;
}
