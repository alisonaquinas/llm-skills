/**
 * Shared SVG iconography for the marketplace shell.
 *
 * Responsibilities:
 * - centralize reusable social and feed glyphs for the site chrome
 * - keep brand-adjacent visual assets localized to a single presentation module
 * - provide stable icon primitives that can be reused without duplicating SVG paths
 *
 * Dependency rules:
 * - remains presentation-only and does not import catalog or business logic modules
 * - exports pure icon components that inherit sizing and accessibility from callers
 */

import type { SVGProps } from "react";
import { buildPublicAssetPath } from "@/lib/seo";

/**
 * Renders Alison Aquinas' actual branded site bug.
 *
 * @param className Optional utility classes that size and position the rendered mark.
 * @returns Branded bug image sourced from the vendored web asset.
 */
export function BrandBug({ className }: { className?: string }) {
  return (
    <img
      src={buildPublicAssetPath("alison-bug.svg")}
      alt="Alison Aquinas logo"
      width={40}
      height={40}
      className={className}
    />
  );
}

/**
 * Presents the GitHub brand glyph for repository and profile links.
 *
 * @param props Shared SVG presentation properties.
 * @returns GitHub SVG mark sized by the caller.
 */
export function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.8.5 12.34c0 5.23 3.29 9.67 7.86 11.24.58.11.79-.26.79-.57 0-.28-.01-1.22-.02-2.22-3.2.71-3.87-1.39-3.87-1.39-.52-1.37-1.28-1.73-1.28-1.73-1.05-.73.08-.72.08-.72 1.16.08 1.77 1.22 1.77 1.22 1.03 1.82 2.69 1.29 3.35.99.1-.77.4-1.29.73-1.59-2.56-.3-5.25-1.31-5.25-5.85 0-1.29.45-2.35 1.19-3.18-.12-.3-.52-1.5.11-3.12 0 0 .97-.32 3.19 1.21a10.8 10.8 0 0 1 5.8 0c2.21-1.53 3.18-1.21 3.18-1.21.64 1.62.24 2.82.12 3.12.74.83 1.19 1.89 1.19 3.18 0 4.55-2.7 5.54-5.28 5.84.41.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.69.8.57 4.56-1.58 7.84-6.02 7.84-11.24C23.5 5.8 18.35.5 12 .5" />
    </svg>
  );
}

/**
 * Presents a simple globe icon for general web destinations.
 *
 * @param props Shared SVG presentation properties.
 * @returns Globe SVG mark sized by the caller.
 */
export function GlobeIcon(props: SVGProps<SVGSVGElement>) {
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
 * Presents the LinkedIn brand glyph for author profile links.
 *
 * @param props Shared SVG presentation properties.
 * @returns LinkedIn SVG mark sized by the caller.
 */
export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-9.5 6.5H7V17h2.5zM8.25 6.96a1.46 1.46 0 1 0 0 2.92 1.46 1.46 0 0 0 0-2.92M17 12.27c0-2.46-1.31-3.6-3.05-3.6-1.41 0-2.04.78-2.39 1.32V9.5H9.06c.03.66 0 7.5 0 7.5h2.5v-4.19c0-.22.02-.44.08-.6.17-.43.56-.88 1.22-.88.86 0 1.2.66 1.2 1.63V17H17z" />
    </svg>
  );
}

/**
 * Presents a traditional RSS feed glyph for feed discovery links.
 *
 * @param props Shared SVG presentation properties.
 * @returns RSS SVG mark sized by the caller.
 */
export function RssIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M5 3a2 2 0 0 0 0 4c6.62 0 12 5.38 12 12a2 2 0 1 0 4 0C21 10.17 13.83 3 5 3Z" />
      <path d="M5 10a2 2 0 0 0 0 4c2.76 0 5 2.24 5 5a2 2 0 1 0 4 0c0-4.97-4.03-9-9-9Z" />
      <circle cx="6" cy="18" r="2" />
    </svg>
  );
}

/**
 * Presents a downward download glyph for release-asset actions.
 *
 * @param props Shared SVG presentation properties.
 * @returns Download icon sized by the caller.
 */
export function DownloadIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 19h14" />
    </svg>
  );
}

/**
 * Presents a clipboard-style copy glyph for copy-to-clipboard actions.
 *
 * @param props Shared SVG presentation properties.
 * @returns Copy icon sized by the caller.
 */
export function CopyIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

/**
 * Presents a 3x3 grid glyph for skill-catalog navigation affordances.
 *
 * @param props Shared SVG presentation properties.
 * @returns Grid icon sized by the caller.
 */
export function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

/**
 * Presents an open-book glyph for guides and learning affordances.
 *
 * @param props Shared SVG presentation properties.
 * @returns Book-open icon sized by the caller.
 */
export function BookOpenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M2 6c0 0 4-1 10-1s10 1 10 1v14c0 0-4-1-10-1S2 20 2 20V6Z" />
      <path d="M12 5v14" />
    </svg>
  );
}

/**
 * Presents a hamburger menu icon for compact navigation affordances.
 *
 * @param props Shared SVG presentation properties.
 * @returns Menu icon sized by the caller.
 */
export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path strokeLinecap="round" d="M4 7h16" />
      <path strokeLinecap="round" d="M4 12h16" />
      <path strokeLinecap="round" d="M4 17h16" />
    </svg>
  );
}

/**
 * Presents a close icon for dismissible overlays and popovers.
 *
 * @param props Shared SVG presentation properties.
 * @returns Close icon sized by the caller.
 */
export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path strokeLinecap="round" d="M6 6l12 12" />
      <path strokeLinecap="round" d="M18 6 6 18" />
    </svg>
  );
}
