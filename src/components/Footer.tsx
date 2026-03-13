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
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-gray-900">{MARKETPLACE.title}</p>
          <p>Current version: v{MARKETPLACE.version}</p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <p className="text-gray-900">
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
                className="inline-flex items-center gap-2 text-gray-600 transition hover:text-brand-700"
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

/**
 * Presents a simple globe icon for general web destinations.
 *
 * @param props Shared SVG presentation properties.
 * @returns Globe SVG mark sized by the caller.
 */
function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14.5 14.5 0 0 1 0 18" />
      <path d="M12 3a14.5 14.5 0 0 0 0 18" />
    </svg>
  );
}

/**
 * Presents the GitHub brand glyph for the profile link.
 *
 * @param props Shared SVG presentation properties.
 * @returns GitHub SVG mark sized by the caller.
 */
function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 .5C5.65.5.5 5.8.5 12.34c0 5.23 3.29 9.67 7.86 11.24.58.11.79-.26.79-.57 0-.28-.01-1.22-.02-2.22-3.2.71-3.87-1.39-3.87-1.39-.52-1.37-1.28-1.73-1.28-1.73-1.05-.73.08-.72.08-.72 1.16.08 1.77 1.22 1.77 1.22 1.03 1.82 2.69 1.29 3.35.99.1-.77.4-1.29.73-1.59-2.56-.3-5.25-1.31-5.25-5.85 0-1.29.45-2.35 1.19-3.18-.12-.3-.52-1.5.11-3.12 0 0 .97-.32 3.19 1.21a10.8 10.8 0 0 1 5.8 0c2.21-1.53 3.18-1.21 3.18-1.21.64 1.62.24 2.82.12 3.12.74.83 1.19 1.89 1.19 3.18 0 4.55-2.7 5.54-5.28 5.84.41.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.69.8.57 4.56-1.58 7.84-6.02 7.84-11.24C23.5 5.8 18.35.5 12 .5" />
    </svg>
  );
}

/**
 * Presents the LinkedIn brand glyph for the profile link.
 *
 * @param props Shared SVG presentation properties.
 * @returns LinkedIn SVG mark sized by the caller.
 */
function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-9.5 6.5H7V17h2.5zM8.25 6.96a1.46 1.46 0 1 0 0 2.92 1.46 1.46 0 0 0 0-2.92M17 12.27c0-2.46-1.31-3.6-3.05-3.6-1.41 0-2.04.78-2.39 1.32V9.5H9.06c.03.66 0 7.5 0 7.5h2.5v-4.19c0-.22.02-.44.08-.6.17-.43.56-.88 1.22-.88.86 0 1.2.66 1.2 1.63V17H17z" />
    </svg>
  );
}
