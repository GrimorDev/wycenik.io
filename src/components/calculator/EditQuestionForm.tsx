"use client";

import { useActionState } from "react";
import { updateQuestion, type ActionState } from "@/lib/actions/calculators";
import type { RawQuestion } from "@/lib/calculator/mapper";

const initialState: ActionState = { error: null };

export function EditQuestionForm({
  calculatorId,
  question,
}: {
  calculatorId: string;
  question: RawQuestion;
}) {
  const action = updateQuestion.bind(null, calculatorId, question.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="type" value={question.type} />
      <div className="flex flex-wrap items-center gap-3">
        <input name="label" required defaultValue={question.label} className="field flex-1" />
        <label className="flex items-center gap-2 whitespace-nowrap text-sm text-ink-soft">
          <input type="checkbox" name="required" defaultChecked={question.required} className="accent-rust" />
          Wymagane
        </label>
      </div>

      {question.type === "number_slider" && (
        <div className="grid grid-cols-4 gap-3">
          <label className="text-sm text-ink-soft">
            Min
            <input name="min" type="number" defaultValue={Number(question.config.min)} className="field tabular mt-1" />
          </label>
          <label className="text-sm text-ink-soft">
            Max
            <input name="max" type="number" defaultValue={Number(question.config.max)} className="field tabular mt-1" />
          </label>
          <label className="text-sm text-ink-soft">
            Krok
            <input name="step" type="number" defaultValue={Number(question.config.step)} className="field tabular mt-1" />
          </label>
          <label className="text-sm text-ink-soft">
            Cena / jednostkę
            <input
              name="price_per_unit"
              type="number"
              step="0.01"
              defaultValue={Number(question.config.pricePerUnit)}
              className="field tabular mt-1"
            />
          </label>
          <label className="col-span-4 text-sm text-ink-soft">
            Jednostka (np. m2)
            <input name="unit" defaultValue={String(question.config.unit ?? "")} className="field mt-1" />
          </label>
        </div>
      )}

      {state.error && <p className="text-sm text-rust-dark">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-ghost px-3 py-1.5 text-xs">
        {pending ? "Zapisywanie…" : "Zapisz pytanie"}
      </button>
    </form>
  );
}
