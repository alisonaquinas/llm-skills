/**
 * Installation banner shown near the top of the marketplace landing page.
 *
 * Responsibilities:
 * - explain the recommended marketplace installation flow for Claude Code
 * - explain how to add skills to Codex via ZIP bundle download
 * - provide copyable commands for marketplace and plugin installation
 * - keep install command formatting centralized in the command helpers
 */
import CopyButton from "./CopyButton";
import { DownloadIcon } from "./SiteIcons";
import { MARKETPLACE, PLUGINS } from "@/lib/catalog";
import { buildAllPluginsBundleUrl } from "@/lib/catalog";
import { getMarketplaceAddCommand, getMarketplaceUrlAddCommand, getPluginInstallRef } from "@/lib/commands";

/** Recommended command for registering the marketplace repository. */
const marketplaceAddCommand = getMarketplaceAddCommand();
/** Secondary command for registering the published marketplace JSON URL. */
const marketplaceUrlAddCommand = getMarketplaceUrlAddCommand();

/**
 * Renders the marketplace installation guidance banner.
 *
 * @returns A documentation-oriented installation panel with collapsible Claude Code
 *          instructions and a Codex download card.
 */
export default function InstallBanner() {
  return (
    <div className="mb-8 space-y-3">

      {/* Claude Code card — collapsible */}
      <details className="group rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add this marketplace to Claude Code
          </h2>
          {/* Chevron rotates when open */}
          <svg
            className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180 dark:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </summary>

        <div className="space-y-3 px-4 pb-4 sm:px-5">
          <p className="max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            Use the GitHub repository as the primary marketplace source, then install one of the
            published skill bundles. Each bundle packages many individual skills and is installed as a
            single Claude Code plugin. You do not install skills one at a time.
          </p>

          <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">1. Add marketplace (recommended)</span>
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 dark:bg-stone-900/80">
                  <code className="min-w-0 flex-1 truncate text-sm text-gray-800 dark:text-gray-100" title={marketplaceAddCommand}>
                    {marketplaceAddCommand}
                  </code>
                  <CopyButton text={marketplaceAddCommand} label="Copy marketplace command" variant="icon" />
                </div>
              </div>
            </div>
            <p className="mt-3 break-all text-xs text-gray-500 dark:text-gray-400">
              Marketplace repo: <code>{MARKETPLACE.githubRepo}</code>
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-950">
            <span className="mb-3 block text-xs font-medium text-gray-500 dark:text-gray-400">2. Install a skill bundle</span>
            <div className="space-y-3">
              {PLUGINS.map((plugin) => {
                const installCommand = `/plugin install ${getPluginInstallRef(plugin)}`;
                return (
                  <div key={plugin.pluginName} className="rounded-lg bg-stone-50 px-3 py-3 dark:bg-stone-900/80">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{plugin.label}</div>
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-white px-3 py-2 dark:bg-stone-950">
                          <code className="min-w-0 flex-1 truncate text-sm text-gray-800 dark:text-gray-100" title={installCommand}>
                            {installCommand}
                          </code>
                          <CopyButton text={installCommand} label={`Copy ${plugin.label} install command`} variant="icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-950">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <span className="mb-0.5 block text-xs font-medium text-gray-400 dark:text-gray-500">
                  Marketplace URL (secondary option)
                </span>
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 dark:bg-stone-900/80">
                  <code className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300" title={marketplaceUrlAddCommand}>
                    {marketplaceUrlAddCommand}
                  </code>
                  <CopyButton text={marketplaceUrlAddCommand} label="Copy marketplace URL command" variant="icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>

      {/* Codex card — collapsible */}
      <details className="group rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add these skills to Codex
          </h2>
          <svg
            className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180 dark:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </summary>

        <div className="space-y-3 px-4 pb-4 sm:px-5">
          <p className="max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            Codex does not use the Claude Code plugin system. Instead, download the skill bundle ZIP,
            extract it to your project or workspace, and reference the skills via the
            <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 text-xs dark:bg-stone-800">agents/openai.yaml</code>
            metadata each skill ships with. Each bundle is a flat collection of skill directories
            ready to drop into a Codex-compatible workspace.
          </p>

          <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/50">
            <span className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
              1. Download a bundle ZIP
            </span>
            <p className="mb-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Each bundle page has a download link, or grab all bundles in one archive:
            </p>
            <a
              href={buildAllPluginsBundleUrl()}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-950 dark:text-gray-200 dark:hover:border-stone-600"
              aria-label="Download all skill bundles as a single ZIP"
            >
              <DownloadIcon className="h-4 w-4 shrink-0" />
              <span>Download all-plugins.zip</span>
            </a>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/50">
            <span className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
              2. Extract to your workspace
            </span>
            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
              Unzip the bundle into your project root or a dedicated skills directory.
              Each skill folder contains a
              <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 dark:bg-stone-800">SKILL.md</code>
              plus an
              <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 dark:bg-stone-800">agents/openai.yaml</code>
              file with the trigger name, description, and metadata Codex reads on activation.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/50">
            <span className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
              3. Invoke a skill in your agent session
            </span>
            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
              Once the skill files are in your workspace, Codex picks them up on trigger.
              Skill names and trigger phrases are defined in each skill&apos;s
              <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 dark:bg-stone-800">agents/openai.yaml</code>.
              See the <a href="/claude-vs-codex" className="text-brand-700 underline hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200">Claude Code vs Codex</a> page
              for a side-by-side comparison of how the two platforms handle skills.
            </p>
          </div>
        </div>
      </details>

    </div>
  );
}
