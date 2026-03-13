/**
 * Icon lookup helpers for skill cards.
 *
 * Responsibilities:
 * - provide a lightweight visual hint for common skill names
 * - centralize icon keyword matching in one extension-friendly table
 */

/** Mapping from recognizable skill-name fragments to display icons. */
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
  aws: "☁️",
};

/** Keyword list sorted longest-first so specific matches win over broad ones. */
const ICON_KEYS = Object.keys(ICON_MAP).sort((left, right) => right.length - left.length);

/**
 * Returns the best icon for a skill name based on keyword matching.
 *
 * @param name Skill name to analyze.
 * @returns The matching icon, or a generic plug when no mapping is found.
 */
export function getSkillIcon(name: string): string {
  const lowerName = name.toLowerCase();
  const key = ICON_KEYS.find((item) => lowerName.includes(item));
  return key ? ICON_MAP[key] : "🔌";
}
