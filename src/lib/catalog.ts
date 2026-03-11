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

interface CatalogFile {
  marketplace: MarketplaceConfig;
  plugins: PluginConfig[];
}

const catalog = catalogData as CatalogFile;

export const MARKETPLACE = catalog.marketplace;
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
