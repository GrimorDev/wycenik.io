"use client";

import { useActionState } from "react";
import { addOption, type ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

export function AddOptionForm({
  calculatorId,
  questionId,
}: {
  calculatorId: string;
  questionId: string;
}) {
  const action = addOption.bind(null, calculatorId, questionId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="text-sm">
        Opcja
        <input
          name="label"
          required
          className="mt-1 rounded-lg border border-black/10 bg-transparent px-2 py-1.5 text-sm dark:border-white/10"
        />
      </label>
      <label className="text-sm">
        Dopłata
        <input
          name="price_delta"
          type="number"
          step="0.01"
          defaultValue={0}
          className="mt-1 w-24 rounded-lg border border-black/10 bg-transparent px-2 py-1.5 text-sm dark:border-white/10"
        />
      </label>
      <label className="text-sm">
        Mnożnik
        <input
          name="price_multiplier"
          type="number"
          step="0.01"
          defaultValue={1}
          className="mt-1 w-20 rounded-lg border border-black/10 bg-transparent px-2 py-1.5 text-sm dark:border-white/10"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-black/20 px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
      >
        {pending ? "Dodawanie…" : "Dodaj opcję"}
      </button>
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
