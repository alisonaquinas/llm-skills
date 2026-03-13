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

/**
 * Props accepted by the copy button component.
 */
interface CopyButtonProps {
  /** Text to place on the clipboard when the button is activated. */
  text: string;
  /** Optional button label to use while idle. */
  label?: string;
}

/**
 * Renders a button that copies text to the clipboard and reports status inline.
 *
 * @param text Clipboard payload.
 * @param label Idle button label.
 * @returns A client component for clipboard interactions.
 */
export default function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
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

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
    >
      {status === "copied" ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : status === "failed" ? (
        <>
          <svg className="h-3.5 w-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M10.29 3.86l-7.54 13a1 1 0 00.87 1.5h15.08a1 1 0 00.87-1.5l-7.54-13a1 1 0 00-1.74 0z" />
          </svg>
          Couldn&apos;t copy
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
