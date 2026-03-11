import {
  MARKETPLACE,
  PLUGINS,
  type PluginConfig,
  getPluginInstallRef,
} from "@/lib/catalog";

export interface PluginMeta {
  name: string;
  version: string;
  description: string;
  author?: { name: string; email?: string };
  homepage?: string;
  repository?: string;
  license?: string;
}

export interface SkillEntry {
  name: string;
  path: string;
  repo: PluginConfig;
}

export interface SkillDetail extends SkillEntry {
  readme: string | null;
  files: string[];
}

export type { PluginConfig };
export { MARKETPLACE, PLUGINS, getPluginInstallRef };

const BASE = "https://api.github.com";

async function ghFetch<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    headers,
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function getPluginMeta(plugin: PluginConfig): Promise<PluginMeta | null> {
  try {
    const file = await ghFetch<{ content: string }>(
      `/repos/${plugin.owner}/${plugin.repo}/contents/.claude-plugin/plugin.json`
    );

    return JSON.parse(Buffer.from(file.content, "base64").toString("utf-8")) as PluginMeta;
  } catch {
    return null;
  }
}

export async function listSkills(plugin: PluginConfig): Promise<SkillEntry[]> {
  try {
    const items = await ghFetch<Array<{ name: string; path: string; type: string }>>(
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
    const items = await ghFetch<
      Array<{ name: string; type: string; download_url: string | null }>
    >(`/repos/${plugin.owner}/${plugin.repo}/contents/skills/${skillName}`);

    files = items.map((item) => item.name);

    const skillMd = items.find((item) => item.name === "SKILL.md");
    if (skillMd?.download_url) {
      const res = await fetch(skillMd.download_url, { cache: "force-cache" });
      if (res.ok) {
        readme = await res.text();
      }
    }
  } catch {
    // Allow the caller to decide whether an empty result should render or 404.
  }

  return { ...entry, readme, files };
}

export async function getAllSkills(): Promise<SkillEntry[]> {
  const results = await Promise.all(PLUGINS.map(listSkills));
  return results.flat();
}

export function getSkillInvocation(plugin: PluginConfig, skillName: string): string {
  return `/${plugin.pluginName}:${skillName}`;
}

export function getPluginInstallCommand(plugin: PluginConfig): string {
  return `/plugin install ${getPluginInstallRef(plugin)}`;
}
