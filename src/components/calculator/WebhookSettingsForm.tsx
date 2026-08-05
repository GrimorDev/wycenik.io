"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  regenerateWebhookSecret,
  updateWebhookUrl,
  type ActionState,
} from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

interface Props {
  calculatorId: string;
  webhookUrl: string | null;
  webhookSecret: string | null;
}

export function WebhookSettingsForm({ calculatorId, webhookUrl, webhookSecret }: Props) {
  const action = updateWebhookUrl.bind(null, calculatorId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!webhookSecret) return;
    await navigator.clipboard.writeText(webhookSecret);
    setCopied(true);
    toast.success("Skopiowano sekret webhooka");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-2">
        <Label htmlFor="webhook-url">Adres URL webhooka</Label>
        <Input
          id="webhook-url"
          name="webhook_url"
          type="url"
          placeholder="https://hook.make.com/..."
          defaultValue={webhookUrl ?? ""}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Puste = wyłączone. Musi zaczynać się od https://. Po zapisaniu każdy nowy lead zostanie
          wysłany pod ten adres jako POST z JSON-em.
        </p>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" variant="brand" disabled={pending}>
          {pending ? "Zapisywanie…" : "Zapisz"}
        </Button>
      </form>

      {webhookSecret && (
        <div className="space-y-2 border-t border-border pt-5">
          <Label>Sekret podpisu (HMAC)</Label>
          <div className="flex flex-wrap items-center gap-2">
            <code className="font-mono flex h-9 flex-1 items-center overflow-x-auto rounded-md border border-input bg-transparent px-3 text-xs shadow-sm">
              {revealed ? webhookSecret : "•".repeat(24)}
            </code>
            <Button type="button" variant="outline" size="sm" onClick={() => setRevealed((v) => !v)}>
              {revealed ? "Ukryj" : "Pokaż"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
              {copied ? "Skopiowano!" : "Kopiuj"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Każde żądanie zawiera nagłówek <code className="font-mono">X-Wycenik-Signature</code> —
            HMAC-SHA256 treści żądania z tym sekretem. Użyj go, żeby zweryfikować, że webhook
            faktycznie pochodzi z Wycenik.io.
          </p>
          <form action={regenerateWebhookSecret.bind(null, calculatorId)}>
            <Button type="submit" variant="link" size="sm" className="h-auto p-0 text-destructive">
              Wygeneruj nowy sekret
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
