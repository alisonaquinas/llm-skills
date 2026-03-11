import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Plugin Marketplace",
  description: "Browse and install LLM skill plugins for Claude Code",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-gray-900 no-underline">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                C
              </div>
              <span className="font-semibold text-lg">Claude Plugin Marketplace</span>
            </a>
            <nav className="ml-auto flex gap-4 text-sm text-gray-500">
              <a
                href="https://github.com/alisonaquinas/llm-shared-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
              >
                llm-shared-skills ↗
              </a>
              <a
                href="https://github.com/alisonaquinas/llm-ci-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
              >
                llm-ci-dev ↗
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
