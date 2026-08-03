"use client";

import { useActionState, useState } from "react";
import {
  regenerateWebhookSecret,
  updateWebhookUrl,
  type ActionState,
} from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

const FIELD_CLASS =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100";

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
        <label className="block text-sm text-slate-600">
          Adres URL webhooka
          <input
            name="webhook_url"
            type="url"
            placeholder="https://hook.make.com/..."
            defaultValue={webhookUrl ?? ""}
            className={`tabular mt-1 ${FIELD_CLASS}`}
          />
        </label>
        <p className="text-xs text-slate-400">
          Puste = wyłączone. Musi zaczynać się od https://. Po zapisaniu każdy nowy lead zostanie
          wysłany pod ten adres jako POST z JSON-em.
        </p>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
        >
          {pending ? "Zapisywanie…" : "Zapisz"}
        </button>
      </form>

      {webhookSecret && (
        <div className="border-t border-dashed border-slate-200 pt-5">
          <p className="mb-2 text-sm text-slate-600">Sekret podpisu (HMAC)</p>
          <div className="flex flex-wrap items-center gap-2">
            <code className={`tabular flex-1 overflow-x-auto py-2 text-xs ${FIELD_CLASS}`}>
              {revealed ? webhookSecret : "•".repeat(24)}
            </code>
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400"
            >
              {revealed ? "Ukryj" : "Pokaż"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400"
            >
              {copied ? "Skopiowano!" : "Kopiuj"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Każde żądanie zawiera nagłówek <code className="tabular">X-Wycenik-Signature</code> —
            HMAC-SHA256 treści żądania z tym sekretem. Użyj go, żeby zweryfikować, że webhook
            faktycznie pochodzi z Wycenik.io.
          </p>
          <form action={regenerateWebhookSecret.bind(null, calculatorId)} className="mt-3">
            <button type="submit" className="text-xs font-medium text-red-600 hover:text-red-700">
              Wygeneruj nowy sekret
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
