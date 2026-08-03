"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { addOption, type ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

const FIELD_CLASS =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20";

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
      <button type="button" onClick={() => setIsAdding(true)} className="text-sm font-medium text-brand-accent hover:text-brand-accent-hover">
        + Dodaj opcję
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
      <form ref={formRef} action={formAction} className="space-y-3">
        <label className="block text-sm text-slate-600">
          Opcja
          <input name="label" required className={`mt-1 ${FIELD_CLASS}`} />
        </label>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm text-slate-600">
            Dopłata
            <InfoTooltip text="Kwota doliczana do wyceny, jeśli klient wybierze tę opcję. Może być ujemna (rabat)." />
            <input
              name="price_delta"
              type="number"
              step="0.01"
              defaultValue={0}
              className={`tabular mt-1 w-24 ${FIELD_CLASS}`}
            />
          </label>
          <label className="text-sm text-slate-600">
            Mnożnik
            <InfoTooltip text="Przemnaża całą dotychczasową sumę. 1 = bez zmian, 0.8 = 20% taniej, 1.5 = 50% drożej. Zostaw 1, jeśli nie wiesz, po co to jest." />
            <input
              name="price_multiplier"
              type="number"
              step="0.01"
              defaultValue={1}
              className={`tabular mt-1 w-20 ${FIELD_CLASS}`}
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded-[10px] bg-brand-accent px-3 py-1.5 text-xs font-medium text-brand-accent-ink hover:bg-brand-accent-hover disabled:opacity-60"
          >
            {pending ? "Dodawanie…" : "Dodaj opcję"}
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            disabled={pending}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400"
          >
            Anuluj
          </button>
        </div>
      </form>
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </div>
  );
}
