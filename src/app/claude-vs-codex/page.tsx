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
  "How Claude Code skills compare to OpenAI Codex skills: shared SKILL.md concepts, plugin manifests, marketplace install flows, and this marketplace's dual-platform packaging.";

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
        Claude Code and OpenAI Codex now both support agent skills and plugin
        marketplaces, but the install surfaces and bundle manifests are different.
        The useful comparison starts with the shared core: a skill is still a
        focused <code className="font-mono text-sm">SKILL.md</code> package.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        The shared concept
      </h2>
      <p className="mb-4">
        On both platforms, a skill is a directory with a required{" "}
        <code className="font-mono text-sm">SKILL.md</code> file, frontmatter such as
        <code className="mx-1 font-mono text-sm">name</code> and
        <code className="mx-1 font-mono text-sm">description</code>, and optional
        supporting files such as references, scripts, templates, and assets. The
        description tells the agent when the skill is relevant. The full instructions
        are loaded only when needed, which keeps context smaller.
      </p>
      <p className="mb-4">
        Skills can also travel in <strong>plugins</strong>. A plugin is the
        installable bundle: it can package many skills, plus other platform-specific
        capabilities such as commands, hooks, agents, MCP server configuration, app
        integration metadata, or visual assets depending on the target platform.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Claude Code today
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          Claude Code discovers personal skills from{" "}
          <code className="font-mono text-sm">~/.claude/skills/</code>, project
          skills from <code className="font-mono text-sm">.claude/skills/</code>,
          and plugin skills bundled under a plugin&apos;s{" "}
          <code className="font-mono text-sm">skills/</code> directory.
        </li>
        <li>
          Claude Code plugins use{" "}
          <code className="font-mono text-sm">.claude-plugin/plugin.json</code> for
          plugin metadata. Claude marketplaces use{" "}
          <code className="font-mono text-sm">.claude-plugin/marketplace.json</code>.
        </li>
        <li>
          Users add marketplaces and install plugins inside Claude Code with commands
          such as <code className="font-mono text-sm">/plugin marketplace add</code>{" "}
          and <code className="font-mono text-sm">/plugin install</code>. Claude
          Code can also install configured team plugins from project settings.
        </li>
        <li>
          Claude Code skills are model-invoked. Slash commands are separate,
          user-invoked plugin components, even when a plugin ships both.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Codex today
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          Codex skills also use{" "}
          <code className="font-mono text-sm">SKILL.md</code> with frontmatter and
          progressive disclosure. Codex initially sees the skill name, description,
          and file path, then loads the full instructions when the skill is needed.
        </li>
        <li>
          Codex supports optional per-skill metadata in{" "}
          <code className="font-mono text-sm">agents/openai.yaml</code>, including
          interface metadata, invocation policy, and tool dependency declarations.
        </li>
        <li>
          Codex plugins use{" "}
          <code className="font-mono text-sm">.codex-plugin/plugin.json</code> and
          can point at bundled skills with{" "}
          <code className="font-mono text-sm">&quot;skills&quot;: &quot;./skills/&quot;</code>. Plugins
          can also include MCP server configuration and app or connector metadata.
        </li>
        <li>
          Codex marketplaces can be added with{" "}
          <code className="font-mono text-sm">codex plugin marketplace add</code>{" "}
          from GitHub shorthand, Git URLs, or local directories. Users browse and
          manage plugins with <code className="font-mono text-sm">/plugins</code>.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Key differences at a glance
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          <strong>Install surface.</strong> Claude Code installs named plugins with{" "}
          <code className="font-mono text-sm">/plugin install</code>. Codex adds a
          marketplace source with{" "}
          <code className="font-mono text-sm">codex plugin marketplace add</code>,
          then installs from the <code className="font-mono text-sm">/plugins</code>{" "}
          browser.
        </li>
        <li>
          <strong>Plugin manifest.</strong>{" "}
          <code className="font-mono text-sm">.claude-plugin/plugin.json</code> for
          Claude Code,{" "}
          <code className="font-mono text-sm">.codex-plugin/plugin.json</code> for
          Codex.
        </li>
        <li>
          <strong>Marketplace file.</strong>{" "}
          <code className="font-mono text-sm">.claude-plugin/marketplace.json</code>{" "}
          for Claude Code,{" "}
          <code className="font-mono text-sm">.agents/plugins/marketplace.json</code>{" "}
          for Codex.
        </li>
        <li>
          <strong>Shared skill core.</strong> Both platforms use{" "}
          <code className="font-mono text-sm">SKILL.md</code> and model-invoked
          activation. Platform-specific files refine how the same content is
          presented, installed, and governed.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        How this marketplace serves both
      </h2>
      <p className="mb-4">
        Every skill in {MARKETPLACE.title} keeps the cross-platform core in
        <code className="mx-1 font-mono text-sm">SKILL.md</code>, references, scripts,
        and assets. The plugin repositories also publish both
        <code className="mx-1 font-mono text-sm">.claude-plugin/plugin.json</code> and
        <code className="mx-1 font-mono text-sm">.codex-plugin/plugin.json</code>, so
        the same skills can be distributed through both marketplace systems.
      </p>
      <p className="mb-4">
        This marketplace also keeps compatibility metadata such as{" "}
        <code className="font-mono text-sm">agents/openai.yaml</code> for Codex and
        existing agent metadata used by the Claude-oriented bundles. Treat those as
        packaging helpers around the shared skill instructions, not as replacements
        for <code className="font-mono text-sm">SKILL.md</code>. Browse the{" "}
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
          Claude Code plugins docs:{" "}
          <a
            href="https://docs.claude.com/en/docs/claude-code/plugins"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            docs.claude.com/en/docs/claude-code/plugins
          </a>
        </li>
        <li>
          Claude Code skills docs:{" "}
          <a
            href="https://docs.claude.com/en/docs/claude-code/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            docs.claude.com/en/docs/claude-code/skills
          </a>
        </li>
        <li>
          OpenAI Codex docs:{" "}
          <a
            href="https://developers.openai.com/codex/plugins"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            developers.openai.com/codex/plugins
          </a>
        </li>
        <li>
          OpenAI Codex skills docs:{" "}
          <a
            href="https://developers.openai.com/codex/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            developers.openai.com/codex/skills
          </a>
        </li>
      </ul>
    </article>
  );
}
