/**
 * Learn hub that indexes every long-form guide and explainer on the site.
 *
 * Responsibilities:
 * - serve as the canonical /guides/ landing for beginner-oriented content
 * - surface each guide with a short teaser for scannable navigation
 * - capture broad educational search intent and route visitors to the catalog
 *
 * Dependency rules:
 * - reuses layout chrome from the root layout — no new design system
 * - pulls marketplace metadata from the catalog namespace for consistency
 */
import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { MARKETPLACE } from "@/lib/catalog";
import {
  buildGuideArticleStructuredData,
  buildSiteUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";

/** Canonical URL for the guides hub page. */
const PAGE_URL = buildSiteUrl("guides/");

/** Shared description used across metadata fields. */
const PAGE_DESCRIPTION =
  "Long-form guides and explainers for Claude Code and Codex skills: installing from GitHub, picking CI/CD skills, and deciding whether a skills marketplace is right for your team.";

/**
 * Route metadata for the guides hub.
 */
export const metadata: Metadata = {
  title: `Learn: guides and explainers | ${MARKETPLACE.title}`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: `Learn: guides and explainers | ${MARKETPLACE.title}`,
    description: PAGE_DESCRIPTION,
    images: [getSocialPreviewImageUrl()],
  },
  twitter: {
    card: "summary_large_image",
    title: `Learn: guides and explainers | ${MARKETPLACE.title}`,
    description: PAGE_DESCRIPTION,
    images: [getSocialPreviewImageUrl()],
  },
};

/** Entry rendered in the guide list. */
interface GuideEntry {
  /** Internal href relative to the site root. */
  href: string;
  /** Short display title. */
  title: string;
  /** One- or two-sentence teaser describing the entry. */
  teaser: string;
}

/** Ordered guide entries surfaced in the Learn hub. */
const GUIDES: GuideEntry[] = [
  {
    href: "/what-are-skills",
    title: "What are agent skills?",
    teaser:
      "Start here. A plain-English explainer on what a skill is, how it triggers, and how bundles work on Claude Code and Codex.",
  },
  {
    href: "/guides/install-skills-from-github",
    title: "How to install skills from GitHub",
    teaser:
      "Step-by-step walkthrough of /plugin marketplace add and /plugin install, plus update, uninstall, and troubleshooting.",
  },
  {
    href: "/guides/best-ci-cd-skills-for-claude-code",
    title: "Best CI/CD skills for Claude Code",
    teaser:
      "Curated picks from the ci-cd bundle grouped by workflow: GitHub Actions, GitLab, Kubernetes, Terraform, and Docker.",
  },
  {
    href: "/guides/why-use-a-skills-marketplace",
    title: "Why use a skills marketplace?",
    teaser:
      "The case for a curated marketplace — reuse, version pinning, portability across agents — and the honest tradeoffs.",
  },
  {
    href: "/guides/well-documented-case-study",
    title: "Case study: the well-documented skill",
    teaser:
      "Evidence-first, low-drift documentation in action — maturity levels, audit-first fixes, and illustrations of the before-and-after layout.",
  },
  {
    href: "/claude-vs-codex",
    title: "Claude Code skills vs Codex skills",
    teaser:
      "Side-by-side comparison of how the two platforms install, trigger, and extend skills.",
  },
];

/**
 * Renders the Learn hub index page.
 *
 * @returns Static content page listing every guide with a short teaser.
 */
export default function GuidesIndexPage() {
  return (
    <article className="prose-like max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
      <StructuredData
        data={buildGuideArticleStructuredData({
          url: PAGE_URL,
          title: `Learn: guides and explainers | ${MARKETPLACE.title}`,
          description: PAGE_DESCRIPTION,
        })}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
          Marketplace
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">Learn</span>
      </nav>

      <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        Learn: guides and explainers
      </h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
        Long-form guides that go deeper than the catalog. Start with the explainer if
        skills are new to you, then move on to installation, curated picks, and the
        case for a marketplace.
      </p>

      <ul className="mb-8 space-y-5">
        {GUIDES.map((guide) => (
          <li key={guide.href} className="border-l-2 border-brand-200 pl-4 dark:border-brand-900">
            <Link
              href={guide.href}
              className="text-lg font-semibold text-brand-700 hover:underline dark:text-brand-200"
            >
              {guide.title}
            </Link>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
              {guide.teaser}
            </p>
          </li>
        ))}
      </ul>

      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Looking for something specific? Browse the{" "}
        <Link href="/skills" className="text-brand-600 hover:underline dark:text-brand-300">
          full skill catalog
        </Link>{" "}
        or jump into a{" "}
        <Link href="/" className="text-brand-600 hover:underline dark:text-brand-300">
          bundle
        </Link>
        .
      </p>
    </article>
  );
}
