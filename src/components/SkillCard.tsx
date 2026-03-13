/**
 * Presentational card for a single skill entry in the marketplace grid.
 *
 * Responsibilities:
 * - render skill metadata with consistent visual affordances
 * - construct the skill detail route link
 * - surface the canonical invocation command for the selected skill
 */
import Link from "next/link";
import type { SkillEntry } from "@/lib/github";
import { getSkillInvocation } from "@/lib/commands";
import { getSkillIcon } from "@/lib/skills";

/**
 * Props accepted by the skill card component.
 */
interface SkillCardProps {
  /** Skill metadata rendered by the card. */
  skill: SkillEntry;
}

/**
 * Renders a navigable skill card.
 *
 * @param skill Skill metadata and owning plugin information.
 * @returns A link-wrapped card for the skill grid.
 */
export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link
      href={`/skill/${skill.repo.owner}/${skill.repo.repo}/${skill.name}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-brand-500 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-2xl">{getSkillIcon(skill.name)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-gray-900 group-hover:text-brand-600">
              {skill.name}
            </h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${skill.repo.color}`}>
              {skill.repo.label}
            </span>
          </div>
          <p className="mt-1 font-mono text-sm text-gray-500">{getSkillInvocation(skill.repo, skill.name)}</p>
          <p className="mt-1 text-xs text-gray-400">Plugin repo: {skill.repo.owner}/{skill.repo.repo}</p>
        </div>
        <svg
          className="mt-1 h-4 w-4 shrink-0 text-gray-300 group-hover:text-brand-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
