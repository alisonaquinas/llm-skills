#!/usr/bin/env node

/**
 * CLI entrypoint for generating the combined marketplace RSS feed.
 *
 * Responsibilities:
 * - expose RSS helpers for unit tests and other tooling
 * - generate a static RSS document from configured feed sources
 * - run as a standalone script during build and deploy workflows
 */
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { loadCatalog } from "./lib/catalog";
import { buildRssDocument, collectReleaseItems, writeTextOutput } from "./lib/rss";

/** Default RSS output path used during local build and deployment. */
const DEFAULT_OUTPUTS = ["out/rss.xml"];

export {
  buildRssDocument,
  collectReleaseItems,
  compareReleases,
  getEnabledFeedSources,
  parseChangelogReleases,
  parseReferenceLinks,
  renderReleaseHtml,
  resolveReleaseLink,
} from "./lib/rss";

/**
 * Generates the combined RSS feed and writes it to each requested output path.
 *
 * @param outputPaths Optional list of destination paths.
 */
export async function generateRssFeed(outputPaths: string[] = DEFAULT_OUTPUTS): Promise<void> {
  const catalog = await loadCatalog();
  const items = await collectReleaseItems(catalog);
  const document = buildRssDocument(items, catalog.marketplace);
  await Promise.all(outputPaths.map((outPath) => writeTextOutput(outPath, document)));
}

/**
 * Runs the CLI workflow for RSS generation.
 */
async function main(): Promise<void> {
  const outputPaths = process.argv.slice(2);
  await generateRssFeed(outputPaths.length > 0 ? outputPaths : DEFAULT_OUTPUTS);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(message);
    process.exit(1);
  });
}
