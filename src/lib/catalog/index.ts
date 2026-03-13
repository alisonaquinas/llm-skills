/**
 * Barrel exports for the catalog namespace.
 *
 * Responsibilities:
 * - expose catalog data, contracts, and helpers through one import surface
 * - keep callers from reaching into individual module files unnecessarily
 */
export type {
  CatalogFile,
  FeedSourceConfig,
  MarketplaceConfig,
  MarketplaceOwner,
  PluginConfig,
} from "./types";
export { CATALOG } from "./data";
export {
  FEED_SOURCES,
  MARKETPLACE,
  PLUGINS,
  findPluginByRepo,
  getEnabledFeedSources,
  getPluginRepoUrl,
} from "./service";
