"use client";

import { useActionState, useState } from "react";
import { addQuestion, type ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

export function AddQuestionForm({ calculatorId }: { calculatorId: string }) {
  const action = addQuestion.bind(null, calculatorId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [type, setType] = useState<"number_slider" | "single_choice" | "checkbox">("single_choice");

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-dashed border-black/20 p-4 dark:border-white/20">
      <p className="text-sm font-medium">Dodaj pytanie</p>
      <label className="block text-sm">
        Treść pytania
        <input
          name="label"
          required
          className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
        />
      </label>
      <div className="flex items-end gap-4">
        <label className="block text-sm">
          Typ
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="mt-1 rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          >
            <option value="single_choice">Jednokrotny wybór</option>
            <option value="checkbox">Checkboxy (wielokrotny wybór)</option>
            <option value="number_slider">Suwak liczbowy</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pb-2.5 text-sm">
          <input type="checkbox" name="required" defaultChecked />
          Wymagane
        </label>
      </div>

      {type === "number_slider" && (
        <div className="grid grid-cols-4 gap-3">
          <label className="text-sm">
            Min
            <input name="min" type="number" defaultValue={0} className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
          </label>
          <label className="text-sm">
            Max
            <input name="max" type="number" defaultValue={100} className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
          </label>
          <label className="text-sm">
            Krok
            <input name="step" type="number" defaultValue={1} className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
          </label>
          <label className="text-sm">
            Cena / jednostkę
            <input name="price_per_unit" type="number" step="0.01" defaultValue={0} className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
          </label>
          <label className="col-span-4 text-sm">
            Jednostka (np. m2)
            <input name="unit" className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
          </label>
        </div>
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
      >
        {pending ? "Dodawanie…" : "Dodaj pytanie"}
      </button>
    </form>
  );
}
