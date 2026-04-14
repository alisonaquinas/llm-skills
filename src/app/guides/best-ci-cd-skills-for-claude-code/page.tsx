/**
 * Curated guide surfacing the best CI/CD skills in the ci-cd bundle.
 *
 * Responsibilities:
 * - target search intent for "best CI/CD skills for Claude Code"
 * - group picks by workflow so readers can scan to their stack
 * - drive qualified traffic into the ci-cd bundle page and install flow
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
const PAGE_URL = buildSiteUrl("guides/best-ci-cd-skills-for-claude-code/");

/** Shared description used across metadata fields. */
const PAGE_DESCRIPTION =
  "Curated picks from the ci-cd skill bundle for Claude Code, grouped by workflow: GitHub Actions, GitLab, Kubernetes, Terraform, and Docker. Real skill names with install commands.";

/** Page title used in the browser tab and structured data. */
const PAGE_TITLE = `Best CI/CD skills for Claude Code | ${MARKETPLACE.title}`;

/**
 * Route metadata for the CI/CD picks guide.
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

/** Single curated pick displayed in a workflow section. */
interface CiCdPick {
  /** Skill name as it appears in the bundle. */
  skill: string;
  /** Short description of what the skill does and when it triggers. */
  description: string;
}

/** One workflow group rendered on the page. */
interface WorkflowGroup {
  /** Headline for the workflow section. */
  heading: string;
  /** Lead-in paragraph shown above the picks. */
  intro: string;
  /** Ordered skill picks within the group. */
  picks: CiCdPick[];
}

/** Curated workflow groups and picks, all sourced from the ci-cd bundle. */
const GROUPS: WorkflowGroup[] = [
  {
    heading: "GitHub Actions",
    intro:
      "Use these when you are authoring or debugging GitHub-hosted pipelines, release flows, or self-hosted runners.",
    picks: [
      {
        skill: "github-ci",
        description:
          "Triggers when you ask Claude Code to write or edit GitHub Actions workflow YAML for build, test, or lint jobs.",
      },
      {
        skill: "github-cd",
        description:
          "Triggers for GitHub-based deployment flows — environment promotion, manual approvals, and release jobs.",
      },
      {
        skill: "github-runner",
        description:
          "Triggers when configuring self-hosted runners, runner groups, or scaling GitHub Actions capacity.",
      },
      {
        skill: "github-docs",
        description:
          "Triggers when you need the authoritative GitHub Actions reference docs pulled into context.",
      },
    ],
  },
  {
    heading: "GitLab",
    intro:
      "For teams on GitLab CI/CD, pick the matching skill for pipelines, deployments, and runners.",
    picks: [
      {
        skill: "gitlab-ci",
        description:
          "Triggers when writing or editing .gitlab-ci.yml — jobs, stages, artifacts, and caches.",
      },
      {
        skill: "gitlab-cd",
        description:
          "Triggers for GitLab deployment pipelines, environments, and release orchestration.",
      },
      {
        skill: "gitlab-runner",
        description:
          "Triggers when installing or tuning GitLab Runner — executors, tags, and autoscaling.",
      },
      {
        skill: "glab",
        description:
          "Triggers when you want Claude Code to drive the GitLab CLI — MRs, pipelines, and issues.",
      },
    ],
  },
  {
    heading: "Kubernetes and GitOps",
    intro:
      "Cluster-facing work. Use these when rolling out manifests, charts, or GitOps pipelines.",
    picks: [
      {
        skill: "kubectl",
        description:
          "Triggers when interacting with a Kubernetes cluster — inspecting resources, rolling restarts, debugging pods.",
      },
      {
        skill: "helm",
        description:
          "Triggers for Helm chart authoring, templating, and release management.",
      },
      {
        skill: "kustomize",
        description:
          "Triggers when layering Kubernetes overlays with kustomize bases and patches.",
      },
      {
        skill: "argocd",
        description:
          "Triggers for Argo CD applications, projects, and sync configuration in a GitOps workflow.",
      },
      {
        skill: "flux",
        description:
          "Triggers for Flux CD reconcilers, sources, and kustomization resources.",
      },
    ],
  },
  {
    heading: "Infrastructure as Code",
    intro:
      "For Terraform, OpenTofu, and Pulumi stacks, drop in the right skill and skip re-explaining provider semantics.",
    picks: [
      {
        skill: "terraform",
        description:
          "Triggers for Terraform modules, providers, state, and plan/apply workflows.",
      },
      {
        skill: "open-tofu",
        description:
          "Triggers for OpenTofu-specific syntax and migration concerns away from Terraform.",
      },
      {
        skill: "pulumi",
        description:
          "Triggers when writing Pulumi stacks in TypeScript, Python, Go, or .NET.",
      },
      {
        skill: "ansible",
        description:
          "Triggers for Ansible playbooks, roles, inventories, and collection authoring.",
      },
    ],
  },
  {
    heading: "Docker and container runtimes",
    intro:
      "Container work — from Dockerfile authoring to alternate runtimes used in production images.",
    picks: [
      {
        skill: "docker",
        description:
          "Triggers when authoring Dockerfiles, composing services, or optimizing image layers.",
      },
      {
        skill: "podman",
        description:
          "Triggers for Podman-specific commands, rootless containers, and pod definitions.",
      },
      {
        skill: "containerd",
        description:
          "Triggers for containerd configuration and low-level runtime work.",
      },
      {
        skill: "cri-o",
        description:
          "Triggers for CRI-O configuration on Kubernetes nodes.",
      },
      {
        skill: "skaffold",
        description:
          "Triggers when wiring Skaffold-driven local development and CI builds.",
      },
    ],
  },
];

/**
 * Renders the best CI/CD skills guide.
 *
 * @returns Static guide page with grouped curated picks.
 */
export default function BestCiCdSkillsPage() {
  const ciCdPlugin =
    PLUGINS.find((plugin) => plugin.pluginName === "ci-cd") ?? PLUGINS[0];
  const installCommand = getPluginInstallCommand(ciCdPlugin);

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
          Best CI/CD skills
        </span>
      </nav>

      <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        Best CI/CD skills for Claude Code
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
        Curated picks from the <Link
          href="/bundles/ci-cd"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          ci-cd bundle
        </Link>
        , grouped by the delivery workflow you actually run. Every skill listed below
        ships in the same bundle — you install the whole bundle once and Claude Code
        picks the right skill per request based on its trigger.
      </p>

      <section className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/80 p-4 shadow-sm dark:border-brand-900/70 dark:bg-brand-950/30 sm:p-5">
        <h2 className="mb-1 text-lg font-semibold text-brand-900 dark:text-brand-100">
          Install the CI/CD bundle
        </h2>
        <p className="mb-3 max-w-3xl text-sm leading-6 text-brand-800 dark:text-brand-200">
          One command installs every skill referenced on this page. Register the
          marketplace first if you have not already (see the{" "}
          <Link
            href="/guides/install-skills-from-github"
            className="text-brand-700 underline decoration-brand-400 hover:decoration-brand-700 dark:text-brand-200 dark:decoration-brand-600"
          >
            installation guide
          </Link>
          ).
        </p>
        <pre className="overflow-x-auto rounded-lg bg-stone-900 p-3 font-mono text-sm text-green-300">
          <code>{installCommand}</code>
        </pre>
      </section>

      {GROUPS.map((group) => (
        <section key={group.heading} className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            {group.heading}
          </h2>
          <p className="mb-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {group.intro}
          </p>
          <ul className="ml-6 list-disc space-y-2">
            {group.picks.map((pick) => (
              <li key={pick.skill}>
                <code className="font-mono text-sm text-gray-800 dark:text-gray-100">
                  {pick.skill}
                </code>{" "}
                — {pick.description}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        How to pick
      </h2>
      <p className="mb-4">
        You do not really pick — you install the whole bundle and let Claude Code
        choose per request. The groups above are for mental mapping: when you are
        working on GitLab today, know that <code className="font-mono text-sm">gitlab-ci</code>{" "}
        and <code className="font-mono text-sm">gitlab-runner</code> are loaded and
        will trigger when you ask about pipelines or runners. You do not need to
        invoke them by name.
      </p>
      <p className="mb-4">
        If a skill you expect to trigger does not, start a fresh conversation — skills
        added mid-session are not always picked up. And if you are evaluating whether
        this approach fits your team at all, read{" "}
        <Link
          href="/guides/why-use-a-skills-marketplace"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          why use a skills marketplace
        </Link>
        .
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
        Next step: install the bundle
      </h2>
      <p className="mb-4">
        Ready to install? Head to the{" "}
        <Link
          href="/bundles/ci-cd"
          className="text-brand-600 hover:underline dark:text-brand-300"
        >
          CI/CD bundle page
        </Link>{" "}
        for the full skill list, the download link, and the one-line install command.
      </p>
    </article>
  );
}
