/**
 * Skill filtering helpers used by the interactive marketplace grid.
 *
 * Responsibilities:
 * - normalize free-text skill search behavior
 * - apply repo-filter and query predicates consistently
 * - provide small display helpers for active repo filters
 */
import type { SkillEntry } from "@/lib/github";
import type { PluginConfig } from "@/lib/catalog";

/** Input model for client-side skill filtering. */
export interface SkillFilterInput {
  /** User-provided free-text query. */
  query: string;
  /** Repository name to restrict results to, or "all". */
  repoFilter: string;
}

/**
 * Builds the normalized search haystack for a skill.
 *
 * @param skill Skill entry to flatten for searching.
 * @returns Lower-cased text used by the query matcher.
 */
export function buildSkillSearchHaystack(skill: SkillEntry): string {
  return [skill.name, skill.repo.label, skill.repo.pluginName, skill.repo.repo]
    .join(" ")
    .toLowerCase();
}

/**
 * Applies repository and query filters to a set of skills.
 *
 * @param skills Available skill entries.
 * @param input Active query and repository filter values.
 * @returns The filtered skill list to render.
 */
export function filterSkills(
  skills: SkillEntry[],
  { query, repoFilter }: SkillFilterInput
): SkillEntry[] {
  const normalizedQuery = query.trim().toLowerCase();

  return skills.filter((skill) => {
    const matchRepo = repoFilter === "all" || skill.repo.repo === repoFilter;
    const matchQuery = !normalizedQuery || buildSkillSearchHaystack(skill).includes(normalizedQuery);
    return matchRepo && matchQuery;
  });
}

/**
 * Resolves the display label for the active repo filter.
 *
 * @param repos Available repository filter definitions.
 * @param repoFilter Active repository filter value.
 * @returns The human-readable label, or null when all repos are selected.
 */
export function getRepoFilterLabel(
  repos: PluginConfig[],
  repoFilter: string
): string | null {
  if (repoFilter === "all") {
    return null;
  }

  return repos.find((repo) => repo.repo === repoFilter)?.label ?? repoFilter;
}
