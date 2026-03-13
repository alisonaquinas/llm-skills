/**
 * Unit tests for RSS parsing and rendering helpers.
 *
 * Responsibilities:
 * - verify changelog parsing and reference-link extraction
 * - verify description rendering and release-link fallback behavior
 * - verify deterministic sorting and final RSS document generation
 */
import { describe, expect, it } from "vitest";
import type { FeedSourceConfig, MarketplaceConfig } from "@/lib/catalog";
import {
  buildRssDocument,
  compareReleases,
  parseChangelogReleases,
  parseReferenceLinks,
  renderReleaseHtml,
  resolveReleaseLink,
} from "../../../scripts/lib/rss";

/** Feed source fixture representing the marketplace repository. */
const source: FeedSourceConfig = {
  owner: "alisonaquinas",
  repo: "llm-skills",
  label: "Marketplace",
  ref: "main",
};

/** Marketplace metadata fixture used when rendering the RSS channel. */
const market: MarketplaceConfig = {
  name: "llm-skills",
  title: "Alison's LLM Plugins",
  description: "Browse",
  version: "1.0.0",
  owner: { name: "Alison Aquinas" },
  githubRepo: "alisonaquinas/llm-skills",
  githubUrl: "https://github.com/alisonaquinas/llm-skills",
  siteUrl: "https://alisonaquinas.github.io/llm-skills",
  marketplaceJsonUrl: "https://alisonaquinas.github.io/llm-skills/marketplace.json",
};

/** Representative changelog fixture covering releases, headings, and reference links. */
const markdown = `## [Unreleased]\n\n## [1.0.0] - 2026-03-11\n\n### Added\n- Feature\n\n[1.0.0]: https://example.com/release`;

describe("parseChangelogReleases", () => {
  /** Ensures unreleased content is skipped and dated releases are captured. */
  it("ignores Unreleased and parses dated releases", () => {
    expect(parseChangelogReleases(markdown)).toEqual([
      { version: "1.0.0", date: "2026-03-11", bodyLines: ["", "### Added", "- Feature", "", "[1.0.0]: https://example.com/release"] },
    ]);
  });
});

describe("parseReferenceLinks", () => {
  /** Ensures changelog reference definitions are collected by version key. */
  it("extracts version reference links", () => {
    expect(parseReferenceLinks(markdown).get("1.0.0")).toBe("https://example.com/release");
  });
});

describe("renderReleaseHtml", () => {
  /** Ensures changelog headings and body content are converted into HTML fragments. */
  it("renders headings and preformatted content", () => {
    const html = renderReleaseHtml(["### Added", "- Feature"]);
    expect(html).toContain("<h3>Added</h3>");
    expect(html).toContain("<pre>- Feature</pre>");
  });
});

describe("resolveReleaseLink", () => {
  /** Ensures reference links win over the GitHub release fallback. */
  it("prefers changelog references over fallback URLs", () => {
    const refs = new Map([["1.0.0", "https://example.com/release"]]);
    expect(resolveReleaseLink(source, "1.0.0", refs)).toBe("https://example.com/release");
  });
});

describe("compareReleases", () => {
  /** Ensures newer releases sort before older ones. */
  it("sorts newer dates first", () => {
    expect(compareReleases(
      { source, version: "1.0.0", date: "2026-03-10", title: "A", descriptionHtml: "", link: "a", guid: "a" },
      { source, version: "1.0.1", date: "2026-03-11", title: "B", descriptionHtml: "", link: "b", guid: "b" }
    )).toBeGreaterThan(0);
  });
});

describe("buildRssDocument", () => {
  /** Ensures the final XML document includes the expected RSS shell and item title. */
  it("emits a valid RSS shell", () => {
    const rss = buildRssDocument([
      {
        source,
        version: "1.0.0",
        date: "2026-03-11",
        title: "Marketplace v1.0.0",
        descriptionHtml: "<p>Test</p>",
        link: "https://example.com/release",
        guid: "alisonaquinas/llm-skills@1.0.0",
      },
    ], market);

    expect(rss).toContain("<rss version=\"2.0\"");
    expect(rss).toContain("Marketplace v1.0.0");
  });
});


