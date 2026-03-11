import CopyButton from "./CopyButton";

const MARKETPLACE_URL =
  "https://alisonaquinas.github.io/llm-skills/marketplace.json";
const GIT_URL = "https://github.com/alisonaquinas/llm-skills.git";

export default function InstallBanner() {
  return (
    <section className="mb-8 bg-indigo-50 border border-indigo-200 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-indigo-900 mb-1">
        Add to Claude Code
      </h2>
      <p className="text-sm text-indigo-700 mb-4">
        Install the full skill library in three steps:
      </p>

      <ol className="text-sm text-indigo-800 mb-5 space-y-1 list-decimal list-inside">
        <li>Open Claude Code → Settings → Plugins → Add marketplace by URL</li>
        <li>Paste the marketplace URL below</li>
        <li>Browse the registry and install individual skills</li>
      </ol>

      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-white border border-indigo-200 rounded-lg px-4 py-2.5">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-indigo-500 block mb-0.5">
              Marketplace URL (recommended)
            </span>
            <code className="text-sm text-gray-800 truncate block">
              {MARKETPLACE_URL}
            </code>
          </div>
          <CopyButton text={MARKETPLACE_URL} label="Copy" />
        </div>

        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-gray-400 block mb-0.5">
              Git URL (alternative)
            </span>
            <code className="text-sm text-gray-600 truncate block">
              {GIT_URL}
            </code>
          </div>
          <CopyButton text={GIT_URL} label="Copy" />
        </div>
      </div>
    </section>
  );
}
