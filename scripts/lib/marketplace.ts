/**
 * Marketplace JSON generation helpers.
 *
 * Responsibilities:
 * - map repository catalog configuration into the published marketplace schema
 * - persist the generated document to one or more output paths
 * - keep generation behavior deterministic and testable outside the CLI wrapper
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { CatalogFile, MarketplaceOwner, PluginConfig } from "@/lib/catalog";

/** Published marketplace plugin record emitted into marketplace.json. */
export interface MarketplacePluginDocument {
  /** Plugin identifier used by consumers of the marketplace document. */
  name: string;
  /** Source definition for the plugin package. */
  source: {
    /** Marketplace source kind. */
    source: "github";
    /** GitHub repository in owner/repo form. */
    repo: string;
    /** Optional ref to install from. */
    ref?: string;
  };
  /** Human-readable plugin description. */
  description: string;
  /** Canonical repository URL for the plugin. */
  repository: string;
  /** Marketplace category for grouping or filtering. */
  category: string;
  /** Hard-coded strict mode flag required by the published schema. */
  strict: true;
}

/** Published marketplace document emitted by the generation script. */
export interface MarketplaceDocument {
  /** Marketplace identifier. */
  name: string;
  /** Owner metadata copied from the repository catalog. */
  owner: MarketplaceOwner;
  /** Document-level metadata for description and versioning. */
  metadata: {
    /** Marketplace description. */
    description: string;
    /** Marketplace version string. */
    version: string;
  };
  /** Installable plugin entries published by the marketplace. */
  plugins: MarketplacePluginDocument[];
}

/**
 * Builds the published marketplace record for a single plugin.
 *
 * @param plugin Plugin configuration from catalog.json.
 * @returns A marketplace.json plugin entry.
 */
function buildMarketplacePluginDocument(plugin: PluginConfig): MarketplacePluginDocument {
  const repoRef = `${plugin.owner}/${plugin.repo}`;

  return {
    name: plugin.pluginName,
    source: {
      source: "github",
      repo: repoRef,
      ...(plugin.ref ? { ref: plugin.ref } : {}),
    },
    description: plugin.siteDescription,
    repository: `https://github.com/${repoRef}`,
    category: plugin.category,
    strict: true,
  };
}

/**
 * Builds the full published marketplace document from catalog configuration.
 *
 * @param catalog Parsed repository catalog.
 * @returns The complete marketplace document to serialize.
 */
export function buildMarketplaceDocument(catalog: CatalogFile): MarketplaceDocument {
  const { marketplace, plugins } = catalog;

  return {
    name: marketplace.name,
    owner: marketplace.owner,
    metadata: {
      description: marketplace.description,
      version: marketplace.version,
    },
    plugins: plugins.map(buildMarketplacePluginDocument),
  };
}

/**
 * Writes a marketplace document to disk.
 *
 * @param outPath Destination path for the generated file.
 * @param doc Marketplace document to serialize.
 */
export async function writeMarketplaceFile(
  outPath: string,
  doc: MarketplaceDocument
): Promise<void> {
  const resolved = resolve(outPath);
  await mkdir(dirname(resolved), { recursive: true });
  await writeFile(resolved, JSON.stringify(doc, null, 2) + "\n");
  console.log(`Wrote ${doc.plugins.length} plugins to ${outPath}`);
}
