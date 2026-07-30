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
    <div className="ticket overflow-hidden">
      <pre className="overflow-x-auto p-4 font-mono text-xs text-ink-soft">
        <code>{snippet}</code>
      </pre>
      <div className="border-t border-dashed border-line-strong p-2 text-right">
        <button type="button" onClick={handleCopy} className="btn btn-ghost px-3 py-1 text-xs">
          {copied ? "Skopiowano!" : "Kopiuj kod"}
        </button>
      </div>
    </div>
  );
}
