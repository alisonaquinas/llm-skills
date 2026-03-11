import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "@/components/CopyButton";
import {
  PLUGINS,
  getAllSkills,
  getPluginInstallCommand,
  getSkillDetail,
  getSkillInvocation,
  type PluginConfig
} from "@/lib/github";
import { getPluginRepoUrl } from "@/lib/catalog";

export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((skill) => ({
    slug: [skill.repo.owner, skill.repo.repo, skill.name]
  }));
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

function findPlugin(owner: string, repo: string): PluginConfig | undefined {
  return PLUGINS.find((plugin) => plugin.owner === owner && plugin.repo === repo);
}

export default async function SkillPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length < 3) {
    notFound();
  }

  const [owner, repo, ...nameParts] = slug;
  const skillName = nameParts.join("/");

  const plugin = findPlugin(owner, repo);
  if (!plugin) {
    notFound();
  }

  const resolvedPlugin = plugin as PluginConfig;
  const skill = await getSkillDetail(resolvedPlugin, skillName);
  if (skill.files.length === 0 && !skill.readme) {
    notFound();
  }

  const installCommand = getPluginInstallCommand(resolvedPlugin);
  const invokeCommand = getSkillInvocation(resolvedPlugin, skillName);
  const pluginRepoUrl = getPluginRepoUrl(resolvedPlugin);

  return (
    <div className="max-w-3xl">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700">
          Marketplace
        </Link>
        <span>/</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${resolvedPlugin.color}`}>
          {resolvedPlugin.label}
        </span>
        <span>/</span>
        <span className="font-medium text-gray-700">{skillName}</span>
      </nav>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{skillName}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>Included in plugin</span>
          <code className="rounded bg-gray-100 px-2 py-0.5 text-gray-700">{resolvedPlugin.pluginName}</code>
          <span>·</span>
          <a
            href={`${pluginRepoUrl}/tree/main/skills/${skillName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-brand-600"
          >
            View on GitHub ↗
          </a>
        </div>
      </div>

      {skill.files.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Files</h2>
          <div className="flex flex-wrap gap-2">
            {skill.files.map((file) => (
              <span
                key={file}
                className={`rounded px-2 py-1 font-mono text-xs ${
                  file === "SKILL.md"
                    ? "bg-brand-100 font-semibold text-brand-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {file}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-8 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Install</h2>

        <div className="rounded-xl bg-gray-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-gray-400">Install the containing plugin</span>
            <CopyButton text={installCommand} />
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-green-400">
            {installCommand}
          </pre>
        </div>

        <div className="rounded-xl bg-gray-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-gray-400">Invoke this skill after installation</span>
            <CopyButton text={invokeCommand} label="Copy" />
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-green-400">
            {invokeCommand}
          </pre>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          This skill is bundled inside <strong className="text-gray-800">{resolvedPlugin.pluginName}</strong>.
          Install the plugin once, then Claude Code can use any of its included skills. Browse the
          full plugin repository at{" "}
          <a
            href={pluginRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            github.com/{resolvedPlugin.owner}/{resolvedPlugin.repo}
          </a>
          .
        </div>
      </section>

      {skill.readme ? (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">SKILL.md</h2>
            <CopyButton text={skill.readme} label="Copy raw" />
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-5">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700">
              {skill.readme}
            </pre>
          </div>
        </section>
      ) : null}

      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
        ← Back to marketplace
      </Link>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const skillName = slug?.slice(2).join("/") ?? "Skill";
  return { title: `${skillName} — Claude Plugin Marketplace` };
}
