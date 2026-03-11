#!/usr/bin/env node
// Validates out/marketplace.json against the Claude Code marketplace schema.
// Usage: node scripts/validate-marketplace-json.mjs [path]
// Exits 0 on success, 1 on failure.

import { readFile } from "node:fs/promises";

const filePath = process.argv[2] ?? "out/marketplace.json";

function fail(msg) {
  console.error(`FAIL ${filePath}: ${msg}`);
  process.exit(1);
}

function assert(condition, msg) {
  if (!condition) fail(msg);
}

async function main() {
  let raw;
  try {
    raw = await readFile(filePath, "utf-8");
  } catch {
    fail(`file not found or unreadable`);
  }

  let doc;
  try {
    doc = JSON.parse(raw);
  } catch (e) {
    fail(`invalid JSON: ${e.message}`);
  }

  // Top-level fields
  assert(typeof doc.name === "string" && doc.name.length > 0, "missing or empty 'name'");
  assert(doc.owner && typeof doc.owner.name === "string" && doc.owner.name.length > 0, "missing 'owner.name'");
  assert(doc.metadata && typeof doc.metadata.description === "string", "missing 'metadata.description'");
  assert(doc.metadata && typeof doc.metadata.version === "string", "missing 'metadata.version'");
  assert(Array.isArray(doc.plugins), "'plugins' must be an array");
  assert(doc.plugins.length > 0, "'plugins' array is empty");

  // Per-plugin fields
  for (let i = 0; i < doc.plugins.length; i++) {
    const p = doc.plugins[i];
    const ctx = `plugins[${i}] (${p.name ?? "unnamed"})`;
    assert(typeof p.name === "string" && p.name.length > 0, `${ctx}: missing 'name'`);
    assert(p.source && typeof p.source === "object", `${ctx}: missing 'source'`);
    assert(p.source.source === "git-subdir", `${ctx}: source.source must be 'git-subdir', got '${p.source.source}'`);
    assert(typeof p.source.url === "string" && p.source.url.startsWith("https://"), `${ctx}: source.url must be an https URL`);
    assert(typeof p.source.path === "string" && p.source.path.length > 0, `${ctx}: missing 'source.path'`);
    assert(typeof p.source.ref === "string" && p.source.ref.length > 0, `${ctx}: missing 'source.ref'`);
  }

  console.log(`OK ${filePath}: ${doc.plugins.length} plugins, all valid`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
