/**
 * Shared type contracts for GitHub-backed marketplace data.
 *
 * Responsibilities:
 * - define the shapes returned by GitHub fetch helpers
 * - represent plugin metadata and skill documents in the domain layer
 * - keep downstream modules typed without coupling them to raw JSON internals
 */

/** Metadata read from an upstream plugin's .claude-plugin/plugin.json file. */
export interface PluginMeta {
  /** Plugin display name declared by the upstream plugin. */
  name: string;
  /** Plugin version declared by the upstream plugin. */
  version: string;
  /** Plugin description presented by the upstream plugin metadata. */
  description: string;
  /** Optional author information embedded in the plugin metadata. */
  author?: { name: string; email?: string };
  /** Optional plugin homepage URL. */
  homepage?: string;
  /** Optional repository URL or identifier. */
  repository?: string;
  /** Optional license identifier or label. */
  license?: string;
}

/** Summary metadata for a skill directory discovered in a plugin repository. */
export interface SkillEntry {
  /** Published skill name, including nested path segments when applicable. */
  name: string;
  /** Repository-relative path to the skill directory. */
  path: string;
  /** Owning plugin configuration. */
  repo: import("@/lib/catalog").PluginConfig;
}

/** Full skill payload used by the skill detail page. */
export interface SkillDetail extends SkillEntry {
  /** Raw SKILL.md contents when present. */
  readme: string | null;
  /** File names found in the skill directory. */
  files: string[];
}

/** Minimal GitHub contents API shape for a base64-encoded file response. */
export interface GitHubContentFile {
  /** Base64-encoded file contents returned by the contents API. */
  content: string;
}

/** Minimal GitHub contents API shape for directory listing entries. */
export interface GitHubDirectoryItem {
  /** Basename of the file or directory. */
  name: string;
  /** Repository-relative path to the entry. */
  path: string;
  /** GitHub contents API item type such as dir or file. */
  type: string;
  /** Optional raw download URL for file entries. */
  download_url?: string | null;
}
