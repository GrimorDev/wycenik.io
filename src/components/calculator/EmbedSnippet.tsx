"use client";

import { useState } from "react";

export function EmbedSnippet({ snippet }: { snippet: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10">
      <pre className="overflow-x-auto p-4 text-xs">
        <code>{snippet}</code>
      </pre>
      <div className="border-t border-black/10 p-2 text-right dark:border-white/10">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-black/20 px-3 py-1 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Skopiowano!" : "Kopiuj kod"}
        </button>
      </div>
    </div>
  );
}
