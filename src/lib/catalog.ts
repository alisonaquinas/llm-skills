import catalogData from "../../catalog.json";

export interface MarketplaceOwner {
  name: string;
  email?: string;
}

export interface MarketplaceConfig {
  name: string;
  title: string;
  description: string;
  version: string;
  owner: MarketplaceOwner;
  githubRepo: string;
  githubUrl: string;
  siteUrl: string;
  marketplaceJsonUrl: string;
}

export interface PluginConfig {
  pluginName: string;
  owner: string;
  repo: string;
  label: string;
  category: string;
  color: string;
  ref?: string;
  siteDescription: string;
}

export interface FeedSourceConfig {
  owner: string;
  repo: string;
  label: string;
  ref?: string;
  enabled?: boolean;
}

interface CatalogFile {
  marketplace: MarketplaceConfig;
  feedSources?: FeedSourceConfig[];
  plugins: PluginConfig[];
}

const catalog = catalogData as CatalogFile;

export const MARKETPLACE = catalog.marketplace;
export const FEED_SOURCES = (catalog.feedSources ?? []).filter(
  (source) => source.enabled !== false
);
export const PLUGINS = catalog.plugins;

export function getPluginInstallRef(plugin: PluginConfig): string {
  return `${plugin.pluginName}@${MARKETPLACE.name}`;
}

export function getMarketplaceAddCommand(): string {
  return `/plugin marketplace add ${MARKETPLACE.githubRepo}`;
}

export function getMarketplaceUrlAddCommand(): string {
  return `/plugin marketplace add ${MARKETPLACE.marketplaceJsonUrl}`;
}

export function getPluginRepoUrl(plugin: PluginConfig): string {
  return `https://github.com/${plugin.owner}/${plugin.repo}`;
}
