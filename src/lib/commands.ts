/**
 * Command-building helpers for marketplace and skill invocation flows.
 *
 * Responsibilities:
 * - centralize CLI command string construction
 * - keep UI components free of command formatting details
 * - preserve a single extension point if install command syntax changes
 */
import { MARKETPLACE } from "./catalog";
import type { PluginConfig } from "./catalog";

/**
 * Builds the plugin reference used by Claude Code installation commands.
 *
 * @param plugin Plugin configuration to encode.
 * @returns The plugin reference in pluginName@marketplace form.
 */
export function getPluginInstallRef(plugin: PluginConfig): string {
  return `${plugin.pluginName}@${MARKETPLACE.name}`;
}

/**
 * Builds the install command for a specific plugin.
 *
 * @param plugin Plugin configuration to install.
 * @returns The CLI command for installing the plugin.
 */
export function getPluginInstallCommand(plugin: PluginConfig): string {
  return `/plugin install ${getPluginInstallRef(plugin)}`;
}

/**
 * Builds the recommended command for adding the GitHub-backed marketplace source.
 *
 * @returns The CLI command for marketplace registration by repository.
 */
export function getMarketplaceAddCommand(): string {
  return `/plugin marketplace add ${MARKETPLACE.githubRepo}`;
}

/**
 * Builds the recommended Codex CLI command for adding the GitHub-backed marketplace source.
 *
 * @returns The Codex CLI command for marketplace registration by repository.
 */
export function getCodexMarketplaceAddCommand(): string {
  return `codex plugin marketplace add ${MARKETPLACE.githubRepo}`;
}

/**
 * Builds the secondary Codex CLI command for adding the marketplace by published JSON URL.
 *
 * @returns The Codex CLI command for marketplace registration by URL.
 */
export function getCodexMarketplaceUrlAddCommand(): string {
  return `codex plugin marketplace add ${MARKETPLACE.siteUrl}/codex-marketplace.json`;
}

/**
 * Builds the secondary command for adding the marketplace by published JSON URL.
 *
 * @returns The CLI command for marketplace registration by URL.
 */
export function getMarketplaceUrlAddCommand(): string {
  return `/plugin marketplace add ${MARKETPLACE.marketplaceJsonUrl}`;
}

/**
 * Builds the invocation string for a skill bundled inside a plugin.
 *
 * @param plugin Plugin containing the skill.
 * @param skillName Published skill name.
 * @returns The slash-command users can invoke after installation.
 */
export function getSkillInvocation(plugin: PluginConfig, skillName: string): string {
  return `/${plugin.pluginName}:${skillName}`;
}
