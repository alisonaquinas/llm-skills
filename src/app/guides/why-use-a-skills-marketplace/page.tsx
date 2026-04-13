/**
 * Opinionated guide arguing the case for using a curated skills marketplace.
 *
 * Responsibilities:
 * - target search intent for "why use a skills marketplace" and similar queries
 * - lay out the practical reuse, pinning, and portability arguments honestly
 * - acknowledge real tradeoffs around curator coupling and maintenance latency
 *
 * Dependency rules:
 * - reuses layout chrome from the root layout — no new design system
 * - pulls marketplace metadata from the catalog namespace for consistency
 */
import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { MARKETPLACE, PLUGINS } from "@/lib/catalog";
import {
  buildGuideArticleStructuredData,
  buildSiteUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";

/** Canonical URL for this guide. */
const PAGE_URL = buildSiteUrl("guides/why-use-a-skills-marketplace/");

/** Shared description used across metadata fields. */
const PAGE_DESCRIPTION =
  "Why a curated skills marketplace beats rolling your own: reuse across projects, pinned versions, portability between Claude Code and Codex, and team consistency — plus the honest tradeoffs.";

/** Page title used in the browser tab and structured data. */
const PAGE_TITLE = `Why use a skills marketplace? | ${MARKETPLACE.title}`;

/**
 * Route metadata for the marketplace rationale guide.
 */
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
 * Renders the marketplace rationale guide.
 *
 * @returns Static guide page covering benefits and tradeoffs.
 */
export default function WhyUseASkillsMarketplacePage() {
  return (
    <article className="prose-like max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
      <StructuredData
        data={buildGuideArticleStructuredData({
          url: PAGE_URL,
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        })}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
          Marketplace
        </Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-gray-700 dark:hover:text-gray-200">
          Learn
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          Why use a skills marketplace
        </span>
      </nav>

      <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        Why use a skills marketplace?
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
        You can hand-roll skills in a local folder and commit them alongside your
        project. Plenty of teams do. A marketplace is worth using anyway — here is
        why, and where the tradeoffs genuinely hurt.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Reuse across projects
      </h2>
      <p className="mb-4">
        A Helm chart skill you wrote for one repo works identically in every other
        repo. Shipping it as a marketplace bundle removes the copy-paste step. Every
        project that installs the bundle gets the same skill, same references, same
        scripts — no drift.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Version pinning
      </h2>
      <p className="mb-4">
        Bundles are released with semver tags. The marketplace catalog pins each
        bundle to a specific release (this site currently ships {PLUGINS.length}{" "}
        bundles, each pinned to a tagged version). When you install, you get that
        version — not whatever&apos;s on <code className="font-mono text-sm">main</code>.
        Upgrades are deliberate: re-run the install command and you opt into the new
        version; otherwise you stay pinned. That is strictly better than symlinking a
        local folder that quietly changes under you.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Portability between Claude Code and Codex
      </h2>
      <p className="mb-4">
        Skills authored with both{" "}
        <code className="font-mono text-sm">agents/claude.yaml</code> and{" "}
        <code className="font-mono text-sm">agents/openai.yaml</code> work across both
        agents. A marketplace enforces this dual-frontmatter convention in its
        curation checks. That means when you switch teammates or tools from Claude
        Code to Codex — or run a mixed shop — the same skill content follows. See the{" "}
        <Link
          href="/claude-vs-codex"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          Claude Code vs Codex comparison
        </Link>{" "}
        for specifics.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Team consistency
      </h2>
      <p className="mb-4">
        If every engineer installs the same bundle, every engineer&apos;s agent
        behaves the same way. That is a real force multiplier. Bug reports become
        reproducible (&quot;I&apos;m on ci-cd v1.2.3, you?&quot;). Onboarding is a
        one-liner rather than a wiki page. Opinionated defaults — linting,
        conventional commits, docstring formats — get enforced through skill content
        rather than policed in code review.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Discovery vs rolling your own
      </h2>
      <p className="mb-4">
        Rolling your own skill is fine until you need the twentieth. At that point
        you&apos;re maintaining a private library: naming conventions, trigger
        quality, cross-referencing, tests. A marketplace has already paid that cost.
        Browsing a{" "}
        <Link href="/skills" className="text-brand-600 hover:underline dark:text-brand-300">
          curated catalog
        </Link>{" "}
        is faster than either writing from scratch or searching a colleague&apos;s
        Slack for &quot;that docker skill you had.&quot;
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        The honest tradeoffs
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-2">
        <li>
          <strong>Coupling to a curator.</strong> When you install from a
          marketplace, you trust whoever runs it to keep it alive, to accept fixes,
          and not to quietly regress content. If the curator disappears, you have a
          migration problem. Mitigation: bundles are plain Git repos — fork them.
        </li>
        <li>
          <strong>Trust.</strong> Skills ship scripts that run in your workspace.
          Read before you install. The content here is all open source on GitHub with
          commit history you can audit.
        </li>
        <li>
          <strong>Maintenance latency.</strong> A bug you file against a bundle
          ships on the curator&apos;s cadence, not yours. If a fix is urgent, a local
          fork beats the marketplace. The marketplace wins over the long run; a fork
          wins in an emergency.
        </li>
        <li>
          <strong>Fit.</strong> Curated bundles encode opinions. If those opinions
          clash with your house style, you will fight the skill. In that case, pick
          narrower bundles (just <code className="font-mono text-sm">ci-cd</code>,
          not the whole set) and write your own overrides.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        When to skip the marketplace
      </h2>
      <p className="mb-4">
        For one-off skills unique to your codebase — that no one outside your team
        would ever reuse — keep them local. The moment a skill looks general
        (&quot;write an Ansible playbook,&quot; &quot;format a Markdown doc&quot;),
        prefer installing a bundle and inheriting the curator&apos;s work.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Where to start
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          New to the concept? Read{" "}
          <Link
            href="/what-are-skills"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            what are agent skills
          </Link>
          .
        </li>
        <li>
          Ready to install something? See the{" "}
          <Link
            href="/guides/install-skills-from-github"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            install walkthrough
          </Link>
          .
        </li>
        <li>
          Looking for picks? Start with{" "}
          <Link
            href="/guides/best-ci-cd-skills-for-claude-code"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            best CI/CD skills
          </Link>
          .
        </li>
      </ul>
    </article>
  );
}
