/**
 * Unit tests for Codex marketplace JSON generation helpers.
 *
 * Responsibilities:
 * - verify catalog configuration is transformed into the Codex marketplace schema
 * - verify generated Codex documents satisfy repository validation rules
 */
import { describe, expect, it } from "vitest";
import type { CatalogFile } from "@/lib/catalog";
import { buildCodexMarketplaceDocument } from "../../../scripts/lib/codex-marketplace";
import { validateCodexMarketplaceDocument } from "../../../scripts/lib/codex-marketplace-validation";

/** Stable catalog fixture used for Codex marketplace document tests. */
const catalog: CatalogFile = {
  marketplace: {
    name: "llm-skills",
    title: "Alison's LLM Skills Marketplace",
    description: "Browse plugins",
    version: "1.0.0",
    owner: { name: "Alison Aquinas" },
    githubRepo: "alisonaquinas/llm-skills",
    githubUrl: "https://github.com/alisonaquinas/llm-skills",
    siteUrl: "https://llm-skills.alisonaquinas.com",
    marketplaceJsonUrl: "https://llm-skills.alisonaquinas.com/marketplace.json",
  },
  plugins: [
    {
      pluginName: "shared-skills",
      owner: "alisonaquinas",
      repo: "llm-shared-skills",
      label: "Shared Skills",
      category: "shared-skills",
      color: "bg-blue-100 text-blue-800",
      ref: "v1.7.7",
      siteDescription: "Shared skills",
    },
  ],
};

describe("buildCodexMarketplaceDocument", () => {
  /** Ensures Codex marketplace entries use Git-backed root plugin sources. */
  it("maps catalog configuration into Codex marketplace JSON", () => {
    const document = buildCodexMarketplaceDocument(catalog);

    expect(document.name).toBe("llm-skills");
    expect(document.interface.displayName).toBe("Alison's LLM Skills Marketplace");
    expect(document.plugins[0]).toMatchObject({
      name: "shared-skills",
      source: {
        source: "url",
        url: "https://github.com/alisonaquinas/llm-shared-skills.git",
        ref: "v1.7.7",
      },
      policy: {
        installation: "AVAILABLE",
        authentication: "ON_INSTALL",
      },
      category: "shared-skills",
    });
  });

  it("passes Codex marketplace validation", () => {
    const document = buildCodexMarketplaceDocument(catalog);

    expect(() => validateCodexMarketplaceDocument(document, "marketplace.json")).not.toThrow();
  });
});
