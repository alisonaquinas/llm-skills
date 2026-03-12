#!/usr/bin/env node

import { readFile } from "node:fs/promises";

interface MarketplaceSource {
  source: string;
  repo: string;
  ref?: string;
  sha?: string;
}

interface MarketplacePlugin {
  name?: string;
  source?: MarketplaceSource;
  description?: string;
  version?: string;
}

interface MarketplaceDocument {
  name?: string;
  owner?: {
    name?: string;
  };
  metadata?: {
    description?: string;
    version?: string;
  };
  plugins?: MarketplacePlugin[];
}

const filePath = process.argv[2] ?? ".claude-plugin/marketplace.json";

function fail(msg: string): never {
  console.error(`FAIL ${filePath}: ${msg}`);
  process.exit(1);
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) {
    fail(msg);
  }
}

function isKebabCase(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isGithubRepo(value: string): boolean {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value);
}

async function main(): Promise<void> {
  let raw: string;
  try {
    raw = await readFile(filePath, "utf-8");
  } catch {
    fail("file not found or unreadable");
  }

  let doc: MarketplaceDocument;
  try {
    doc = JSON.parse(raw) as MarketplaceDocument;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`invalid JSON: ${message}`);
  }

  assert(typeof doc.name === "string" && doc.name.length > 0, "missing or empty 'name'");
  assert(isKebabCase(doc.name), "marketplace 'name' must be kebab-case");
  assert(
    doc.owner && typeof doc.owner.name === "string" && doc.owner.name.length > 0,
    "missing 'owner.name'"
  );
  assert(doc.metadata && typeof doc.metadata === "object", "missing 'metadata'");
  assert(
    typeof doc.metadata.description === "string" && doc.metadata.description.length > 0,
    "missing 'metadata.description'"
  );
  assert(
    typeof doc.metadata.version === "string" && doc.metadata.version.length > 0,
    "missing 'metadata.version'"
  );
  assert(Array.isArray(doc.plugins), "'plugins' must be an array");
  assert(doc.plugins.length === 2, "expected exactly 2 plugins");

  const names = new Set<string>();

  for (let i = 0; i < doc.plugins.length; i += 1) {
    const plugin = doc.plugins[i];
    const ctx = `plugins[${i}] (${plugin?.name ?? "unnamed"})`;

    assert(typeof plugin.name === "string" && plugin.name.length > 0, `${ctx}: missing 'name'`);
    assert(isKebabCase(plugin.name), `${ctx}: 'name' must be kebab-case`);
    assert(!names.has(plugin.name), `${ctx}: duplicate plugin name '${plugin.name}'`);
    names.add(plugin.name);

    assert(plugin.source && typeof plugin.source === "object", `${ctx}: missing 'source'`);
    assert(plugin.source.source === "github", `${ctx}: source.source must be 'github'`);
    assert(
      typeof plugin.source.repo === "string" && isGithubRepo(plugin.source.repo),
      `${ctx}: source.repo must be 'owner/repo'`
    );
    if (plugin.source.ref !== undefined) {
      assert(
        typeof plugin.source.ref === "string" && plugin.source.ref.length > 0,
        `${ctx}: source.ref must be a non-empty string when provided`
      );
    }
    if (plugin.source.sha !== undefined) {
      assert(
        typeof plugin.source.sha === "string" && /^[0-9a-f]{40}$/i.test(plugin.source.sha),
        `${ctx}: source.sha must be a full 40-character git SHA when provided`
      );
    }

    if (plugin.description !== undefined) {
      assert(
        typeof plugin.description === "string" && plugin.description.length > 0,
        `${ctx}: description must be a non-empty string when provided`
      );
    }
    if (plugin.version !== undefined) {
      assert(
        typeof plugin.version === "string" && plugin.version.length > 0,
        `${ctx}: version must be a non-empty string when provided`
      );
    }
  }

  console.log(`OK ${filePath}: ${doc.plugins.length} plugins, all valid`);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
