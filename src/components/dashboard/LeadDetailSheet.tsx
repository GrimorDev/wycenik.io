"use client";

import { useMemo } from "react";
import { MailIcon, PhoneIcon, XIcon } from "@/components/icons";
import { calculatePrice } from "@/lib/calculator/engine";
import type { AnswersMap, CalculatorConfig } from "@/lib/calculator/types";
import type { LeadRow } from "@/components/dashboard/LeadsTable";

function formatMoney(amount: number, currency: string) {
  return `${amount.toLocaleString("pl-PL")} ${currency}`;
}

export function LeadDetailSheet({
  lead,
  config,
  onClose,
}: {
  lead: LeadRow;
  config: CalculatorConfig | undefined;
  onClose: () => void;
}) {
  const breakdown = useMemo(() => {
    if (!config) return null;
    try {
      return calculatePrice(config, lead.answers as AnswersMap);
    } catch {
      return null;
    }
  }, [config, lead.answers]);

  const emailHref = `mailto:${lead.email}?subject=${encodeURIComponent(
    `Wycena — ${lead.calculatorName}`,
  )}&body=${encodeURIComponent(
    `Dzień dobry ${lead.name},\n\nW nawiązaniu do Twojego zgłoszenia, szacowany koszt to ${lead.estimated_min}–${lead.estimated_max} zł.\n\n`,
  )}`;

  return (
    <div className="animate-overlay-in fixed inset-0 z-50 flex justify-end bg-slate-950/40" onClick={onClose}>
      <div
        className="animate-sheet-in-right h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{lead.name}</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Zgłoszenie z {new Date(lead.created_at).toLocaleString("pl-PL")} · {lead.calculatorName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-brand-accent"
          >
            <MailIcon className="h-4 w-4 text-slate-400" />
            {lead.email}
          </a>
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-brand-accent"
            >
              <PhoneIcon className="h-4 w-4 text-slate-400" />
              {lead.phone}
            </a>
          )}
        </div>

        {breakdown && breakdown.breakdown.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-900">Odpowiedzi klienta</h3>
            <div className="mt-3 space-y-3">
              {breakdown.breakdown.map((line, i) => (
                <div key={i} className="flex items-start justify-between gap-4 text-sm">
                  <p className="text-slate-600">{line.label}</p>
                  <span className="tabular shrink-0 text-slate-900">
                    {formatMoney(line.amount, breakdown.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-dashed border-slate-200 pt-6">
          <div className="rounded-xl bg-brand-mint p-4">
            <p className="text-xs uppercase tracking-wide text-brand-mint-ink">Wyliczona wycena</p>
            <p className="font-dashboard-display mt-1 text-2xl font-semibold text-brand-mint-ink">
              {lead.estimated_min}–{lead.estimated_max} zł
            </p>
          </div>
        </div>

        <a
          href={emailHref}
          className="mt-4 flex w-full items-center justify-center rounded-[10px] bg-brand-accent px-4 py-2 text-sm font-medium text-brand-accent-ink transition-colors hover:bg-brand-accent-hover"
        >
          Wyślij ofertę mailem
        </a>
      </div>
    </div>
  );
}
