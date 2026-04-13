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
    <section className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/80 p-4 shadow-sm dark:border-brand-900/70 dark:bg-brand-950/30 sm:p-5">
      <h2 className="mb-1 text-lg font-semibold text-brand-900 dark:text-brand-100">Add this marketplace to Claude Code</h2>
      <p className="mb-4 max-w-3xl text-sm leading-6 text-brand-800 dark:text-brand-200">
        Use the GitHub repository as the primary marketplace source, then install one of the
        published skill bundles. Each bundle packages many individual skills and is installed as a
        single Claude Code plugin — you do not install skills one at a time.
      </p>

      <div className="space-y-3">
        <div className="rounded-xl border border-brand-200 bg-white px-4 py-3 dark:border-brand-900/70 dark:bg-stone-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-brand-600 dark:text-brand-300">1. Add marketplace (recommended)</span>
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
    </section>
  );
}

