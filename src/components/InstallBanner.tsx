import CopyButton from "./CopyButton";
import { MARKETPLACE, PLUGINS, getPluginInstallRef } from "@/lib/github";
import { getMarketplaceAddCommand, getMarketplaceUrlAddCommand } from "@/lib/catalog";

const marketplaceAddCommand = getMarketplaceAddCommand();
const marketplaceUrlAddCommand = getMarketplaceUrlAddCommand();

export default function InstallBanner() {
  return (
    <section className="mb-8 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <h2 className="mb-1 text-lg font-semibold text-indigo-900">Add this marketplace to Claude Code</h2>
      <p className="mb-4 text-sm text-indigo-700">
        Use the GitHub repository as the primary marketplace source, then install either of the two
        published plugins. Individual skills are included within those plugins; they are not listed
        as standalone plugins.
      </p>

      <div className="space-y-3">
        <div className="rounded-lg border border-indigo-200 bg-white px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <span className="block text-xs font-medium text-indigo-500">1. Add marketplace (recommended)</span>
              <code className="block text-sm text-gray-800">{marketplaceAddCommand}</code>
            </div>
            <CopyButton text={marketplaceAddCommand} label="Copy" />
          </div>
          <p className="text-xs text-gray-500">
            Marketplace repo: <code>{MARKETPLACE.githubRepo}</code>
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <span className="mb-2 block text-xs font-medium text-gray-500">2. Install a plugin</span>
          <div className="space-y-2">
            {PLUGINS.map((plugin) => {
              const installCommand = `/plugin install ${getPluginInstallRef(plugin)}`;
              return (
                <div key={plugin.pluginName} className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-500">{plugin.label}</div>
                    <code className="block truncate text-sm text-gray-800">{installCommand}</code>
                  </div>
                  <CopyButton text={installCommand} label="Copy" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <span className="mb-0.5 block text-xs font-medium text-gray-400">
              Marketplace URL (secondary option)
            </span>
            <code className="block truncate text-sm text-gray-600">{marketplaceUrlAddCommand}</code>
          </div>
          <CopyButton text={marketplaceUrlAddCommand} label="Copy" />
        </div>
      </div>
    </section>
  );
}
