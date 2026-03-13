/**
 * Shared SEO helpers and structured-data builders for the static marketplace site.
 *
 * Responsibilities:
 * - centralize canonical URL and asset URL construction from catalog.json
 * - standardize metadata titles, descriptions, and keywords across public routes
 * - provide server-safe JSON-LD payload builders for pages and the app shell
 */
import { MARKETPLACE, getPluginRepoUrl, type PluginConfig } from "@/lib/catalog";
import type { SkillDetail, SkillEntry } from "@/lib/github";

/** Keywords shared by the marketplace shell and public pages. */
export const SEO_KEYWORDS = [
  "Claude Code plugins",
  "LLM skills marketplace",
  "developer automation skills",
  "CI/CD skills",
  "shared developer skills",
  "Claude Code skills",
  "Codex-compatible skills",
];

/** Relative path to the default social preview image published by the site. */
export const SOCIAL_PREVIEW_IMAGE_PATH = "marketplace-preview.svg";

/**
 * Builds an absolute site URL from a repository-relative public path.
 *
 * @param path Path relative to the published site root.
 * @returns Fully qualified URL under the configured siteUrl.
 */
export function buildSiteUrl(path = ""): string {
  const normalizedPath = path.replace(/^\//, "");
  return new URL(normalizedPath, `${MARKETPLACE.siteUrl}/`).toString();
}

/**
 * Returns the canonical URL for the marketplace landing page.
 *
 * @returns Absolute home page URL.
 */
export function getHomeUrl(): string {
  return buildSiteUrl();
}

/**
 * Builds a base-path-aware public asset path for rendered markup and image tags.
 *
 * @param path Path relative to the published site root.
 * @returns Root-relative path that includes the configured GitHub Pages project path.
 */
export function buildPublicAssetPath(path = ""): string {
  const sitePath = new URL(MARKETPLACE.siteUrl).pathname.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  if (!sitePath || sitePath === "/") {
    return normalizedPath ? `/${normalizedPath}` : "/";
  }

  return normalizedPath ? `${sitePath}/${normalizedPath}` : `${sitePath}/`;
}

/**
 * Returns the published RSS feed URL.
 *
 * @returns Absolute RSS feed URL.
 */
export function getRssUrl(): string {
  return buildSiteUrl("rss.xml");
}

/**
 * Returns the published sitemap URL.
 *
 * @returns Absolute sitemap URL.
 */
export function getSitemapUrl(): string {
  return buildSiteUrl("sitemap.xml");
}

/**
 * Returns the published social preview image URL.
 *
 * @returns Absolute URL for the SEO/share preview image.
 */
export function getSocialPreviewImageUrl(): string {
  return buildSiteUrl(SOCIAL_PREVIEW_IMAGE_PATH);
}

/**
 * Builds the published route path for a skill detail page.
 *
 * @param owner GitHub owner for the skill's plugin repository.
 * @param repo GitHub repository for the skill's plugin repository.
 * @param skillName Skill name, including nested path segments when present.
 * @returns Relative path for the skill detail page with a trailing slash.
 */
export function buildSkillPath(owner: string, repo: string, skillName: string): string {
  const encodedSegments = skillName.split("/").map((segment) => encodeURIComponent(segment));
  return `skill/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodedSegments.join("/")}/`;
}

/**
 * Builds the canonical URL for a skill detail page.
 *
 * @param owner GitHub owner for the skill's plugin repository.
 * @param repo GitHub repository for the skill's plugin repository.
 * @param skillName Skill name, including nested path segments when present.
 * @returns Absolute canonical URL for the skill detail page.
 */
export function buildSkillUrl(owner: string, repo: string, skillName: string): string {
  return buildSiteUrl(buildSkillPath(owner, repo, skillName));
}

/**
 * Builds the standardized metadata title for an individual skill page.
 *
 * @param skillName Published skill name.
 * @returns Route-specific page title.
 */
export function buildSkillTitle(skillName: string): string {
  return `${skillName} | ${MARKETPLACE.title}`;
}

/**
 * Builds a search- and share-friendly description for a skill detail page.
 *
 * @param plugin Plugin containing the skill.
 * @param skillName Published skill name.
 * @returns Deterministic route description.
 */
export function buildSkillDescription(plugin: PluginConfig, skillName: string): string {
  return `Browse install instructions, invocation syntax, and bundled files for the ${skillName} skill in the ${plugin.label} plugin on ${MARKETPLACE.title}.`;
}

/**
 * Builds a normalized description for the marketplace home page.
 *
 * @returns Home page description used across metadata and structured data.
 */
export function getHomeDescription(): string {
  return MARKETPLACE.description;
}

/**
 * Builds Organization JSON-LD for the marketplace publisher.
 *
 * @returns Structured data describing the publishing organization.
 */
export function buildOrganizationStructuredData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${getHomeUrl()}#organization`,
    name: MARKETPLACE.owner.name,
    url: getHomeUrl(),
    logo: buildSiteUrl("branding/logo-color-no-background.png"),
    sameAs: [MARKETPLACE.githubUrl, "https://www.alisonquinas.com/", "https://www.linkedin.com/in/alisonaquinas/"],
  };
}

/**
 * Builds WebSite JSON-LD for the marketplace shell.
 *
 * @returns Structured data describing the site.
 */
export function buildWebsiteStructuredData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getHomeUrl()}#website`,
    url: getHomeUrl(),
    name: MARKETPLACE.title,
    description: getHomeDescription(),
    publisher: {
      "@id": `${getHomeUrl()}#organization`,
    },
  };
}

/**
 * Builds CollectionPage JSON-LD for the marketplace landing page.
 *
 * @returns Structured data describing the home page as a plugin collection.
 */
export function buildCollectionPageStructuredData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${getHomeUrl()}#collection`,
    url: getHomeUrl(),
    name: MARKETPLACE.title,
    description: getHomeDescription(),
    isPartOf: {
      "@id": `${getHomeUrl()}#website`,
    },
    about: {
      "@id": `${getHomeUrl()}#organization`,
    },
  };
}

/**
 * Builds ItemList JSON-LD for the installable plugins shown on the home page.
 *
 * @param plugins Plugin summaries or entries to serialize.
 * @returns Structured data describing the installable plugin list.
 */
export function buildPluginItemListStructuredData(
  plugins: Array<{ plugin: PluginConfig; description?: string; skillCount?: number }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${getHomeUrl()}#plugins`,
    name: `${MARKETPLACE.title} plugins`,
    itemListElement: plugins.map(({ plugin, description, skillCount }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: plugin.pluginName,
        description: description ?? plugin.siteDescription,
        url: getPluginRepoUrl(plugin),
        applicationCategory: plugin.category,
        featureList: `${skillCount ?? 0} documented skills`,
        publisher: {
          "@id": `${getHomeUrl()}#organization`,
        },
      },
    })),
  };
}

/**
 * Builds TechArticle JSON-LD for a skill detail page.
 *
 * @param skill Skill detail payload for the route.
 * @returns Structured data describing the skill documentation page.
 */
export function buildSkillStructuredData(skill: SkillDetail | SkillEntry): Record<string, unknown> {
  const skillUrl = buildSkillUrl(skill.repo.owner, skill.repo.repo, skill.name);

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${skillUrl}#article`,
    url: skillUrl,
    headline: skill.name,
    name: skill.name,
    description: buildSkillDescription(skill.repo, skill.name),
    about: {
      "@type": "SoftwareApplication",
      name: skill.repo.pluginName,
      applicationCategory: skill.repo.category,
      url: getPluginRepoUrl(skill.repo),
    },
    isPartOf: {
      "@id": `${getHomeUrl()}#website`,
    },
    publisher: {
      "@id": `${getHomeUrl()}#organization`,
    },
    author: {
      "@type": "Organization",
      name: MARKETPLACE.owner.name,
    },
  };
}
