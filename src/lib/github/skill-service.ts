/**
 * Skill discovery and detail services for upstream plugin repositories.
 *
 * Responsibilities:
 * - enumerate published skill directories for configured plugins
 * - resolve the full detail payload for an individual skill
 * - aggregate all skills across configured plugin repositories
 * - normalize repository layouts so both skills/ and root-level skill bundles work
 * - compute direct release asset URLs for per-skill ZIP downloads
 */
import type { PluginConfig } from "@/lib/catalog";
import { PLUGINS } from "@/lib/catalog";
import { ghFetchJson, ghFetchText } from "./client";
import { getPluginMeta } from "./plugin-service";
import type { GitHubDirectoryItem, PluginMeta, SkillDetail, SkillEntry } from "./types";

/** Default skill root used by plugin repositories that publish under skills/. */
const DEFAULT_SKILLS_ROOT = "skills";

/**
 * Builds a stable key for looking up plugin-scoped metadata.
 *
 * @param plugin Plugin configuration to key.
 * @returns Owner and repo joined into a single map key.
 */
function getPluginKey(plugin: PluginConfig): string {
  return `${plugin.owner}/${plugin.repo}`;
}

/**
 * Normalizes the configured skill root so discovery code can handle root-level skill repos.
 *
 * @param plugin Plugin configuration to inspect.
 * @returns "." for root-level skills or a trimmed repository-relative directory name.
 */
export function resolvePluginSkillsRoot(plugin: PluginConfig): string {
  const configuredRoot = plugin.skillsRoot?.trim();
  if (!configuredRoot || configuredRoot === ".") {
    return configuredRoot === "." ? "." : DEFAULT_SKILLS_ROOT;
  }

  return configuredRoot.replace(/^\/+|\/+$/g, "");
}

/**
 * Builds the repository-relative directory path for a specific skill.
 *
 * @param plugin Plugin repository that owns the skill.
 * @param skillName Skill name relative to the configured skill root.
 * @returns Repository-relative directory path for the skill.
 */
function buildSkillDirectoryPath(plugin: PluginConfig, skillName: string): string {
  const skillsRoot = resolvePluginSkillsRoot(plugin);
  return skillsRoot === "." ? skillName : `${skillsRoot}/${skillName}`;
}

/**
 * Builds the GitHub contents API path for a plugin skill directory or root listing.
 *
 * @param plugin Plugin repository to inspect.
 * @param relativePath Optional repository-relative path under the configured skill root.
 * @returns GitHub contents API path for the requested location.
 */
function buildContentsApiPath(plugin: PluginConfig, relativePath = ""): string {
  const skillsRoot = resolvePluginSkillsRoot(plugin);
  const repoRelativePath = skillsRoot === "."
    ? relativePath
    : [skillsRoot, relativePath].filter(Boolean).join("/");

  return `/repos/${plugin.owner}/${plugin.repo}/contents${repoRelativePath ? `/${repoRelativePath}` : ""}`;
}

/**
 * Builds the direct GitHub release asset URL for a per-skill ZIP bundle.
 *
 * @param plugin Plugin repository that publishes the release asset.
 * @param version Upstream plugin version from plugin.json.
 * @param skillName Published skill name.
 * @returns Direct asset URL or null when the version is not available.
 */
export function buildSkillDownloadUrl(
  plugin: PluginConfig,
  version: string | null | undefined,
  skillName: string
): string | null {
  if (!version) {
    return null;
  }

  return `https://github.com/${plugin.owner}/${plugin.repo}/releases/download/v${version}/${skillName}-skill.zip`;
}

/**
 * Creates a skill entry with an optional direct download URL.
 *
 * @param plugin Owning plugin configuration.
 * @param item Directory item discovered from GitHub.
 * @param pluginMeta Optional upstream plugin metadata.
 * @returns Normalized marketplace skill entry.
 */
function buildSkillEntry(
  plugin: PluginConfig,
  item: GitHubDirectoryItem,
  pluginMeta: PluginMeta | null
): SkillEntry {
  return {
    name: item.name,
    path: item.path,
    repo: plugin,
    downloadUrl: buildSkillDownloadUrl(plugin, pluginMeta?.version, item.name),
  };
}

/**
 * Checks whether a top-level directory in a root-layout repo is actually a skill.
 *
 * @param plugin Plugin repository that publishes root-level skills.
 * @param item Candidate top-level directory from the contents API.
 * @returns Whether the directory contains a SKILL.md marker file.
 */
async function isRootSkillDirectory(plugin: PluginConfig, item: GitHubDirectoryItem): Promise<boolean> {
  try {
    const items = await ghFetchJson<GitHubDirectoryItem[]>(
      buildContentsApiPath(plugin, item.name)
    );

    return items.some((child) => child.name === "SKILL.md");
  } catch {
    return false;
  }
}

/**
 * Lists the top-level skill directories for a single plugin repository.
 *
 * @param plugin Plugin repository to scan.
 * @param pluginMeta Optional upstream plugin metadata reused by callers that already fetched it.
 * @returns Skill entries discovered under the plugin's skills directory.
 */
export async function listSkills(
  plugin: PluginConfig,
  pluginMeta: PluginMeta | null = null
): Promise<SkillEntry[]> {
  try {
    const resolvedPluginMeta = pluginMeta ?? await getPluginMeta(plugin);
    const items = await ghFetchJson<GitHubDirectoryItem[]>(buildContentsApiPath(plugin));
    const directoryItems = items.filter((item) => item.type === "dir");

    if (resolvePluginSkillsRoot(plugin) !== ".") {
      return directoryItems.map((item) => buildSkillEntry(plugin, item, resolvedPluginMeta));
    }

    const skillDirectories = await Promise.all(
      directoryItems.map(async (item) => ({
        item,
        isSkill: await isRootSkillDirectory(plugin, item),
      }))
    );

    return skillDirectories
      .filter((entry) => entry.isSkill)
      .map((entry) => buildSkillEntry(plugin, entry.item, resolvedPluginMeta));
  } catch {
    return [];
  }
}

/**
 * Retrieves the file listing and optional SKILL.md contents for a single skill.
 *
 * @param plugin Plugin repository containing the skill.
 * @param skillName Skill path relative to the skills directory.
 * @param pluginMeta Optional upstream plugin metadata reused by callers that already fetched it.
 * @returns A normalized skill detail payload suitable for page rendering.
 */
export async function getSkillDetail(
  plugin: PluginConfig,
  skillName: string,
  pluginMeta: PluginMeta | null = null
): Promise<SkillDetail> {
  const resolvedPluginMeta = pluginMeta ?? await getPluginMeta(plugin);
  const entry: SkillEntry = {
    name: skillName,
    path: buildSkillDirectoryPath(plugin, skillName),
    repo: plugin,
    downloadUrl: buildSkillDownloadUrl(plugin, resolvedPluginMeta?.version, skillName),
  };

  let readme: string | null = null;
  let files: string[] = [];

  try {
    const items = await ghFetchJson<GitHubDirectoryItem[]>(
      buildContentsApiPath(plugin, skillName)
    );

    files = items.map((item) => item.name);

    const skillMd = items.find((item) => item.name === "SKILL.md");
    if (skillMd?.download_url) {
      readme = await ghFetchText(skillMd.download_url);
    }
  } catch {
    // Allow the caller to decide whether an empty result should render or 404.
  }

  return { ...entry, readme, files };
}

/**
 * Aggregates skill entries across every configured plugin repository.
 *
 * @param pluginMetas Optional pre-fetched metadata keyed by owner/repo.
 * @returns A flattened list of all discovered skill entries.
 */
export async function getAllSkills(
  pluginMetas?: ReadonlyMap<string, PluginMeta | null>
): Promise<SkillEntry[]> {
  const results = await Promise.all(
    PLUGINS.map((plugin) => listSkills(plugin, pluginMetas?.get(getPluginKey(plugin)) ?? null))
  );

  return results.flat();
}
