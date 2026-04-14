"use client";

/**
 * Compact mobile navigation menu for header links that do not fit on phone widths.
 *
 * Responsibilities:
 * - keep repository and RSS links reachable on narrow screens
 * - own menu open and close behavior for outside click and escape dismissal
 * - present touch-friendly menu items without disturbing the desktop header layout
 *
 * Dependency rules:
 * - stays client-only because it manages browser events and transient menu state
 * - consumes only presentational icon helpers and stable catalog-derived props from callers
 */
import { useEffect, useId, useRef, useState } from "react";
import { BookOpenIcon, CloseIcon, GitHubIcon, GridIcon, MenuIcon, RssIcon } from "@/components/SiteIcons";

/**
 * Individual link metadata rendered inside the mobile header menu.
 */
export interface MobileHeaderMenuItem {
  /** Stable key used when rendering menu entries. */
  key: string;
  /** Destination URL for the menu entry. */
  href: string;
  /** Human-readable label rendered in the menu. */
  label: string;
  /** Icon component paired with the menu entry. */
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  /** When true, opens in a new tab with rel="noopener noreferrer". Defaults to false. */
  isExternal?: boolean;
}

/**
 * Props accepted by the mobile header menu.
 */
interface MobileHeaderMenuProps {
  /** Menu entries rendered for narrow screens only. */
  items: MobileHeaderMenuItem[];
}

/**
 * Renders the compact mobile overflow menu for header links.
 *
 * @param items Navigation entries moved out of the main header row on phones.
 * @returns A touch-friendly popover menu trigger for mobile navigation.
 */
export default function MobileHeaderMenu({ items }: MobileHeaderMenuProps) {
  /** Whether the menu popover is currently visible. */
  const [isOpen, setIsOpen] = useState(false);
  /** Root menu element used for outside-click detection. */
  const containerRef = useRef<HTMLDivElement | null>(null);
  /** Stable id used to associate the trigger and popup menu. */
  const buttonId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const TriggerIcon = isOpen ? CloseIcon : MenuIcon;

  return (
    <div ref={containerRef} className="relative md:hidden">
      <button
        id={buttonId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={`${buttonId}-menu`}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
      >
        <TriggerIcon className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div
          id={`${buttonId}-menu`}
          role="menu"
          aria-labelledby={buttonId}
          className="absolute right-0 top-12 z-20 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map(({ key, href, label, Icon, isExternal }) => {
            const itemClass = "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-gray-200 dark:hover:bg-brand-950/40 dark:hover:text-brand-100";
            return (
              <a
                key={key}
                href={href}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className={itemClass}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 break-words">{label}</span>
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Exported icon map used by callers that build menu entries in a typed way.
 */
export const MOBILE_HEADER_MENU_ICONS = {
  github: GitHubIcon,
  rss: RssIcon,
  skills: GridIcon,
  guides: BookOpenIcon,
} as const;

