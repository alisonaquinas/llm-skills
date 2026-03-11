import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSkills, getSkillDetail, REPOS } from "@/lib/github";
import CopyButton from "@/components/CopyButton";

export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((s) => ({
    slug: [s.repo.owner, s.repo.repo, s.name],
  }));
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function SkillPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length < 3) notFound();

  const [owner, repo, ...nameParts] = slug;
  const skillName = nameParts.join("/");

  const repoConfig = REPOS.find((r) => r.owner === owner && r.repo === repo);
  if (!repoConfig) notFound();

  const skill = await getSkillDetail(repoConfig, skillName);

  const cloneCmd = `git clone https://github.com/${owner}/${repo}.git
# Then copy the skill:
cp -r ${repo}/skills/${skillName} ~/.claude/skills/`;

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700">
          Marketplace
        </Link>
        <span>/</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${repoConfig.color}`}>
          {repoConfig.label}
        </span>
        <span>/</span>
        <span className="text-gray-700 font-medium">{skillName}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{skillName}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <a
            href={`https://github.com/${owner}/${repo}/tree/main/skills/${skillName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-600 flex items-center gap-1"
          >
            View on GitHub ↗
          </a>
          <span>·</span>
          <span>{owner}/{repo}</span>
        </div>
      </div>

      {/* Files */}
      {skill.files.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Files</h2>
          <div className="flex flex-wrap gap-2">
            {skill.files.map((f) => (
              <span
                key={f}
                className={`text-xs px-2 py-1 rounded font-mono ${
                  f === "SKILL.md"
                    ? "bg-brand-100 text-brand-700 font-semibold"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Install */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Install</h2>
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-mono">Via git clone</span>
              <CopyButton text={cloneCmd} />
            </div>
            <pre className="text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
              {cloneCmd}
            </pre>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
            <strong className="text-gray-800">Or</strong> browse the full package:{" "}
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              github.com/{owner}/{repo}
            </a>{" "}
            and follow the{" "}
            <a
              href={`https://github.com/${owner}/${repo}/blob/main/INSTALL.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              INSTALL.md
            </a>{" "}
            instructions.
          </div>
        </div>
      </section>

      {/* SKILL.md content */}
      {skill.readme && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">SKILL.md</h2>
            <CopyButton text={skill.readme} label="Copy raw" />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">
              {skill.readme}
            </pre>
          </div>
        </section>
      )}

      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to marketplace
      </Link>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const skillName = slug?.slice(2).join("/") ?? "";
  return { title: `${skillName} — Claude Plugin Marketplace` };
}
