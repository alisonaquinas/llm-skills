/**
 * Unit tests for the theme helper module.
 *
 * Responsibilities:
 * - verify persisted value parsing and validation
 * - ensure effective theme resolution respects system preference semantics
 * - protect the bootstrap script contract used by the root layout
 */
import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
  getThemeBootstrapScript,
  parseThemePreference,
  resolveEffectiveTheme,
} from "@/lib/theme";

describe("theme helpers", () => {
  it("falls back to system for invalid stored preferences", () => {
    expect(parseThemePreference("sepia")).toBe(DEFAULT_THEME_PREFERENCE);
    expect(parseThemePreference(null)).toBe(DEFAULT_THEME_PREFERENCE);
  });

  it("keeps valid saved preferences unchanged", () => {
    expect(parseThemePreference("system")).toBe("system");
    expect(parseThemePreference("light")).toBe("light");
    expect(parseThemePreference("dark")).toBe("dark");
  });

  it("resolves system preference using the operating-system signal", () => {
    expect(resolveEffectiveTheme("system", true)).toBe("dark");
    expect(resolveEffectiveTheme("system", false)).toBe("light");
  });

  it("lets explicit user preference override the system signal", () => {
    expect(resolveEffectiveTheme("light", true)).toBe("light");
    expect(resolveEffectiveTheme("dark", false)).toBe("dark");
  });

  it("embeds the storage key and theme logic in the bootstrap script", () => {
    const script = getThemeBootstrapScript();

    expect(script).toContain(THEME_STORAGE_KEY);
    expect(script).toContain('classList.toggle("dark"');
    expect(script).toContain('matchMedia("(prefers-color-scheme: dark)")');
  });
});
