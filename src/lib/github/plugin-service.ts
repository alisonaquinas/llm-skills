/**
 * Plugin metadata service for upstream plugin repositories.
 *
 * Responsibilities:
 * - locate each plugin's declared Codex or Claude metadata file in GitHub
 * - decode the upstream plugin.json payload into typed metadata
 * - align published versions with the latest GitHub release tag when available
 * - gracefully fall back to null when metadata is absent or unreadable
 */
import type { PluginConfig } from "@/lib/catalog";
import { ghFetchJson, decodeBase64Json } from "./client";
import type { GitHubContentFile, GitHubRelease, PluginMeta } from "./types";

/**
 * Normalizes a GitHub release tag into the plain semantic version used by the UI.
 *
 * @param tagName GitHub release tag such as v1.2.3.
 * @returns Tag without a leading v prefix.
 */
function normalizeReleaseTag(tagName: string): string {
  return tagName.replace(/^v/, "");
}

/**
 * Reads the latest published release version for a plugin repository.
 *
 * @param plugin Plugin repository configuration.
 * @returns Published release version without the leading v, or null when unavailable.
 */
async function getLatestReleaseVersion(plugin: PluginConfig): Promise<string | null> {
  try {
    const release = await ghFetchJson<GitHubRelease>(
      `/repos/${plugin.owner}/${plugin.repo}/releases/latest`
    );

    return normalizeReleaseTag(release.tag_name);
  } catch {
    return null;
  }
}

/**
 * Reads the preferred upstream plugin manifest, using the Codex manifest first
 * and the Claude manifest as a rollout fallback.
 *
 * @param plugin Plugin repository configuration.
 * @returns GitHub contents payload for the first available plugin manifest.
 */
async function getPluginManifestFile(plugin: PluginConfig): Promise<GitHubContentFile> {
  try {
    return await ghFetchJson<GitHubContentFile>(
      `/repos/${plugin.owner}/${plugin.repo}/contents/.codex-plugin/plugin.json`
    );
  } catch {
    return ghFetchJson<GitHubContentFile>(
      `/repos/${plugin.owner}/${plugin.repo}/contents/.claude-plugin/plugin.json`
    );
  }
}

/**
 * Reads plugin metadata from an upstream repository.
 *
 * @param plugin Plugin repository configuration.
 * @returns Parsed plugin metadata, or null if the file cannot be read.
 */
export async function getPluginMeta(plugin: PluginConfig): Promise<PluginMeta | null> {
  try {
    const file = await getPluginManifestFile(plugin);
    const latestReleaseVersion = await getLatestReleaseVersion(plugin);
    const meta = decodeBase64Json<PluginMeta>(file.content);

    return {
      ...meta,
      version: latestReleaseVersion ?? meta.version,
    };
  } catch {
    return null;
  }
}
