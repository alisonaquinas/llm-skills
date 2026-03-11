import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { MARKETPLACE, PLUGINS, getPluginRepoUrl } from "@/lib/catalog";

export const metadata: Metadata = {
  title: MARKETPLACE.title,
  description: MARKETPLACE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-gray-900 no-underline">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                C
              </div>
              <span className="text-lg font-semibold">{MARKETPLACE.title}</span>
            </Link>
            <nav className="ml-auto flex gap-4 text-sm text-gray-500">
              {PLUGINS.map((plugin) => (
                <a
                  key={plugin.repo}
                  href={getPluginRepoUrl(plugin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900"
                >
                  {plugin.repo} ↗
                </a>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
