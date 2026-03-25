/**
 * Unit tests for GitHub skill discovery helpers.
 *
 * Responsibilities:
 * - verify skill-root normalization for skills/ and root-layout repositories
 * - verify direct release asset URL construction for per-skill ZIP bundles
 * - verify skill discovery and detail loading attach download URLs consistently
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PluginConfig } from "@/lib/catalog";
import type { GitHubDirectoryItem, PluginMeta } from "@/lib/github";
import {
  buildPluginBundleUrl,
  buildSkillDownloadUrl,
  getSkillDetail,
  listSkills,
  resolvePluginSkillsRoot,
} from "@/lib/github";

const { ghFetchJsonMock, ghFetchTextMock, getPluginMetaMock } = vi.hoisted(() => ({
  ghFetchJsonMock: vi.fn(),
  ghFetchTextMock: vi.fn(),
  getPluginMetaMock: vi.fn(),
}));

vi.mock("@/lib/github/client", () => ({
  ghFetchJson: ghFetchJsonMock,
  ghFetchText: ghFetchTextMock,
}));

vi.mock("@/lib/github/plugin-service", () => ({
  getPluginMeta: getPluginMetaMock,
}));

/** Shared plugin fixture for a standard skills/ layout repository. */
const sharedPlugin: PluginConfig = {
  pluginName: "shared-skills",
  owner: "alisonaquinas",
  repo: "llm-shared-skills",
  label: "Shared Skills",
  category: "shared-skills",
  color: "bg-blue-100 text-blue-800",
  siteDescription: "Shared skills",
};

/** Plugin fixture demonstrating the root-layout feature (skillsRoot: "."). */
const docPlugin: PluginConfig = {
  pluginName: "doc-skills",
  owner: "alisonaquinas",
  repo: "llm-doc-skills",
  label: "Doc Skills",
  category: "doc-skills",
  color: "bg-violet-100 text-violet-800",
  skillsRoot: ".",
  siteDescription: "Doc skills",
};

/** Shared plugin metadata used to construct direct download URLs. */
const pluginMeta: PluginMeta = {
  name: "doc-skills",
  version: "0.1.1",
  description: "Doc skills",
};

beforeEach(() => {
  ghFetchJsonMock.mockReset();
  ghFetchTextMock.mockReset();
  getPluginMetaMock.mockReset();
});

describe("resolvePluginSkillsRoot", () => {
  it("defaults to the skills directory for standard plugin repos", () => {
    expect(resolvePluginSkillsRoot(sharedPlugin)).toBe("skills");
  });

  it("preserves root-layout repositories via an explicit dot", () => {
    expect(resolvePluginSkillsRoot(docPlugin)).toBe(".");
  });
});

describe("buildSkillDownloadUrl", () => {
  it("builds direct GitHub release asset URLs", () => {
    expect(buildSkillDownloadUrl(sharedPlugin, "1.6.3", "bash")).toBe(
      "https://github.com/alisonaquinas/llm-shared-skills/releases/download/v1.6.3/bash-skill.zip"
    );
  });

  it("returns null when the plugin version is unavailable", () => {
    expect(buildSkillDownloadUrl(sharedPlugin, null, "bash")).toBeNull();
  });
});

describe("buildPluginBundleUrl", () => {
  it("builds all-in-one plugin bundle URL using pluginName", () => {
    expect(buildPluginBundleUrl(sharedPlugin, "1.6.3")).toBe(
      "https://github.com/alisonaquinas/llm-shared-skills/releases/download/v1.6.3/shared-skills-plugin.zip"
    );
  });

  it("uses pluginName from doc-skills config", () => {
    expect(buildPluginBundleUrl(docPlugin, "0.1.1")).toBe(
      "https://github.com/alisonaquinas/llm-doc-skills/releases/download/v0.1.1/doc-skills-plugin.zip"
    );
  });

  it("returns null when the plugin version is unavailable", () => {
    expect(buildPluginBundleUrl(sharedPlugin, null)).toBeNull();
  });
});

describe("listSkills", () => {
  it("lists skills from the default skills/ directory and attaches download links", async () => {
    ghFetchJsonMock.mockResolvedValueOnce([
      { name: "bash", path: "skills/bash", type: "dir" },
      { name: "README.md", path: "skills/README.md", type: "file" },
    ] satisfies GitHubDirectoryItem[]);

    const skills = await listSkills(sharedPlugin, {
      name: "shared-skills",
      version: "1.6.3",
      description: "Shared skills",
    });

    expect(ghFetchJsonMock).toHaveBeenCalledWith(
      "/repos/alisonaquinas/llm-shared-skills/contents/skills"
    );
    expect(skills).toEqual([
      {
        name: "bash",
        path: "skills/bash",
        repo: sharedPlugin,
        downloadUrl: "https://github.com/alisonaquinas/llm-shared-skills/releases/download/v1.6.3/bash-skill.zip",
      },
    ]);
  });

  it("discovers only root directories that contain SKILL.md for llm-doc-skills", async () => {
    ghFetchJsonMock
      .mockResolvedValueOnce([
        { name: "markdown", path: "markdown", type: "dir" },
        { name: "scripts", path: "scripts", type: "dir" },
        { name: "README.md", path: "README.md", type: "file" },
      ] satisfies GitHubDirectoryItem[])
      .mockResolvedValueOnce([
        { name: "SKILL.md", path: "markdown/SKILL.md", type: "file", download_url: "https://example.com/skill" },
      ] satisfies GitHubDirectoryItem[])
      .mockResolvedValueOnce([
        { name: "build.py", path: "scripts/build.py", type: "file" },
      ] satisfies GitHubDirectoryItem[]);

    const skills = await listSkills(docPlugin, pluginMeta);

    expect(ghFetchJsonMock).toHaveBeenNthCalledWith(
      1,
      "/repos/alisonaquinas/llm-doc-skills/contents"
    );
    expect(skills).toEqual([
      {
        name: "markdown",
        path: "markdown",
        repo: docPlugin,
        downloadUrl: "https://github.com/alisonaquinas/llm-doc-skills/releases/download/v0.1.1/markdown-skill.zip",
      },
    ]);
  });
});

describe("getSkillDetail", () => {
  it("returns downloadUrl and repository-correct paths for root-layout skills", async () => {
    ghFetchJsonMock.mockResolvedValueOnce([
      {
        name: "SKILL.md",
        path: "markdown/SKILL.md",
        type: "file",
        download_url: "https://raw.githubusercontent.com/example/markdown/SKILL.md",
      },
      {
        name: "scripts",
        path: "markdown/scripts",
        type: "dir",
      },
    ] satisfies GitHubDirectoryItem[]);
    ghFetchTextMock.mockResolvedValueOnce("# markdown");

    const detail = await getSkillDetail(docPlugin, "markdown", pluginMeta);

    expect(ghFetchJsonMock).toHaveBeenCalledWith(
      "/repos/alisonaquinas/llm-doc-skills/contents/markdown"
    );
    expect(detail).toEqual({
      name: "markdown",
      path: "markdown",
      repo: docPlugin,
      downloadUrl: "https://github.com/alisonaquinas/llm-doc-skills/releases/download/v0.1.1/markdown-skill.zip",
      readme: "# markdown",
      files: ["SKILL.md", "scripts"],
    });
  });

  it("loads plugin metadata lazily when the caller does not provide it", async () => {
    getPluginMetaMock.mockResolvedValueOnce({
      name: "shared-skills",
      version: "1.6.3",
      description: "Shared skills",
    });
    ghFetchJsonMock.mockResolvedValueOnce([
      {
        name: "SKILL.md",
        path: "skills/bash/SKILL.md",
        type: "file",
        download_url: "https://raw.githubusercontent.com/example/bash/SKILL.md",
      },
    ] satisfies GitHubDirectoryItem[]);
    ghFetchTextMock.mockResolvedValueOnce("# bash");

    const detail = await getSkillDetail(sharedPlugin, "bash");

    expect(getPluginMetaMock).toHaveBeenCalledWith(sharedPlugin);
    expect(detail.downloadUrl).toBe(
      "https://github.com/alisonaquinas/llm-shared-skills/releases/download/v1.6.3/bash-skill.zip"
    );
  });
});
