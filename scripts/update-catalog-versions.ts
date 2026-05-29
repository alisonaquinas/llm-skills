#!/usr/bin/env node

/**
 * Updates marketplace plugin release pins and generated marketplace artifacts.
 *
 * Responsibilities:
 * - verify requested plugin releases exist and publish expected plugin assets
 * - verify Claude and Codex plugin manifests carry the requested version
 * - update catalog.json, optional package metadata, and committed marketplace JSON
 * - fail fast when generated marketplace files drift from catalog.json
 */
import { readFile, writeFile } from "node:fs/promises";
import type { CatalogFile, PluginConfig } from "@/lib/catalog";
import { loadCatalog } from "./lib/catalog";
import { buildCodexMarketplaceDocument, writeCodexMarketplaceFile } from "./lib/codex-marketplace";
import {
  validateCodexMarketplaceDocument,
  validateCodexMarketplaceMatchesCatalog,
} from "./lib/codex-marketplace-validation";
import { buildMarketplaceDocument, writeMarketplaceFile } from "./lib/marketplace";
import {
  validateMarketplaceDocument,
  validateMarketplaceMatchesCatalog,
} from "./lib/marketplace-validation";

interface CliOptions {
  updates: Map<string, string>;
  latest: boolean;
  marketplaceVersion?: string;
  dryRun: boolean;
}

interface GitHubRelease {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  assets: Array<{ name: string }>;
}

interface PluginManifest {
  name?: string;
  version?: string;
}

interface PackageJson {
  version?: string;
  [key: string]: unknown;
}

interface PackageLockJson {
  version?: string;
  packages?: {
    ""?: {
      version?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const catalogPath = new URL("../catalog.json", import.meta.url);
const packageJsonPath = new URL("../package.json", import.meta.url);
const packageLockPath = new URL("../package-lock.json", import.meta.url);
const semverPattern = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

function printUsage(): void {
  console.log(`Usage:
  npm run marketplace:update-versions -- --set shared-skills=1.8.1
  npm run marketplace:update-versions -- --set doc-skills=1.3.2 --set ci-cd=1.2.4
  npm run marketplace:update-versions -- --latest
  npm run marketplace:update-versions -- --marketplace-version 1.4.11

Options:
  --set <plugin=version>       Pin one catalog plugin to a release version.
  --latest                     Pin every catalog plugin to its latest GitHub release.
  --marketplace-version <ver>  Update catalog/package marketplace version metadata.
  --dry-run                    Verify and print changes without writing files.
  --help                       Show this help.
`);
}

function parseArgs(argv: string[]): CliOptions {
  const updates = new Map<string, string>();
  let latest = false;
  let marketplaceVersion: string | undefined;
  let dryRun = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]!;

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "--latest") {
      latest = true;
      continue;
    }

    if (arg === "--set") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--set requires a plugin=version value");
      }
      addRequestedUpdate(updates, value);
      index += 1;
      continue;
    }

    if (arg.startsWith("--set=")) {
      addRequestedUpdate(updates, arg.slice("--set=".length));
      continue;
    }

    if (arg === "--marketplace-version") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--marketplace-version requires a semver value");
      }
      marketplaceVersion = normalizeVersion(value);
      index += 1;
      continue;
    }

    if (arg.startsWith("--marketplace-version=")) {
      marketplaceVersion = normalizeVersion(arg.slice("--marketplace-version=".length));
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (latest && updates.size > 0) {
    throw new Error("Use either --latest or --set, not both");
  }

  return { updates, latest, marketplaceVersion, dryRun };
}

function addRequestedUpdate(updates: Map<string, string>, value: string): void {
  const separatorIndex = value.indexOf("=");
  if (separatorIndex <= 0 || separatorIndex === value.length - 1) {
    throw new Error(`Invalid --set value '${value}', expected plugin=version`);
  }

  const pluginName = value.slice(0, separatorIndex);
  const version = normalizeVersion(value.slice(separatorIndex + 1));
  updates.set(pluginName, version);
}

function normalizeVersion(value: string): string {
  const version = value.startsWith("v") ? value.slice(1) : value;

  if (!semverPattern.test(version)) {
    throw new Error(`Invalid semver version '${value}'`);
  }

  return version;
}

function tagFromVersion(version: string): string {
  return `v${version}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "llm-skills-marketplace-updater",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

async function fetchRelease(plugin: PluginConfig, tag: string): Promise<GitHubRelease> {
  return fetchJson<GitHubRelease>(
    `https://api.github.com/repos/${plugin.owner}/${plugin.repo}/releases/tags/${tag}`
  );
}

async function fetchLatestVersion(plugin: PluginConfig): Promise<string> {
  const release = await fetchJson<GitHubRelease>(
    `https://api.github.com/repos/${plugin.owner}/${plugin.repo}/releases/latest`
  );

  return normalizeVersion(release.tag_name);
}

async function fetchManifest(plugin: PluginConfig, tag: string, manifestPath: string): Promise<PluginManifest> {
  return fetchJson<PluginManifest>(
    `https://raw.githubusercontent.com/${plugin.owner}/${plugin.repo}/${tag}/${manifestPath}`
  );
}

async function verifyPluginRelease(plugin: PluginConfig, version: string): Promise<void> {
  const tag = tagFromVersion(version);
  const release = await fetchRelease(plugin, tag);

  if (release.draft) {
    throw new Error(`${plugin.pluginName} ${tag} is a draft release`);
  }
  if (release.prerelease) {
    console.warn(`WARN ${plugin.pluginName} ${tag} is marked prerelease`);
  }

  const assetNames = new Set(release.assets.map((asset) => asset.name));
  const expectedAssets = [
    `${plugin.pluginName}-plugin.zip`,
    `${plugin.pluginName}-codex-plugin.zip`,
  ];

  expectedAssets.forEach((assetName) => {
    if (!assetNames.has(assetName)) {
      throw new Error(`${plugin.pluginName} ${tag} is missing release asset ${assetName}`);
    }
  });

  await verifyManifestVersion(plugin, tag, version, ".claude-plugin/plugin.json");
  await verifyManifestVersion(plugin, tag, version, ".codex-plugin/plugin.json");
}

async function verifyManifestVersion(
  plugin: PluginConfig,
  tag: string,
  version: string,
  manifestPath: string
): Promise<void> {
  const manifest = await fetchManifest(plugin, tag, manifestPath);

  if (manifest.version !== version) {
    throw new Error(
      `${plugin.pluginName} ${tag} ${manifestPath} version '${manifest.version ?? "missing"}' does not match ${version}`
    );
  }
  if (!manifest.name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.name)) {
    throw new Error(`${plugin.pluginName} ${tag} ${manifestPath} has invalid or missing name`);
  }
}

async function readJsonFile<T>(url: URL): Promise<T> {
  return JSON.parse(await readFile(url, "utf-8")) as T;
}

async function writeJsonFile(url: URL, value: unknown): Promise<void> {
  await writeFile(url, JSON.stringify(value, null, 2) + "\n");
}

async function updatePackageVersion(version: string): Promise<void> {
  const packageJson = await readJsonFile<PackageJson>(packageJsonPath);
  const packageLock = await readJsonFile<PackageLockJson>(packageLockPath);

  packageJson.version = version;
  packageLock.version = version;
  if (packageLock.packages?.[""]) {
    packageLock.packages[""].version = version;
  }

  await writeJsonFile(packageJsonPath, packageJson);
  await writeJsonFile(packageLockPath, packageLock);
}

function cloneCatalog(catalog: CatalogFile): CatalogFile {
  return JSON.parse(JSON.stringify(catalog)) as CatalogFile;
}

function findPlugin(catalog: CatalogFile, pluginName: string): PluginConfig {
  const plugin = catalog.plugins.find((candidate) => candidate.pluginName === pluginName);
  if (!plugin) {
    throw new Error(`Unknown plugin '${pluginName}'`);
  }
  return plugin;
}

async function resolveRequestedUpdates(catalog: CatalogFile, options: CliOptions): Promise<Map<string, string>> {
  if (!options.latest) {
    return options.updates;
  }

  const updates = new Map<string, string>();
  for (const plugin of catalog.plugins) {
    updates.set(plugin.pluginName, await fetchLatestVersion(plugin));
  }
  return updates;
}

function validateGeneratedDocuments(catalog: CatalogFile): void {
  const marketplaceDocument = buildMarketplaceDocument(catalog);
  validateMarketplaceDocument(marketplaceDocument, ".claude-plugin/marketplace.json");
  validateMarketplaceMatchesCatalog(marketplaceDocument, catalog, ".claude-plugin/marketplace.json");

  const codexMarketplaceDocument = buildCodexMarketplaceDocument(catalog);
  validateCodexMarketplaceDocument(codexMarketplaceDocument, ".agents/plugins/marketplace.json");
  validateCodexMarketplaceMatchesCatalog(codexMarketplaceDocument, catalog, ".agents/plugins/marketplace.json");
}

async function writeGeneratedArtifacts(catalog: CatalogFile): Promise<void> {
  await writeMarketplaceFile(".claude-plugin/marketplace.json", buildMarketplaceDocument(catalog));
  await writeCodexMarketplaceFile(".agents/plugins/marketplace.json", buildCodexMarketplaceDocument(catalog));
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const originalCatalog = await loadCatalog();
  const catalog = cloneCatalog(originalCatalog);
  const updates = await resolveRequestedUpdates(catalog, options);

  if (updates.size === 0 && !options.marketplaceVersion) {
    throw new Error("No updates requested; pass --set, --latest, or --marketplace-version");
  }

  for (const [pluginName, version] of updates) {
    const plugin = findPlugin(catalog, pluginName);
    await verifyPluginRelease(plugin, version);
    plugin.ref = tagFromVersion(version);
    plugin.version = version;
    console.log(`${pluginName} -> ${plugin.ref} (${plugin.version})`);
  }

  if (options.marketplaceVersion) {
    catalog.marketplace.version = options.marketplaceVersion;
    console.log(`marketplace -> ${options.marketplaceVersion}`);
  }

  validateGeneratedDocuments(catalog);

  if (options.dryRun) {
    if (options.marketplaceVersion) {
      console.log(`DRY-RUN package.json/package-lock.json version -> ${options.marketplaceVersion}`);
    }
    console.log("DRY-RUN catalog and marketplace files unchanged");
    return;
  }

  await writeJsonFile(catalogPath, catalog);
  if (options.marketplaceVersion) {
    await updatePackageVersion(options.marketplaceVersion);
  }
  await writeGeneratedArtifacts(catalog);
  console.log("OK catalog.json and committed marketplace files updated");
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
