/**
 * Presentational card for a single skill entry in the marketplace grid.
 *
 * Responsibilities:
 * - render skill metadata with consistent visual affordances
 * - construct the skill detail route link
 * - surface the canonical invocation command for the selected skill
 * - expose a direct release-asset download action without nesting anchors
 */
import Link from "next/link";
import type { SkillEntry } from "@/lib/github";
import { getSkillInvocation } from "@/lib/commands";
import { getSkillIcon } from "@/lib/skills";
import CopyButton from "./CopyButton";
import { DownloadIcon } from "./SiteIcons";

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
 * @returns A card with separate detail-navigation and download actions.
 */
export default function SkillCard({ skill }: SkillCardProps) {
  const invocation = getSkillInvocation(skill.repo, skill.name);

  return (
    <article className="group relative rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-400 sm:p-5">
      <Link
        href={`/skill/${skill.repo.owner}/${skill.repo.repo}/${skill.name}`}
        aria-label={`View details for ${skill.name}`}
        className="absolute inset-0 z-[1] rounded-xl"
      />
      <div className="relative flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-2xl">{getSkillIcon(skill.name)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <h3 className="break-words font-semibold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
              {skill.name}
            </h3>
            <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${skill.repo.color}`}>
              {skill.repo.label}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="min-w-0 flex-1 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/80">
              <p
                className="truncate font-mono text-sm text-gray-500 dark:text-gray-300"
                title={invocation}
              >
                {invocation}
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <CopyButton
                text={invocation}
                label="Copy command"
                ariaLabel={`Copy install command for ${skill.name}`}
                variant="icon"
              />
            </div>
          </div>
          <p className="mt-1 break-all text-xs text-gray-400 dark:text-gray-500">
            Bundle repo: {skill.repo.owner}/{skill.repo.repo}
          </p>
        </div>
        <div className="relative z-10 mt-1 flex shrink-0 items-center gap-2">
          {skill.downloadUrl ? (
            <a
              href={skill.downloadUrl}
              aria-label={`Download ${skill.name}-skill.zip`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
            >
              <DownloadIcon className="h-4 w-4" />
            </a>
          ) : null}
          <svg
            className="hidden h-4 w-4 text-gray-300 group-hover:text-brand-500 dark:text-gray-600 dark:group-hover:text-brand-300 sm:block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </article>
  );
}
