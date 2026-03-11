#!/usr/bin/env node
// Generates out/marketplace.json from GitHub API skill listings.
// Usage: node scripts/generate-marketplace-json.mjs [output-path]

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const REPOS = [
  {
    owner: "alisonaquinas",
    repo: "llm-shared-skills",
    label: "Shared Skills",
    category: "shared-skills",
  },
  {
    owner: "alisonaquinas",
    repo: "llm-ci-dev",
    label: "CI/CD Skills",
    category: "ci-cd",
  },
];

const BASE = "https://api.github.com";

async function ghFetch(path) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`);
  return res.json();
}

async function listSkills(r) {
  const items = await ghFetch(`/repos/${r.owner}/${r.repo}/contents/skills`);
  return items
    .filter((i) => i.type === "dir")
    .map((i) => ({ name: i.name, path: i.path }));
}

async function getPluginMeta(r) {
  try {
    const file = await ghFetch(
      `/repos/${r.owner}/${r.repo}/contents/.claude-plugin/plugin.json`
    );
    const raw = Buffer.from(file.content, "base64").toString("utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function main() {
  const outPath = process.argv[2] ?? "out/marketplace.json";

  console.log("Fetching skill lists and plugin metadata...");

  const [skillsByRepo, metas] = await Promise.all([
    Promise.all(REPOS.map((r) => listSkills(r).then((s) => ({ r, skills: s })))),
    Promise.all(REPOS.map(getPluginMeta)),
  ]);

  const primaryMeta = metas[0];

  const plugins = skillsByRepo.flatMap(({ r, skills }, i) => {
    const meta = metas[i];
    return skills.map((skill) => ({
      name: skill.name,
      source: {
        source: "git-subdir",
        url: `https://github.com/${r.owner}/${r.repo}.git`,
        path: skill.path,
        ref: "main",
      },
      category: r.category,
      license: meta?.license ?? "MIT",
    }));
  });

  const marketplace = {
    name: "llm-skills",
    owner: { name: "Alison Aquinas" },
    metadata: {
      description:
        primaryMeta?.description ??
        "LLM skill packages for Claude Code and Codex",
      version: primaryMeta?.version ?? "1.0.0",
    },
    plugins,
  };

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(marketplace, null, 2) + "\n");

  console.log(
    `Wrote ${plugins.length} plugins to ${outPath}`
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
