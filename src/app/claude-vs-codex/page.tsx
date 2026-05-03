/**
 * Comparison page between Claude Code skills and Codex skills.
 *
 * Responsibilities:
 * - capture narrow-intent search traffic for "Claude Code vs Codex skills"
 * - describe shared concepts and real platform differences
 * - explain how this marketplace targets both platforms per skill
 *
 * Dependency rules:
 * - reuses layout chrome from the root layout — no new design system
 * - pulls marketplace metadata from the catalog namespace for consistency
 */
import type { Metadata } from "next";
import Link from "next/link";
import { MARKETPLACE } from "@/lib/catalog";
import { buildSiteUrl, getSocialPreviewImageUrl } from "@/lib/seo";

/** Canonical URL for this comparison page. */
const PAGE_URL = buildSiteUrl("claude-vs-codex/");

/** Shared description used across metadata fields. */
const PAGE_DESCRIPTION =
  "How Claude Code skills compare to OpenAI Codex skills: shared concepts, platform differences, and how a single skill bundle can serve both agents.";

/**
 * Route metadata for the comparison page.
 */
export const metadata: Metadata = {
  title: `Claude Code skills vs Codex skills | ${MARKETPLACE.title}`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title: `Claude Code skills vs Codex skills | ${MARKETPLACE.title}`,
    description: PAGE_DESCRIPTION,
    images: [getSocialPreviewImageUrl()],
  },
  twitter: {
    card: "summary_large_image",
    title: `Claude Code skills vs Codex skills | ${MARKETPLACE.title}`,
    description: PAGE_DESCRIPTION,
    images: [getSocialPreviewImageUrl()],
  },
};

/**
 * Renders the Claude Code vs Codex comparison page.
 *
 * @returns Static content page comparing the two platforms&apos; skill systems.
 */
export default function ClaudeVsCodexPage() {
  return (
    <article className="prose-like max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
          Marketplace
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          Claude Code vs Codex
        </span>
      </nav>

      <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        Claude Code skills vs Codex skills
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
        Both Claude Code and OpenAI Codex are skill-based agent-augmentation systems.
        They share a lot of concepts, and a well-authored skill can serve both. Here
        is how they line up.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        The shared concept
      </h2>
      <p className="mb-4">
        A skill is a packaged instruction set with a trigger description, primary
        guidance (usually a <code className="font-mono">SKILL.md</code>), optional
        references, and optional scripts. When a user&apos;s request matches the
        trigger, the agent pulls the skill into context and follows it. This pattern
        works the same on both platforms: the agent does not memorize every task; it
        loads the right skill when it needs one.
      </p>
      <p className="mb-4">
        Skills also travel in <strong>bundles</strong>: a collection of related
        skills installed as a single plugin. Bundling keeps distribution simple and
        makes it easier to version related skills together.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Claude Code skills
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          Installed via the Claude Code plugin system. Users add a marketplace, then
          run{" "}
          <code className="font-mono text-sm">/plugin install &lt;bundle&gt;</code>.
        </li>
        <li>
          Skill metadata targeted to Claude lives in
          <code className="mx-1 font-mono text-sm">agents/claude.yaml</code> inside
          each skill directory.
        </li>
        <li>
          The Claude Code CLI handles trigger matching, reference loading, and
          invocation automatically. Users rarely need to call a skill by name.
        </li>
        <li>
          Bundles can include hooks and slash commands alongside skills, which lets a
          bundle extend Claude Code behavior beyond per-request skill use.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Codex skills
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          Installed through the Codex plugin marketplace. Users add the marketplace
          with <code className="font-mono text-sm">codex plugin marketplace add</code>,
          then choose bundles from the Codex plugin directory.
        </li>
        <li>
          Skill metadata targeted to Codex lives in
          <code className="mx-1 font-mono text-sm">agents/openai.yaml</code>, letting
          a single skill directory publish both Claude and Codex frontmatter side by
          side.
        </li>
        <li>
          Bundle metadata targeted to Codex lives in
          <code className="mx-1 font-mono text-sm">.codex-plugin/plugin.json</code>,
          while Claude Code bundle metadata remains in
          <code className="mx-1 font-mono text-sm">.claude-plugin/plugin.json</code>.
        </li>
        <li>
          Codex reads Git-backed marketplace entries and loads plugin sources from
          the configured repository refs.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Key differences at a glance
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          <strong>Install surface.</strong> Claude Code has a native marketplace and
          <code className="mx-1 font-mono text-sm">/plugin install</code> flow;
          Codex has its own plugin marketplace flow through the
          <code className="mx-1 font-mono text-sm">codex plugin marketplace</code>
          command family.
        </li>
        <li>
          <strong>Metadata file.</strong>{" "}
          <code className="font-mono text-sm">agents/claude.yaml</code> for Claude
          Code,{" "}
          <code className="font-mono text-sm">agents/openai.yaml</code> for Codex.
        </li>
        <li>
          <strong>Bundle manifest.</strong>{" "}
          <code className="font-mono text-sm">.claude-plugin/plugin.json</code> for
          Claude Code,{" "}
          <code className="font-mono text-sm">.codex-plugin/plugin.json</code> for
          Codex.
        </li>
        <li>
          <strong>Platform model.</strong> Claude Code is a full desktop CLI with
          long-lived context; Codex runs inside the broader OpenAI agent stack.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        How this marketplace serves both
      </h2>
      <p className="mb-4">
        Every skill in {MARKETPLACE.title} is authored to target both platforms. Each
        skill directory contains its own
        <code className="mx-1 font-mono text-sm">agents/claude.yaml</code> and
        <code className="mx-1 font-mono text-sm">agents/openai.yaml</code>, plus a
        shared <code className="font-mono text-sm">SKILL.md</code>, references, and
        scripts. Each plugin repository also publishes both Claude and Codex bundle
        manifests, so the same source content can be installed from either marketplace
        without rewriting. Browse the{" "}
        <Link
          href="/skills"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          full skill catalog
        </Link>{" "}
        or read{" "}
        <Link
          href="/what-are-skills"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          what agent skills are
        </Link>{" "}
        if you are new to the concept.
      </p>
      <p className="mb-4">
        Deciding whether to adopt a marketplace at all? See{" "}
        <Link
          href="/guides/why-use-a-skills-marketplace"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          why use a skills marketplace
        </Link>
        . Ready to install? Follow the{" "}
        <Link
          href="/guides/install-skills-from-github"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          install-from-GitHub guide
        </Link>
        .
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Official documentation
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          Anthropic Claude Code docs:{" "}
          <a
            href="https://docs.claude.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            docs.claude.com
          </a>
        </li>
        <li>
          OpenAI Codex docs:{" "}
          <a
            href="https://platform.openai.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            platform.openai.com/docs
          </a>
        </li>
      </ul>
    </article>
  );
}
