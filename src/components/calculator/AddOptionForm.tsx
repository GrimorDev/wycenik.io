"use client";

import { useActionState } from "react";
import { InfoTooltip } from "@/components/InfoTooltip";
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
      <label className="text-sm text-ink-soft">
        Opcja
        <input name="label" required className="field mt-1 py-1.5" />
      </label>
      <label className="text-sm text-ink-soft">
        Dopłata
        <InfoTooltip text="Kwota doliczana do wyceny, jeśli klient wybierze tę opcję. Może być ujemna (rabat)." />
        <input
          name="price_delta"
          type="number"
          step="0.01"
          defaultValue={0}
          className="field tabular mt-1 w-24 py-1.5"
        />
      </label>
      <label className="text-sm text-ink-soft">
        Mnożnik
        <InfoTooltip text="Przemnaża całą dotychczasową sumę. 1 = bez zmian, 0.8 = 20% taniej, 1.5 = 50% drożej. Zostaw 1, jeśli nie wiesz, po co to jest." />
        <input
          name="price_multiplier"
          type="number"
          step="0.01"
          defaultValue={1}
          className="field tabular mt-1 w-20 py-1.5"
        />
      </label>
      <button type="submit" disabled={pending} className="btn btn-ghost px-3 py-1.5">
        {pending ? "Dodawanie…" : "Dodaj opcję"}
      </button>
      {state.error && <p className="w-full text-sm text-rust-dark">{state.error}</p>}
    </form>
  );
}
