/**
 * Unit tests for marketplace JSON generation helpers.
 *
 * Responsibilities:
 * - verify catalog configuration is transformed into the published marketplace schema
 */
import { describe, expect, it } from "vitest";
import type { CatalogFile } from "@/lib/catalog";
import { buildMarketplaceDocument } from "../../../scripts/lib/marketplace";

/** Stable catalog fixture used for marketplace document tests. */
const catalog: CatalogFile = {
  marketplace: {
    name: "llm-skills",
    title: "Alison's LLM Plugins",
    description: "Browse plugins",
    version: "1.0.0",
    owner: { name: "Alison Aquinas" },
    githubRepo: "alisonaquinas/llm-skills",
    githubUrl: "https://github.com/alisonaquinas/llm-skills",
    siteUrl: "https://alisonaquinas.github.io/llm-skills",
    marketplaceJsonUrl: "https://alisonaquinas.github.io/llm-skills/marketplace.json",
  },
  plugins: [
    {
      pluginName: "shared-skills",
      owner: "alisonaquinas",
      repo: "llm-shared-skills",
      label: "Shared Skills",
      category: "shared-skills",
      color: "bg-blue-100 text-blue-800",
      ref: "main",
      siteDescription: "Shared skills",
    },
    {
      pluginName: "software-design",
      owner: "alisonaquinas",
      repo: "llm-software-design",
      label: "Software Design Skills",
      category: "software-design",
      color: "bg-amber-100 text-amber-800",
      ref: "main",
      siteDescription: "Software design skills",
    },
  ],
};

describe("buildMarketplaceDocument", () => {
  /** Ensures published marketplace fields are derived from catalog.json consistently. */
  it("maps catalog configuration into marketplace JSON", () => {
    const document = buildMarketplaceDocument(catalog);
    expect(document.name).toBe("llm-skills");
    expect(document.plugins[0]?.source.repo).toBe("alisonaquinas/llm-shared-skills");
    expect(document.plugins[1]?.source.repo).toBe("alisonaquinas/llm-software-design");
    expect(document.plugins[0]?.strict).toBe(true);
    expect(document.plugins[1]?.strict).toBe(true);
  });
});
