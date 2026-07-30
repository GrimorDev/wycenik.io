import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AddOptionForm } from "@/components/calculator/AddOptionForm";
import { AddQuestionForm } from "@/components/calculator/AddQuestionForm";
import { DetailsForm } from "@/components/calculator/DetailsForm";
import { EmbedSnippet } from "@/components/calculator/EmbedSnippet";
import {
  deleteCalculator,
  deleteOption,
  deleteQuestion,
  togglePublish,
} from "@/lib/actions/calculators";
import type { RawCalculator, RawQuestion } from "@/lib/calculator/mapper";
import { createClient } from "@/lib/supabase/server";

const CALCULATOR_SELECT =
  "id,name,slug,description,base_price,currency,estimate_spread_percent,is_published,user_id,questions(id,label,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

async function getOrigin() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

const QUESTION_TYPE_LABEL: Record<RawQuestion["type"], string> = {
  number_slider: "Suwak liczbowy",
  single_choice: "Jednokrotny wybór",
  checkbox: "Checkboxy",
};

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
  const origin = await getOrigin();
  const embedSnippet = `<script src="${origin}/widget.js" data-calculator="${calculator.slug}"></script>`;
  const questions = [...calculator.questions].sort((a, b) => a.position - b.position);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-10">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{calculator.name}</h1>
          <span className="text-sm text-zinc-500">
            {calculator.is_published ? "Opublikowany" : "Szkic"}
          </span>
        </div>
        <p className="text-sm text-zinc-500">/{calculator.slug}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Kod do wdrożenia</h2>
        {calculator.is_published ? (
          <EmbedSnippet snippet={embedSnippet} />
        ) : (
          <p className="text-sm text-zinc-500">
            Opublikuj kalkulator, aby otrzymać kod do wklejenia na stronę.
          </p>
        )}
        <form action={togglePublish.bind(null, calculator.id, !calculator.is_published)}>
          <button
            type="submit"
            className="rounded-full border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            {calculator.is_published ? "Cofnij publikację" : "Opublikuj"}
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Ustawienia</h2>
        <DetailsForm
          calculatorId={calculator.id}
          name={calculator.name}
          description={calculator.description}
          basePrice={calculator.base_price}
          currency={calculator.currency}
          estimateSpreadPercent={calculator.estimate_spread_percent}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Pytania</h2>

        {questions.length === 0 && (
          <p className="text-sm text-zinc-500">Ten kalkulator nie ma jeszcze żadnych pytań.</p>
        )}

        <ul className="space-y-4">
          {questions.map((question) => (
            <li key={question.id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-medium">{question.label}</p>
                  <p className="text-xs text-zinc-500">
                    {QUESTION_TYPE_LABEL[question.type]} · {question.required ? "wymagane" : "opcjonalne"}
                  </p>
                </div>
                <form action={deleteQuestion.bind(null, calculator.id, question.id)}>
                  <button type="submit" className="text-xs text-red-600 hover:underline">
                    Usuń pytanie
                  </button>
                </form>
              </div>

              {question.type === "number_slider" ? (
                <p className="text-sm text-zinc-500">
                  {String(question.config.min)}–{String(question.config.max)}
                  {question.config.unit ? ` ${question.config.unit}` : ""} · krok{" "}
                  {String(question.config.step)} · {String(question.config.pricePerUnit)}{" "}
                  {calculator.currency}/jedn.
                </p>
              ) : (
                <div className="space-y-2">
                  <ul className="space-y-1">
                    {[...question.options]
                      .sort((a, b) => a.position - b.position)
                      .map((option) => (
                        <li key={option.id} className="flex items-center justify-between text-sm">
                          <span>
                            {option.label} — {option.price_delta} {calculator.currency}
                            {option.price_multiplier !== 1 ? ` · ×${option.price_multiplier}` : ""}
                          </span>
                          <form action={deleteOption.bind(null, calculator.id, option.id)}>
                            <button type="submit" className="text-xs text-red-600 hover:underline">
                              Usuń
                            </button>
                          </form>
                        </li>
                      ))}
                  </ul>
                  <AddOptionForm calculatorId={calculator.id} questionId={question.id} />
                </div>
              )}
            </li>
          ))}
        </ul>

        <AddQuestionForm calculatorId={calculator.id} />
      </section>

      <section className="border-t border-black/10 pt-6 dark:border-white/10">
        <form action={deleteCalculator.bind(null, calculator.id)}>
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Usuń kalkulator
          </button>
        </form>
      </section>
    </div>
  );
}
