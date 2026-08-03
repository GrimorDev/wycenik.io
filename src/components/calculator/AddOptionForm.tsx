"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
  const [isAdding, setIsAdding] = useState(false);
  const action = addOption.bind(null, calculatorId, questionId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const wasPending = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      formRef.current?.reset();
      setIsAdding(false);
    }
    wasPending.current = pending;
  }, [pending, state.error]);

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="link-underline text-sm text-ink-soft hover:text-ink"
      >
        + Dodaj opcję
      </button>
    );
  }

  return (
    <div>
      <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
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
        <button type="submit" disabled={pending} className="btn btn-ghost px-3 py-1.5 text-xs">
          {pending ? "Dodawanie…" : "Dodaj opcję"}
        </button>
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          disabled={pending}
          className="btn btn-ghost px-3 py-1.5 text-xs"
        >
          Anuluj
        </button>
      </form>
      {state.error && <p className="mt-1 text-sm text-rust-dark">{state.error}</p>}
    </div>
  );
}
