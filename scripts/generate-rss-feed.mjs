#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_OUTPUTS = ["out/rss.xml"];
const MAX_ITEMS = 50;

const catalog = JSON.parse(
  await readFile(new URL("../catalog.json", import.meta.url), "utf-8")
);

const { marketplace, feedSources: configuredFeedSources = [] } = catalog;

function getEnabledFeedSources() {
  return configuredFeedSources.filter((source) => source.enabled !== false);
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function fetchChangelog(source) {
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

export function parseReferenceLinks(markdown) {
  const refs = new Map();

  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^\[([^\]]+)\]:\s*(\S+)\s*$/);
    if (match) {
      refs.set(match[1], match[2]);
    }
  }

  return refs;
}

export function parseChangelogReleases(markdown) {
  const releases = [];
  const lines = markdown.split(/\r?\n/);
  let current = null;

  for (const line of lines) {
    const match = line.match(/^## \[([^\]]+)\]\s*[—-]\s*(\d{4}-\d{2}-\d{2})\s*$/);

    if (match) {
      if (current) {
        releases.push(current);
      }

      const version = match[1].trim();
      current = version.toLowerCase() === "unreleased"
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

function flushPreBlock(buffer, htmlParts) {
  const content = buffer.join("\n").trim();
  if (content) {
    htmlParts.push(`<pre>${escapeXml(content)}</pre>`);
  }
  buffer.length = 0;
}

export function renderReleaseHtml(bodyLines) {
  const htmlParts = [];
  const buffer = [];

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

function resolveReleaseLink(source, version, refs) {
  return (
    refs.get(version) ??
    refs.get(`v${version}`) ??
    `https://github.com/${source.owner}/${source.repo}/releases/tag/v${version}`
  );
}

function toUtcDate(date) {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

function compareReleases(a, b) {
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

async function collectReleaseItems() {
  const feedSources = getEnabledFeedSources();
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

export function buildRssDocument(items) {
  const selfUrl = `${marketplace.siteUrl}/rss.xml`;
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
    <title>${escapeXml(`${marketplace.title} Releases`)}</title>
    <link>${escapeXml(marketplace.siteUrl)}</link>
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

async function writeOutput(outPath, contents) {
  const resolved = resolve(outPath);
  await mkdir(dirname(resolved), { recursive: true });
  await writeFile(resolved, contents);
  console.log(`Wrote RSS feed to ${outPath}`);
}

export async function generateRssFeed(outputPaths = DEFAULT_OUTPUTS) {
  const items = await collectReleaseItems();
  const document = buildRssDocument(items);
  await Promise.all(outputPaths.map((outPath) => writeOutput(outPath, document)));
}

async function main() {
  const outputPaths = process.argv.slice(2);
  await generateRssFeed(outputPaths.length > 0 ? outputPaths : DEFAULT_OUTPUTS);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
