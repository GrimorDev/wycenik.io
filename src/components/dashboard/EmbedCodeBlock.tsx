"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function EmbedCodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Skopiowano kod osadzenia");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-sidebar">
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-2">
        <span className="font-mono text-xs text-sidebar-foreground/70">{title}</span>
        <Button size="sm" variant="brand" onClick={handleCopy}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Skopiowano" : "Kopiuj kod"}
        </Button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-xs leading-relaxed text-sidebar-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}
