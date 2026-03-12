#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

interface FeedSourceConfig {
  owner: string;
  repo: string;
  label: string;
  ref?: string;
  enabled?: boolean;
}

interface MarketplaceConfig {
  title: string;
  siteUrl: string;
}

interface CatalogFile {
  marketplace: MarketplaceConfig;
  feedSources?: FeedSourceConfig[];
}

interface ParsedRelease {
  version: string;
  date: string;
  bodyLines: string[];
}

interface ReleaseItem {
  source: FeedSourceConfig;
  version: string;
  date: string;
  title: string;
  descriptionHtml: string;
  link: string;
  guid: string;
}

const DEFAULT_OUTPUTS = ["out/rss.xml"];
const MAX_ITEMS = 50;

async function loadCatalog(): Promise<CatalogFile> {
  return JSON.parse(
    await readFile(new URL("../catalog.json", import.meta.url), "utf-8")
  ) as CatalogFile;
}

function getEnabledFeedSources(catalog: CatalogFile): FeedSourceConfig[] {
  return (catalog.feedSources ?? []).filter((source) => source.enabled !== false);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function fetchChangelog(source: FeedSourceConfig): Promise<string> {
  const ref = source.ref ?? "main";
  const changelogUrl = `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${encodeURIComponent(
    ref
  )}/CHANGELOG.md`;

  const response = await fetch(changelogUrl, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch ${changelogUrl}: ${response.status}`);
  }

  return response.text();
}

export function parseReferenceLinks(markdown: string): Map<string, string> {
  const refs = new Map<string, string>();

  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^\[([^\]]+)\]:\s*(\S+)\s*$/);
    if (match) {
      refs.set(match[1], match[2]);
    }
  }

  return refs;
}

export function parseChangelogReleases(markdown: string): ParsedRelease[] {
  const releases: ParsedRelease[] = [];
  const lines = markdown.split(/\r?\n/);
  let current: ParsedRelease | null = null;

  for (const line of lines) {
    const match = line.match(/^## \[([^\]]+)\]\s*[—-]\s*(\d{4}-\d{2}-\d{2})\s*$/);

    if (match) {
      if (current) {
        releases.push(current);
      }

      const version = match[1].trim();
      current =
        version.toLowerCase() === "unreleased"
          ? null
          : { version, date: match[2], bodyLines: [] };
      continue;
    }

    if (line.startsWith("## [")) {
      if (current) {
        releases.push(current);
        current = null;
      }
      continue;
    }

    if (current) {
      current.bodyLines.push(line);
    }
  }

  if (current) {
    releases.push(current);
  }

  return releases;
}

function flushPreBlock(buffer: string[], htmlParts: string[]): void {
  const content = buffer.join("\n").trim();
  if (content) {
    htmlParts.push(`<pre>${escapeXml(content)}</pre>`);
  }
  buffer.length = 0;
}

export function renderReleaseHtml(bodyLines: string[]): string {
  const htmlParts: string[] = [];
  const buffer: string[] = [];

  for (const line of bodyLines) {
    const heading = line.match(/^(###|####)\s+(.+?)\s*$/);
    if (heading) {
      flushPreBlock(buffer, htmlParts);
      const tag = heading[1] === "###" ? "h3" : "h4";
      htmlParts.push(`<${tag}>${escapeXml(heading[2])}</${tag}>`);
      continue;
    }

    buffer.push(line);
  }

  flushPreBlock(buffer, htmlParts);

  return htmlParts.join("\n");
}

function resolveReleaseLink(
  source: FeedSourceConfig,
  version: string,
  refs: Map<string, string>
): string {
  return (
    refs.get(version) ??
    refs.get(`v${version}`) ??
    `https://github.com/${source.owner}/${source.repo}/releases/tag/v${version}`
  );
}

function toUtcDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

function compareReleases(a: ReleaseItem, b: ReleaseItem): number {
  const dateDiff = Date.parse(b.date) - Date.parse(a.date);
  if (dateDiff !== 0) {
    return dateDiff;
  }

  const repoDiff = `${a.source.owner}/${a.source.repo}`.localeCompare(
    `${b.source.owner}/${b.source.repo}`
  );
  if (repoDiff !== 0) {
    return repoDiff;
  }

  return b.version.localeCompare(a.version, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

async function collectReleaseItems(catalog: CatalogFile): Promise<ReleaseItem[]> {
  const feedSources = getEnabledFeedSources(catalog);
  const changelogs = await Promise.all(
    feedSources.map(async (source) => ({
      source,
      markdown: await fetchChangelog(source),
    }))
  );

  return changelogs
    .flatMap(({ source, markdown }) => {
      const refs = parseReferenceLinks(markdown);
      const releases = parseChangelogReleases(markdown);

      return releases.map((release) => {
        const link = resolveReleaseLink(source, release.version, refs);
        const descriptionHtml = [
          `<p>${escapeXml(`${source.label} v${release.version} release notes.`)}</p>`,
          renderReleaseHtml(release.bodyLines),
        ]
          .filter(Boolean)
          .join("\n");

        return {
          source,
          version: release.version,
          date: release.date,
          title: `${source.label} v${release.version}`,
          descriptionHtml,
          link,
          guid: `${source.owner}/${source.repo}@${release.version}`,
        };
      });
    })
    .sort(compareReleases)
    .slice(0, MAX_ITEMS);
}

export function buildRssDocument(
  items: ReleaseItem[],
  market: MarketplaceConfig
): string {
  const selfUrl = `${market.siteUrl}/rss.xml`;
  const lastBuildDate =
    items.length > 0 ? toUtcDate(items[0].date) : new Date().toUTCString();

  const xmlItems = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>
      <pubDate>${escapeXml(toUtcDate(item.date))}</pubDate>
      <description><![CDATA[${item.descriptionHtml}]]></description>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${market.title} Releases`)}</title>
    <link>${escapeXml(market.siteUrl)}</link>
    <description>${escapeXml(
      "Combined release notes feed for the llm-skills marketplace ecosystem."
    )}</description>
    <language>en-us</language>
    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />
${xmlItems}
  </channel>
</rss>
`;
}

async function writeOutput(outPath: string, contents: string): Promise<void> {
  const resolved = resolve(outPath);
  await mkdir(dirname(resolved), { recursive: true });
  await writeFile(resolved, contents);
  console.log(`Wrote RSS feed to ${outPath}`);
}

export async function generateRssFeed(
  outputPaths: string[] = DEFAULT_OUTPUTS
): Promise<void> {
  const catalog = await loadCatalog();
  const items = await collectReleaseItems(catalog);
  const document = buildRssDocument(items, catalog.marketplace);
  await Promise.all(outputPaths.map((outPath) => writeOutput(outPath, document)));
}

async function main(): Promise<void> {
  const outputPaths = process.argv.slice(2);
  await generateRssFeed(outputPaths.length > 0 ? outputPaths : DEFAULT_OUTPUTS);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(message);
    process.exit(1);
  });
}
