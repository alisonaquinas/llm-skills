/**
 * Skill discovery and detail services for upstream plugin repositories.
 *
 * Responsibilities:
 * - enumerate published skill directories for configured plugins
 * - resolve the full detail payload for an individual skill
 * - aggregate all skills across configured plugin repositories
 */
import type { PluginConfig } from "@/lib/catalog";
import { PLUGINS } from "@/lib/catalog";
import { ghFetchJson, ghFetchText } from "./client";
import type { GitHubDirectoryItem, SkillDetail, SkillEntry } from "./types";

/**
 * Lists the top-level skill directories for a single plugin repository.
 *
 * @param plugin Plugin repository to scan.
 * @returns Skill entries discovered under the plugin's skills directory.
 */
export async function listSkills(plugin: PluginConfig): Promise<SkillEntry[]> {
  try {
    const items = await ghFetchJson<GitHubDirectoryItem[]>(
      `/repos/${plugin.owner}/${plugin.repo}/contents/skills`
    );

    return items
      .filter((item) => item.type === "dir")
      .map((item) => ({
        name: item.name,
        path: item.path,
        repo: plugin,
      }));
  } catch {
    return [];
  }
}

/**
 * Retrieves the file listing and optional SKILL.md contents for a single skill.
 *
 * @param plugin Plugin repository containing the skill.
 * @param skillName Skill path relative to the skills directory.
 * @returns A normalized skill detail payload suitable for page rendering.
 */
export async function getSkillDetail(
  plugin: PluginConfig,
  skillName: string
): Promise<SkillDetail> {
  const entry: SkillEntry = {
    name: skillName,
    path: `skills/${skillName}`,
    repo: plugin,
  };

  let readme: string | null = null;
  let files: string[] = [];

  try {
    const items = await ghFetchJson<GitHubDirectoryItem[]>(
      `/repos/${plugin.owner}/${plugin.repo}/contents/skills/${skillName}`
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
 * @returns A flattened list of all discovered skill entries.
 */
export async function getAllSkills(): Promise<SkillEntry[]> {
  const results = await Promise.all(PLUGINS.map(listSkills));
  return results.flat();
}
