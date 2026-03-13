/**
 * Root barrel for the application business-logic layer.
 *
 * Responsibilities:
 * - provide a small import surface for callers that need multiple domain modules
 * - re-export module boundaries without introducing new behavior
 */
export * from "./catalog";
export * from "./commands";
export * from "./github";
export * from "./marketplace";
export * from "./routes";
export * from "./seo";
export * from "./skills";
