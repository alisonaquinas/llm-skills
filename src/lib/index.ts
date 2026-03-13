/**
 * Barrel exports for the shared lib namespace.
 *
 * Responsibilities:
 * - centralize the public lib surface used by app and component layers
 * - keep import paths short for common library entrypoints
 */
export * from "./catalog";
export * from "./commands";
export * from "./github";
export * from "./marketplace";
export * from "./routes";
export * from "./seo";
export * from "./skills";
export * from "./theme";
