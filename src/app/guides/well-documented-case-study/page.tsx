/**
 * Case-study guide for the well-documented skill.
 *
 * Responsibilities:
 * - narrate a realistic end-to-end usage of the well-documented skill
 * - orient both human readers and AI agents navigating the repository
 * - surface the audit-first philosophy and maturity-level model with diagrams
 *
 * Dependency rules:
 * - reuses layout chrome from the root layout and the guide page pattern
 * - sources the install command via the shared commands helper for parity
 * - illustrations are inline SVG so they ship in the static export with no assets
 */
import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { MARKETPLACE, PLUGINS } from "@/lib/catalog";
import { getPluginInstallCommand } from "@/lib/commands";
import {
  buildGuideArticleStructuredData,
  buildSiteUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";

const PAGE_URL = buildSiteUrl("guides/well-documented-case-study/");

const PAGE_DESCRIPTION =
  "Case study of the well-documented skill: an audit-first, low-drift documentation workflow with maturity levels, evidence-based fixes, and language-aware headers.";

const PAGE_TITLE = `Case study: the well-documented skill | ${MARKETPLACE.title}`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [getSocialPreviewImageUrl()],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [getSocialPreviewImageUrl()],
  },
};

/**
 * Renders the well-documented case-study guide.
 *
 * @returns Static case-study page with inline SVG illustrations and install CTA.
 */
export default function WellDocumentedCaseStudyPage() {
  const softwareDesignPlugin =
    PLUGINS.find((plugin) => plugin.pluginName === "software-design") ?? PLUGINS[0];
  const installCommand = getPluginInstallCommand(softwareDesignPlugin);

  return (
    <article className="prose-like max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
      <StructuredData
        data={buildGuideArticleStructuredData({
          url: PAGE_URL,
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        })}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
          Marketplace
        </Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-gray-700 dark:hover:text-gray-200">
          Learn
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          Well-documented case study
        </span>
      </nav>

      <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        Case study: raising documentation quality with the well-documented skill
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
        The <code className="font-mono text-base">well-documented</code> skill
        ships in the{" "}
        <Link
          href="/bundles/software-design"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          software-design bundle
        </Link>
        . Unlike a template generator, it treats documentation as an evidence-first
        audit target: find what is missing, stale, or lying — then fix the smallest
        thing that moves the needle. This page walks through how it behaves on a
        real repository and why it is useful context for both humans and AI agents
        navigating the codebase.
      </p>

      <section className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/80 p-4 shadow-sm dark:border-brand-900/70 dark:bg-brand-950/30 sm:p-5">
        <h2 className="mb-1 text-lg font-semibold text-brand-900 dark:text-brand-100">
          Install the software-design bundle
        </h2>
        <p className="mb-3 max-w-3xl text-sm leading-6 text-brand-800 dark:text-brand-200">
          The well-documented skill is installed as part of the software-design
          bundle. Register the marketplace first (see the{" "}
          <Link
            href="/guides/install-skills-from-github"
            className="text-brand-700 underline decoration-brand-400 hover:decoration-brand-700 dark:text-brand-200 dark:decoration-brand-600"
          >
            installation guide
          </Link>
          ), then install.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
          <code>{installCommand}</code>
        </pre>
      </section>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        The problem
      </h2>
      <p className="mb-4">
        Most repository documentation fails in one of three ways: it is missing, it
        is technically present but silently wrong (broken links, renamed commands,
        stale directory trees), or it has sprawled — a folder-per-folder
        <code className="font-mono text-sm"> README.md</code> farm where file
        counts go up but nothing is trustworthy. AI agents make this worse: prompt
        them to &quot;document the repo&quot; and you get invented APIs, duplicated
        structure, and boilerplate that has nothing to do with the code.
      </p>
      <p className="mb-4">
        The well-documented skill tries to reverse that pattern. Its default
        answer is <em>do less, but make it true</em>. The first command it runs is
        always an audit, and the first output is always a report — not new files.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Maturity levels, not one-size-fits-all
      </h2>
      <p className="mb-4">
        The skill refuses to generate a full documentation tree by default.
        Instead, you pick a maturity level that fits the repository&rsquo;s actual
        surface area:
      </p>

      <figure className="my-6">
        <svg
          viewBox="0 0 640 240"
          role="img"
          aria-labelledby="maturity-title maturity-desc"
          className="mx-auto block h-auto w-full max-w-[640px] rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950"
        >
          <title id="maturity-title">Documentation maturity ladder</title>
          <desc id="maturity-desc">
            Three steps from left to right: minimal, standard, full. Each step
            widens the scope of documentation coverage.
          </desc>
          <defs>
            <linearGradient id="step-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 z" fill="#78350f" />
            </marker>
          </defs>
          <rect x="20" y="150" width="180" height="60" rx="10" fill="url(#step-fill)" stroke="#b45309" strokeWidth="1.5" />
          <text x="110" y="175" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="600" fill="#78350f">minimal</text>
          <text x="110" y="195" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#78350f">root README + AGENTS.md</text>

          <rect x="230" y="100" width="180" height="110" rx="10" fill="url(#step-fill)" stroke="#b45309" strokeWidth="1.5" />
          <text x="320" y="125" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="600" fill="#78350f">standard</text>
          <text x="320" y="145" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#78350f">+ folder docs on</text>
          <text x="320" y="160" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#78350f">important boundaries</text>
          <text x="320" y="180" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#78350f">+ CONCEPTS.md</text>

          <rect x="440" y="40" width="180" height="170" rx="10" fill="url(#step-fill)" stroke="#b45309" strokeWidth="1.5" />
          <text x="530" y="65" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="600" fill="#78350f">full</text>
          <text x="530" y="85" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#78350f">+ recursive folder docs</text>
          <text x="530" y="100" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#78350f">+ file headers</text>
          <text x="530" y="115" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#78350f">+ docstrings</text>
          <text x="530" y="130" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#78350f">+ architecture notes</text>
          <text x="530" y="145" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#78350f">(explicit opt-in)</text>

          <path d="M 210 180 L 225 180" stroke="#78350f" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <path d="M 420 155 L 435 155" stroke="#78350f" strokeWidth="1.5" markerEnd="url(#arrow)" />

          <text x="320" y="225" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fontStyle="italic" fill="#57534e">
            pick the smallest level that fits the repository
          </text>
        </svg>
        <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Figure 1. Documentation maturity ladder — narrower levels are the default.
        </figcaption>
      </figure>

      <ul className="mb-4 ml-6 list-disc space-y-2">
        <li>
          <strong>minimal</strong> — just the high-value root files. Good for new
          or small repositories that only need a trustworthy entry point.
        </li>
        <li>
          <strong>standard</strong> — add folder docs at important boundaries
          (packages, services, subsystems) and a <code className="font-mono text-sm">CONCEPTS.md</code>{" "}
          glossary. This is the default working target.
        </li>
        <li>
          <strong>full</strong> — recursive per-folder docs, file headers, and
          docstrings. An explicit opt-in, because over-documenting is its own
          drift problem.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Audit first, write later
      </h2>
      <p className="mb-4">
        The most distinctive move is that every workflow starts with{" "}
        <code className="font-mono text-sm">audit-docs</code>. It scans the
        repository, scores findings against a published checklist, and reports
        PASS / WARN / FAIL / SKIP for each item before touching a file. Only then
        does it offer to fix — and the first fixes are always evidence-based:
        broken links, commands that no longer work, layout references that moved.
      </p>

      <figure className="my-6">
        <svg
          viewBox="0 0 640 260"
          role="img"
          aria-labelledby="loop-title loop-desc"
          className="mx-auto block h-auto w-full max-w-[640px] rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950"
        >
          <title id="loop-title">Audit-first documentation loop</title>
          <desc id="loop-desc">
            A four-step loop: audit-docs, fix evidence gaps, normalize-docs, re-audit.
            Arrows flow clockwise.
          </desc>

          <g fontFamily="system-ui, sans-serif">
            <circle cx="160" cy="80" r="52" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.5" />
            <text x="160" y="76" textAnchor="middle" fontSize="13" fontWeight="600" fill="#0c4a6e">audit-docs</text>
            <text x="160" y="94" textAnchor="middle" fontSize="10" fill="#0c4a6e">score gaps</text>

            <circle cx="480" cy="80" r="52" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <text x="480" y="74" textAnchor="middle" fontSize="13" fontWeight="600" fill="#78350f">fix evidence</text>
            <text x="480" y="90" textAnchor="middle" fontSize="10" fill="#78350f">broken links,</text>
            <text x="480" y="104" textAnchor="middle" fontSize="10" fill="#78350f">stale commands</text>

            <circle cx="480" cy="200" r="52" fill="#dcfce7" stroke="#166534" strokeWidth="1.5" />
            <text x="480" y="196" textAnchor="middle" fontSize="13" fontWeight="600" fill="#14532d">normalize-docs</text>
            <text x="480" y="214" textAnchor="middle" fontSize="10" fill="#14532d">fill only the gaps</text>

            <circle cx="160" cy="200" r="52" fill="#ede9fe" stroke="#6d28d9" strokeWidth="1.5" />
            <text x="160" y="196" textAnchor="middle" fontSize="13" fontWeight="600" fill="#4c1d95">re-audit</text>
            <text x="160" y="214" textAnchor="middle" fontSize="10" fill="#4c1d95">confirm gaps closed</text>
          </g>

          <defs>
            <marker id="loop-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M0,0 L0,10 L10,5 z" fill="#44403c" />
            </marker>
          </defs>
          <path d="M 216 72 L 422 72" stroke="#44403c" strokeWidth="1.5" fill="none" markerEnd="url(#loop-arrow)" />
          <path d="M 480 136 L 480 146" stroke="#44403c" strokeWidth="1.5" fill="none" markerEnd="url(#loop-arrow)" />
          <path d="M 424 208 L 218 208" stroke="#44403c" strokeWidth="1.5" fill="none" markerEnd="url(#loop-arrow)" />
          <path d="M 160 148 L 160 136" stroke="#44403c" strokeWidth="1.5" fill="none" markerEnd="url(#loop-arrow)" />
        </svg>
        <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Figure 2. The audit-first loop. New files are a last resort, not a first move.
        </figcaption>
      </figure>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Walkthrough: a service repo in three turns
      </h2>
      <p className="mb-4">
        A plausible transcript. Assume a backend service repo with a thin README,
        a couple of Go packages, and no AGENTS.md file.
      </p>

      <p className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Turn 1 — audit only</p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>audit-docs --maturity standard</code>
      </pre>
      <p className="mb-4">
        The skill reports: root README exists but is missing a project summary and
        build-test section (WARN); no AGENTS.md (FAIL); CONCEPTS.md absent (WARN);
        two links in the README point at renamed files (FAIL); three public
        packages have no doc-comments on their exported types (WARN at standard,
        FAIL at full). No files written.
      </p>

      <p className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Turn 2 — fix evidence first</p>
      <p className="mb-4">
        You review the report and agree. You ask for the evidence fixes — broken
        links, stale build commands — and the AGENTS.md + CONCEPTS.md baselines
        at standard maturity:
      </p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>normalize-docs --maturity standard --project-type service</code>
      </pre>
      <p className="mb-4">
        The skill writes only what the audit flagged: repairs two README links,
        creates <code className="font-mono text-sm">AGENTS.md</code> and{" "}
        <code className="font-mono text-sm">CONCEPTS.md</code> with the
        service template, and leaves bootstrap markers visible on generated
        sections so the next reviewer knows what still needs human input. No
        per-folder README sprawl.
      </p>

      <p className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Turn 3 — add docstrings where it matters</p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>add-docstrings internal/api/</code>
      </pre>
      <p className="mb-4">
        The skill delegates Go format choices to the{" "}
        <code className="font-mono text-sm">go-docstrings</code> skill (also in
        the software-design bundle), adds declaration-adjacent comments on
        exported types and functions, and reports which symbols were skipped and
        why — test helpers, generated code, internal-only types.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        What ends up on disk
      </h2>
      <p className="mb-4">
        After the three turns, the repository has a small, honest set of
        documentation files arranged around real boundaries:
      </p>

      <figure className="my-6">
        <svg
          viewBox="0 0 640 300"
          role="img"
          aria-labelledby="layout-title layout-desc"
          className="mx-auto block h-auto w-full max-w-[640px] rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950"
        >
          <title id="layout-title">Documentation layout after normalize-docs</title>
          <desc id="layout-desc">
            Tree diagram of a repo root with README, AGENTS, CONCEPTS at the top
            level and an AGENTS.md inside the internal/api package only.
          </desc>

          <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="13" fill="#292524">
            <text x="40" y="40" fontWeight="600">my-service/</text>
            <text x="70" y="70">├── README.md</text>
            <text x="70" y="95">├── AGENTS.md</text>
            <text x="70" y="120">├── CONCEPTS.md</text>
            <text x="70" y="145">├── cmd/</text>
            <text x="110" y="170">└── server/main.go</text>
            <text x="70" y="195">├── internal/</text>
            <text x="110" y="220">├── api/</text>
            <text x="150" y="245">├── AGENTS.md</text>
            <text x="150" y="270">└── handlers.go</text>
            <text x="110" y="295">└── store/</text>
          </g>

          <g fontFamily="system-ui, sans-serif" fontSize="11" fill="#78716c">
            <line x1="220" y1="70" x2="360" y2="70" stroke="#a8a29e" strokeDasharray="4 3" />
            <text x="370" y="74">project purpose + build/test</text>

            <line x1="220" y1="95" x2="360" y2="95" stroke="#a8a29e" strokeDasharray="4 3" />
            <text x="370" y="99">agent-facing guidance</text>

            <line x1="240" y1="120" x2="360" y2="120" stroke="#a8a29e" strokeDasharray="4 3" />
            <text x="370" y="124">domain glossary</text>

            <line x1="270" y1="245" x2="360" y2="245" stroke="#a8a29e" strokeDasharray="4 3" />
            <text x="370" y="249">subsystem-specific notes</text>
          </g>
        </svg>
        <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Figure 3. Typical layout after a standard-maturity normalize pass. No
          folder-per-folder README farm.
        </figcaption>
      </figure>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Why this is useful context for AI agents
      </h2>
      <p className="mb-4">
        Agents that read a repository cold tend to re-derive context from file
        paths and names. That works for small projects and fails on anything with
        a non-obvious domain vocabulary. Three artifacts this skill produces
        change that dynamic:
      </p>
      <ul className="mb-4 ml-6 list-disc space-y-2">
        <li>
          <strong>AGENTS.md</strong> tells an AI reader the house rules —
          preferred commands, test runners, things to avoid — without consuming
          human-facing README real estate. Claude Code and Codex both honor it.
        </li>
        <li>
          <strong>CONCEPTS.md</strong> grounds domain terms in single-paragraph
          definitions with cross-references. It measurably reduces the chance an
          agent invents a plausible-but-wrong meaning for a term like{" "}
          <em>tenant</em>, <em>quota</em>, or <em>run</em>.
        </li>
        <li>
          <strong>Bootstrap markers</strong> visible in generated sections keep
          agents honest: they can see at a glance which paragraphs are template
          residue and which have been refined by a human.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Safety rails worth noticing
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-2">
        <li>Never deletes or rewrites accurate content just to fit a template.</li>
        <li>
          Never invents APIs, workflows, or invariants — only documents what the
          code already supports.
        </li>
        <li>
          Refuses to run tree-wide header or docstring generation on large repos
          without first reporting scope and exclusions.
        </li>
        <li>
          Skips generated, vendored, minified, and fixture content by default.
        </li>
        <li>
          Treats broad write operations as reversible batches and reports exactly
          what changed.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Where to go next
      </h2>
      <p className="mb-4">
        Install the <Link
          href="/bundles/software-design"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          software-design bundle
        </Link>{" "}
        and run <code className="font-mono text-sm">audit-docs --maturity standard</code>{" "}
        on a repository you already care about. Read the report before you approve
        any fix. If you want the broader case for skill-based agent augmentation,
        see{" "}
        <Link
          href="/guides/why-use-a-skills-marketplace"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          why use a skills marketplace
        </Link>
        . If you are new to skills entirely, start with{" "}
        <Link
          href="/what-are-skills"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          what are agent skills
        </Link>
        .
      </p>
    </article>
  );
}
