import { useEffect, useState } from "preact/hooks";
import type { Answer, AnswersMap, CalculatorConfig, CalculatorQuestion } from "../../src/lib/calculator/types";
import { fetchCalculatorConfig, submitLead, type LeadEstimate } from "./api";
import { QuestionInput } from "./QuestionInput";

interface Props {
  apiBase: string;
  slug: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; config: CalculatorConfig };

export function App({ apiBase, slug }: Props) {
  const [load, setLoad] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchCalculatorConfig(apiBase, slug)
      .then((config) => {
        if (!cancelled) setLoad({ status: "ready", config });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoad({
            status: "error",
            message: err instanceof Error ? err.message : "Nie udało się wczytać kalkulatora.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [apiBase, slug]);

  if (load.status === "loading") {
    return <div class="wk-widget wk-center">Ładowanie kalkulatora…</div>;
  }
  if (load.status === "error") {
    return <div class="wk-widget wk-center wk-error">{load.message}</div>;
  }
  return <Calculator apiBase={apiBase} slug={slug} config={load.config} />;
}

function initialAnswer(question: CalculatorQuestion): Answer | undefined {
  if (question.type === "number_slider") {
    return { questionId: question.id, type: "number_slider", value: question.config.min };
  }
  return undefined;
}

function isLeadValid(lead: { name: string; email: string; phone: string }): boolean {
  return (
    lead.name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) &&
    lead.phone.trim().length > 0
  );
}

function canAdvance(question: CalculatorQuestion | null, answers: AnswersMap): boolean {
  if (!question || !question.required) return true;
  const answer = answers[question.id];
  if (!answer) return false;
  if (answer.type === "checkbox") return answer.optionIds.length > 0;
  if (answer.type === "single_choice") return Boolean(answer.optionId);
  return true;
}

function Calculator({ apiBase, slug, config }: { apiBase: string; slug: string; config: CalculatorConfig }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>(() => {
    const initial: AnswersMap = {};
    for (const question of config.questions) {
      const answer = initialAnswer(question);
      if (answer) initial[question.id] = answer;
    }
    return initial;
  });
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<LeadEstimate | null>(null);

  const totalSteps = config.questions.length + 1;
  const isLeadStep = stepIndex === config.questions.length;
  const question = isLeadStep ? null : config.questions[stepIndex];
  const progressPct = result ? 100 : Math.round((stepIndex / totalSteps) * 100);

  function setAnswer(questionId: string, answer: Answer) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  function handleNext() {
    if (!canAdvance(question, answers)) return;
    setStepIndex((i) => i + 1);
  }

  function handleBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!isLeadValid(lead) || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const estimate = await submitLead(apiBase, slug, { ...lead, answers });
      setResult(estimate);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Nie udało się wysłać formularza.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div class="wk-widget wk-result">
        <div class="wk-progress">
          <div class="wk-progress-bar" style={{ width: "100%" }} />
        </div>
        <span class="wk-result-label">Szacunkowa wycena</span>
        <p class="wk-price">
          {result.min.toLocaleString("pl-PL")}–{result.max.toLocaleString("pl-PL")} {result.currency}
        </p>
        <p class="wk-hint">Dokładną wycenę prześlemy na podany adres e-mail.</p>
      </div>
    );
  }

  return (
    <div class="wk-widget">
      <div class="wk-progress">
        <div class="wk-progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      {isLeadStep ? (
        <form class="wk-step" onSubmit={handleSubmit}>
          <h3>{config.name}</h3>
          <p class="wk-hint">Podaj dane kontaktowe, aby zobaczyć szacunkową wycenę.</p>
          <label>
            Imię
            <input
              type="text"
              required
              value={lead.name}
              onInput={(e) => setLead((p) => ({ ...p, name: (e.target as HTMLInputElement).value }))}
            />
          </label>
          <label>
            E-mail
            <input
              type="email"
              required
              value={lead.email}
              onInput={(e) => setLead((p) => ({ ...p, email: (e.target as HTMLInputElement).value }))}
            />
          </label>
          <label>
            Telefon
            <input
              type="tel"
              required
              value={lead.phone}
              onInput={(e) => setLead((p) => ({ ...p, phone: (e.target as HTMLInputElement).value }))}
            />
          </label>
          {submitError && <p class="wk-error">{submitError}</p>}
          <div class="wk-actions">
            <button type="button" class="wk-btn wk-btn-secondary" onClick={handleBack}>
              Wstecz
            </button>
            <button type="submit" class="wk-btn wk-btn-primary" disabled={!isLeadValid(lead) || submitting}>
              {submitting ? "Wysyłanie…" : "Pokaż wycenę"}
            </button>
          </div>
        </form>
      ) : (
        <div class="wk-step">
          <h3>{question!.label}</h3>
          <QuestionInput
            question={question!}
            answer={answers[question!.id]}
            onChange={(answer) => setAnswer(question!.id, answer)}
          />
          <div class="wk-actions">
            <button type="button" class="wk-btn wk-btn-secondary" onClick={handleBack} disabled={stepIndex === 0}>
              Wstecz
            </button>
            <button type="button" class="wk-btn wk-btn-primary" onClick={handleNext} disabled={!canAdvance(question, answers)}>
              Dalej
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
