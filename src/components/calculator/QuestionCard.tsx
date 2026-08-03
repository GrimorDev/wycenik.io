"use client";

import { useState } from "react";
import { AddOptionForm } from "@/components/calculator/AddOptionForm";
import { EditOptionForm } from "@/components/calculator/EditOptionForm";
import { EditQuestionForm } from "@/components/calculator/EditQuestionForm";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "@/components/icons";
import { deleteQuestion, moveQuestion } from "@/lib/actions/calculators";
import type { RawQuestion } from "@/lib/calculator/mapper";

function summaryPill(question: RawQuestion, currency: string): string {
  if (question.type === "number_slider") {
    const unit = typeof question.config.unit === "string" && question.config.unit ? question.config.unit : "jedn.";
    return `${String(question.config.pricePerUnit)} ${currency} / ${unit}`;
  }
  return `${question.options.length} ${question.options.length === 1 ? "opcja" : "opcji"}`;
}

export function QuestionCard({
  calculatorId,
  question,
  currency,
  index,
  isFirst,
  isLast,
}: {
  calculatorId: string;
  question: RawQuestion;
  currency: string;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const hasOptions = question.type !== "number_slider";
  const sortedOptions = [...question.options].sort((a, b) => a.position - b.position);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 p-4">
        <div className="flex shrink-0 flex-col gap-0.5">
          <form action={moveQuestion.bind(null, calculatorId, question.id, "up")}>
            <button
              type="submit"
              disabled={isFirst}
              aria-label="Przenieś wyżej"
              className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-30"
            >
              <ChevronUpIcon className="h-3.5 w-3.5" />
            </button>
          </form>
          <form action={moveQuestion.bind(null, calculatorId, question.id, "down")}>
            <button
              type="submit"
              disabled={isLast}
              aria-label="Przenieś niżej"
              className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-30"
            >
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <EditQuestionForm calculatorId={calculatorId} question={question} />
        </div>

        <span className="tabular hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 sm:inline-block">
          {summaryPill(question, currency)}
        </span>

        <form action={deleteQuestion.bind(null, calculatorId, question.id)}>
          <button
            type="submit"
            aria-label="Usuń pytanie"
            className="shrink-0 rounded-md p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </form>

        {hasOptions && (
          <button
            type="button"
            onClick={() => setOptionsOpen((v) => !v)}
            aria-label={optionsOpen ? "Zwiń opcje" : "Pokaż opcje"}
            className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            {optionsOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        )}
      </div>

      {hasOptions && optionsOpen && (
        <div className="space-y-2 border-t border-slate-100 p-4">
          <ul className="space-y-2">
            {sortedOptions.map((option) => (
              <li key={option.id}>
                <EditOptionForm calculatorId={calculatorId} option={option} currency={currency} />
              </li>
            ))}
          </ul>
          <AddOptionForm calculatorId={calculatorId} questionId={question.id} />
        </div>
      )}
    </div>
  );
}
