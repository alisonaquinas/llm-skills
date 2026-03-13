/**
 * Root application layout for the statically exported marketplace site.
 *
 * Responsibilities:
 * - publish stable metadata for the marketplace shell
 * - render the persistent header and plugin navigation used across pages
 * - host the routed page content within the shared page frame
 *
 * Dependency rules:
 * - imports configuration from the catalog module
 * - does not perform GitHub or marketplace business logic directly
 */
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";
import { MARKETPLACE, PLUGINS, getPluginRepoUrl } from "@/lib/catalog";
import {
  SEO_KEYWORDS,
  buildOrganizationStructuredData,
  buildWebsiteStructuredData,
  getHomeUrl,
  getRssUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";
import { getThemeBootstrapScript } from "@/lib/theme";

/**
 * Static metadata used by Next.js during build and export.
 */
export const metadata: Metadata = {
  metadataBase: new URL(MARKETPLACE.siteUrl),
  title: MARKETPLACE.title,
  description: MARKETPLACE.description,
  applicationName: MARKETPLACE.title,
  creator: MARKETPLACE.owner.name,
  publisher: MARKETPLACE.owner.name,
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: getHomeUrl(),
    types: {
      "application/rss+xml": getRssUrl(),
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: MARKETPLACE.title,
    url: getHomeUrl(),
    title: MARKETPLACE.title,
    description: MARKETPLACE.description,
    images: [
      {
        url: getSocialPreviewImageUrl(),
        width: 1200,
        height: 630,
        alt: `${MARKETPLACE.title} social preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: MARKETPLACE.title,
    description: MARKETPLACE.description,
    images: [getSocialPreviewImageUrl()],
  },
};

/**
 * Wraps all routed pages in the shared marketplace chrome.
 *
 * @param children Rendered page content for the active route.
 * @returns The full application shell for the marketplace site.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-gray-100">
        <script dangerouslySetInnerHTML={{ __html: getThemeBootstrapScript() }} />
        <StructuredData
          data={[buildOrganizationStructuredData(), buildWebsiteStructuredData()]}
        />
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-gray-900 no-underline dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                C
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{MARKETPLACE.title}</span>
            </Link>
            <nav className="ml-auto flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {PLUGINS.map((plugin) => (
                <a
                  key={plugin.repo}
                  href={getPluginRepoUrl(plugin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 dark:hover:text-white"
                >
                  {plugin.repo} ↗
                </a>
              ))}
              <a href={getRssUrl()} className="hover:text-gray-900 dark:hover:text-white">
                rss.xml ↗
              </a>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
