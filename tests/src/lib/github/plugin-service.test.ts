/**
 * Unit tests for published plugin metadata resolution.
 *
 * Responsibilities:
 * - verify plugin metadata keeps descriptive fields from plugin.json
 * - verify the displayed version prefers the latest GitHub release tag
 * - verify plugin.json versions remain the fallback when release lookup fails
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PluginConfig } from "@/lib/catalog";
import { getPluginMeta } from "@/lib/github";

const { ghFetchJsonMock, decodeBase64JsonMock } = vi.hoisted(() => ({
  ghFetchJsonMock: vi.fn(),
  decodeBase64JsonMock: vi.fn(),
}));

vi.mock("@/lib/github/client", () => ({
  ghFetchJson: ghFetchJsonMock,
  decodeBase64Json: decodeBase64JsonMock,
}));

/** Shared plugin fixture for metadata tests. */
const plugin: PluginConfig = {
  pluginName: "ci-cd",
  owner: "alisonaquinas",
  repo: "llm-ci-dev",
  label: "CI/CD Skills",
  category: "ci-cd",
  color: "bg-emerald-100 text-emerald-800",
  siteDescription: "CI/CD skills",
};

beforeEach(() => {
  ghFetchJsonMock.mockReset();
  decodeBase64JsonMock.mockReset();
});

describe("getPluginMeta", () => {
  it("prefers the latest release tag over the version in plugin.json", async () => {
    ghFetchJsonMock
      .mockResolvedValueOnce({ content: "encoded" })
      .mockResolvedValueOnce({ tag_name: "v1.1.2" });
    decodeBase64JsonMock.mockReturnValue({
      name: "llm-ci-dev",
      version: "1.0.1",
      description: "CI/CD skills",
    });

    const meta = await getPluginMeta(plugin);

    expect(meta).toEqual({
      name: "llm-ci-dev",
      version: "1.1.2",
      description: "CI/CD skills",
    });
  });

  it("falls back to the plugin.json version when release lookup fails", async () => {
    ghFetchJsonMock
      .mockResolvedValueOnce({ content: "encoded" })
      .mockRejectedValueOnce(new Error("release lookup failed"));
    decodeBase64JsonMock.mockReturnValue({
      name: "llm-ci-dev",
      version: "1.0.1",
      description: "CI/CD skills",
    });

    const meta = await getPluginMeta(plugin);

    expect(meta?.version).toBe("1.0.1");
  });
});
