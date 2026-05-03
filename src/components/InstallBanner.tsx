/**
 * Installation banner shown near the top of the marketplace landing page.
 *
 * Responsibilities:
 * - explain the recommended marketplace installation flow for Claude Code
 * - explain the recommended marketplace installation flow for Codex
 * - provide copyable commands for marketplace and plugin installation
 * - keep install command formatting centralized in the command helpers
 */
import CopyButton from "./CopyButton";
import { MARKETPLACE, PLUGINS } from "@/lib/catalog";
import {
  getCodexMarketplaceAddCommand,
  getCodexMarketplaceUrlAddCommand,
  getMarketplaceAddCommand,
  getMarketplaceUrlAddCommand,
  getPluginInstallRef,
} from "@/lib/commands";

/** Recommended command for registering the marketplace repository. */
const marketplaceAddCommand = getMarketplaceAddCommand();
/** Secondary command for registering the published marketplace JSON URL. */
const marketplaceUrlAddCommand = getMarketplaceUrlAddCommand();
/** Recommended Codex CLI command for registering the marketplace repository. */
const codexMarketplaceAddCommand = getCodexMarketplaceAddCommand();
/** Secondary Codex CLI command for registering the published Codex marketplace JSON URL. */
const codexMarketplaceUrlAddCommand = getCodexMarketplaceUrlAddCommand();

/** Shared chevron SVG used in both collapsible summary rows. */
function ChevronIcon() {
  return (
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
  );
}

/**
 * Renders the marketplace installation guidance banner.
 *
 * @returns A documentation-oriented installation panel with collapsible Claude Code
 *          instructions and a Codex download card.
 */
export default function InstallBanner() {
  return (
    <div className="mb-8 space-y-3">

      {/* Claude Code card — collapsible, open by default (primary CTA) */}
      <details open className="group rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950">
        <summary
          role="heading"
          aria-level={2}
          className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 sm:px-5"
        >
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Add this marketplace to Claude Code
          </span>
          <ChevronIcon />
        </summary>

        <div className="space-y-4 px-4 pb-4 sm:px-5">
          <p className="max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            Use the GitHub repository as the primary marketplace source, then install one of the
            published skill bundles. Each bundle packages many individual skills and is installed as a
            single Claude Code plugin. You do not install skills one at a time.
          </p>

          {/* Step 1 */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              1. Add marketplace (recommended)
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 dark:bg-stone-900/80">
              <code className="min-w-0 flex-1 truncate text-sm text-gray-800 dark:text-gray-100" title={marketplaceAddCommand}>
                {marketplaceAddCommand}
              </code>
              <CopyButton text={marketplaceAddCommand} label="Copy marketplace command" variant="icon" />
            </div>
            <p className="mt-2 break-all text-xs text-gray-500 dark:text-gray-400">
              Marketplace repo: <code>{MARKETPLACE.githubRepo}</code>
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              2. Install a skill bundle
            </p>
            <div className="space-y-2">
              {PLUGINS.map((plugin) => {
                const installCommand = `/plugin install ${getPluginInstallRef(plugin)}`;
                return (
                  <div key={plugin.pluginName} className="rounded-lg bg-stone-50 px-3 py-2.5 dark:bg-stone-900/80">
                    <div className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">{plugin.label}</div>
                    <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 dark:bg-stone-950">
                      <code className="min-w-0 flex-1 truncate text-sm text-gray-800 dark:text-gray-100" title={installCommand}>
                        {installCommand}
                      </code>
                      <CopyButton text={installCommand} label={`Copy ${plugin.label} install command`} variant="icon" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary option */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
              Marketplace URL (secondary option)
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 dark:bg-stone-900/80">
              <code className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300" title={marketplaceUrlAddCommand}>
                {marketplaceUrlAddCommand}
              </code>
              <CopyButton text={marketplaceUrlAddCommand} label="Copy marketplace URL command" variant="icon" />
            </div>
          </div>
        </div>
      </details>

      {/* Codex card — collapsible, collapsed by default (secondary CTA) */}
      <details className="group rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950">
        <summary
          role="heading"
          aria-level={2}
          className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 sm:px-5"
        >
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Add these skills to Codex
          </span>
          <ChevronIcon />
        </summary>

        <div className="space-y-4 px-4 pb-4 sm:px-5">
          <p className="max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            Codex can read this repository as a plugin marketplace. Add the marketplace once, then
            choose the skill bundles you want from the Codex plugin directory. Each bundle ships a
            <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 text-xs dark:bg-stone-800">.codex-plugin/plugin.json</code>
            manifest plus Codex metadata in
            <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 text-xs dark:bg-stone-800">agents/openai.yaml</code>.
          </p>

          {/* Step 1 */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              1. Add marketplace (recommended)
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 dark:bg-stone-900/80">
              <code className="min-w-0 flex-1 truncate text-sm text-gray-800 dark:text-gray-100" title={codexMarketplaceAddCommand}>
                {codexMarketplaceAddCommand}
              </code>
              <CopyButton text={codexMarketplaceAddCommand} label="Copy Codex marketplace command" variant="icon" />
            </div>
            <p className="mt-2 break-all text-xs text-gray-500 dark:text-gray-400">
              Codex marketplace file: <code>{MARKETPLACE.siteUrl}/codex-marketplace.json</code>
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              2. Install skill bundles in Codex
            </p>
            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
              Restart Codex, open the plugin directory, choose {MARKETPLACE.title}, and install the
              bundles your project needs:
              <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 dark:bg-stone-800">
                shared-skills
              </code>
              ,
              <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 dark:bg-stone-800">ci-cd</code>
              ,
              <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 dark:bg-stone-800">
                software-design
              </code>
              ,
              <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 dark:bg-stone-800">doc-skills</code>
              , or
              <code className="mx-1 rounded bg-stone-100 px-1 py-0.5 dark:bg-stone-800">
                web-design-skills
              </code>
              .
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Marketplace URL (secondary option)
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 dark:bg-stone-900/80">
              <code className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300" title={codexMarketplaceUrlAddCommand}>
                {codexMarketplaceUrlAddCommand}
              </code>
              <CopyButton text={codexMarketplaceUrlAddCommand} label="Copy Codex marketplace URL command" variant="icon" />
            </div>
          </div>
        </div>
      </details>

    </div>
  );
}
