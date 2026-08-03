import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AddOptionForm } from "@/components/calculator/AddOptionForm";
import { AddQuestionForm } from "@/components/calculator/AddQuestionForm";
import { AdminCalculatorPreview } from "@/components/calculator/AdminCalculatorPreview";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { DetailsForm } from "@/components/calculator/DetailsForm";
import { EditOptionForm } from "@/components/calculator/EditOptionForm";
import { EditQuestionForm } from "@/components/calculator/EditQuestionForm";
import { EmbedSnippet } from "@/components/calculator/EmbedSnippet";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/icons";
import { deleteCalculator, moveQuestion, togglePublish } from "@/lib/actions/calculators";
import { toCalculatorConfig, type RawCalculator } from "@/lib/calculator/mapper";
import { createClient } from "@/lib/supabase/server";

const CALCULATOR_SELECT =
  "id,name,slug,description,base_price,currency,estimate_spread_percent,accent_color,locale,corner_style,bg_color,text_color,border_color,is_published,user_id,questions(id,label,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

async function getOrigin() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function topDomainsFrom(rows: { source_domain: string | null }[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (!row.source_domain) continue;
    counts.set(row.source_domain, (counts.get(row.source_domain) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
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
        is_published: boolean;
        user_id: string;
      })
    | null;

  if (error || !calculator || calculator.user_id !== user?.id) {
    notFound();
  }

  const [{ count: viewCount }, { count: leadCount }, { data: viewRows }] = await Promise.all([
    supabase
      .from("calculator_views")
      .select("id", { count: "exact", head: true })
      .eq("calculator_id", calculator.id),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("calculator_id", calculator.id),
    supabase
      .from("calculator_views")
      .select("source_domain")
      .eq("calculator_id", calculator.id)
      .not("source_domain", "is", null)
      .limit(2000),
  ]);

  const views = viewCount ?? 0;
  const leads = leadCount ?? 0;
  const conversion = views > 0 ? ((leads / views) * 100).toFixed(1) : "0.0";
  const topDomains = topDomainsFrom(viewRows ?? []);

  const origin = await getOrigin();
  const embedSnippet = `<script src="${origin}/widget.js" data-calculator="${calculator.slug}"></script>`;
  const questions = [...calculator.questions].sort((a, b) => a.position - b.position);
  const previewConfig = toCalculatorConfig(calculator);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <CalculatorHeader
        calculatorId={calculator.id}
        name={calculator.name}
        slug={calculator.slug}
        isPublished={calculator.is_published}
      />

      <div className="mt-10 grid gap-10 xl:grid-cols-[1fr_380px]">
        <div className="max-w-2xl space-y-12">
          <section className="space-y-3">
            <h2 className="font-display text-xl">Statystyki</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="ticket p-4 text-center">
                <p className="tabular font-display text-2xl text-rust">{views}</p>
                <p className="mt-1 text-xs text-ink-faint">Wyświetlenia</p>
              </div>
              <div className="ticket p-4 text-center">
                <p className="tabular font-display text-2xl text-rust">{leads}</p>
                <p className="mt-1 text-xs text-ink-faint">Leady</p>
              </div>
              <div className="ticket p-4 text-center">
                <p className="tabular font-display text-2xl text-rust">{conversion}%</p>
                <p className="mt-1 text-xs text-ink-faint">Konwersja</p>
              </div>
            </div>
            {topDomains.length > 0 && (
              <div className="ticket-dashed p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
                  Aktywny na domenach
                </p>
                <ul className="space-y-1">
                  {topDomains.map(([domain, count]) => (
                    <li key={domain} className="flex items-center justify-between text-sm">
                      <span className="tabular text-ink-soft">{domain}</span>
                      <span className="tabular text-ink-faint">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

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
              {questions.map((question, index) => (
                <li key={question.id} className="ticket flex gap-3 p-4">
                  <div className="flex shrink-0 flex-col gap-0.5 pt-0.5">
                    <form action={moveQuestion.bind(null, calculator.id, question.id, "up")}>
                      <button
                        type="submit"
                        disabled={index === 0}
                        aria-label="Przenieś wyżej"
                        className="rounded p-1 text-ink-faint hover:text-ink disabled:opacity-20"
                      >
                        <ChevronUpIcon className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={moveQuestion.bind(null, calculator.id, question.id, "down")}>
                      <button
                        type="submit"
                        disabled={index === questions.length - 1}
                        aria-label="Przenieś niżej"
                        className="rounded p-1 text-ink-faint hover:text-ink disabled:opacity-20"
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  <div className="min-w-0 flex-1">
                    <EditQuestionForm calculatorId={calculator.id} question={question} />

                    {question.type !== "number_slider" && (
                      <div className="mt-4 space-y-2 border-t border-dashed border-line-strong pt-4">
                        <ul className="space-y-2">
                          {[...question.options]
                            .sort((a, b) => a.position - b.position)
                            .map((option) => (
                              <li key={option.id}>
                                <EditOptionForm
                                  calculatorId={calculator.id}
                                  option={option}
                                  currency={calculator.currency}
                                />
                              </li>
                            ))}
                        </ul>
                        <AddOptionForm calculatorId={calculator.id} questionId={question.id} />
                      </div>
                    )}
                  </div>
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

        <div className="xl:sticky xl:top-10 xl:self-start">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Podgląd na żywo
          </p>
          <div className="flex justify-center">
            <AdminCalculatorPreview key={JSON.stringify(previewConfig)} config={previewConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
