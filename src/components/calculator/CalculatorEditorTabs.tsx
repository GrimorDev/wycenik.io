"use client";

import { useState } from "react";
import { Eye, Monitor, Smartphone } from "lucide-react";
import { AddQuestionForm } from "@/components/calculator/AddQuestionForm";
import { AdminCalculatorPreview } from "@/components/calculator/AdminCalculatorPreview";
import { DetailsForm } from "@/components/calculator/DetailsForm";
import { QuestionCard } from "@/components/calculator/QuestionCard";
import { WebhookSettingsForm } from "@/components/calculator/WebhookSettingsForm";
import { WidgetSettingsForm, type CornerStyle, type WidgetTheme } from "@/components/calculator/WidgetSettingsForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RawQuestion } from "@/lib/calculator/mapper";
import type { CalculatorConfig } from "@/lib/calculator/types";
import { cn } from "@/lib/cn";

const DEFAULT_BG = "#ffffff";
const DEFAULT_TEXT = "#1e1b16";
const DEFAULT_BORDER = "#e4dac5";

interface WebhookLogRow {
  id: string;
  status_code: number | null;
  response_time_ms: number | null;
  error: string | null;
  created_at: string;
}

interface SimulationLine {
  label: string;
  amount: number;
}

interface Simulation {
  breakdown: SimulationLine[];
  min: number;
  max: number;
  currency: string;
}

function StatusBadge({ statusCode, error }: { statusCode: number | null; error: string | null }) {
  if (error) {
    return (
      <Badge variant="destructive" className="font-mono">
        błąd
      </Badge>
    );
  }
  if (statusCode && statusCode >= 200 && statusCode < 300) {
    return (
      <Badge className="font-mono bg-brand text-brand-foreground hover:bg-brand/90">
        {statusCode} OK
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="font-mono">
      {statusCode ?? "brak odpowiedzi"}
    </Badge>
  );
}

export function CalculatorEditorTabs({
  calculatorId,
  currency,
  description,
  questions,
  previewConfig,
  views,
  leads,
  conversion,
  topDomains,
  simulation,
  allowedDomain,
  webhookUrl,
  webhookSecret,
  logs,
}: {
  calculatorId: string;
  currency: string;
  description: string | null;
  questions: RawQuestion[];
  previewConfig: CalculatorConfig;
  views: number;
  leads: number;
  conversion: string;
  topDomains: [string, number][];
  simulation: Simulation | null;
  allowedDomain: string | null;
  webhookUrl: string | null;
  webhookSecret: string | null;
  logs: WebhookLogRow[];
}) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [theme, setTheme] = useState<WidgetTheme>({
    color: previewConfig.accentColor,
    locale: previewConfig.locale,
    corner: previewConfig.cornerStyle as CornerStyle,
    customPalette: Boolean(previewConfig.bgColor && previewConfig.textColor && previewConfig.borderColor),
    bg: previewConfig.bgColor ?? DEFAULT_BG,
    text: previewConfig.textColor ?? DEFAULT_TEXT,
    border: previewConfig.borderColor ?? DEFAULT_BORDER,
  });

  const liveConfig: CalculatorConfig = {
    ...previewConfig,
    accentColor: theme.color,
    locale: theme.locale,
    cornerStyle: theme.corner,
    bgColor: theme.customPalette ? theme.bg : null,
    textColor: theme.customPalette ? theme.text : null,
    borderColor: theme.customPalette ? theme.border : null,
  };

  const sortedQuestions = [...questions].sort((a, b) => a.position - b.position);

  return (
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)] lg:overflow-hidden">
      <div className="border-border px-6 py-5 lg:overflow-y-auto lg:border-r">
        <Tabs defaultValue="questions">
          <TabsList>
            <TabsTrigger value="questions">Pytania</TabsTrigger>
            <TabsTrigger value="pricing">Ustawienia wyceny</TabsTrigger>
            <TabsTrigger value="style">Styling</TabsTrigger>
            <TabsTrigger value="integrations">Integracje</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="mt-5">
            <p className="mb-3 text-sm text-muted-foreground">
              Przeciągnij pytania, aby zmienić kolejność. Zmiany widać natychmiast w podglądzie.
            </p>
            {sortedQuestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Ten kalkulator nie ma jeszcze żadnych pytań.
              </div>
            ) : (
              <div className="space-y-3">
                {sortedQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    calculatorId={calculatorId}
                    question={question}
                    currency={currency}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === sortedQuestions.length - 1}
                  />
                ))}
              </div>
            )}
            <div className="mt-3">
              <AddQuestionForm calculatorId={calculatorId} />
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="mt-5 max-w-xl space-y-6">
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">Statystyki</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="panel p-4 text-center">
                  <p className="font-dashboard-display text-2xl font-semibold text-foreground">{views}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Wyświetlenia</p>
                </div>
                <div className="panel p-4 text-center">
                  <p className="font-dashboard-display text-2xl font-semibold text-foreground">{leads}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Leady</p>
                </div>
                <div className="panel p-4 text-center">
                  <p className="font-dashboard-display text-2xl font-semibold text-foreground">{conversion}%</p>
                  <p className="mt-1 text-xs text-muted-foreground">Konwersja</p>
                </div>
              </div>
              {topDomains.length > 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Aktywny na domenach</p>
                  <ul className="space-y-1">
                    {topDomains.map(([domain, count]) => (
                      <li key={domain} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-foreground/80">{domain}</span>
                        <span className="font-mono text-muted-foreground">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">Ustawienia wyceny</h2>
              <DetailsForm
                calculatorId={calculatorId}
                name={previewConfig.name}
                description={description}
                basePrice={previewConfig.basePrice}
                currency={previewConfig.currency}
                estimateSpreadPercent={previewConfig.estimateSpreadPercent}
              />
            </section>

            {simulation && simulation.breakdown.length > 0 && (
              <div className="panel p-4">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  Symulacja dla odpowiedzi domyślnych
                </p>
                <div className="mt-3 space-y-1.5 text-sm">
                  {simulation.breakdown.map((line, i) => (
                    <div key={i} className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{line.label}</span>
                      <span className="font-mono">
                        {line.amount.toLocaleString("pl-PL")} {simulation.currency}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-border pt-2 font-medium">
                    <span>Razem</span>
                    <span className="font-mono text-brand">
                      {simulation.min.toLocaleString("pl-PL")}–{simulation.max.toLocaleString("pl-PL")} {simulation.currency}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="style" className="mt-5">
            <WidgetSettingsForm
              calculatorId={calculatorId}
              theme={theme}
              onThemeChange={(patch) => setTheme((t) => ({ ...t, ...patch }))}
              allowedDomain={allowedDomain}
            />
          </TabsContent>

          <TabsContent value="integrations" className="mt-5 max-w-xl space-y-6">
            <div className="panel space-y-4 p-4">
              <WebhookSettingsForm calculatorId={calculatorId} webhookUrl={webhookUrl} webhookSecret={webhookSecret} />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground">Ostatnie dostarczenia</h3>
              {logs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                  Brak jeszcze żadnych wysyłek.
                </div>
              ) : (
                <div className="panel overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-surface/60 hover:bg-surface/60">
                        <TableHead>Status</TableHead>
                        <TableHead>Czas odpowiedzi</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <StatusBadge statusCode={log.status_code} error={log.error} />
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">
                            {log.response_time_ms != null ? `${log.response_time_ms} ms` : "—"}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">
                            {new Date(log.created_at).toLocaleString("pl-PL")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid-dots overflow-y-auto bg-surface px-6 py-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Eye className="size-4 text-brand" /> Podgląd na żywo
          </span>
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
            <Button
              type="button"
              variant={device === "desktop" ? "soft" : "ghost"}
              size="icon"
              onClick={() => setDevice("desktop")}
              aria-label="Podgląd na komputer"
              aria-pressed={device === "desktop"}
            >
              <Monitor className="size-4" />
            </Button>
            <Button
              type="button"
              variant={device === "mobile" ? "soft" : "ghost"}
              size="icon"
              onClick={() => setDevice("mobile")}
              aria-label="Podgląd na telefon"
              aria-pressed={device === "mobile"}
            >
              <Smartphone className="size-4" />
            </Button>
          </div>
        </div>
        <div className={cn("mx-auto transition-all", device === "mobile" ? "max-w-[380px]" : "max-w-lg")}>
          <AdminCalculatorPreview key={JSON.stringify(liveConfig)} config={liveConfig} />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Dokładnie to zobaczy Twój klient na stronie.
          </p>
        </div>
      </div>
    </div>
  );
}
