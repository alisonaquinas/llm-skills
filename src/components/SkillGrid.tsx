"use client";

/**
 * Interactive skill grid for client-side search and repo filtering.
 *
 * Responsibilities:
 * - own local UI state for search and repo filter controls
 * - delegate filtering rules to src/lib/skills helpers
 * - render either the filtered skill list or an empty-state message
 */
import { useState } from "react";
import type { PluginConfig } from "@/lib/catalog";
import type { SkillEntry } from "@/lib/github";
import { filterSkills, getRepoFilterLabel } from "@/lib/skills";
import SkillCard from "./SkillCard";

/**
 * Props accepted by the interactive skill grid.
 */
interface Props {
  /** Full list of skills available for filtering. */
  skills: SkillEntry[];
  /** Repository filter options derived from configured plugins. */
  repos: PluginConfig[];
}

/**
 * Renders the searchable and filterable skill grid.
 *
 * @param skills Complete set of skills for the marketplace page.
 * @param repos Plugin configuration used to render repo filters.
 * @returns A client-side filtering UI for skill discovery.
 */
export default function SkillGrid({ skills, repos }: Props) {
  /** Active free-text search query. */
  const [query, setQuery] = useState("");
  /** Active repository filter value, or "all" for no restriction. */
  const [repoFilter, setRepoFilter] = useState("all");

  const filtered = filterSkills(skills, { query, repoFilter });
  const repoLabel = getRepoFilterLabel(repos, repoFilter);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
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
            placeholder="Search skills or skill bundles..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <div className="-mx-1 overflow-x-auto pb-1">
          <div className="flex min-w-max items-center gap-2 px-1">
            <button
              type="button"
              onClick={() => setRepoFilter("all")}
              className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                repoFilter === "all"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600"
              }`}
            >
              All ({skills.length})
            </button>
            {repos.map((repo) => (
              <button
                key={repo.repo}
                type="button"
                onClick={() => setRepoFilter(repo.repo)}
                className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  repoFilter === repo.repo
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {repo.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
        {filtered.length} included skill{filtered.length !== 1 ? "s" : ""}
        {query ? ` matching "${query}"` : ""}
        {repoLabel ? ` in ${repoLabel}` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-gray-500 sm:py-20">
          <p className="mb-4 text-5xl">🔍</p>
          <p className="font-medium text-gray-700 dark:text-gray-200">No skills found</p>
          <p className="mt-1 text-sm">Try a different search term or skill bundle filter.</p>
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
