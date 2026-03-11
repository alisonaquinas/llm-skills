import { getAllSkills, getPluginMeta, REPOS } from "@/lib/github";
import SkillGrid from "@/components/SkillGrid";
import InstallBanner from "@/components/InstallBanner";

export default async function MarketplacePage() {
  const [allSkills, metas] = await Promise.all([
    getAllSkills(),
    Promise.all(REPOS.map(getPluginMeta)),
  ]);

  return (
    <div>
      <InstallBanner />

      {/* Hero */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Claude Plugin Marketplace</h1>
        <p className="text-gray-500 text-lg">
          Browse and install LLM skill packages for Claude Code and Codex.
        </p>
      </section>

      {/* Package Registry Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {REPOS.map((r, i) => {
          const meta = metas[i];
          const count = allSkills.filter((s) => s.repo.repo === r.repo).length;
          return (
            <div key={r.repo} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.color}`}>
                  {r.label}
                </span>
                {meta && <span className="text-xs text-gray-400">v{meta.version}</span>}
              </div>
              <h2 className="font-semibold text-gray-900 mb-1">{meta?.name ?? r.repo}</h2>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{meta?.description ?? ""}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{count} skills</span>
                <a
                  href={`https://github.com/${r.owner}/${r.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600 flex items-center gap-1"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          );
        })}
      </section>

      {/* Client-side search + filtered grid */}
      <SkillGrid skills={allSkills} repos={REPOS} />
    </div>
  );
}
