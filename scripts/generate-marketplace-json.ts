#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

interface MarketplaceOwner {
  name: string;
  email?: string;
}

interface MarketplaceConfig {
  name: string;
  description: string;
  version: string;
  owner: MarketplaceOwner;
}

interface PluginConfig {
  pluginName: string;
  owner: string;
  repo: string;
  category: string;
  ref?: string;
  siteDescription: string;
}

interface CatalogFile {
  marketplace: MarketplaceConfig;
  plugins: PluginConfig[];
}

interface MarketplacePluginDocument {
  name: string;
  source: {
    source: "github";
    repo: string;
    ref?: string;
  };
  description: string;
  repository: string;
  category: string;
  strict: true;
}

interface MarketplaceDocument {
  name: string;
  owner: MarketplaceOwner;
  metadata: {
    description: string;
    version: string;
  };
  plugins: MarketplacePluginDocument[];
}

const DEFAULT_OUTPUTS = [".claude-plugin/marketplace.json"];

async function loadCatalog(): Promise<CatalogFile> {
  return JSON.parse(
    await readFile(new URL("../catalog.json", import.meta.url), "utf-8")
  ) as CatalogFile;
}

function buildMarketplaceDocument(catalog: CatalogFile): MarketplaceDocument {
  const { marketplace, plugins: configuredPlugins } = catalog;
  const plugins = configuredPlugins.map((plugin) => {
    const repoRef = `${plugin.owner}/${plugin.repo}`;

    return {
      name: plugin.pluginName,
      source: {
        source: "github" as const,
        repo: repoRef,
        ...(plugin.ref ? { ref: plugin.ref } : {}),
      },
      description: plugin.siteDescription,
      repository: `https://github.com/${repoRef}`,
      category: plugin.category,
      strict: true as const,
    };
  });

  return {
    name: marketplace.name,
    owner: marketplace.owner,
    metadata: {
      description: marketplace.description,
      version: marketplace.version,
    },
    plugins,
  };
}

async function writeMarketplaceFile(
  outPath: string,
  doc: MarketplaceDocument
): Promise<void> {
  const resolved = resolve(outPath);
  await mkdir(dirname(resolved), { recursive: true });
  await writeFile(resolved, JSON.stringify(doc, null, 2) + "\n");
  console.log(`Wrote ${doc.plugins.length} plugins to ${outPath}`);
}

async function main(): Promise<void> {
  const outputs = process.argv.slice(2);
  const outPaths = outputs.length > 0 ? outputs : DEFAULT_OUTPUTS;
  const catalog = await loadCatalog();
  const marketplaceDoc = buildMarketplaceDocument(catalog);
  await Promise.all(
    outPaths.map((outPath) => writeMarketplaceFile(outPath, marketplaceDoc))
  );
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
