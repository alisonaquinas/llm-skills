#!/usr/bin/env node

/**
 * CLI entrypoint for generating marketplace.json from catalog configuration.
 *
 * Responsibilities:
 * - resolve output paths from CLI arguments
 * - load repository catalog configuration
 * - build and write the published marketplace document
 */
import { buildMarketplaceDocument, writeMarketplaceFile } from "./lib/marketplace";
import { loadCatalog } from "./lib/catalog";

/** Default marketplace JSON outputs when no CLI paths are provided. */
const DEFAULT_OUTPUTS = [".claude-plugin/marketplace.json"];

/**
 * Runs marketplace document generation for the requested output paths.
 */
async function main(): Promise<void> {
  const outputs = process.argv.slice(2);
  const outPaths = outputs.length > 0 ? outputs : DEFAULT_OUTPUTS;
  const catalog = await loadCatalog();
  const marketplaceDoc = buildMarketplaceDocument(catalog);
  await Promise.all(outPaths.map((outPath) => writeMarketplaceFile(outPath, marketplaceDoc)));
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
