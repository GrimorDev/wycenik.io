import { notFound } from "next/navigation";
import { CalculatorEditorShell } from "@/components/calculator/CalculatorEditorShell";
import { CalculatorPreviewPane } from "@/components/calculator/CalculatorPreviewPane";
import { DetailsForm } from "@/components/calculator/DetailsForm";
import { calculatePrice } from "@/lib/calculator/engine";
import { toCalculatorConfig, type RawCalculator } from "@/lib/calculator/mapper";
import type { Answer, AnswersMap } from "@/lib/calculator/types";
import { createClient } from "@/lib/supabase/server";

function defaultAnswers(config: ReturnType<typeof toCalculatorConfig>): AnswersMap {
  const answers: AnswersMap = {};
  for (const question of config.questions) {
    let answer: Answer | undefined;
    if (question.type === "number_slider") {
      answer = { questionId: question.id, type: "number_slider", value: question.config.min };
    } else if (question.type === "single_choice" && question.options.length > 0) {
      answer = { questionId: question.id, type: "single_choice", optionId: question.options[0].id };
    }
    if (answer) answers[question.id] = answer;
  }
  return answers;
}

const CALCULATOR_SELECT =
  "id,name,slug,description,base_price,currency,estimate_spread_percent,accent_color,locale,corner_style,bg_color,text_color,border_color,is_published,user_id,questions(id,label,hint,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

function topDomainsFrom(rows: { source_domain: string | null }[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (!row.source_domain) continue;
    counts.set(row.source_domain, (counts.get(row.source_domain) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}

export default async function CalculatorPricingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("calculators").select(CALCULATOR_SELECT).eq("id", id).single();

  const calculator = data as unknown as
    | (RawCalculator & {
        slug: string;
        description: string | null;
        is_published: boolean;
        user_id: string;
      })
    | null;

  if (error || !calculator || calculator.user_id !== user?.id) {
    notFound();
  }

  const previewConfig = toCalculatorConfig(calculator);

  const [{ count: viewCount }, { count: leadCount }, { data: viewRows }] = await Promise.all([
    supabase.from("calculator_views").select("id", { count: "exact", head: true }).eq("calculator_id", id),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("calculator_id", id),
    supabase
      .from("calculator_views")
      .select("source_domain")
      .eq("calculator_id", id)
      .not("source_domain", "is", null)
      .limit(2000),
  ]);

  const views = viewCount ?? 0;
  const leads = leadCount ?? 0;
  const conversion = views > 0 ? ((leads / views) * 100).toFixed(1) : "0.0";
  const topDomains = topDomainsFrom(viewRows ?? []);

  let simulation: ReturnType<typeof calculatePrice> | null = null;
  try {
    simulation = calculatePrice(previewConfig, defaultAnswers(previewConfig));
  } catch {
    simulation = null;
  }

  return (
    <CalculatorEditorShell
      calculatorId={calculator.id}
      name={calculator.name}
      slug={calculator.slug}
      isPublished={calculator.is_published}
      preview={<CalculatorPreviewPane config={previewConfig} />}
    >
      <div className="max-w-xl space-y-6">
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
            calculatorId={calculator.id}
            name={calculator.name}
            description={calculator.description}
            basePrice={calculator.base_price}
            currency={calculator.currency}
            estimateSpreadPercent={calculator.estimate_spread_percent}
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
      </div>
    </CalculatorEditorShell>
  );
}
