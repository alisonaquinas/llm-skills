#!/usr/bin/env node

/**
 * CLI entrypoint for generating a Codex marketplace.json from catalog configuration.
 *
 * Responsibilities:
 * - resolve output paths from CLI arguments
 * - load repository catalog configuration
 * - build and write the Codex marketplace document
 */
import { buildCodexMarketplaceDocument, writeCodexMarketplaceFile } from "./lib/codex-marketplace";
import { loadCatalog } from "./lib/catalog";

/** Default Codex marketplace JSON output when no CLI paths are provided. */
const DEFAULT_OUTPUTS = [".agents/plugins/marketplace.json"];

/**
 * Runs Codex marketplace document generation for the requested output paths.
 */
async function main(): Promise<void> {
  const outputs = process.argv.slice(2);
  const outPaths = outputs.length > 0 ? outputs : DEFAULT_OUTPUTS;
  const catalog = await loadCatalog();
  const marketplaceDoc = buildCodexMarketplaceDocument(catalog);
  await Promise.all(outPaths.map((outPath) => writeCodexMarketplaceFile(outPath, marketplaceDoc)));
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
