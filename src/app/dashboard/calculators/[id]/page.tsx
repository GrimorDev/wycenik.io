import { notFound } from "next/navigation";
import { AddQuestionForm } from "@/components/calculator/AddQuestionForm";
import { AdminCalculatorPreview } from "@/components/calculator/AdminCalculatorPreview";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { QuestionCard } from "@/components/calculator/QuestionCard";
import { toCalculatorConfig, type RawCalculator } from "@/lib/calculator/mapper";
import { createClient } from "@/lib/supabase/server";

const CALCULATOR_SELECT =
  "id,name,slug,description,base_price,currency,estimate_spread_percent,accent_color,locale,corner_style,bg_color,text_color,border_color,is_published,user_id,questions(id,label,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

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
        is_published: boolean;
        user_id: string;
      })
    | null;

  if (error || !calculator || calculator.user_id !== user?.id) {
    notFound();
  }

  const questions = [...calculator.questions].sort((a, b) => a.position - b.position);
  const previewConfig = toCalculatorConfig(calculator);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <CalculatorHeader
        calculatorId={calculator.id}
        name={calculator.name}
        slug={calculator.slug}
        isPublished={calculator.is_published}
        questionCount={questions.length}
      />

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_380px]">
        <div>
          <p className="mb-3 text-sm text-slate-500">
            Zmiany kolejności i treści widać natychmiast w podglądzie obok.
          </p>

          {questions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Ten kalkulator nie ma jeszcze żadnych pytań.
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  calculatorId={calculator.id}
                  question={question}
                  currency={calculator.currency}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === questions.length - 1}
                />
              ))}
            </div>
          )}

          <div className="mt-3">
            <AddQuestionForm calculatorId={calculator.id} />
          </div>
        </div>

        <div className="xl:sticky xl:top-10 xl:self-start">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">Podgląd na żywo</p>
          <div className="flex justify-center">
            <AdminCalculatorPreview key={JSON.stringify(previewConfig)} config={previewConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
