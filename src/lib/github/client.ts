/**
 * Low-level GitHub HTTP helpers used by build-time data services.
 *
 * Responsibilities:
 * - centralize GitHub API request headers and caching behavior
 * - provide typed JSON and text fetch helpers for upstream repository content
 * - decode base64-encoded contents API payloads for higher-level services
 */

/** Base URL for GitHub REST API requests. */
const GITHUB_API_BASE = "https://api.github.com";

/**
 * Fetches JSON from the GitHub REST API with shared headers and caching policy.
 *
 * @param path API path beginning with a leading slash.
 * @returns A parsed JSON payload typed by the caller.
 */
export async function ghFetchJson<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers,
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${path}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches raw text content from a GitHub-provided download URL.
 *
 * @param url Fully qualified raw-content URL.
 * @returns The text body when available, otherwise null.
 */
export async function ghFetchText(url: string): Promise<string | null> {
  const response = await fetch(url, { cache: "force-cache" });
  return response.ok ? response.text() : null;
}

/**
 * Decodes a base64 GitHub contents payload into a typed JSON object.
 *
 * @param content Base64-encoded file contents.
 * @returns The parsed JSON object represented by the encoded content.
 */
export function decodeBase64Json<T>(content: string): T {
  return JSON.parse(Buffer.from(content, "base64").toString("utf-8")) as T;
}
