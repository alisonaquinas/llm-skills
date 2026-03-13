/**
 * Script-side catalog loader used by generation entrypoints.
 *
 * Responsibilities:
 * - read the repository catalog from disk for non-Next script execution
 * - provide a typed catalog object to marketplace and RSS generators
 */
import { readFile } from "node:fs/promises";
import type { CatalogFile } from "@/lib/catalog";

/**
 * Reads and parses the repository catalog configuration.
 *
 * @returns The typed catalog file used by generation scripts.
 */
export async function loadCatalog(): Promise<CatalogFile> {
  return JSON.parse(
    await readFile(new URL("../../catalog.json", import.meta.url), "utf-8")
  ) as CatalogFile;
}
