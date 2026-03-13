/**
 * Installation banner shown near the top of the marketplace landing page.
 *
 * Responsibilities:
 * - explain the recommended marketplace installation flow
 * - provide copyable commands for marketplace and plugin installation
 * - keep install command formatting centralized in the command helpers
 */
import CopyButton from "./CopyButton";
import { MARKETPLACE, PLUGINS } from "@/lib/catalog";
import { getMarketplaceAddCommand, getMarketplaceUrlAddCommand, getPluginInstallRef } from "@/lib/commands";

/** Recommended command for registering the marketplace repository. */
const marketplaceAddCommand = getMarketplaceAddCommand();
/** Secondary command for registering the published marketplace JSON URL. */
const marketplaceUrlAddCommand = getMarketplaceUrlAddCommand();

/**
 * Renders the marketplace installation guidance banner.
 *
 * @returns A documentation-oriented installation panel.
 */
export default function InstallBanner() {
  return (
    <section className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/80 p-5 shadow-sm dark:border-brand-900/70 dark:bg-brand-950/30">
      <h2 className="mb-1 text-lg font-semibold text-brand-900 dark:text-brand-100">Add this marketplace to Claude Code</h2>
      <p className="mb-4 text-sm text-brand-800 dark:text-brand-200">
        Use the GitHub repository as the primary marketplace source, then install either of the two
        published plugins. Individual skills are included within those plugins; they are not listed
        as standalone plugins.
      </p>

      <div className="space-y-3">
        <div className="rounded-xl border border-brand-200 bg-white px-4 py-3 dark:border-brand-900/70 dark:bg-stone-950">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <span className="block text-xs font-medium text-brand-600 dark:text-brand-300">1. Add marketplace (recommended)</span>
              <code className="block text-sm text-gray-800 dark:text-gray-100">{marketplaceAddCommand}</code>
            </div>
            <CopyButton text={marketplaceAddCommand} label="Copy" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Marketplace repo: <code>{MARKETPLACE.githubRepo}</code>
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-950">
          <span className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">2. Install a plugin</span>
          <div className="space-y-2">
            {PLUGINS.map((plugin) => {
              const installCommand = `/plugin install ${getPluginInstallRef(plugin)}`;
              return (
                <div key={plugin.pluginName} className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 px-3 py-2 dark:bg-stone-900/80">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{plugin.label}</div>
                    <code className="block truncate text-sm text-gray-800 dark:text-gray-100">{installCommand}</code>
                  </div>
                  <CopyButton text={installCommand} label="Copy" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-2.5 dark:border-stone-800 dark:bg-stone-950">
          <div className="min-w-0 flex-1">
            <span className="mb-0.5 block text-xs font-medium text-gray-400 dark:text-gray-500">
              Marketplace URL (secondary option)
            </span>
            <code className="block truncate text-sm text-gray-600 dark:text-gray-300">{marketplaceUrlAddCommand}</code>
          </div>
          <CopyButton text={marketplaceUrlAddCommand} label="Copy" />
        </div>
      </div>
    </section>
  );
}
