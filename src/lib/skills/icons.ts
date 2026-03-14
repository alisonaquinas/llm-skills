/**
 * Icon lookup helpers for skill cards.
 *
 * Responsibilities:
 * - provide a lightweight visual hint for common skill names
 * - centralize icon keyword matching in one extension-friendly table
 *
 * Matching strategy: `lowerName.includes(key)`, longest key wins.
 * More specific (longer) keys are listed first within each category
 * so they win over shorter overlapping keys after sort.
 */

/** Mapping from recognizable skill-name fragments to display icons. */
const ICON_MAP: Record<string, string> = {
  // ── CI/CD platforms — specific variants before brand root ─────────────────
  "travis-ci-docs": "📘",
  "travis-worker": "🏃",
  "travis-cd": "🚀",
  "travis-ci": "🔄",
  "travis": "🔄",
  "github-runner": "🏃",
  "github-docs": "📘",
  "github-cd": "🚀",
  "github-ci": "🔄",
  "gitlab-runner": "🏃",
  "gitlab-docs": "📘",
  "gitlab-cd": "🚀",
  "gitlab-ci": "🔄",
  "jenkins-agent": "🤖",
  "jenkins-docs": "📘",
  "jenkins-cd": "🚀",
  "jenkins-ci": "🔄",

  // ── Brand roots ───────────────────────────────────────────────────────────
  "kubernetes": "☸️",
  "kubectl": "☸️",
  "terraform": "🏗️",
  "open-tofu": "🏗️",
  "github": "🐙",
  "gitlab": "🦊",
  "glab": "🦊",
  "docker": "🐳",
  "podman": "🐋",
  "containerd": "📦",
  "cri-o": "🐳",
  "jenkins": "🔧",
  "ansible": "🔧",
  "argocd": "🚀",
  "skaffold": "🚀",
  "tilt": "🔥",
  "flux": "🔄",
  "helm": "⎈",
  "kustomize": "🔧",

  // ── Cloud providers ───────────────────────────────────────────────────────
  "secretsmanager": "🔐",
  "pulumi": "☁️",
  "aws": "☁️",
  "azure": "🔷",
  "az": "🔷",

  // ── Secret / credential management ───────────────────────────────────────
  "1password": "🔑",
  "bitwarden": "🔒",
  "openssl": "🔒",
  "vault": "🔑",

  // ── SSH ───────────────────────────────────────────────────────────────────
  "ssh-keygen": "🔑",
  "ssh-client": "🔐",
  "ssh": "🔐",

  // ── Shells & scripting ────────────────────────────────────────────────────
  "powershell": "🖥️",
  "bash": "💻",
  "zsh": "🐚",

  // ── Version managers ─────────────────────────────────────────────────────
  "pyenv": "🐍",
  "rbenv": "💎",
  "asdf": "🔧",
  "nvm": "🟩",
  "rvm": "💎",

  // ── Package & build managers ──────────────────────────────────────────────
  "pipenv": "🐍",
  "poetry": "🐍",
  "pnpm": "📦",
  "yarn": "🧶",
  "gradle": "🐘",
  "maven": "☕",
  "cmake": "⚙️",
  "make": "⚙️",
  "npm": "📦",
  "pip": "🐍",

  // ── AI / LLM docs & tools ─────────────────────────────────────────────────
  "atlassian-cli-docs": "📘",
  "codex-cli-docs": "🤖",
  "claude-cli-docs": "🤖",
  "chatgpt-docs": "🤖",
  "codex-cli": "🤖",
  "claude-cli": "🤖",
  "codex-docs": "🤖",
  "claude-docs": "🤖",
  "rovo-docs": "🤖",
  "jira-docs": "📋",
  "jsm-docs": "🎫",
  "atlassian": "📘",
  "codex": "🤖",
  "claude": "🤖",

  // ── Source control ────────────────────────────────────────────────────────
  "changelog": "📋",
  "git": "🌿",

  // ── CI architecture ───────────────────────────────────────────────────────
  "ci-architecture": "🏗️",

  // ── Databases ─────────────────────────────────────────────────────────────
  "sqlite": "🗄️",

  // ── XML / structured data formats ────────────────────────────────────────
  "xmllint": "🏷️",
  "xml2": "📑",
  "xq": "🔍",
  "yq": "📊",
  "jq": "🔍",

  // ── Search ────────────────────────────────────────────────────────────────
  "rg": "🔍",
  "ag": "🔍",

  // ── Text processing ───────────────────────────────────────────────────────
  "yaml-linting": "📝",
  "yaml-lsp": "📝",
  "edit-files": "✏️",
  "diff": "↔️",
  "sed": "✂️",
  "awk": "⚙️",
  "cmp": "⚖️",

  // ── File & archive tools ──────────────────────────────────────────────────
  "unzip": "📦",
  "tree": "🌲",
  "head": "📄",
  "tail": "📄",
  "less": "📖",
  "tar": "📦",
  "7z": "🗜️",

  // ── Binary / reverse engineering ─────────────────────────────────────────
  "objdump": "🔩",
  "readelf": "🧬",
  "hexdump": "🔢",
  "binwalk": "🔬",
  "strings": "🔤",
  "xxd": "🔢",
  "ldd": "🔗",
  "nm": "🔣",
  "od": "🗂️",
  "ar": "📚",

  // ── Raw document structure (last-resort skill) ───────────────────────────
  "raw-document": "🗜️",

  // ── Document formats & markup ────────────────────────────────────────────
  // Flavored-markdown variants must come before both "markdown" and brand roots
  // so the longer key wins (e.g. "github-flavored-markdown" > "markdown" > "github").
  "github-flavored-markdown": "🐙",
  "gitlab-flavored-markdown": "🦊",
  "markdownlint": "📝",  // longer than "markdown", so it still wins
  "asciidoc": "📝",
  "markdown": "📝",
  "typst": "📝",
  "latex": "📐",
  "pandoc": "🔄",

  // ── Office & PDF formats ─────────────────────────────────────────────────
  "docx": "📝",
  "pptx": "📊",
  "xlsx": "📊",
  "office": "💼",
  "pdf": "📄",

  // ── Diagram & visualization ───────────────────────────────────────────────
  "plantuml": "🌱",
  "graphviz": "🕸️",
  "mermaid": "🧜",

  // ── Media & document tools ────────────────────────────────────────────────
  "mediainfo": "🎬",
  "exiftool": "🖼️",
  "pdftotext": "📄",
  "pdfinfo": "📄",

  // ── Network tools ─────────────────────────────────────────────────────────
  "curl": "🌐",
  "wget": "⬇️",

  // ── File inspection ───────────────────────────────────────────────────────
  "file": "🔎",

  // ── Skill meta-tools ─────────────────────────────────────────────────────
  "skill-validation": "✅",
  "skill-linting": "🧹",
  "skill-creator": "🛠️",

  // ── Software design ───────────────────────────────────────────────────────
  "software-architecture": "🏛️",
  "design-pattern": "🧩",
  "code-smells": "🤢",
  "solid": "🧱",
  "oop": "🔷",

  // ── Navigation ────────────────────────────────────────────────────────────
  "zoxide": "⚡",

  // ── Environment management ────────────────────────────────────────────────
  "direnv": "📁",

  // ── Python (catch-all, after more specific python keys) ──────────────────
  "python": "🐍",
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
