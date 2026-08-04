"use client";

import { useMemo } from "react";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
  lead: LeadRow | null;
  config: CalculatorConfig | undefined;
  onClose: () => void;
}) {
  const breakdown = useMemo(() => {
    if (!lead || !config) return null;
    try {
      return calculatePrice(config, lead.answers as AnswersMap);
    } catch {
      return null;
    }
  }, [config, lead]);

  const emailHref = lead
    ? `mailto:${lead.email}?subject=${encodeURIComponent(
        `Wycena — ${lead.calculatorName}`,
      )}&body=${encodeURIComponent(
        `Dzień dobry ${lead.name},\n\nW nawiązaniu do Twojego zgłoszenia, szacowany koszt to ${lead.estimated_min}–${lead.estimated_max} zł.\n\n`,
      )}`
    : "";

  return (
    <Sheet open={!!lead} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {lead ? (
          <>
            <SheetHeader>
              <SheetTitle>{lead.name}</SheetTitle>
              <SheetDescription>
                Zgłoszenie z {new Date(lead.created_at).toLocaleString("pl-PL")} · {lead.calculatorName}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-8">
              <div className="grid gap-2">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:border-brand"
                >
                  <Mail className="size-4 text-muted-foreground" /> {lead.email}
                </a>
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:border-brand"
                  >
                    <Phone className="size-4 text-muted-foreground" /> {lead.phone}
                  </a>
                )}
              </div>

              {breakdown && breakdown.breakdown.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Odpowiedzi klienta</h3>
                  <div className="mt-3 space-y-3">
                    {breakdown.breakdown.map((line, i) => (
                      <div key={i} className="flex items-start justify-between gap-4 text-sm">
                        <p className="text-muted-foreground">{line.label}</p>
                        <span className="font-mono shrink-0 text-foreground">
                          {formatMoney(line.amount, breakdown.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="rounded-xl bg-brand-soft p-4">
                <p className="text-xs tracking-wide text-accent-foreground uppercase">Wyliczona wycena</p>
                <p className="font-dashboard-display mt-1 text-2xl font-semibold text-accent-foreground">
                  {lead.estimated_min}–{lead.estimated_max} zł
                </p>
              </div>

              <Button asChild variant="brand" className="w-full">
                <a href={emailHref}>Wyślij ofertę mailem</a>
              </Button>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
