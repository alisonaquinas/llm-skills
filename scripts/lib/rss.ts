/**
 * RSS feed generation helpers for the combined marketplace ecosystem feed.
 *
 * Responsibilities:
 * - fetch and parse changelog data from configured feed source repositories
 * - normalize releases into RSS item models with deterministic ordering
 * - render and write the static RSS 2.0 document used by GitHub Pages deploys
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { CatalogFile, FeedSourceConfig, MarketplaceConfig } from "@/lib/catalog";

/** Parsed changelog release heading and body payload. */
export interface ParsedRelease {
  /** Version identifier captured from a changelog release heading. */
  version: string;
  /** ISO release date captured from a changelog release heading. */
  date: string;
  /** Raw body lines associated with the release. */
  bodyLines: string[];
}

/** Normalized RSS item model used during feed generation. */
export interface ReleaseItem {
  /** Feed source repository that produced the release. */
  source: FeedSourceConfig;
  /** Released version string. */
  version: string;
  /** ISO release date. */
  date: string;
  /** RSS item title. */
  title: string;
  /** HTML description rendered from the changelog body. */
  descriptionHtml: string;
  /** Canonical link for the release. */
  link: string;
  /** Stable GUID for RSS consumers. */
  guid: string;
}

/** Maximum number of release items to keep in the generated feed. */
const MAX_ITEMS = 50;

/**
 * Filters the catalog's feed sources down to enabled entries.
 *
 * @param catalog Parsed catalog configuration.
 * @returns Enabled feed sources that should contribute to the RSS feed.
 */
export function getEnabledFeedSources(catalog: CatalogFile): FeedSourceConfig[] {
  return (catalog.feedSources ?? []).filter((source) => source.enabled !== false);
}

/**
 * Escapes XML-sensitive characters for element and attribute content.
 *
 * @param value Raw text to escape.
 * @returns XML-safe text.
 */
function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Fetches the changelog markdown for a configured feed source.
 *
 * @param source Feed source repository definition.
 * @returns Raw changelog markdown fetched from raw.githubusercontent.com.
 */
export async function fetchChangelog(source: FeedSourceConfig): Promise<string> {
  const ref = source.ref ?? "main";
  const changelogUrl = `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${encodeURIComponent(
    ref
  )}/CHANGELOG.md`;

  const response = await fetch(changelogUrl, { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Unable to fetch ${changelogUrl}: ${response.status}`);
  }

  return response.text();
}

/**
 * Extracts changelog reference-style links keyed by version label.
 *
 * @param markdown Changelog markdown to scan.
 * @returns A map of reference labels to URLs.
 */
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

/**
 * Parses Keep a Changelog release sections into normalized release records.
 *
 * @param markdown Changelog markdown contents.
 * @returns Parsed dated releases, excluding Unreleased.
 */
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
      current = version.toLowerCase() === "unreleased" ? null : { version, date: match[2], bodyLines: [] };
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

/**
 * Flushes buffered changelog lines into a preformatted HTML block.
 *
 * @param buffer Buffered body lines awaiting serialization.
 * @param htmlParts HTML fragment accumulator.
 */
function flushPreBlock(buffer: string[], htmlParts: string[]): void {
  const content = buffer.join("\n").trim();
  if (content) {
    htmlParts.push(`<pre>${escapeXml(content)}</pre>`);
  }
  buffer.length = 0;
}

/**
 * Renders changelog body lines into a small HTML fragment for RSS descriptions.
 *
 * @param bodyLines Raw changelog body lines for a release.
 * @returns HTML suitable for inclusion inside an RSS description CDATA block.
 */
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

/**
 * Resolves the best URL for a release item.
 *
 * @param source Feed source repository definition.
 * @param version Released version string.
 * @param refs Reference links parsed from the changelog.
 * @returns The preferred changelog or GitHub release URL.
 */
export function resolveReleaseLink(
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

/**
 * Converts an ISO calendar date into an RFC 822-style UTC date string for RSS.
 *
 * @param date ISO date in YYYY-MM-DD form.
 * @returns UTC date string suitable for RSS pubDate fields.
 */
function toUtcDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

/**
 * Sorts release items newest-first, then deterministically by repo and version.
 *
 * @param a Left-hand release item.
 * @param b Right-hand release item.
 * @returns Sort comparator result for Array.prototype.sort.
 */
export function compareReleases(a: ReleaseItem, b: ReleaseItem): number {
  const dateDiff = Date.parse(b.date) - Date.parse(a.date);
  if (dateDiff !== 0) {
    return dateDiff;
  }

  const repoDiff = `${a.source.owner}/${a.source.repo}`.localeCompare(`${b.source.owner}/${b.source.repo}`);
  if (repoDiff !== 0) {
    return repoDiff;
  }

  return b.version.localeCompare(a.version, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

/**
 * Collects and normalizes release items across all enabled feed sources.
 *
 * @param catalog Parsed catalog configuration.
 * @returns Sorted release items limited to the feed size cap.
 */
export async function collectReleaseItems(catalog: CatalogFile): Promise<ReleaseItem[]> {
  const feedSources = getEnabledFeedSources(catalog);
  const changelogs = (
    await Promise.all(
      feedSources.map(async (source) => {
        try {
          return {
            source,
            markdown: await fetchChangelog(source),
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          console.warn(`Skipping RSS source ${source.owner}/${source.repo}: ${message}`);
          return null;
        }
      })
    )
  ).filter((entry): entry is { source: FeedSourceConfig; markdown: string } => entry !== null);

  return changelogs
    .flatMap(({ source, markdown }) => {
      const refs = parseReferenceLinks(markdown);
      const releases = parseChangelogReleases(markdown);

      return releases.map((release) => ({
        source,
        version: release.version,
        date: release.date,
        title: `${source.label} v${release.version}`,
        descriptionHtml: [
          `<p>${escapeXml(`${source.label} v${release.version} release notes.`)}</p>`,
          renderReleaseHtml(release.bodyLines),
        ]
          .filter(Boolean)
          .join("\n"),
        link: resolveReleaseLink(source, release.version, refs),
        guid: `${source.owner}/${source.repo}@${release.version}`,
      }));
    })
    .sort(compareReleases)
    .slice(0, MAX_ITEMS);
}

/**
 * Builds the final RSS 2.0 XML document for the combined marketplace feed.
 *
 * @param items Normalized release items.
 * @param market Marketplace metadata used for channel fields.
 * @returns Complete RSS XML ready to write to disk.
 */
export function buildRssDocument(items: ReleaseItem[], market: MarketplaceConfig): string {
  const selfUrl = `${market.siteUrl}/rss.xml`;
  const lastBuildDate = items.length > 0 ? toUtcDate(items[0].date) : new Date().toUTCString();

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
    <description>${escapeXml("Combined release notes feed for the llm-skills marketplace ecosystem.")}</description>
    <language>en-us</language>
    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />
${xmlItems}
  </channel>
</rss>
`;
}

/**
 * Writes arbitrary text output to disk, creating parent directories as needed.
 *
 * @param outPath Destination output path.
 * @param contents Full file contents to write.
 */
export async function writeTextOutput(outPath: string, contents: string): Promise<void> {
  const resolved = resolve(outPath);
  await mkdir(dirname(resolved), { recursive: true });
  await writeFile(resolved, contents);
  console.log(`Wrote RSS feed to ${outPath}`);
}

