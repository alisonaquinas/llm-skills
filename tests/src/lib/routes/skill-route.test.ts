/**
 * Unit tests for skill route parsing helpers.
 *
 * Responsibilities:
 * - verify invalid slug rejection
 * - verify owner, repo, and nested skill parsing
 * - verify reverse route generation for static params
 */
import { describe, expect, it } from "vitest";
import type { SkillEntry } from "@/lib/github";
import { createSkillRouteParams, parseSkillRoute } from "@/lib/routes";

describe("parseSkillRoute", () => {
  /** Ensures incomplete catch-all routes are rejected. */
  it("returns null for incomplete slugs", () => {
    expect(parseSkillRoute(["only", "two"])).toBeNull();
  });

  /** Ensures flat skill names are parsed into their expected route components. */
  it("extracts owner, repo, and skill name", () => {
    expect(parseSkillRoute(["alisonaquinas", "llm-shared-skills", "bash"]))
      .toEqual({ owner: "alisonaquinas", repo: "llm-shared-skills", skillName: "bash" });
  });

  /** Ensures nested skill paths are preserved when parsed from route segments. */
  it("preserves nested skill names", () => {
    expect(parseSkillRoute(["alisonaquinas", "llm-shared-skills", "docs", "codex"]))
      .toEqual({ owner: "alisonaquinas", repo: "llm-shared-skills", skillName: "docs/codex" });
  });
});

describe("createSkillRouteParams", () => {
  /** Ensures nested skill names are expanded back into individual slug segments. */
  it("splits nested skill names into slug parts", () => {
    const skill = {
      name: "docs/codex",
      path: "skills/docs/codex",
      downloadUrl: null,
      repo: {
        pluginName: "shared-skills",
        owner: "alisonaquinas",
        repo: "llm-shared-skills",
        label: "Shared Skills",
        category: "shared-skills",
        color: "bg-blue-100 text-blue-800",
        siteDescription: "Shared",
      },
    } as SkillEntry;

    expect(createSkillRouteParams(skill)).toEqual({
      slug: ["alisonaquinas", "llm-shared-skills", "docs", "codex"],
    });
  });
});
