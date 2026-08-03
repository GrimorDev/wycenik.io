"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { updateQuestion, type ActionState } from "@/lib/actions/calculators";
import type { RawQuestion } from "@/lib/calculator/mapper";

const initialState: ActionState = { error: null };

const QUESTION_TYPE_LABEL: Record<RawQuestion["type"], string> = {
  number_slider: "Suwak liczbowy",
  single_choice: "Jednokrotny wybór",
  checkbox: "Checkboxy",
};

const FIELD_CLASS =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20";

export function EditQuestionForm({
  calculatorId,
  question,
}: {
  calculatorId: string;
  question: RawQuestion;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const action = updateQuestion.bind(null, calculatorId, question.id);
  const [state, formAction, pending] = useActionState(action, initialState);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      setIsEditing(false);
    }
    wasPending.current = pending;
  }, [pending, state.error]);

  if (!isEditing) {
    return (
      <button type="button" onClick={() => setIsEditing(true)} className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-medium text-slate-900">{question.label}</p>
        <p className="text-xs text-slate-400">
          {QUESTION_TYPE_LABEL[question.type]} · {question.required ? "wymagane" : "opcjonalne"}
          {question.type === "number_slider" && (
            <>
              {" · "}
              Od {String(question.config.min)} do {String(question.config.max)}
              {question.config.unit ? ` ${question.config.unit}` : ""} · krok {String(question.config.step)}
            </>
          )}
        </p>
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="type" value={question.type} />
      <div className="flex flex-wrap items-center gap-3">
        <input name="label" required defaultValue={question.label} className={`${FIELD_CLASS} flex-1`} />
        <label className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-600">
          <input type="checkbox" name="required" defaultChecked={question.required} className="accent-brand-accent" />
          Wymagane
        </label>
      </div>

      {question.type === "number_slider" && (
        <div className="grid grid-cols-4 gap-3">
          <label className="text-sm text-slate-500">
            Min
            <input name="min" type="number" defaultValue={Number(question.config.min)} className={`tabular mt-1 ${FIELD_CLASS}`} />
          </label>
          <label className="text-sm text-slate-500">
            Max
            <input name="max" type="number" defaultValue={Number(question.config.max)} className={`tabular mt-1 ${FIELD_CLASS}`} />
          </label>
          <label className="text-sm text-slate-500">
            Krok
            <input name="step" type="number" defaultValue={Number(question.config.step)} className={`tabular mt-1 ${FIELD_CLASS}`} />
          </label>
          <label className="text-sm text-slate-500">
            Cena / jednostkę
            <input
              name="price_per_unit"
              type="number"
              step="0.01"
              defaultValue={Number(question.config.pricePerUnit)}
              className={`tabular mt-1 ${FIELD_CLASS}`}
            />
          </label>
          <label className="col-span-4 text-sm text-slate-500">
            Jednostka (np. m2)
            <input name="unit" defaultValue={String(question.config.unit ?? "")} className={`mt-1 ${FIELD_CLASS}`} />
          </label>
        </div>
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-brand-accent px-3 py-1.5 text-xs font-medium text-brand-accent-ink transition-colors hover:bg-brand-accent-hover disabled:opacity-60"
        >
          {pending ? "Zapisywanie…" : "Zapisz pytanie"}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          disabled={pending}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400"
        >
          Anuluj
        </button>
      </div>
    </form>
  );
}
