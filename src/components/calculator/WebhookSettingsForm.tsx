"use client";

import { useActionState, useState } from "react";
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
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <label className="block text-sm text-ink-soft">
          Adres URL webhooka
          <input
            name="webhook_url"
            type="url"
            placeholder="https://hook.make.com/..."
            defaultValue={webhookUrl ?? ""}
            className="field tabular mt-1"
          />
        </label>
        <p className="text-xs text-ink-faint">
          Puste = wyłączone. Musi zaczynać się od https://. Po zapisaniu każdy nowy lead zostanie
          wysłany pod ten adres jako POST z JSON-em.
        </p>
        {state.error && <p className="text-sm text-rust-dark">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? "Zapisywanie…" : "Zapisz"}
        </button>
      </form>

      {webhookSecret && (
        <div className="border-t border-dashed border-line-strong pt-5">
          <p className="mb-2 text-sm text-ink-soft">Sekret podpisu (HMAC)</p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="field tabular flex-1 overflow-x-auto py-2 text-xs">
              {revealed ? webhookSecret : "•".repeat(24)}
            </code>
            <button type="button" onClick={() => setRevealed((v) => !v)} className="btn btn-ghost px-3 py-1.5 text-xs">
              {revealed ? "Ukryj" : "Pokaż"}
            </button>
            <button type="button" onClick={handleCopy} className="btn btn-ghost px-3 py-1.5 text-xs">
              {copied ? "Skopiowano!" : "Kopiuj"}
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            Każde żądanie zawiera nagłówek <code className="tabular">X-Wycenik-Signature</code> —
            HMAC-SHA256 treści żądania z tym sekretem. Użyj go, żeby zweryfikować, że webhook
            faktycznie pochodzi z Wycenik.io.
          </p>
          <form action={regenerateWebhookSecret.bind(null, calculatorId)} className="mt-3">
            <button type="submit" className="link-underline text-xs text-rust-dark">
              Wygeneruj nowy sekret
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
