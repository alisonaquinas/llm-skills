/**
 * Unit tests for marketplace page aggregation helpers.
 *
 * Responsibilities:
 * - verify per-plugin skill counting
 * - verify plugin summary models combine metadata and install commands correctly
 */
import { describe, expect, it } from "vitest";
import type { PluginMeta, SkillEntry } from "@/lib/github";
import {
  buildMarketplacePluginSummaries,
  countSkillsByPlugin,
  preferDistinctSkills,
} from "@/lib/marketplace";

/** Stable skill fixtures for marketplace summary tests. */
const skills: SkillEntry[] = [
  {
    name: "bash",
    path: "skills/bash",
    downloadUrl: "https://github.com/alisonaquinas/llm-shared-skills/releases/download/v1.0.0/bash-skill.zip",
    repo: {
      pluginName: "shared-skills",
      owner: "alisonaquinas",
      repo: "llm-shared-skills",
      label: "Shared Skills",
      category: "shared-skills",
      color: "bg-blue-100 text-blue-800",
      siteDescription: "Shared",
    },
  },
  {
    name: "git",
    path: "skills/git",
    downloadUrl: "https://github.com/alisonaquinas/llm-shared-skills/releases/download/v1.0.0/git-skill.zip",
    repo: {
      pluginName: "shared-skills",
      owner: "alisonaquinas",
      repo: "llm-shared-skills",
      label: "Shared Skills",
      category: "shared-skills",
      color: "bg-blue-100 text-blue-800",
      siteDescription: "Shared",
    },
  },
];

describe("countSkillsByPlugin", () => {
  /** Ensures skill counting is grouped by repository key. */
  it("groups counts by repo", () => {
    expect(countSkillsByPlugin(skills).get("llm-shared-skills")).toBe(2);
  });
});

describe("buildMarketplacePluginSummaries", () => {
  /** Ensures summary creation merges skill counts, metadata, and install commands. */
  it("maps skills and plugin metadata into summaries", () => {
    const metas: Array<PluginMeta | null> = [{
      name: "shared-skills",
      version: "1.0.0",
      description: "Shared skills",
    }, null];

    const summaries = buildMarketplacePluginSummaries(skills, metas);
    expect(summaries[0]?.skillCount).toBe(2);
    expect(summaries[0]?.meta?.version).toBe("1.0.0");
    expect(summaries[0]?.installCommand).toContain("/plugin install");
  });
});

describe("preferDistinctSkills", () => {
  /** Ensures duplicate skill names prefer the more specific plugin later in catalog order. */
  it("keeps one preferred entry per skill name", () => {
    const distinct = preferDistinctSkills([
      ...skills,
      {
        name: "aws",
        path: "skills/aws",
        downloadUrl: "https://github.com/alisonaquinas/llm-shared-skills/releases/download/v1.6.3/aws-skill.zip",
        repo: {
          pluginName: "shared-skills",
          owner: "alisonaquinas",
          repo: "llm-shared-skills",
          label: "Shared Skills",
          category: "shared-skills",
          color: "bg-blue-100 text-blue-800",
          siteDescription: "Shared",
        },
      },
      {
        name: "aws",
        path: "skills/aws",
        downloadUrl: "https://github.com/alisonaquinas/llm-ci-dev/releases/download/v1.1.2/aws-skill.zip",
        repo: {
          pluginName: "ci-cd",
          owner: "alisonaquinas",
          repo: "llm-ci-dev",
          label: "CI/CD Skills",
          category: "ci-cd",
          color: "bg-emerald-100 text-emerald-800",
          siteDescription: "CI",
        },
      },
    ]);

    expect(distinct.find((skill) => skill.name === "aws")?.repo.repo).toBe("llm-ci-dev");
    expect(distinct.find((skill) => skill.name === "aws")?.downloadUrl).toContain("llm-ci-dev");
  });
});
