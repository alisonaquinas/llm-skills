/**
 * Installation walkthrough for adding Claude Code skills from a GitHub-backed marketplace.
 *
 * Responsibilities:
 * - capture search traffic for "install Claude Code skills" and "plugin marketplace add"
 * - show a concrete step-by-step install flow using this marketplace's real bundles
 * - cover update, uninstall, and common failure modes without invented details
 *
 * Dependency rules:
 * - reuses layout chrome from the root layout — no new design system
 * - sources install command strings from the commands helper to match other pages
 */
import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { MARKETPLACE, PLUGINS } from "@/lib/catalog";
import {
  getMarketplaceAddCommand,
  getMarketplaceUrlAddCommand,
  getPluginInstallCommand,
} from "@/lib/commands";
import {
  buildGuideArticleStructuredData,
  buildSiteUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";

/** Canonical URL for this guide. */
const PAGE_URL = buildSiteUrl("guides/install-skills-from-github/");

/** Shared description used across metadata fields. */
const PAGE_DESCRIPTION =
  "Step-by-step walkthrough of installing Claude Code skills from a GitHub marketplace: /plugin marketplace add, /plugin install, updating, uninstalling, and common errors.";

/** Page title used in the browser tab and structured data. */
const PAGE_TITLE = `How to install skills from GitHub | ${MARKETPLACE.title}`;

/**
 * Route metadata for the install guide.
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
 * Renders the install walkthrough guide.
 *
 * @returns Static guide page covering end-to-end installation.
 */
export default function InstallSkillsFromGithubPage() {
  const addCommand = getMarketplaceAddCommand();
  const addUrlCommand = getMarketplaceUrlAddCommand();
  const sharedInstall = getPluginInstallCommand(
    PLUGINS.find((plugin) => plugin.pluginName === "shared-skills") ?? PLUGINS[0],
  );
  const ciCdInstall = getPluginInstallCommand(
    PLUGINS.find((plugin) => plugin.pluginName === "ci-cd") ?? PLUGINS[0],
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
        <Link href="/guides" className="hover:text-gray-700 dark:hover:text-gray-200">
          Learn
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          Install skills from GitHub
        </span>
      </nav>

      <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        How to install skills from GitHub
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
        Claude Code can install skill bundles straight from a GitHub repository. This
        guide walks through the full flow end-to-end using the real bundles published
        in this marketplace.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Prerequisites
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          A working Claude Code installation. If you have not set it up, see the{" "}
          <a
            href="https://docs.claude.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            Claude Code docs
          </a>
          .
        </li>
        <li>
          Network access to <code className="font-mono text-sm">github.com</code>.
          Private repos additionally need <code className="font-mono text-sm">gh auth login</code>{" "}
          or a GitHub personal access token configured for Claude Code.
        </li>
        <li>
          Read{" "}
          <Link
            href="/what-are-skills"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            what agent skills are
          </Link>{" "}
          first if the terminology is unfamiliar.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Step 1. Register the marketplace
      </h2>
      <p className="mb-4">
        Tell Claude Code where to find skill bundles. Either command below works — the
        first references this GitHub repository directly, the second loads the
        published catalog JSON:
      </p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>{addCommand}</code>
      </pre>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>{addUrlCommand}</code>
      </pre>
      <p className="mb-4">
        Claude Code stores the marketplace reference in its configuration. You only do
        this once per machine, not once per bundle.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Step 2. Install a bundle
      </h2>
      <p className="mb-4">
        Once the marketplace is registered, install any bundle by name. For example,
        to install the Shared Skills bundle:
      </p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>{sharedInstall}</code>
      </pre>
      <p className="mb-4">Or the CI/CD bundle:</p>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
        <code>{ciCdInstall}</code>
      </pre>
      <p className="mb-4">
        The syntax is{" "}
        <code className="font-mono text-sm">
          /plugin install &lt;pluginName&gt;@{MARKETPLACE.name}
        </code>
        . You can find the exact install command on every bundle page — there are{" "}
        {PLUGINS.length} bundles total. See the{" "}
        <Link href="/" className="text-brand-600 hover:underline dark:text-brand-300">
          home page
        </Link>{" "}
        for the full list.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Step 3. What happens after install
      </h2>
      <p className="mb-4">
        Claude Code downloads the bundle at the version pinned in the marketplace
        (every bundle on this site is tagged — the catalog records the exact{" "}
        <code className="font-mono text-sm">ref</code>), unpacks it into your Claude
        Code plugin directory, and loads every skill inside the bundle into the
        trigger table. The next time you start a conversation, the agent sees each
        skill&apos;s trigger description. When your request matches, Claude Code pulls
        the skill into context automatically — you do not normally call skills by
        name.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Updating an installed bundle
      </h2>
      <p className="mb-4">
        Bundles are versioned. When a new release is published, re-run{" "}
        <code className="font-mono text-sm">/plugin install</code> with the same
        identifier — Claude Code will fetch the latest pinned version from the
        marketplace and replace the installed copy. You can also refresh the
        marketplace first with{" "}
        <code className="font-mono text-sm">/plugin marketplace update</code> to pull
        the newest catalog entries before installing.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Uninstalling a bundle
      </h2>
      <p className="mb-4">
        Remove a bundle with{" "}
        <code className="font-mono text-sm">
          /plugin uninstall &lt;pluginName&gt;@{MARKETPLACE.name}
        </code>
        . That removes the bundle from Claude Code&apos;s plugin directory and drops
        all skills it contained from the trigger table in new sessions.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Troubleshooting
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-2">
        <li>
          <strong>GitHub rate limits.</strong> Unauthenticated GitHub API calls cap
          out at 60 requests per hour. If install fails with a rate-limit error,
          authenticate with{" "}
          <code className="font-mono text-sm">gh auth login</code> or export a{" "}
          <code className="font-mono text-sm">GITHUB_TOKEN</code> in your environment
          before retrying.
        </li>
        <li>
          <strong>Private repositories.</strong> If you are installing from a private
          fork of this marketplace, make sure your GitHub token has{" "}
          <code className="font-mono text-sm">repo</code> scope and that Claude Code
          is configured to use it. Public installs do not need auth at all.
        </li>
        <li>
          <strong>Unknown plugin name.</strong> The pluginName must match exactly.
          Copy the command from the bundle&apos;s page rather than typing it — the
          slugs are lowercase and hyphenated (for example{" "}
          <code className="font-mono text-sm">ci-cd</code>, not{" "}
          <code className="font-mono text-sm">ci_cd</code>).
        </li>
        <li>
          <strong>Version mismatch.</strong> If a release tag referenced in the
          catalog has been deleted, the install will 404. Run{" "}
          <code className="font-mono text-sm">/plugin marketplace update</code> to
          pull the latest catalog and try again.
        </li>
        <li>
          <strong>Skills not triggering.</strong> After install, start a fresh
          conversation. Skills loaded mid-session are not always picked up until the
          next session begins.
        </li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Where to go next
      </h2>
      <ul className="mb-4 ml-6 list-disc space-y-1">
        <li>
          Browse the{" "}
          <Link href="/skills" className="text-brand-600 hover:underline dark:text-brand-300">
            full skill catalog
          </Link>{" "}
          to see what each bundle ships.
        </li>
        <li>
          See the{" "}
          <Link
            href="/guides/best-ci-cd-skills-for-claude-code"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            best CI/CD skills guide
          </Link>{" "}
          for curated recommendations from the ci-cd bundle.
        </li>
        <li>
          Read the{" "}
          <Link
            href="/claude-vs-codex"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            Claude Code vs Codex comparison
          </Link>{" "}
          if you are evaluating both platforms.
        </li>
        <li>
          Official:{" "}
          <a
            href="https://docs.claude.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            docs.claude.com
          </a>{" "}
          for the plugin system reference.
        </li>
      </ul>
    </article>
  );
}
