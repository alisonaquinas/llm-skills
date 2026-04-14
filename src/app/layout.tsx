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
import { Plus_Jakarta_Sans } from "next/font/google";
import Footer from "@/components/Footer";
import MobileHeaderMenu, { type MobileHeaderMenuItem } from "@/components/MobileHeaderMenu";
import { BrandBug, RssIcon } from "@/components/SiteIcons";
import StructuredData from "@/components/StructuredData";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";
import { MARKETPLACE } from "@/lib/catalog";
import {
  SEO_KEYWORDS,
  buildOrganizationStructuredData,
  buildWebsiteStructuredData,
  getHomeUrl,
  getRssUrl,
  getSocialPreviewImageUrl,
} from "@/lib/seo";
import { getThemeBootstrapScript } from "@/lib/theme";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
  icons: {
    icon: [{ url: getHomeUrl() + "favicon.png", type: "image/png" }],
    shortcut: [{ url: getHomeUrl() + "favicon.png", type: "image/png" }],
    apple: [{ url: getHomeUrl() + "branding/iphone-favicon.png", type: "image/png" }],
  },
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
 * Precomputed mobile-only navigation entries that move out of the header row on phones.
 */
const MOBILE_MENU_ITEMS: MobileHeaderMenuItem[] = [
  { key: "skills", href: "/skills", label: "Browse skills", iconKey: "skills", isExternal: false },
  { key: "guides", href: "/guides", label: "Learn", iconKey: "guides", isExternal: false },
  { key: "rss", href: getRssUrl(), label: "RSS feed", iconKey: "rss", isExternal: true },
];

/**
 * Wraps all routed pages in the shared marketplace chrome.
 *
 * @param children Rendered page content for the active route.
 * @returns The full application shell for the marketplace site.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body suppressHydrationWarning className="min-h-screen overflow-x-hidden text-gray-950 dark:text-gray-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg dark:focus:bg-stone-950 dark:focus:text-white"
        >
          Skip to main content
        </a>
        <script dangerouslySetInnerHTML={{ __html: getThemeBootstrapScript() }} />
        <StructuredData data={[buildOrganizationStructuredData(), buildWebsiteStructuredData()]} />
        <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
          <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-3 sm:px-5 md:items-center md:px-6">
            <Link href="/" className="min-w-0 flex-1 text-gray-900 no-underline dark:text-white md:flex-none">
              <span className="flex items-center gap-3">
                <BrandBug className="h-9 w-9 shrink-0" />
                <span className="min-w-0 text-base font-semibold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-lg">
                  {MARKETPLACE.title}
                </span>
              </span>
            </Link>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <nav className="hidden items-center justify-end gap-1 text-sm text-gray-500 dark:text-gray-400 md:flex">
                <Link
                  href="/skills"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-gray-600 transition-colors hover:bg-brand-50 hover:text-brand-800 dark:text-gray-300 dark:hover:bg-brand-950/50 dark:hover:text-brand-100"
                >
                  Skills
                </Link>
                <Link
                  href="/guides"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-gray-600 transition-colors hover:bg-brand-50 hover:text-brand-800 dark:text-gray-300 dark:hover:bg-brand-950/50 dark:hover:text-brand-100"
                >
                  Learn
                </Link>
                <a
                  href={getRssUrl()}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-800 dark:text-brand-200 dark:hover:bg-brand-950/50 dark:hover:text-brand-100"
                  aria-label="Open the combined RSS feed"
                >
                  <RssIcon className="h-4 w-4" />
                  <span>RSS</span>
                </a>
              </nav>
              <ThemeToggle />
              <MobileHeaderMenu items={MOBILE_MENU_ITEMS} />
            </div>
          </div>
        </header>
        <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8 md:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

