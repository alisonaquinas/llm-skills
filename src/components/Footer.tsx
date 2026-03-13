/**
 * Shared marketplace footer rendered across every public route.
 *
 * Responsibilities:
 * - display stable release metadata sourced from the catalog configuration
 * - credit the site author with durable, crawlable profile links
 * - keep external-brand iconography localized to the presentation layer
 *
 * Dependency rules:
 * - reads version and site title from the catalog namespace only
 * - does not fetch remote data or perform page-level business logic
 */
import { GitHubIcon, GlobeIcon, LinkedInIcon } from "@/components/SiteIcons";
import { MARKETPLACE } from "@/lib/catalog";

/** Author profile links rendered in the marketplace footer. */
const CREATOR_LINKS = [
  {
    href: "https://www.alisonquinas.com/",
    label: "Website",
    icon: GlobeIcon,
  },
  {
    href: "https://github.com/alisonaquinas",
    label: "GitHub",
    icon: GitHubIcon,
  },
  {
    href: "https://www.linkedin.com/in/alisonaquinas/",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
] as const;

/**
 * Renders the shared footer for the marketplace shell.
 *
 * @returns Footer chrome with version metadata and creator profile links.
 */
export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-gray-600 dark:text-gray-400 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-gray-900 dark:text-white">{MARKETPLACE.title}</p>
          <p>Current version: v{MARKETPLACE.version}</p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <p className="text-gray-900 dark:text-white">
            Vibe-coded by: <span className="font-semibold">Alison Aquinas</span>
          </p>
          <div className="flex flex-wrap gap-4">
            {CREATOR_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={`Visit Alison Aquinas on ${label}`}
                className="inline-flex items-center gap-2 text-gray-600 transition hover:text-brand-700 dark:text-gray-400 dark:hover:text-brand-200"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
