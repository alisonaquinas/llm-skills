"use client";

/**
 * Client-side clipboard helper used by installation and detail views.
 *
 * Responsibilities:
 * - copy supplied text to the browser clipboard
 * - surface transient copied and failure UI states
 * - keep the clipboard interaction details out of presentation callers
 */
import { useState } from "react";
import { CopyIcon } from "./SiteIcons";

/**
 * Props accepted by the copy button component.
 */
interface CopyButtonProps {
  /** Text to place on the clipboard when the button is activated. */
  text: string;
  /** Optional button label to use while idle. */
  label?: string;
  /** Optional accessible label for icon-only copy buttons. */
  ariaLabel?: string;
  /** Visual treatment used by the button. */
  variant?: "default" | "icon";
}

/**
 * Renders a button that copies text to the clipboard and reports status inline.
 *
 * @param text Clipboard payload.
 * @param label Idle button label.
 * @returns A client component for clipboard interactions.
 */
export default function CopyButton({
  text,
  label = "Copy",
  ariaLabel,
  variant = "default",
}: CopyButtonProps) {
  /** Current feedback state rendered by the button. */
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  /**
   * Attempts to copy the configured text and resets the status after a short delay.
   */
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    window.setTimeout(() => setStatus("idle"), 2000);
  }

  const isIconOnly = variant === "icon";
  const currentAriaLabel =
    ariaLabel ?? (isIconOnly ? `Copy "${text}" to clipboard` : label);

  if (isIconOnly) {
    const iconClassName =
      status === "copied"
        ? "text-green-600 dark:text-green-400"
        : status === "failed"
          ? "text-amber-600 dark:text-amber-400"
          : "";

    return (
      <button
        type="button"
        onClick={copy}
        aria-label={currentAriaLabel}
        title={status === "copied" ? "Copied!" : status === "failed" ? "Couldn't copy" : label}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
      >
        {status === "copied" ? (
          <svg className={`h-4 w-4 ${iconClassName}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : status === "failed" ? (
          <svg className={`h-4 w-4 ${iconClassName}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M10.29 3.86l-7.54 13a1 1 0 00.87 1.5h15.08a1 1 0 00.87-1.5l-7.54-13a1 1 0 00-1.74 0z" />
          </svg>
        ) : (
          <CopyIcon className={`h-4 w-4 ${iconClassName}`} />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={currentAriaLabel}
      className="inline-flex min-h-11 items-center justify-center gap-1.5 self-start rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:self-auto"
    >
      {status === "copied" ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : status === "failed" ? (
        <>
          <svg className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M10.29 3.86l-7.54 13a1 1 0 00.87 1.5h15.08a1 1 0 00.87-1.5l-7.54-13a1 1 0 00-1.74 0z" />
          </svg>
          Couldn&apos;t copy
        </>
      ) : (
        <>
          <CopyIcon className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}
