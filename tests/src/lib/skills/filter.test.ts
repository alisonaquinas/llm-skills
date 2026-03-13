/**
 * Unit tests for client-side skill filtering helpers.
 *
 * Responsibilities:
 * - verify search haystack normalization
 * - verify combined query and repo filter behavior
 * - verify display label resolution for active repo filters
 */
import { describe, expect, it } from "vitest";
import type { PluginConfig } from "@/lib/catalog";
import type { SkillEntry } from "@/lib/github";
import { buildSkillSearchHaystack, filterSkills, getRepoFilterLabel } from "@/lib/skills";

/** Shared plugin fixture for the shared-skills repo. */
const sharedRepo: PluginConfig = {
  pluginName: "shared-skills",
  owner: "alisonaquinas",
  repo: "llm-shared-skills",
  label: "Shared Skills",
  category: "shared-skills",
  color: "bg-blue-100 text-blue-800",
  siteDescription: "Shared",
};

/** Shared plugin fixture for the CI/CD repo. */
const ciRepo: PluginConfig = {
  pluginName: "ci-cd",
  owner: "alisonaquinas",
  repo: "llm-ci-dev",
  label: "CI/CD Skills",
  category: "ci-cd",
  color: "bg-emerald-100 text-emerald-800",
  siteDescription: "CI",
};

/** Stable skill fixtures used by the filter helper tests. */
const skills: SkillEntry[] = [
  { name: "bash", path: "skills/bash", repo: sharedRepo },
  { name: "github-ci", path: "skills/github-ci", repo: ciRepo },
];

describe("buildSkillSearchHaystack", () => {
  /** Ensures repo label and plugin metadata are included in the searchable text. */
  it("includes skill and repo metadata", () => {
    expect(buildSkillSearchHaystack(skills[0]!)).toContain("shared skills");
    expect(buildSkillSearchHaystack(skills[1]!)).toContain("ci-cd");
  });
});

describe("filterSkills", () => {
  /** Ensures the helper applies both query matching and repo scoping. */
  it("filters by query and repo", () => {
    expect(filterSkills(skills, { query: "github", repoFilter: "all" })).toHaveLength(1);
    expect(filterSkills(skills, { query: "", repoFilter: "llm-shared-skills" })).toHaveLength(1);
  });
});

describe("getRepoFilterLabel", () => {
  /** Ensures the all-repos case stays unlabeled while specific repos use their UI label. */
  it("returns null for all and the matching label otherwise", () => {
    expect(getRepoFilterLabel([sharedRepo, ciRepo], "all")).toBeNull();
    expect(getRepoFilterLabel([sharedRepo, ciRepo], "llm-ci-dev")).toBe("CI/CD Skills");
  });
});
