/**
 * Codex marketplace JSON generation helpers.
 *
 * Responsibilities:
 * - map catalog plugin entries into the Codex marketplace schema
 * - persist repo-scoped and published Codex marketplace documents
 * - keep Codex marketplace behavior separate from the Claude marketplace schema
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { CatalogFile, PluginConfig } from "@/lib/catalog";

/** Installation and authentication policy for a Codex marketplace plugin entry. */
export interface CodexMarketplacePolicy {
  /** Whether the plugin can be installed from the marketplace. */
  installation: "AVAILABLE" | "INSTALLED_BY_DEFAULT" | "NOT_AVAILABLE";
  /** When authentication should be requested for the plugin. */
  authentication: "ON_INSTALL" | "ON_FIRST_USE";
}

/** Codex marketplace plugin record emitted into marketplace.json. */
export interface CodexMarketplacePluginDocument {
  /** Plugin identifier shown in the Codex plugin directory. */
  name: string;
  /** Git-backed plugin source loaded by Codex. */
  source: {
    /** Source kind for a plugin that lives at the root of a Git repository. */
    source: "url";
    /** Git URL for the plugin repository. */
    url: string;
    /** Optional git ref pinned by catalog.json. */
    ref?: string;
  };
  /** Install policy required by Codex marketplace entries. */
  policy: CodexMarketplacePolicy;
  /** Codex marketplace category. */
  category: string;
}

/** Codex marketplace document emitted by the generation script. */
export interface CodexMarketplaceDocument {
  /** Marketplace identifier. */
  name: string;
  /** Marketplace interface metadata rendered by Codex. */
  interface: {
    /** Human-readable marketplace title. */
    displayName: string;
  };
  /** Installable Codex plugin entries. */
  plugins: CodexMarketplacePluginDocument[];
}

/**
 * Builds the Codex marketplace record for a single configured plugin.
 *
 * @param plugin Plugin configuration from catalog.json.
 * @returns A Codex marketplace plugin entry.
 */
function buildCodexMarketplacePluginDocument(plugin: PluginConfig): CodexMarketplacePluginDocument {
  return {
    name: plugin.pluginName,
    source: {
      source: "url",
      url: `https://github.com/${plugin.owner}/${plugin.repo}.git`,
      ...(plugin.ref ? { ref: plugin.ref } : {}),
    },
    policy: {
      installation: "AVAILABLE",
      authentication: "ON_INSTALL",
    },
    category: plugin.category,
  };
}

/**
 * Builds the full Codex marketplace document from catalog configuration.
 *
 * @param catalog Parsed repository catalog.
 * @returns The complete Codex marketplace document to serialize.
 */
export function buildCodexMarketplaceDocument(catalog: CatalogFile): CodexMarketplaceDocument {
  const { marketplace, plugins } = catalog;

  return {
    name: marketplace.name,
    interface: {
      displayName: marketplace.title,
    },
    plugins: plugins.map(buildCodexMarketplacePluginDocument),
  };
}

/**
 * Writes a Codex marketplace document to disk.
 *
 * @param outPath Destination path for the generated file.
 * @param doc Codex marketplace document to serialize.
 */
export async function writeCodexMarketplaceFile(
  outPath: string,
  doc: CodexMarketplaceDocument
): Promise<void> {
  const resolved = resolve(outPath);
  await mkdir(dirname(resolved), { recursive: true });
  await writeFile(resolved, JSON.stringify(doc, null, 2) + "\n");
  console.log(`Wrote ${doc.plugins.length} Codex plugins to ${outPath}`);
}
