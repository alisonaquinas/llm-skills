"use client";

import { useState } from "react";
import type { PluginConfig, SkillEntry } from "@/lib/github";
import SkillCard from "./SkillCard";

interface Props {
  skills: SkillEntry[];
  repos: PluginConfig[];
}

export default function SkillGrid({ skills, repos }: Props) {
  const [query, setQuery] = useState("");
  const [repoFilter, setRepoFilter] = useState("all");

  const filtered = skills.filter((skill) => {
    const matchRepo = repoFilter === "all" || skill.repo.repo === repoFilter;
    const haystack = [skill.name, skill.repo.label, skill.repo.pluginName, skill.repo.repo].join(" ").toLowerCase();
    const matchQuery = !query || haystack.includes(query.toLowerCase());
    return matchRepo && matchQuery;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search included skills or plugins…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setRepoFilter("all")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              repoFilter === "all"
                ? "bg-gray-900 text-white"
                : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            All ({skills.length})
          </button>
          {repos.map((repo) => (
            <button
              key={repo.repo}
              onClick={() => setRepoFilter(repo.repo)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                repoFilter === repo.repo
                  ? "bg-gray-900 text-white"
                  : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              {repo.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-400">
        {filtered.length} included skill{filtered.length !== 1 ? "s" : ""}
        {query ? ` matching "${query}"` : ""}
        {repoFilter !== "all"
          ? ` in ${repos.find((repo) => repo.repo === repoFilter)?.label ?? repoFilter}`
          : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="mb-4 text-5xl">🔍</p>
          <p className="font-medium">No skills found</p>
          <p className="mt-1 text-sm">Try a different search term or plugin filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill) => (
            <SkillCard key={`${skill.repo.repo}/${skill.name}`} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}
