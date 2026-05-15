/**
 * Codex marketplace document validation helpers.
 *
 * Responsibilities:
 * - validate generated Codex marketplace documents against Codex schema rules
 * - detect committed marketplace files that have drifted from catalog generation
 * - keep CLI validation logic separate from generation code
 * - produce focused file-scoped diagnostics
 */
import type { CatalogFile } from "@/lib/catalog";
import type { CodexMarketplaceDocument } from "./codex-marketplace";
import { buildCodexMarketplaceDocument } from "./codex-marketplace";

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

/**
 * Validates that a Codex marketplace document exactly matches the configured catalog.
 *
 * @param doc Codex marketplace document to validate.
 * @param catalog Parsed repository catalog used as generation source.
 * @param filePath File path used for diagnostic output.
 */
export function validateCodexMarketplaceMatchesCatalog(
  doc: CodexMarketplaceDocument,
  catalog: CatalogFile,
  filePath: string
): void {
  const expected = buildCodexMarketplaceDocument(catalog);

  assert(doc.name === expected.name, "marketplace 'name' does not match catalog", filePath);
  assert(
    doc.interface.displayName === expected.interface.displayName,
    "marketplace 'interface.displayName' does not match catalog",
    filePath
  );
  assert(
    doc.plugins.length === expected.plugins.length,
    `expected ${expected.plugins.length} plugins from catalog, found ${doc.plugins.length}`,
    filePath
  );

  expected.plugins.forEach((expectedPlugin, index) => {
    const actualPlugin = doc.plugins[index];
    const ctx = `plugins[${index}] (${actualPlugin?.name ?? "missing"})`;

    assert(actualPlugin, `${ctx}: missing generated catalog plugin`, filePath);
    assert(
      actualPlugin.name === expectedPlugin.name,
      `${ctx}: name '${actualPlugin.name}' does not match generated catalog name '${expectedPlugin.name}'`,
      filePath
    );
    assert(
      JSON.stringify(actualPlugin.source) === JSON.stringify(expectedPlugin.source),
      `${ctx}: source does not match generated catalog source`,
      filePath
    );
    assert(
      JSON.stringify(actualPlugin.policy) === JSON.stringify(expectedPlugin.policy),
      `${ctx}: policy does not match generated catalog policy`,
      filePath
    );
    assert(
      actualPlugin.category === expectedPlugin.category,
      `${ctx}: category '${actualPlugin.category}' does not match generated catalog category '${expectedPlugin.category}'`,
      filePath
    );
  });
}
