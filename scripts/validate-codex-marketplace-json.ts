#!/usr/bin/env node

/**
 * CLI entrypoint for validating a generated Codex marketplace.json file.
 *
 * Responsibilities:
 * - read a generated Codex marketplace document from disk
 * - invoke shared Codex validation rules
 * - return a non-zero exit code when the document is invalid
 */
import { readFile } from "node:fs/promises";
import type { CodexMarketplaceDocument } from "./lib/codex-marketplace";
import { validateCodexMarketplaceDocument } from "./lib/codex-marketplace-validation";

/** Default Codex marketplace document path used when no CLI argument is supplied. */
const filePath = process.argv[2] ?? ".agents/plugins/marketplace.json";

/**
 * Runs Codex marketplace document validation for the requested file path.
 */
async function main(): Promise<void> {
  const raw = await readFile(filePath, "utf-8");
  const doc = JSON.parse(raw) as CodexMarketplaceDocument;
  validateCodexMarketplaceDocument(doc, filePath);
  console.log(`OK ${filePath}: ${doc.plugins.length} Codex plugins, all valid`);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
