import { notFound } from "next/navigation";
import { CalculatorEditorTabs } from "@/components/calculator/CalculatorEditorTabs";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { calculatePrice } from "@/lib/calculator/engine";
import { toCalculatorConfig, type RawCalculator } from "@/lib/calculator/mapper";
import type { Answer, AnswersMap } from "@/lib/calculator/types";
import { createClient } from "@/lib/supabase/server";

const CALCULATOR_SELECT =
  "id,name,slug,description,base_price,currency,estimate_spread_percent,accent_color,locale,corner_style,bg_color,text_color,border_color,allowed_domain,is_published,user_id,webhook_url,webhook_secret,questions(id,label,hint,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

function topDomainsFrom(rows: { source_domain: string | null }[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (!row.source_domain) continue;
    counts.set(row.source_domain, (counts.get(row.source_domain) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}

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

export default async function EditCalculatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("calculators")
    .select(CALCULATOR_SELECT)
    .eq("id", id)
    .single();

  const calculator = data as unknown as
    | (RawCalculator & {
        slug: string;
        description: string | null;
        allowed_domain: string | null;
        is_published: boolean;
        user_id: string;
        webhook_url: string | null;
        webhook_secret: string | null;
      })
    | null;

  if (error || !calculator || calculator.user_id !== user?.id) {
    notFound();
  }

  const questions = [...calculator.questions].sort((a, b) => a.position - b.position);
  const previewConfig = toCalculatorConfig(calculator);

  const [{ count: viewCount }, { count: leadCount }, { data: viewRows }, { data: logs }] = await Promise.all([
    supabase.from("calculator_views").select("id", { count: "exact", head: true }).eq("calculator_id", id),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("calculator_id", id),
    supabase
      .from("calculator_views")
      .select("source_domain")
      .eq("calculator_id", id)
      .not("source_domain", "is", null)
      .limit(2000),
    supabase
      .from("webhook_logs")
      .select("id,status_code,response_time_ms,error,created_at")
      .eq("calculator_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
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
    <div className="flex flex-col lg:h-screen lg:overflow-hidden">
      <CalculatorHeader
        calculatorId={calculator.id}
        name={calculator.name}
        slug={calculator.slug}
        isPublished={calculator.is_published}
        questionCount={questions.length}
      />
      <CalculatorEditorTabs
        calculatorId={calculator.id}
        currency={calculator.currency}
        description={calculator.description}
        questions={questions}
        previewConfig={previewConfig}
        views={views}
        leads={leads}
        conversion={conversion}
        topDomains={topDomains}
        simulation={simulation}
        allowedDomain={calculator.allowed_domain}
        webhookUrl={calculator.webhook_url}
        webhookSecret={calculator.webhook_secret}
        logs={logs ?? []}
      />
    </div>
  );
}
