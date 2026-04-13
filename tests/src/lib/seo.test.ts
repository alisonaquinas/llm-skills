/**
 * Unit tests for shared SEO helpers.
 *
 * Responsibilities:
 * - verify canonical URL generation under the configured custom domain
 * - verify deterministic page title and description helpers
 * - verify structured data builders include the expected core fields
 */
import { describe, expect, it } from "vitest";
import {
  buildOrganizationStructuredData,
  buildPublicAssetPath,
  buildSkillDescription,
  buildSkillTitle,
  buildSkillUrl,
  getHomeUrl,
  getRssUrl,
  getSitemapUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";

/** Plugin fixture used to validate route descriptions. */
const plugin = {
  pluginName: "shared-skills",
  owner: "alisonaquinas",
  repo: "llm-shared-skills",
  label: "Shared Skills",
  category: "shared-skills",
  color: "bg-blue-100 text-blue-800",
  siteDescription: "Reusable skills",
};

describe("SEO URL helpers", () => {
  /** Ensures the public site root stays anchored under the configured custom domain. */
  it("builds the home, RSS, sitemap, and asset URLs from the configured site root", () => {
    expect(getHomeUrl()).toBe("https://llm-skills.alisonaquinas.com/");
    expect(getRssUrl()).toBe("https://llm-skills.alisonaquinas.com/rss.xml");
    expect(getSitemapUrl()).toBe("https://llm-skills.alisonaquinas.com/sitemap.xml");
    expect(getSocialPreviewImageUrl()).toBe("https://llm-skills.alisonaquinas.com/marketplace-preview.svg");
    expect(buildPublicAssetPath("alison-bug.svg")).toBe("/alison-bug.svg");
  });

  /** Ensures nested skill names preserve their path shape in canonical URLs. */
  it("builds canonical skill URLs for nested skill paths", () => {
    expect(buildSkillUrl("alisonaquinas", "llm-shared-skills", "docs/codex")).toBe(
      "https://llm-skills.alisonaquinas.com/skill/alisonaquinas/llm-shared-skills/docs/codex/"
    );
  });
});

describe("SEO copy helpers", () => {
  /** Ensures skill titles follow the shared page-title convention. */
  it("builds deterministic skill titles", () => {
    expect(buildSkillTitle("git")).toBe("git | Alison's LLM Skills Marketplace");
  });

  /** Ensures skill descriptions include both the skill and its parent plugin label. */
  it("builds deterministic skill descriptions", () => {
    expect(buildSkillDescription(plugin, "git")).toContain("git skill");
    expect(buildSkillDescription(plugin, "git")).toContain("Shared Skills");
    expect(buildSkillDescription(plugin, "git")).toContain("skill bundle");
  });
});

describe("structured data helpers", () => {
  /** Ensures organization JSON-LD stays anchored to the published site. */
  it("builds organization structured data with a stable identifier", () => {
    const organization = buildOrganizationStructuredData();
    expect(organization["@id"]).toBe("https://llm-skills.alisonaquinas.com/#organization");
    expect(organization.name).toBe("Alison Aquinas");
  });
});

