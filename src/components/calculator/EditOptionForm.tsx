"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { deleteOption, updateOption, type ActionState } from "@/lib/actions/calculators";
import type { RawOption } from "@/lib/calculator/mapper";

const initialState: ActionState = { error: null };

const FIELD_CLASS =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20";

export function EditOptionForm({
  calculatorId,
  option,
  currency,
}: {
  calculatorId: string;
  option: RawOption;
  currency: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const action = updateOption.bind(null, calculatorId, option.id);
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
      <div className="flex items-center justify-between text-sm">
        <span className="tabular text-slate-600">
          {option.label} ({option.price_delta} {currency}
          {option.price_multiplier !== 1 ? ` · ×${option.price_multiplier}` : ""})
        </span>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Edytuj
          </button>
          <form action={deleteOption.bind(null, calculatorId, option.id)}>
            <button type="submit" className="text-xs font-medium text-red-600 hover:text-red-700">
              Usuń
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form action={formAction} className="space-y-2">
        <label className="block text-xs text-slate-500">
          Opcja
          <input name="label" required defaultValue={option.label} className={`mt-1 ${FIELD_CLASS}`} />
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-slate-500">
            Dopłata
            <InfoTooltip text="Kwota doliczana do wyceny, jeśli klient wybierze tę opcję. Może być ujemna (rabat)." />
            <input
              name="price_delta"
              type="number"
              step="0.01"
              defaultValue={option.price_delta}
              className={`tabular mt-1 w-24 ${FIELD_CLASS}`}
            />
          </label>
          <label className="text-xs text-slate-500">
            Mnożnik
            <InfoTooltip text="Przemnaża całą dotychczasową sumę. 1 = bez zmian, 0.8 = 20% taniej." />
            <input
              name="price_multiplier"
              type="number"
              step="0.01"
              defaultValue={option.price_multiplier}
              className={`tabular mt-1 w-20 ${FIELD_CLASS}`}
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded-[10px] bg-brand-accent px-3 py-1.5 text-xs font-medium text-brand-accent-ink hover:bg-brand-accent-hover disabled:opacity-60"
          >
            {pending ? "…" : "Zapisz"}
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
      {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
    </div>
  );
}
