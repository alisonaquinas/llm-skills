export interface PluginMeta {
  name: string;
  version: string;
  description: string;
  author: { name: string };
}

export interface SkillEntry {
  name: string;
  path: string;
  repo: RepoConfig;
}

export interface SkillDetail extends SkillEntry {
  readme: string | null;
  files: string[];
}

export interface RepoConfig {
  owner: string;
  repo: string;
  label: string;
  color: string;
}

export const REPOS: RepoConfig[] = [
  {
    owner: "alisonaquinas",
    repo: "llm-shared-skills",
    label: "Shared Skills",
    color: "bg-blue-100 text-blue-800",
  },
  {
    owner: "alisonaquinas",
    repo: "llm-ci-dev",
    label: "CI/CD Skills",
    color: "bg-emerald-100 text-emerald-800",
  },
];

const BASE = "https://api.github.com";

async function ghFetch<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    headers,
    cache: "force-cache",
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function getPluginMeta(r: RepoConfig): Promise<PluginMeta | null> {
  try {
    const file = await ghFetch<{ content: string }>(
      `/repos/${r.owner}/${r.repo}/contents/.claude-plugin/plugin.json`
    );
    return JSON.parse(Buffer.from(file.content, "base64").toString("utf-8")) as PluginMeta;
  } catch {
    return null;
  }
}

export async function listSkills(r: RepoConfig): Promise<SkillEntry[]> {
  try {
    const items = await ghFetch<Array<{ name: string; path: string; type: string }>>(
      `/repos/${r.owner}/${r.repo}/contents/skills`
    );
    return items
      .filter((i) => i.type === "dir")
      .map((i) => ({ name: i.name, path: i.path, repo: r }));
  } catch {
    return [];
  }
}

export async function getSkillDetail(
  r: RepoConfig,
  skillName: string
): Promise<SkillDetail> {
  const entry: SkillEntry = { name: skillName, path: `skills/${skillName}`, repo: r };

  let readme: string | null = null;
  let files: string[] = [];

  try {
    const items = await ghFetch<Array<{ name: string; type: string; download_url: string | null }>>(
      `/repos/${r.owner}/${r.repo}/contents/skills/${skillName}`
    );
    files = items.map((i) => i.name);

    const skillMd = items.find((i) => i.name === "SKILL.md");
    if (skillMd?.download_url) {
      const res = await fetch(skillMd.download_url, { cache: "force-cache" });
      if (res.ok) readme = await res.text();
    }
  } catch {
    // swallow
  }

  return { ...entry, readme, files };
}

export async function getAllSkills(): Promise<SkillEntry[]> {
  const results = await Promise.all(REPOS.map(listSkills));
  return results.flat();
}
