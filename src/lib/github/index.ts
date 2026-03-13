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
  PluginMeta,
  SkillDetail,
  SkillEntry,
} from "./types";
export { ghFetchJson, ghFetchText, decodeBase64Json } from "./client";
export { getPluginMeta } from "./plugin-service";
export { getAllSkills, getSkillDetail, listSkills } from "./skill-service";
