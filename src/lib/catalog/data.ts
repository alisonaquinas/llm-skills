/**
 * Runtime catalog data loader.
 *
 * Responsibilities:
 * - import the checked-in catalog.json file once
 * - cast the imported JSON into the shared catalog contract
 * - provide a single source of configuration truth for the app layer
 */
import catalogData from "../../../catalog.json";
import type { CatalogFile } from "./types";

/** Parsed catalog configuration loaded from the repository root. */
export const CATALOG = catalogData as CatalogFile;
