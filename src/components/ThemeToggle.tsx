"use client";

/**
 * Theme preference control rendered in the marketplace header.
 *
 * Responsibilities:
 * - display the current saved theme preference with a compact icon trigger
 * - persist user preference changes to localStorage
 * - keep the document root synchronized with explicit and system-driven theme changes
 * - expose an accessible menu for switching between system, light, and dark modes
 *
 * Dependency rules:
 * - uses theme helpers from src/lib/theme for validation and resolution
 * - owns browser-only state and document updates locally in the client layer
 */
import { useEffect, useId, useRef, useState } from "react";
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
  parseThemePreference,
  resolveEffectiveTheme,
  type ThemePreference,
} from "@/lib/theme";

/** Available theme menu options with labels and icons. */
const THEME_OPTIONS: ReadonlyArray<{
  value: ThemePreference;
  label: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
}> = [
  { value: "system", label: "System", Icon: MonitorIcon },
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
] as const;

/**
 * Renders the compact theme selection control for the header.
 *
 * @returns Interactive theme preference menu.
 */
export default function ThemeToggle() {
  /** Saved theme preference selected by the user. */
  const [preference, setPreference] = useState<ThemePreference>(DEFAULT_THEME_PREFERENCE);
  /** Whether the system currently prefers dark mode. */
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  /** Whether the popup menu is visible. */
  const [isOpen, setIsOpen] = useState(false);
  /** Root element used for outside-click detection. */
  const containerRef = useRef<HTMLDivElement | null>(null);
  /** Stable id used to bind the button and menu. */
  const buttonId = useId();

  const activeOption =
    THEME_OPTIONS.find((option) => option.value === preference) ?? THEME_OPTIONS[0];
  const resolvedTheme = resolveEffectiveTheme(preference, systemPrefersDark);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemPreference = () => setSystemPrefersDark(mediaQuery.matches);
    updateSystemPreference();

    try {
      setPreference(parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY)));
    } catch {
      setPreference(DEFAULT_THEME_PREFERENCE);
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolvedTheme;
  }, [preference, resolvedTheme]);

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

  /**
   * Persists a newly selected theme preference and closes the menu.
   *
   * @param nextPreference Theme option chosen by the user.
   */
  function selectPreference(nextPreference: ThemePreference) {
    setPreference(nextPreference);
    setIsOpen(false);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    } catch {
      // Ignore storage failures so the toggle still works for the current session.
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        id={buttonId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={`${buttonId}-menu`}
        aria-label={`Theme preference: ${activeOption.label}`}
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
      >
        <activeOption.Icon className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div
          id={`${buttonId}-menu`}
          role="menu"
          aria-labelledby={buttonId}
          className="absolute right-0 top-12 z-20 min-w-40 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {THEME_OPTIONS.map(({ value, label, Icon }) => {
            const isActive = value === preference;

            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => selectPreference(value)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive ? <CheckIcon className="h-4 w-4 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Renders the system theme icon.
 *
 * @param props Shared SVG presentation properties.
 * @returns Monitor icon for the system theme mode.
 */
function MonitorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

/**
 * Renders the light theme icon.
 *
 * @param props Shared SVG presentation properties.
 * @returns Sun icon for the light theme mode.
 */
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5" />
      <path d="M12 19.5V22" />
      <path d="M4.93 4.93l1.77 1.77" />
      <path d="M17.3 17.3l1.77 1.77" />
      <path d="M2 12h2.5" />
      <path d="M19.5 12H22" />
      <path d="M4.93 19.07l1.77-1.77" />
      <path d="M17.3 6.7l1.77-1.77" />
    </svg>
  );
}

/**
 * Renders the dark theme icon.
 *
 * @param props Shared SVG presentation properties.
 * @returns Moon icon for the dark theme mode.
 */
function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

/**
 * Renders the active-state checkmark icon for the selected menu item.
 *
 * @param props Shared SVG presentation properties.
 * @returns Check icon for the selected theme option.
 */
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
