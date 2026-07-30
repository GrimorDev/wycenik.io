import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AddOptionForm } from "@/components/calculator/AddOptionForm";
import { AddQuestionForm } from "@/components/calculator/AddQuestionForm";
import { DetailsForm } from "@/components/calculator/DetailsForm";
import { EditOptionForm } from "@/components/calculator/EditOptionForm";
import { EditQuestionForm } from "@/components/calculator/EditQuestionForm";
import { EmbedSnippet } from "@/components/calculator/EmbedSnippet";
import { ArrowLeftIcon } from "@/components/icons";
import { deleteCalculator, deleteQuestion, togglePublish } from "@/lib/actions/calculators";
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
    <div className="mx-auto w-full max-w-2xl space-y-12">
      <div>
        <Link href="/dashboard" className="link-underline flex items-center gap-1.5 text-sm text-ink-soft">
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Twoje kalkulatory
        </Link>
        <div className="mb-1 mt-3 flex items-center justify-between">
          <h1 className="font-display text-3xl">{calculator.name}</h1>
          <span className={`stamp ${calculator.is_published ? "text-sage" : "text-ink-faint"}`}>
            {calculator.is_published ? "Opublikowany" : "Szkic"}
          </span>
        </div>
        <p className="tabular text-sm text-ink-faint">/{calculator.slug}</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-xl">Kod do wdrożenia</h2>
        {calculator.is_published ? (
          <EmbedSnippet snippet={embedSnippet} />
        ) : (
          <p className="text-sm text-ink-soft">
            Opublikuj kalkulator, aby otrzymać kod do wklejenia na stronę.
          </p>
        )}
        <form action={togglePublish.bind(null, calculator.id, !calculator.is_published)}>
          <button type="submit" className="btn btn-ghost">
            {calculator.is_published ? "Cofnij publikację" : "Opublikuj"}
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl">Ustawienia</h2>
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
        <h2 className="font-display text-xl">Pytania</h2>

        {questions.length === 0 && (
          <p className="text-sm text-ink-soft">Ten kalkulator nie ma jeszcze żadnych pytań.</p>
        )}

        <ul className="space-y-4">
          {questions.map((question) => (
            <li key={question.id} className="ticket p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="text-xs text-ink-faint">
                  {QUESTION_TYPE_LABEL[question.type]}
                </p>
                <form action={deleteQuestion.bind(null, calculator.id, question.id)}>
                  <button type="submit" className="link-underline text-xs text-rust-dark">
                    Usuń pytanie
                  </button>
                </form>
              </div>

              <EditQuestionForm calculatorId={calculator.id} question={question} />

              {question.type !== "number_slider" && (
                <div className="mt-4 space-y-2 border-t border-dashed border-line-strong pt-4">
                  <ul className="space-y-2">
                    {[...question.options]
                      .sort((a, b) => a.position - b.position)
                      .map((option) => (
                        <li key={option.id}>
                          <EditOptionForm calculatorId={calculator.id} option={option} />
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

      <section className="border-t border-dashed border-line-strong pt-6">
        <form action={deleteCalculator.bind(null, calculator.id)}>
          <button type="submit" className="link-underline text-sm text-rust-dark">
            Usuń kalkulator
          </button>
        </form>
      </section>
    </div>
  );
}
