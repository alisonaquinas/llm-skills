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

/** Executable users invoke when installing raw skills through npm. */
const NPX_SKILLS_BINARY = "npx skills";

/** Wildcard selector understood by npx skills for installing every skill in a repository. */
const ALL_SKILLS_SELECTOR = "*";

/**
 * Quotes a value for the copyable shell commands shown in the marketplace UI.
 *
 * @param value Raw CLI value.
 * @returns A single-quoted shell argument.
 */
function quoteShellArg(value: string): string {
  return `'${value.replaceAll("'", "'\"'\"'")}'`;
}

/**
 * Builds the GitHub repository reference used by npx skills.
 *
 * @param plugin Plugin configuration to encode.
 * @returns The owner/repository reference accepted by npx skills.
 */
export function getNpxSkillsSourceRef(plugin: PluginConfig): string {
  return `${plugin.owner}/${plugin.repo}`;
}

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
 * Builds the npx skills command for installing every skill from a plugin repository.
 *
 * @param plugin Plugin repository to install.
 * @returns The npx skills install command for the full repository.
 */
export function getNpxSkillsBundleInstallCommand(plugin: PluginConfig): string {
  return `${NPX_SKILLS_BINARY} add ${getNpxSkillsSourceRef(plugin)} --skill ${quoteShellArg(ALL_SKILLS_SELECTOR)} -g -y`;
}

/**
 * Builds the npx skills command for listing skills in a plugin repository.
 *
 * @param plugin Plugin repository to inspect.
 * @returns The npx skills list command for the repository.
 */
export function getNpxSkillsBundleListCommand(plugin: PluginConfig): string {
  return `${NPX_SKILLS_BINARY} add ${getNpxSkillsSourceRef(plugin)} --list`;
}

/**
 * Builds the npx skills command for installing one skill from a plugin repository.
 *
 * @param plugin Plugin repository containing the skill.
 * @param skillName Skill directory name to install.
 * @returns The npx skills install command for one skill.
 */
export function getNpxSkillsSkillInstallCommand(
  plugin: PluginConfig,
  skillName: string,
): string {
  return `${NPX_SKILLS_BINARY} add ${getNpxSkillsSourceRef(plugin)} --skill ${quoteShellArg(skillName)} -g -y`;
}

/**
 * Builds a newline-separated command block for installing every configured skill bundle.
 *
 * @param plugins Plugin repositories to install.
 * @returns Copyable multi-command script for all bundles.
 */
export function getNpxSkillsAllBundlesInstallCommands(
  plugins: readonly PluginConfig[],
): string {
  return plugins.map(getNpxSkillsBundleInstallCommand).join("\n");
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
