import InstallBanner from "@/components/InstallBanner";
import SkillGrid from "@/components/SkillGrid";
import {
  MARKETPLACE,
  PLUGINS,
  getAllSkills,
  getPluginInstallCommand,
  getPluginMeta,
} from "@/lib/github";
import { getPluginRepoUrl } from "@/lib/catalog";

export default async function MarketplacePage() {
  const [allSkills, metas] = await Promise.all([
    getAllSkills(),
    Promise.all(PLUGINS.map(getPluginMeta)),
  ]);

  return (
    <div>
      <InstallBanner />

      <section className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{MARKETPLACE.title}</h1>
        <p className="text-lg text-gray-500">
          This marketplace publishes two installable Claude Code plugins and lets you browse the
          skills bundled inside each one.
        </p>
      </section>

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLUGINS.map((plugin, index) => {
          const meta = metas[index];
          const count = allSkills.filter((skill) => skill.repo.repo === plugin.repo).length;
          const installCommand = getPluginInstallCommand(plugin);

          return (
            <div key={plugin.repo} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${plugin.color}`}>
                  {plugin.label}
                </span>
                {meta?.version ? <span className="text-xs text-gray-400">v{meta.version}</span> : null}
              </div>

              <h2 className="mb-1 font-semibold text-gray-900">{plugin.pluginName}</h2>
              <p className="mb-3 line-clamp-3 text-sm text-gray-500">
                {meta?.description ?? plugin.siteDescription}
              </p>

              <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2">
                <div className="mb-1 text-xs font-medium text-gray-500">Install</div>
                <code className="block text-sm text-gray-800">{installCommand}</code>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{count} included skills</span>
                <a
                  href={getPluginRepoUrl(plugin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-brand-600"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          );
        })}
      </section>

      <SkillGrid skills={allSkills} repos={PLUGINS} />
    </div>
  );
}
