/**
 * Unit tests for CLI command helpers shown throughout the marketplace UI.
 *
 * Responsibilities:
 * - keep copied npx skills commands stable
 * - verify repository and skill selectors are shell-safe
 * - preserve existing Claude Code and Codex marketplace command formats
 */
import { describe, expect, it } from "vitest";
import { MARKETPLACE, PLUGINS } from "@/lib/catalog";
import {
  getCodexMarketplaceAddCommand,
  getMarketplaceAddCommand,
  getNpxSkillsAllBundlesInstallCommands,
  getNpxSkillsBundleInstallCommand,
  getNpxSkillsBundleListCommand,
  getNpxSkillsSkillInstallCommand,
  getPluginInstallCommand,
} from "@/lib/commands";

/** Stable fixture from the published marketplace catalog. */
const sharedSkillsPlugin = PLUGINS[0]!;

describe("marketplace command helpers", () => {
  /** Ensures existing marketplace registration commands keep their public shape. */
  it("builds Claude Code and Codex marketplace commands", () => {
    expect(getMarketplaceAddCommand()).toBe(`/plugin marketplace add ${MARKETPLACE.githubRepo}`);
    expect(getCodexMarketplaceAddCommand()).toBe(
      `codex plugin marketplace add ${MARKETPLACE.githubRepo}`,
    );
  });
});

describe("plugin command helpers", () => {
  /** Ensures legacy plugin installs are still available for Claude Code users. */
  it("builds Claude Code plugin install commands", () => {
    expect(getPluginInstallCommand(sharedSkillsPlugin)).toBe(
      "/plugin install shared-skills@llm-skills",
    );
  });

  /** Ensures repository-level npx skills installs use the wildcard skill selector. */
  it("builds npx skills commands for full bundles", () => {
    expect(getNpxSkillsBundleInstallCommand(sharedSkillsPlugin)).toBe(
      "npx skills add alisonaquinas/llm-shared-skills --skill '*' -g -y",
    );
  });

  /** Ensures repository inspection commands do not install anything. */
  it("builds npx skills commands for listing skills", () => {
    expect(getNpxSkillsBundleListCommand(sharedSkillsPlugin)).toBe(
      "npx skills add alisonaquinas/llm-shared-skills --list",
    );
  });

  /** Ensures individual skills can be installed directly from their source repository. */
  it("builds npx skills commands for individual skills", () => {
    expect(getNpxSkillsSkillInstallCommand(sharedSkillsPlugin, "github-ci")).toBe(
      "npx skills add alisonaquinas/llm-shared-skills --skill 'github-ci' -g -y",
    );
  });

  /** Ensures skill names with quotes cannot break the generated command. */
  it("escapes quoted skill selectors", () => {
    expect(getNpxSkillsSkillInstallCommand(sharedSkillsPlugin, "writer's-room")).toBe(
      "npx skills add alisonaquinas/llm-shared-skills --skill 'writer'\"'\"'s-room' -g -y",
    );
  });

  /** Ensures the all-bundles install block stays aligned to catalog ordering. */
  it("builds one npx skills install command per configured plugin", () => {
    const commands = getNpxSkillsAllBundlesInstallCommands(PLUGINS).split("\n");

    expect(commands).toHaveLength(PLUGINS.length);
    expect(commands[0]).toBe(
      "npx skills add alisonaquinas/llm-shared-skills --skill '*' -g -y",
    );
    expect(commands.at(-1)).toBe(
      "npx skills add alisonaquinas/llm-web-design-skills --skill '*' -g -y",
    );
  });
});
