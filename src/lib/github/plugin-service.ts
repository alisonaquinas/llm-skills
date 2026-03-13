/**
 * Plugin metadata service for upstream plugin repositories.
 *
 * Responsibilities:
 * - locate each plugin's declared metadata file in GitHub
 * - decode the upstream plugin.json payload into typed metadata
 * - gracefully fall back to null when metadata is absent or unreadable
 */
import type { PluginConfig } from "@/lib/catalog";
import { ghFetchJson, decodeBase64Json } from "./client";
import type { GitHubContentFile, PluginMeta } from "./types";

/**
 * Reads plugin metadata from an upstream repository.
 *
 * @param plugin Plugin repository configuration.
 * @returns Parsed plugin metadata, or null if the file cannot be read.
 */
export async function getPluginMeta(plugin: PluginConfig): Promise<PluginMeta | null> {
  try {
    const file = await ghFetchJson<GitHubContentFile>(
      `/repos/${plugin.owner}/${plugin.repo}/contents/.claude-plugin/plugin.json`
    );

    return decodeBase64Json<PluginMeta>(file.content);
  } catch {
    return null;
  }
}
