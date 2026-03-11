#!/usr/bin/env node
// Generates marketplace.json files from catalog.json.
// Usage: node scripts/generate-marketplace-json.mjs [output-path ...]

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const defaultOutputs = [".claude-plugin/marketplace.json"];

const catalog = JSON.parse(
  await readFile(new URL("../catalog.json", import.meta.url), "utf-8")
);

const { marketplace, plugins: configuredPlugins } = catalog;

function buildMarketplaceDocument() {
  const plugins = configuredPlugins.map((plugin) => {
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

async function writeMarketplaceFile(outPath, doc) {
  const resolved = resolve(outPath);
  await mkdir(dirname(resolved), { recursive: true });
  await writeFile(resolved, JSON.stringify(doc, null, 2) + "\n");
  console.log(`Wrote ${doc.plugins.length} plugins to ${outPath}`);
}

async function main() {
  const outputs = process.argv.slice(2);
  const outPaths = outputs.length > 0 ? outputs : defaultOutputs;
  const marketplaceDoc = buildMarketplaceDocument();
  await Promise.all(outPaths.map((outPath) => writeMarketplaceFile(outPath, marketplaceDoc)));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
