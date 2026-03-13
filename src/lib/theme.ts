/**
 * Theme preference helpers shared by the marketplace shell and tests.
 *
 * Responsibilities:
 * - define the supported persisted theme preference values
 * - validate browser-stored theme selections
 * - resolve the effective theme when the user follows system preference
 * - generate the bootstrap script that applies theme state before hydration
 *
 * Dependency rules:
 * - stays framework-agnostic so it can be reused by server and client code
 * - does not read browser globals directly outside explicit script generation
 */

/** Supported persisted theme preference values. */
export type ThemePreference = "system" | "light" | "dark";

/** Concrete theme applied to the document root. */
export type EffectiveTheme = "light" | "dark";

/** Stable browser storage key used for the marketplace theme preference. */
export const THEME_STORAGE_KEY = "llm-skills-theme-preference";

/** Default preference used when the browser has no stored value. */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

/**
 * Returns true when the provided value is a supported theme preference.
 *
 * @param value Unknown stored value to validate.
 * @returns Whether the value is a valid theme preference.
 */
export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

/**
 * Normalizes unknown stored data into a supported theme preference.
 *
 * @param value Unknown persisted value.
 * @returns The validated preference, or `system` when invalid.
 */
export function parseThemePreference(value: unknown): ThemePreference {
  return isThemePreference(value) ? value : DEFAULT_THEME_PREFERENCE;
}

/**
 * Resolves the concrete document theme from a user preference and system signal.
 *
 * @param preference Saved user preference.
 * @param systemPrefersDark Whether the operating system prefers dark mode.
 * @returns The concrete light or dark theme to apply.
 */
export function resolveEffectiveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean
): EffectiveTheme {
  if (preference === "light" || preference === "dark") {
    return preference;
  }

  return systemPrefersDark ? "dark" : "light";
}

/**
 * Builds the inline bootstrap script that applies the correct theme before hydration.
 *
 * @returns Serialized script source for use in the root layout.
 */
export function getThemeBootstrapScript(): string {
  return `(() => {
  const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  const root = document.documentElement;
  const parsePreference = (value) =>
    value === "light" || value === "dark" || value === "system" ? value : "system";
  const getSystemPrefersDark = () =>
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const applyTheme = (preference) => {
    const resolved = preference === "system"
      ? (getSystemPrefersDark() ? "dark" : "light")
      : preference;
    root.classList.toggle("dark", resolved === "dark");
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolved;
  };

  try {
    const stored = window.localStorage.getItem(storageKey);
    applyTheme(parsePreference(stored));
  } catch {
    applyTheme("system");
  }
})();`;
}
