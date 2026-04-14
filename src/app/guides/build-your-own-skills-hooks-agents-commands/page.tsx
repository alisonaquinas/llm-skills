/**
 * Guide for building custom skills, hooks, agents, commands, and plugins
 * using the authoring tools in the shared-skills bundle.
 *
 * Responsibilities:
 * - explain what each Claude Code artifact type is and when to build one
 * - show which SDLC skill to invoke for each artifact type
 * - surface the install step so readers can get the authoring tools first
 *
 * Dependency rules:
 * - reuses layout chrome from the root layout — no new design system
 * - sources install command strings from the commands helper to match other pages
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

/** Canonical URL for this guide. */
const PAGE_URL = buildSiteUrl(
  "guides/build-your-own-skills-hooks-agents-commands/",
);

/** Shared description used across metadata fields. */
const PAGE_DESCRIPTION =
  "Step-by-step guide to building Claude Code skills, hooks, slash commands, and agents using the SDLC authoring tools in the shared-skills bundle.";

/** Page title used in the browser tab and structured data. */
const PAGE_TITLE = `Build your own skills, hooks, agents, and commands | ${MARKETPLACE.title}`;

/**
 * Route metadata for the authoring guide.
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
 * Renders the guide for building custom Claude Code artifacts.
 *
 * @returns Static guide page covering skills, hooks, commands, agents, and MCP servers.
 */
export default function BuildYourOwnPage() {
  const sharedInstall = getPluginInstallCommand(
    PLUGINS.find((plugin) => plugin.pluginName === "shared-skills") ??
      PLUGINS[0],
  );

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
        <Link
          href="/guides"
          className="hover:text-gray-700 dark:hover:text-gray-200"
        >
          Learn
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          Build your own
        </span>
      </nav>

      <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        Build your own skills, hooks, agents, and commands
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
        The shared-skills bundle ships a complete set of authoring tools that
        guide you through every phase of building and shipping your own Claude
        Code artifacts. This guide explains what each artifact type is and which
        SDLC skill to invoke to build one.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        What you can build
      </h2>
      <p className="mb-4">
        Claude Code supports several distinct artifact types. Each serves a
        different purpose and has its own authoring workflow:
      </p>
      <ul className="mb-4 ml-6 list-disc space-y-2">
        <li>
          <strong>Skills</strong> are{" "}
          <code className="font-mono text-sm">SKILL.md</code> files stored in
          your Claude Code plugin directory. When a conversation matches the
          skill&apos;s trigger description, Claude loads the file into context
          and follows its instructions. Skills encode reusable engineering
          practices: TDD workflows, commit style guides, CI/CD playbooks, and
          similar domain knowledge.
        </li>
        <li>
          <strong>Hooks</strong> are shell scripts that Claude Code runs
          automatically in response to specific events: before or after a tool
          call, at session start, or when a notification fires. Hooks enforce
          policies (e.g., block writes to protected paths), log activity, or
          set up session state without requiring any user action.
        </li>
        <li>
          <strong>Slash commands</strong> are user-invocable{" "}
          <code className="font-mono text-sm">/command</code> triggers stored in
          your Claude Code settings. Unlike skills, which activate automatically
          by description match, a slash command is always triggered explicitly by
          the user typing its name.
        </li>
        <li>
          <strong>Agents and subagents</strong> are structured delegation
          workflows. The primary Claude instance hands off a scoped task to a
          specialized agent with its own context, tools, and success criteria.
          Agent workflows are useful for parallelizing work or isolating
          tasks with distinct tool requirements.
        </li>
        <li>
          <strong>MCP servers</strong> extend Claude Code with custom tools,
          resources, and prompts over the Model Context Protocol. If the
          authoring tools you need do not exist as built-in Claude Code tools,
          an MCP server is the extension point to reach for.
        </li>
      </ul>
      <p className="mb-4">
        All five artifact types have dedicated SDLC skills in the shared-skills
        bundle. Install the bundle once and you have authoring support for all
        of them.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Before you start: install the authoring tools
      </h2>
      <p className="mb-4">
        All of the SDLC skills described in this guide are part of the
        shared-skills bundle. If you have not installed it yet, register the
        marketplace and run:
      </p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>{sharedInstall}</code>
      </pre>
      <p className="mb-4">
        If you have not registered the marketplace yet, see{" "}
        <Link
          href="/guides/install-skills-from-github"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          how to install skills from GitHub
        </Link>{" "}
        for the one-time setup step. After installation, all of the{" "}
        <code className="font-mono text-sm">skill-development</code>,{" "}
        <code className="font-mono text-sm">claude-hook-sdlc</code>,{" "}
        <code className="font-mono text-sm">claude-command-sdlc</code>,{" "}
        <code className="font-mono text-sm">claude-agent-sdlc</code>, and{" "}
        <code className="font-mono text-sm">mcp-sdlc</code> skills are available
        in every new Claude Code conversation.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Building a skill
      </h2>
      <p className="mb-4">
        The{" "}
        <Link
          href="/skill/alisonaquinas/llm-shared-skills/skill-development"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          skill-development
        </Link>{" "}
        SDLC orchestrator covers the full lifecycle from ideation to a committed,
        linted, and validated skill file. It coordinates the three supporting
        skills below and guides you through each phase gate:
      </p>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          <Link
            href="/skill/alisonaquinas/llm-shared-skills/skill-creator"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            skill-creator
          </Link>{" "}
          authors the directory structure and{" "}
          <code className="font-mono text-sm">SKILL.md</code> content.
        </li>
        <li>
          <Link
            href="/skill/alisonaquinas/llm-shared-skills/skill-linting"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            skill-linting
          </Link>{" "}
          runs a 12-rule structural lint against the skill directory.
        </li>
        <li>
          <Link
            href="/skill/alisonaquinas/llm-shared-skills/skill-validation"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            skill-validation
          </Link>{" "}
          scores the skill against an 8-criterion qualitative rubric.
        </li>
        <li>
          <Link
            href="/skill/alisonaquinas/llm-shared-skills/skill-test-drive"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            skill-test-drive
          </Link>{" "}
          runs live scenario tests and produces a friction report.
        </li>
      </ul>
      <p className="mb-3">
        To start the full lifecycle, open a Claude Code conversation and say:
      </p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>Use $skill-development to create a new skill for [your topic].</code>
      </pre>
      <p className="mb-4">
        You can also jump straight to authoring if you already know what you
        want to write and just need the file structure:
      </p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>Use $skill-creator to create a new skill for [your topic].</code>
      </pre>

      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Building a hook
      </h2>
      <p className="mb-4">
        Hooks let you automate Claude Code&apos;s behavior without writing a
        skill. Common uses: blocking tool calls that match a pattern (e.g.,
        preventing writes to a protected directory), logging every tool
        invocation to a file, or injecting session context at startup.
      </p>
      <p className="mb-4">
        The{" "}
        <Link
          href="/skill/alisonaquinas/llm-shared-skills/claude-hook-sdlc"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          claude-hook-sdlc
        </Link>{" "}
        skill orchestrates eight phases: planning, design, creation, testing,
        verification, integration, validation, and a live test drive.
      </p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>Use $claude-hook-sdlc to build a hook that [describe the behavior].</code>
      </pre>
      <p className="mb-4">
        Individual phase skills are also available if you want to re-enter at a
        specific gate:{" "}
        <code className="font-mono text-sm">claude-hook-planning</code>,{" "}
        <code className="font-mono text-sm">claude-hook-design</code>,{" "}
        <code className="font-mono text-sm">claude-hook-creation</code>,{" "}
        <code className="font-mono text-sm">claude-hook-testing</code>, and so
        on. See the{" "}
        <Link
          href="/bundles/shared-skills"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          shared-skills bundle
        </Link>{" "}
        for the full list.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Building a slash command
      </h2>
      <p className="mb-4">
        Slash commands are explicit user triggers stored in your{" "}
        <code className="font-mono text-sm">.claude/commands/</code> directory.
        Unlike skills, which activate automatically, a command only runs when
        the user types its name. This makes commands well suited for
        one-off workflows, project-specific utilities, and tasks where explicit
        invocation is safer than automatic triggering.
      </p>
      <p className="mb-4">
        The{" "}
        <Link
          href="/skill/alisonaquinas/llm-shared-skills/claude-command-sdlc"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          claude-command-sdlc
        </Link>{" "}
        skill orchestrates nine phases, including an iterative development
        phase for commands that need multiple improvement cycles.
      </p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>Use $claude-command-sdlc to build a command for [describe the workflow].</code>
      </pre>

      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Building an agent or subagent
      </h2>
      <p className="mb-4">
        Agents are structured delegation workflows. The primary Claude instance
        spawns a scoped subagent with its own context window, tool permissions,
        and success criteria. Agent workflows are most valuable when a task is
        large enough to benefit from parallel execution or when parts of the
        work need different tool access than the primary session.
      </p>
      <p className="mb-4">
        The{" "}
        <Link
          href="/skill/alisonaquinas/llm-shared-skills/claude-agent-sdlc"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          claude-agent-sdlc
        </Link>{" "}
        skill covers planning (role scope, handoff inventory), design (interface
        contract, safety rules), creation, testing (happy path plus blocked and
        recovery paths), verification, integration (live delegated run), and a
        final test drive.
      </p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>Use $claude-agent-sdlc to build an agent that [describe the role].</code>
      </pre>

      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Building an MCP server
      </h2>
      <p className="mb-4">
        The Model Context Protocol lets you extend Claude Code with custom
        tools, resources, and prompt templates. If you need capabilities that do
        not exist as built-in tools (a private API, a database query interface, a
        custom file system view), an MCP server is the right extension point.
      </p>
      <p className="mb-4">
        The{" "}
        <Link
          href="/skill/alisonaquinas/llm-shared-skills/mcp-sdlc"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          mcp-sdlc
        </Link>{" "}
        skill orchestrates the same eight-phase pipeline as the other SDLC
        workflows: planning, design, creation, testing, verification, integration,
        validation, and a live test drive.
      </p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>Use $mcp-sdlc to build an MCP server that [describe the tools or resources].</code>
      </pre>

      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        The common SDLC pattern
      </h2>
      <p className="mb-4">
        All four artifact types follow the same phased pipeline. The phase
        names differ slightly by artifact type (e.g., hooks have an event scope
        while agents have a role scope), but the structure is consistent:
      </p>
      <ol className="mb-4 ml-6 list-decimal space-y-1">
        <li>
          <strong>Planning</strong> — define scope, identify interfaces, write
          success criteria
        </li>
        <li>
          <strong>Design</strong> — make every contract explicit; no implicit
          safety rules
        </li>
        <li>
          <strong>Creation</strong> — implement the artifact; confirm it runs
          locally
        </li>
        <li>
          <strong>Testing</strong> — happy path, one variant, one blocked path,
          one recovery
        </li>
        <li>
          <strong>Verification</strong> — confirm design and implementation
          match; resolve gaps
        </li>
        <li>
          <strong>Integration</strong> — wire into Claude Code; confirm live
          discovery and invocation
        </li>
        <li>
          <strong>Validation</strong> — rubric score; safety pass required
        </li>
        <li>
          <strong>Test drive</strong> — five or more real scenarios; friction
          report
        </li>
        <li>
          <strong>Iterative development</strong> — re-enter at the right phase
          after friction or a gate failure; don&apos;t restart from scratch
        </li>
      </ol>
      <p className="mb-4">
        You can enter the pipeline at any phase. If you already have a draft
        artifact, skip to the linting or testing phase. If you are recovering
        from a specific failure, the SDLC skill will tell you which phase to
        re-enter.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Packaging your skill into a plugin
      </h2>
      <p className="mb-4">
        A plugin is a versioned bundle of one or more skills distributed through
        a Claude Code marketplace. If you want to share your skills with a team
        or publish them for others to install, the steps are:
      </p>
      <ol className="mb-4 ml-6 list-decimal space-y-2">
        <li>
          Fork or create a GitHub repository following the same structure used
          by this marketplace&apos;s bundles: a{" "}
          <code className="font-mono text-sm">skills/</code> directory at the
          root, one subdirectory per skill, each containing a{" "}
          <code className="font-mono text-sm">SKILL.md</code> and an{" "}
          <code className="font-mono text-sm">agents/claude.yaml</code>{" "}
          metadata file.
        </li>
        <li>
          Tag a release. Claude Code&apos;s plugin system pins installs to a
          specific Git ref. A semver tag on a release is the conventional
          approach.
        </li>
        <li>
          Add a{" "}
          <code className="font-mono text-sm">marketplace.json</code> or point
          your marketplace config at the repository. The Claude Code{" "}
          <code className="font-mono text-sm">/plugin marketplace add</code>{" "}
          command accepts either a GitHub repository URL or a published JSON
          catalog URL.
        </li>
        <li>
          Publish the install command. It follows the format{" "}
          <code className="font-mono text-sm">
            /plugin install &lt;pluginName&gt;@&lt;marketplaceName&gt;
          </code>
          .
        </li>
      </ol>
      <p className="mb-4">
        To contribute skills back to this marketplace, open a pull request on{" "}
        the relevant GitHub repository. See the{" "}
        <Link
          href="/"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          marketplace home page
        </Link>{" "}
        for the GitHub links to each bundle.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Where to go next
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          Browse the{" "}
          <Link
            href="/bundles/shared-skills"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            shared-skills bundle
          </Link>{" "}
          to see the full list of authoring skills and their trigger
          descriptions.
        </li>
        <li>
          Read{" "}
          <Link
            href="/what-are-skills"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            what are agent skills
          </Link>{" "}
          if the basics are still unfamiliar.
        </li>
        <li>
          See the{" "}
          <Link
            href="/guides/install-skills-from-github"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            install guide
          </Link>{" "}
          if you have not yet added the marketplace to Claude Code.
        </li>
        <li>
          Check the{" "}
          <Link
            href="/guides/well-documented-case-study"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            well-documented case study
          </Link>{" "}
          for a concrete example of a skill that passed the full SDLC pipeline.
        </li>
        <li>
          Official reference:{" "}
          <a
            href="https://docs.claude.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            docs.claude.com
          </a>{" "}
          covers the plugin system, hooks configuration, and slash command
          setup in detail.
        </li>
      </ul>
    </article>
  );
}
