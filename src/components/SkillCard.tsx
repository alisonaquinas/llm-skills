import Link from "next/link";
import type { SkillEntry } from "@/lib/github";

const ICON_MAP: Record<string, string> = {
  git: "🌿", docker: "🐳", kubernetes: "☸️", aws: "☁️", azure: "🔷",
  bash: "💻", python: "🐍", npm: "📦", pip: "🐍", maven: "☕",
  terraform: "🏗️", jenkins: "🔧", github: "🐙", gitlab: "🦊",
  ssh: "🔐", vault: "🔑", helm: "⎈", kubectl: "☸️", jq: "🔍",
  ag: "🔍", rg: "🔍", tar: "📦", sed: "✂️", awk: "⚙️",
  zoxide: "⚡", nvm: "🟩", pyenv: "🐍", "1password": "🔑",
};

function getIcon(name: string): string {
  const key = Object.keys(ICON_MAP).find((k) => name.toLowerCase().includes(k));
  return key ? ICON_MAP[key] : "🔌";
}

export default function SkillCard({ skill }: { skill: SkillEntry }) {
  return (
    <Link
      href={`/skill/${skill.repo.owner}/${skill.repo.repo}/${skill.name}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-500 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">{getIcon(skill.name)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 truncate">
              {skill.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${skill.repo.color}`}>
              {skill.repo.label}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 font-mono">{skill.repo.owner}/{skill.repo.repo}</p>
        </div>
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-brand-500 shrink-0 mt-1"
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
