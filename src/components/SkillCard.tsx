import Link from "next/link";
import type { SkillEntry } from "@/lib/github";

const ICON_MAP: Record<string, string> = {
  kubernetes: "☸️",
  kubectl: "☸️",
  terraform: "🏗️",
  github: "🐙",
  gitlab: "🦊",
  docker: "🐳",
  jenkins: "🔧",
  "1password": "🔑",
  zoxide: "⚡",
  pyenv: "🐍",
  python: "🐍",
  vault: "🔑",
  azure: "🔷",
  maven: "☕",
  helm: "⎈",
  bash: "💻",
  npm: "📦",
  pip: "🐍",
  ssh: "🔐",
  jq: "🔍",
  rg: "🔍",
  ag: "🔍",
  tar: "📦",
  sed: "✂️",
  awk: "⚙️",
  nvm: "🟩",
  git: "🌿",
  aws: "☁️"
};

const ICON_KEYS = Object.keys(ICON_MAP).sort((left, right) => right.length - left.length);

function getIcon(name: string): string {
  const lowerName = name.toLowerCase();
  const key = ICON_KEYS.find((item) => lowerName.includes(item));
  return key ? ICON_MAP[key] : "🔌";
}

export default function SkillCard({ skill }: { skill: SkillEntry }) {
  return (
    <Link
      href={`/skill/${skill.repo.owner}/${skill.repo.repo}/${skill.name}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-brand-500 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-2xl">{getIcon(skill.name)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-gray-900 group-hover:text-brand-600">
              {skill.name}
            </h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${skill.repo.color}`}>
              {skill.repo.label}
            </span>
          </div>
          <p className="mt-1 font-mono text-sm text-gray-500">/{skill.repo.pluginName}:{skill.name}</p>
          <p className="mt-1 text-xs text-gray-400">Plugin repo: {skill.repo.owner}/{skill.repo.repo}</p>
        </div>
        <svg
          className="mt-1 h-4 w-4 shrink-0 text-gray-300 group-hover:text-brand-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
