/**
 * Route parsing helpers for the skill detail catch-all route.
 *
 * Responsibilities:
 * - convert URL segment arrays into typed skill route data
 * - generate static route params from skill entries
 * - keep route-shape knowledge out of page components
 */
import type { SkillEntry } from "@/lib/github";

/** Parsed representation of a skill detail route. */
export interface ParsedSkillRoute {
  /** GitHub owner segment. */
  owner: string;
  /** GitHub repository segment. */
  repo: string;
  /** Skill name, including nested path segments joined with slashes. */
  skillName: string;
}

/**
 * Parses a catch-all slug into the owner, repo, and skill name segments.
 *
 * @param slug Catch-all route segments from Next.js.
 * @returns A parsed route object or null when the slug is incomplete.
 */
export function parseSkillRoute(slug: string[] | undefined): ParsedSkillRoute | null {
  if (!slug || slug.length < 3) {
    return null;
  }

  const [owner, repo, ...nameParts] = slug;
  return {
    owner,
    repo,
    skillName: nameParts.join("/"),
  };
}

/**
 * Builds the static route parameter shape for a published skill.
 *
 * @param skill Skill entry to convert into route params.
 * @returns The catch-all slug object consumed by Next.js static generation.
 */
export function createSkillRouteParams(skill: SkillEntry): { slug: string[] } {
  return {
    slug: [skill.repo.owner, skill.repo.repo, ...skill.name.split("/")],
  };
}
