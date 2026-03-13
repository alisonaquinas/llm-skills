/**
 * Marketplace document validation helpers.
 *
 * Responsibilities:
 * - validate the generated marketplace document against repo expectations
 * - provide focused assertion helpers with file-aware error messages
 * - keep CLI validation logic separate from rule definitions
 */
import type { MarketplaceDocument } from "./marketplace";

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
 * Determines whether a string matches GitHub owner/repo notation.
 *
 * @param value Candidate repository identifier.
 * @returns True when the value is a valid owner/repo pair.
 */
function isGithubRepo(value: string): boolean {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value);
}

/**
 * Validates a generated marketplace document against repository expectations.
 *
 * @param doc Marketplace document to validate.
 * @param filePath File path used for diagnostic output.
 */
export function validateMarketplaceDocument(doc: MarketplaceDocument, filePath: string): void {
  assert(typeof doc.name === "string" && doc.name.length > 0, "missing or empty 'name'", filePath);
  assert(isKebabCase(doc.name), "marketplace 'name' must be kebab-case", filePath);
  assert(
    doc.owner && typeof doc.owner.name === "string" && doc.owner.name.length > 0,
    "missing 'owner.name'",
    filePath
  );
  assert(doc.metadata && typeof doc.metadata === "object", "missing 'metadata'", filePath);
  assert(
    typeof doc.metadata.description === "string" && doc.metadata.description.length > 0,
    "missing 'metadata.description'",
    filePath
  );
  assert(
    typeof doc.metadata.version === "string" && doc.metadata.version.length > 0,
    "missing 'metadata.version'",
    filePath
  );
  assert(Array.isArray(doc.plugins), "'plugins' must be an array", filePath);
  assert(doc.plugins.length === 2, "expected exactly 2 plugins", filePath);

  const names = new Set<string>();

  doc.plugins.forEach((plugin, index) => {
    const ctx = `plugins[${index}] (${plugin?.name ?? "unnamed"})`;

    assert(typeof plugin.name === "string" && plugin.name.length > 0, `${ctx}: missing 'name'`, filePath);
    assert(isKebabCase(plugin.name), `${ctx}: 'name' must be kebab-case`, filePath);
    assert(!names.has(plugin.name), `${ctx}: duplicate plugin name '${plugin.name}'`, filePath);
    names.add(plugin.name);

    assert(plugin.source && typeof plugin.source === "object", `${ctx}: missing 'source'`, filePath);
    assert(plugin.source.source === "github", `${ctx}: source.source must be 'github'`, filePath);
    assert(
      typeof plugin.source.repo === "string" && isGithubRepo(plugin.source.repo),
      `${ctx}: source.repo must be 'owner/repo'`,
      filePath
    );
    if (plugin.source.ref !== undefined) {
      assert(
        typeof plugin.source.ref === "string" && plugin.source.ref.length > 0,
        `${ctx}: source.ref must be a non-empty string when provided`,
        filePath
      );
    }
  });
}
