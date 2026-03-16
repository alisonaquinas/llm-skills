/**
 * Markdown rendering component for skill documentation display.
 *
 * Responsibilities:
 * - render raw GitHub Flavored Markdown strings as formatted HTML
 * - apply consistent typography styling that honors light and dark modes
 * - isolate the markdown-to-HTML pipeline from presentation callers
 *
 * Dependency rules:
 * - uses react-markdown + remark-gfm for parsing; no browser APIs required
 * - stays a server component so no markdown parsing happens on the client
 */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Props accepted by the markdown renderer. */
interface MarkdownRendererProps {
  /** Raw markdown string to render. Pass null or empty string to render nothing. */
  content: string | null;
}

/**
 * Renders a raw markdown string as formatted HTML with GitHub Flavored Markdown support.
 *
 * Supports headings, tables, task lists, strikethrough, fenced code blocks, and autolinks.
 *
 * @param content Raw markdown content to display.
 * @returns A rendered markdown view, or null when content is absent.
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div
      className={[
        "prose prose-sm max-w-none",
        "dark:prose-invert",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline",
        "dark:prose-a:text-brand-300",
        // Inline code: no backtick quotes, subtle background chip
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em]",
        "prose-code:bg-gray-100 prose-code:text-gray-800",
        "dark:prose-code:bg-gray-800 dark:prose-code:text-gray-200",
        // Fenced code blocks: dark background matching install command blocks
        "prose-pre:rounded-xl prose-pre:bg-gray-900 prose-pre:text-gray-100",
        "dark:prose-pre:bg-black",
        // Tables: light borders
        "prose-table:text-sm",
        "prose-th:border prose-th:border-gray-200 prose-th:bg-gray-50 prose-th:px-3 prose-th:py-2",
        "dark:prose-th:border-gray-700 dark:prose-th:bg-gray-900",
        "prose-td:border prose-td:border-gray-200 prose-td:px-3 prose-td:py-2",
        "dark:prose-td:border-gray-700",
      ].join(" ")}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
