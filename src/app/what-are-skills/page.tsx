/**
 * Beginner-oriented explainer page about agent skills.
 *
 * Responsibilities:
 * - explain what a Claude Code or Codex skill is to new visitors
 * - capture narrow-intent search traffic for "what are claude code skills"
 * - link visitors into the catalog, the five bundles, and official docs
 *
 * Dependency rules:
 * - reuses layout chrome from the root layout — no new design system
 * - pulls bundle labels from the catalog namespace for consistency
 */
import type { Metadata } from "next";
import Link from "next/link";
import { MARKETPLACE, PLUGINS } from "@/lib/catalog";
import { buildSiteUrl, getSocialPreviewImageUrl } from "@/lib/seo";

/** Canonical URL for this explainer page. */
const PAGE_URL = buildSiteUrl("what-are-skills/");

/** Shared description used across metadata fields. */
const PAGE_DESCRIPTION =
  "An introduction to agent skills for Claude Code and OpenAI Codex: what they are, how they trigger, why they beat plain prompts, and how skill bundles work.";

/**
 * Route metadata for the explainer page.
 */
export const metadata: Metadata = {
  title: `What are agent skills? | ${MARKETPLACE.title}`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title: `What are agent skills? | ${MARKETPLACE.title}`,
    description: PAGE_DESCRIPTION,
    images: [getSocialPreviewImageUrl()],
  },
  twitter: {
    card: "summary_large_image",
    title: `What are agent skills? | ${MARKETPLACE.title}`,
    description: PAGE_DESCRIPTION,
    images: [getSocialPreviewImageUrl()],
  },
};

/**
 * Renders the "what are skills" explainer page.
 *
 * @returns Static content page introducing agent skills to beginners.
 */
export default function WhatAreSkillsPage() {
  return (
    <article className="prose-like max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
          Marketplace
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          What are agent skills?
        </span>
      </nav>

      <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        What are agent skills?
      </h1>

      <p className="mb-4">
        An <strong>agent skill</strong> is a small, focused package of instructions and
        supporting files that teaches a coding agent — like Anthropic&apos;s Claude Code or
        OpenAI&apos;s Codex — how to perform a specific task well. Instead of re-explaining
        &quot;here is how we write a Helm chart&quot; or &quot;here is how we format a PlantUML
        component diagram&quot; in every chat, you install a skill once and the agent
        picks it up whenever the task comes up.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        How a skill is different from a plain prompt
      </h2>
      <p className="mb-4">
        A prompt lives inside a single conversation. It is gone when the session ends
        and cannot be shared reliably across projects, teammates, or agents. A skill
        lives on disk as a versioned bundle. It is:
      </p>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          <strong>Trigger-based.</strong> Each skill declares what user requests it
          handles, so the agent only loads it when relevant.
        </li>
        <li>
          <strong>Composable.</strong> Skills ship their own references, scripts, and
          templates, so the agent has the right context without you pasting it in.
        </li>
        <li>
          <strong>Reusable.</strong> One skill works across any project that installs
          the same bundle.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        How a skill triggers
      </h2>
      <p className="mb-4">
        Every skill publishes a short trigger description — a few sentences that tell
        the agent when to use it. When your request matches, the agent reads the
        skill&apos;s main instructions, pulls in any references it needs, and runs
        relevant scripts. You normally do not have to invoke a skill by name: just
        ask the agent to do the task in natural language. For example, installing the
        PlantUML skill means a request like &quot;draw a sequence diagram for the
        login flow&quot; starts rendering real UML instead of ASCII art.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        What is a skill bundle?
      </h2>
      <p className="mb-4">
        Skills are small, so they are almost always shipped in <strong>bundles</strong>.
        A bundle groups related skills under one installable plugin. On this
        marketplace there are {PLUGINS.length} bundles:
      </p>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        {PLUGINS.map((plugin) => (
          <li key={plugin.pluginName}>
            <Link
              href={`/bundles/${plugin.pluginName}`}
              className="text-brand-600 hover:underline dark:text-brand-300"
            >
              {plugin.label}
            </Link>{" "}
            — {plugin.siteDescription}
          </li>
        ))}
      </ul>
      <p className="mb-4">
        You install an entire bundle at once — you do not cherry-pick individual
        skills. After installation every skill inside the bundle is available to the
        agent, and the agent picks the right one based on your request.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        How installing works
      </h2>
      <p className="mb-4">
        In Claude Code you add this site as a marketplace, then install a bundle with
        <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100">
          /plugin install
        </code>
        . The bundle unpacks into your Claude Code configuration and its skills
        become available immediately. Codex agents can use the same skill content by
        loading the bundled <code className="font-mono">agents/openai.yaml</code>{" "}
        metadata — the marketplace authors skills so they target both platforms.
      </p>
      <p className="mb-4">
        Visit the{" "}
        <Link
          href="/skills"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          full skill catalog
        </Link>{" "}
        to browse everything, or read the{" "}
        <Link
          href="/claude-vs-codex"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          Claude Code vs Codex comparison
        </Link>{" "}
        to see how the two platforms handle skills differently.
      </p>
      <p className="mb-4">
        Want the step-by-step install flow? See the{" "}
        <Link
          href="/guides/install-skills-from-github"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          install-from-GitHub walkthrough
        </Link>
        , or browse every long-form{" "}
        <Link
          href="/guides"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          guide
        </Link>{" "}
        in the Learn hub.
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
