"use client";

import { useState } from "react";
import type { SkillEntry, RepoConfig } from "@/lib/github";
import SkillCard from "./SkillCard";

interface Props {
  skills: SkillEntry[];
  repos: RepoConfig[];
}

export default function SkillGrid({ skills, repos }: Props) {
  const [query, setQuery] = useState("");
  const [repoFilter, setRepoFilter] = useState("all");

  const filtered = skills.filter((s) => {
    const matchRepo = repoFilter === "all" || s.repo.repo === repoFilter;
    const matchQ = !query || s.name.toLowerCase().includes(query.toLowerCase());
    return matchRepo && matchQ;
  });

  return (
    <div>
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
            placeholder="Search skills…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setRepoFilter("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              repoFilter === "all"
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            All ({skills.length})
          </button>
          {repos.map((r) => (
            <button
              key={r.repo}
              onClick={() => setRepoFilter(r.repo)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                repoFilter === r.repo
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-4">
        {filtered.length} skill{filtered.length !== 1 ? "s" : ""}
        {query ? ` matching "${query}"` : ""}
        {repoFilter !== "all"
          ? ` in ${repos.find((r) => r.repo === repoFilter)?.label ?? repoFilter}`
          : ""}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-medium">No skills found</p>
          <p className="text-sm mt-1">Try a different search term or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <SkillCard key={`${skill.repo.repo}/${skill.name}`} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}
