/**
 * Shared catalog type definitions for marketplace configuration.
 *
 * Responsibilities:
 * - define the serialized structure of catalog.json
 * - provide stable contracts for UI, business logic, and script tooling
 * - serve as the low-coupling boundary between config data and consumers
 */

/** Identifies the person or team that publishes the marketplace. */
export interface MarketplaceOwner {
  /** Display name shown in marketplace metadata. */
  name: string;
  /** Optional contact email for the marketplace owner. */
  email?: string;
}

/** Captures top-level marketplace metadata shared by the site and generated artifacts. */
export interface MarketplaceConfig {
  /** Internal marketplace identifier used by plugin installation references. */
  name: string;
  /** Human-readable marketplace title displayed in the UI and RSS channel. */
  title: string;
  /** Summary description for metadata and published documents. */
  description: string;
  /** Current marketplace version carried into generated artifacts. */
  version: string;
  /** Publishing owner information for generated marketplace metadata. */
  owner: MarketplaceOwner;
  /** Canonical GitHub repo identifier in owner/repo form. */
  githubRepo: string;
  /** Canonical GitHub repository URL. */
  githubUrl: string;
  /** Public GitHub Pages base URL for the marketplace site. */
  siteUrl: string;
  /** Public URL for the generated marketplace JSON document. */
  marketplaceJsonUrl: string;
}

/** Defines an installable plugin repository listed by the marketplace site. */
export interface PluginConfig {
  /** Plugin name used in installation and invocation commands. */
  pluginName: string;
  /** GitHub owner for the upstream plugin repository. */
  owner: string;
  /** GitHub repository name for the upstream plugin repository. */
  repo: string;
  /** UI label displayed in badges and filter controls. */
  label: string;
  /** Category label emitted into marketplace JSON. */
  category: string;
  /** Tailwind class list used for plugin badge styling. */
  color: string;
  /** Optional emoji icon displayed on the plugin card. */
  icon?: string;
  /** Optional git ref to use when generating artifacts from source. */
  ref?: string;
  /** Optional repository-relative root that contains published skill directories. */
  skillsRoot?: string;
  /** Marketplace-facing description used when richer metadata is unavailable. */
  siteDescription: string;
}

/** Defines a repository that contributes release notes to the combined RSS feed. */
export interface FeedSourceConfig {
  /** GitHub owner for the source repository. */
  owner: string;
  /** GitHub repository name for the source repository. */
  repo: string;
  /** Human-readable label used in feed item titles. */
  label: string;
  /** Optional git ref used when fetching changelog contents. */
  ref?: string;
  /** Whether the source should be included when generating the feed. */
  enabled?: boolean;
}

/** Top-level shape of the catalog.json configuration file. */
export interface CatalogFile {
  /** Marketplace metadata shared by the app and generated artifacts. */
  marketplace: MarketplaceConfig;
  /** Optional list of repositories included in the combined RSS feed. */
  feedSources?: FeedSourceConfig[];
  /** List of installable plugins rendered in the marketplace UI. */
  plugins: PluginConfig[];
}
