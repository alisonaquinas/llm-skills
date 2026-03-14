/**
 * Barrel exports for the GitHub data namespace.
 *
 * Responsibilities:
 * - expose GitHub contracts and services from a single import surface
 * - keep callers insulated from internal file organization
 */
export type {
  GitHubContentFile,
  GitHubDirectoryItem,
  GitHubRelease,
  PluginMeta,
  SkillDetail,
  SkillEntry,
} from "./types";
export { ghFetchJson, ghFetchText, decodeBase64Json } from "./client";
export { getPluginMeta } from "./plugin-service";
export {
  buildSkillDownloadUrl,
  getAllSkills,
  getSkillDetail,
  listSkills,
  resolvePluginSkillsRoot,
} from "./skill-service";
