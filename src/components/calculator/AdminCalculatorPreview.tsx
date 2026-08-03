"use client";

import { useState } from "react";
import { calculatePrice } from "@/lib/calculator/engine";
import type {
  Answer,
  AnswersMap,
  CalculatorConfig,
  CalculatorQuestion,
} from "@/lib/calculator/types";

const RADIUS_MAP: Record<CalculatorConfig["cornerStyle"], string> = {
  sharp: "4px",
  rounded: "14px",
  soft: "28px",
};

function initialAnswer(question: CalculatorQuestion): Answer | undefined {
  if (question.type === "number_slider") {
    return { questionId: question.id, type: "number_slider", value: question.config.min };
  }
  return undefined;
}

function canAdvance(question: CalculatorQuestion | null, answers: AnswersMap): boolean {
  if (!question || !question.required) return true;
  const answer = answers[question.id];
  if (!answer) return false;
  if (answer.type === "checkbox") return answer.optionIds.length > 0;
  if (answer.type === "single_choice") return Boolean(answer.optionId);
  return true;
}

function CheckIcon() {
  return (
    <svg className="wk-check" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PreviewQuestionInput({
  question,
  answer,
  onChange,
}: {
  question: CalculatorQuestion;
  answer?: Answer;
  onChange: (answer: Answer) => void;
}) {
  if (question.type === "number_slider") {
    const value = answer?.type === "number_slider" ? answer.value : question.config.min;
    return (
      <div className="wk-slider">
        <input
          type="range"
          min={question.config.min}
          max={question.config.max}
          step={question.config.step}
          value={value}
          onChange={(e) =>
            onChange({ questionId: question.id, type: "number_slider", value: Number(e.target.value) })
          }
        />
        <div className="wk-slider-value">
          {value}
          {question.config.unit ? ` ${question.config.unit}` : ""}
        </div>
      </div>
    );
  }

  if (question.type === "single_choice") {
    const selected = answer?.type === "single_choice" ? answer.optionId : undefined;
    return (
      <div className="wk-options">
        {question.options.map((option) => (
          <label
            key={option.id}
            className={`wk-option${selected === option.id ? " wk-option-selected" : ""}`}
          >
            <input
              type="radio"
              name={question.id}
              className="wk-option-input"
              checked={selected === option.id}
              onChange={() =>
                onChange({ questionId: question.id, type: "single_choice", optionId: option.id })
              }
            />
            <span className="wk-option-indicator">
              <CheckIcon />
            </span>
            <span className="wk-option-label">{option.label}</span>
          </label>
        ))}
      </div>
    );
  }

  const selectedIds = answer?.type === "checkbox" ? answer.optionIds : [];
  return (
    <div className="wk-options">
      {question.options.map((option) => {
        const checked = selectedIds.includes(option.id);
        return (
          <label key={option.id} className={`wk-option${checked ? " wk-option-selected" : ""}`}>
            <input
              type="checkbox"
              className="wk-option-input"
              checked={checked}
              onChange={() => {
                const next = checked
                  ? selectedIds.filter((id) => id !== option.id)
                  : [...selectedIds, option.id];
                onChange({ questionId: question.id, type: "checkbox", optionIds: next });
              }}
            />
            <span className="wk-option-indicator wk-option-indicator-square">
              <CheckIcon />
            </span>
            <span className="wk-option-label">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function AdminCalculatorPreview({ config }: { config: CalculatorConfig }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>(() => {
    const initial: AnswersMap = {};
    for (const q of config.questions) {
      const a = initialAnswer(q);
      if (a) initial[q.id] = a;
    }
    return initial;
  });
  const [showResult, setShowResult] = useState(false);

  const radius = RADIUS_MAP[config.cornerStyle] ?? RADIUS_MAP.rounded;
  const style = {
    "--wk-rust": config.accentColor,
    "--wk-radius": radius,
    "--wk-paper": config.bgColor ?? "#ffffff",
    "--wk-ink": config.textColor ?? "#1e1b16",
    "--wk-line": config.borderColor ?? "#e4dac5",
  } as React.CSSProperties;

  if (config.questions.length === 0) {
    return (
      <div className="wk-widget wk-center" style={style}>
        Dodaj przynajmniej jedno pytanie, aby zobaczyć podgląd.
      </div>
    );
  }

  const question = config.questions[stepIndex] ?? null;

  function setAnswer(questionId: string, answer: Answer) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  function handleNext() {
    if (!canAdvance(question, answers)) return;
    if (stepIndex === config.questions.length - 1) {
      setShowResult(true);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function handleBack() {
    if (showResult) {
      setShowResult(false);
      return;
    }
    setStepIndex((i) => Math.max(0, i - 1));
  }

  if (showResult) {
    let estimate: ReturnType<typeof calculatePrice> | null;
    try {
      estimate = calculatePrice(config, answers);
    } catch {
      estimate = null;
    }

    return (
      <div className="wk-widget wk-result" style={style}>
        <div className="wk-progress">
          <div className="wk-progress-bar" style={{ width: "100%" }} />
        </div>
        <span className="wk-result-label">Szacunkowa wycena</span>
        <p className="wk-price">
          {estimate
            ? `Od ${estimate.min.toLocaleString("pl-PL")} do ${estimate.max.toLocaleString("pl-PL")} ${estimate.currency}`
            : "—"}
        </p>
        <button
          type="button"
          className="wk-btn wk-btn-secondary"
          onClick={() => {
            setShowResult(false);
            setStepIndex(0);
          }}
          style={{ marginTop: 12 }}
        >
          Od nowa
        </button>
      </div>
    );
  }

  const progressPct = Math.round((stepIndex / config.questions.length) * 100);

  return (
    <div className="wk-widget" style={style}>
      <div className="wk-progress-row">
        <span>
          Pytanie {stepIndex + 1} z {config.questions.length}
        </span>
        <span className="wk-progress-pct">{progressPct}%</span>
      </div>
      <div className="wk-progress">
        <div className="wk-progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="wk-step">
        <h3>{question!.label}</h3>
        <PreviewQuestionInput
          question={question!}
          answer={answers[question!.id]}
          onChange={(answer) => setAnswer(question!.id, answer)}
        />
        <div className="wk-actions">
          <button
            type="button"
            className="wk-btn wk-btn-secondary"
            onClick={handleBack}
            disabled={stepIndex === 0}
          >
            Wstecz
          </button>
          <button
            type="button"
            className="wk-btn wk-btn-primary"
            onClick={handleNext}
            disabled={!canAdvance(question, answers)}
          >
            {stepIndex === config.questions.length - 1 ? "Pokaż wycenę" : "Dalej"}
          </button>
        </div>
      </div>
    </div>
  );
}
