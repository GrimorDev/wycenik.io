"use client";

import { useActionState, useState } from "react";
import { addQuestion, type ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

export function AddQuestionForm({ calculatorId }: { calculatorId: string }) {
  const action = addQuestion.bind(null, calculatorId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [type, setType] = useState<"number_slider" | "single_choice" | "checkbox">("single_choice");

  return (
    <form action={formAction} className="ticket-dashed space-y-3 p-4">
      <p className="stamp text-rust">Dodaj pytanie</p>
      <label className="block text-sm text-ink-soft">
        Treść pytania
        <input name="label" required className="field mt-1" />
      </label>
      <div className="flex items-end gap-4">
        <label className="block text-sm text-ink-soft">
          Typ
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="field mt-1"
          >
            <option value="single_choice">Jednokrotny wybór</option>
            <option value="checkbox">Checkboxy (wielokrotny wybór)</option>
            <option value="number_slider">Suwak liczbowy</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pb-2.5 text-sm text-ink-soft">
          <input type="checkbox" name="required" defaultChecked className="accent-rust" />
          Wymagane
        </label>
      </div>

      {type === "number_slider" && (
        <div className="grid grid-cols-4 gap-3">
          <label className="text-sm text-ink-soft">
            Min
            <input name="min" type="number" defaultValue={0} className="field tabular mt-1" />
          </label>
          <label className="text-sm text-ink-soft">
            Max
            <input name="max" type="number" defaultValue={100} className="field tabular mt-1" />
          </label>
          <label className="text-sm text-ink-soft">
            Krok
            <input name="step" type="number" defaultValue={1} className="field tabular mt-1" />
          </label>
          <label className="text-sm text-ink-soft">
            Cena / jednostkę
            <input name="price_per_unit" type="number" step="0.01" defaultValue={0} className="field tabular mt-1" />
          </label>
          <label className="col-span-4 text-sm text-ink-soft">
            Jednostka (np. m2)
            <input name="unit" className="field mt-1" />
          </label>
        </div>
      )}

      {state.error && <p className="text-sm text-rust-dark">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-ghost">
        {pending ? "Dodawanie…" : "Dodaj pytanie"}
      </button>
    </form>
  );
}
