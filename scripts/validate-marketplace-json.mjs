#!/usr/bin/env node
// Validates a marketplace.json file for this repository's expected marketplace structure.
// Usage: node scripts/validate-marketplace-json.mjs [path]
// Exits 0 on success, 1 on failure.

import { readFile } from "node:fs/promises";

const filePath = process.argv[2] ?? ".claude-plugin/marketplace.json";

function fail(msg) {
  console.error(`FAIL ${filePath}: ${msg}`);
  process.exit(1);
}

function assert(condition, msg) {
  if (!condition) {
    fail(msg);
  }
}

function isKebabCase(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isGithubRepo(value) {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value);
}

async function main() {
  let raw;
  try {
    raw = await readFile(filePath, "utf-8");
  } catch {
    fail("file not found or unreadable");
  }

  let doc;
  try {
    doc = JSON.parse(raw);
  } catch (error) {
    fail(`invalid JSON: ${error.message}`);
  }

  assert(typeof doc.name === "string" && doc.name.length > 0, "missing or empty 'name'");
  assert(isKebabCase(doc.name), "marketplace 'name' must be kebab-case");
  assert(doc.owner && typeof doc.owner.name === "string" && doc.owner.name.length > 0, "missing 'owner.name'");
  assert(doc.metadata && typeof doc.metadata === "object", "missing 'metadata'");
  assert(typeof doc.metadata.description === "string" && doc.metadata.description.length > 0, "missing 'metadata.description'");
  assert(typeof doc.metadata.version === "string" && doc.metadata.version.length > 0, "missing 'metadata.version'");
  assert(Array.isArray(doc.plugins), "'plugins' must be an array");
  assert(doc.plugins.length === 2, "expected exactly 2 plugins");

  const names = new Set();

  for (let i = 0; i < doc.plugins.length; i += 1) {
    const plugin = doc.plugins[i];
    const ctx = `plugins[${i}] (${plugin?.name ?? "unnamed"})`;

    assert(typeof plugin.name === "string" && plugin.name.length > 0, `${ctx}: missing 'name'`);
    assert(isKebabCase(plugin.name), `${ctx}: 'name' must be kebab-case`);
    assert(!names.has(plugin.name), `${ctx}: duplicate plugin name '${plugin.name}'`);
    names.add(plugin.name);

    assert(plugin.source && typeof plugin.source === "object", `${ctx}: missing 'source'`);
    assert(plugin.source.source === "github", `${ctx}: source.source must be 'github'`);
    assert(typeof plugin.source.repo === "string" && isGithubRepo(plugin.source.repo), `${ctx}: source.repo must be 'owner/repo'`);
    if (plugin.source.ref !== undefined) {
      assert(typeof plugin.source.ref === "string" && plugin.source.ref.length > 0, `${ctx}: source.ref must be a non-empty string when provided`);
    }
    if (plugin.source.sha !== undefined) {
      assert(typeof plugin.source.sha === "string" && /^[0-9a-f]{40}$/i.test(plugin.source.sha), `${ctx}: source.sha must be a full 40-character git SHA when provided`);
    }

    if (plugin.description !== undefined) {
      assert(typeof plugin.description === "string" && plugin.description.length > 0, `${ctx}: description must be a non-empty string when provided`);
    }
    if (plugin.version !== undefined) {
      assert(typeof plugin.version === "string" && plugin.version.length > 0, `${ctx}: version must be a non-empty string when provided`);
    }
  }

  console.log(`OK ${filePath}: ${doc.plugins.length} plugins, all valid`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
