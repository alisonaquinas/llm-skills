/**
 * Codex marketplace document validation helpers.
 *
 * Responsibilities:
 * - validate generated Codex marketplace documents against Codex schema rules
 * - keep CLI validation logic separate from generation code
 * - produce focused file-scoped diagnostics
 */
import type { CodexMarketplaceDocument } from "./codex-marketplace";

/**
 * Throws a file-scoped validation error when a condition is not met.
 *
 * @param condition Condition that must be truthy.
 * @param msg Validation failure description.
 * @param filePath File being validated.
 */
function assert(condition: unknown, msg: string, filePath: string): asserts condition {
  if (!condition) {
    throw new Error(`FAIL ${filePath}: ${msg}`);
  }
}

/**
 * Determines whether a string uses simple kebab-case formatting.
 *
 * @param value Candidate string to validate.
 * @returns True when the string is kebab-case.
 */
function isKebabCase(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

/**
 * Validates a generated Codex marketplace document.
 *
 * @param doc Codex marketplace document to validate.
 * @param filePath File path used for diagnostic output.
 */
export function validateCodexMarketplaceDocument(
  doc: CodexMarketplaceDocument,
  filePath: string
): void {
  assert(typeof doc.name === "string" && doc.name.length > 0, "missing or empty 'name'", filePath);
  assert(isKebabCase(doc.name), "marketplace 'name' must be kebab-case", filePath);
  assert(
    doc.interface && typeof doc.interface.displayName === "string" && doc.interface.displayName.length > 0,
    "missing 'interface.displayName'",
    filePath
  );
  assert(Array.isArray(doc.plugins), "'plugins' must be an array", filePath);
  assert(doc.plugins.length >= 1, "expected at least 1 plugin", filePath);

  const names = new Set<string>();

  doc.plugins.forEach((plugin, index) => {
    const ctx = `plugins[${index}] (${plugin?.name ?? "unnamed"})`;

    assert(typeof plugin.name === "string" && plugin.name.length > 0, `${ctx}: missing 'name'`, filePath);
    assert(isKebabCase(plugin.name), `${ctx}: 'name' must be kebab-case`, filePath);
    assert(!names.has(plugin.name), `${ctx}: duplicate plugin name '${plugin.name}'`, filePath);
    names.add(plugin.name);

    assert(plugin.source && typeof plugin.source === "object", `${ctx}: missing 'source'`, filePath);
    assert(plugin.source.source === "url", `${ctx}: source.source must be 'url'`, filePath);
    assert(
      typeof plugin.source.url === "string" &&
        /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\.git$/.test(plugin.source.url),
      `${ctx}: source.url must be an HTTPS GitHub .git URL`,
      filePath
    );
    if (plugin.source.ref !== undefined) {
      assert(
        typeof plugin.source.ref === "string" && plugin.source.ref.length > 0,
        `${ctx}: source.ref must be a non-empty string when provided`,
        filePath
      );
    }

    assert(plugin.policy && typeof plugin.policy === "object", `${ctx}: missing 'policy'`, filePath);
    assert(plugin.policy.installation === "AVAILABLE", `${ctx}: policy.installation must be 'AVAILABLE'`, filePath);
    assert(plugin.policy.authentication === "ON_INSTALL", `${ctx}: policy.authentication must be 'ON_INSTALL'`, filePath);
    assert(typeof plugin.category === "string" && plugin.category.length > 0, `${ctx}: missing 'category'`, filePath);
  });
}
