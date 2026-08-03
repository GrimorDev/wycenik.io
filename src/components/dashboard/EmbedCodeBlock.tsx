"use client";

import { useState } from "react";
import { CopyIcon } from "@/components/icons";

export function EmbedCodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
        <p className="text-xs font-medium text-slate-400">{title}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-[10px] bg-brand-accent px-3 py-1 text-xs font-medium text-brand-accent-ink hover:bg-brand-accent-hover"
        >
          <CopyIcon className="h-3.5 w-3.5" />
          {copied ? "Skopiowano!" : "Kopiuj kod"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}
