#!/usr/bin/env node

/**
 * CLI entrypoint for validating a generated marketplace.json file.
 *
 * Responsibilities:
 * - read a generated marketplace document from disk
 * - invoke shared validation rules
 * - return a non-zero exit code when the document is invalid
 */
import { readFile } from "node:fs/promises";
import type { MarketplaceDocument } from "./lib/marketplace";
import { validateMarketplaceDocument } from "./lib/marketplace-validation";

/** Default marketplace document path used when no CLI argument is supplied. */
const filePath = process.argv[2] ?? ".claude-plugin/marketplace.json";

/**
 * Runs marketplace document validation for the requested file path.
 */
async function main(): Promise<void> {
  const raw = await readFile(filePath, "utf-8");
  const doc = JSON.parse(raw) as MarketplaceDocument;
  validateMarketplaceDocument(doc, filePath);
  console.log(`OK ${filePath}: ${doc.plugins.length} plugins, all valid`);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
