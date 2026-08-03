"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { deleteOption, updateOption, type ActionState } from "@/lib/actions/calculators";
import type { RawOption } from "@/lib/calculator/mapper";

const initialState: ActionState = { error: null };

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
        <span className="tabular text-ink-soft">
          {option.label} ({option.price_delta} {currency}
          {option.price_multiplier !== 1 ? ` · ×${option.price_multiplier}` : ""})
        </span>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="link-underline text-xs text-ink-soft hover:text-ink"
          >
            Edytuj
          </button>
          <form action={deleteOption.bind(null, calculatorId, option.id)}>
            <button type="submit" className="link-underline text-xs text-rust-dark">
              Usuń
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form action={formAction} className="flex flex-wrap items-end gap-2">
        <label className="flex-1 text-xs text-ink-faint">
          Opcja
          <input name="label" required defaultValue={option.label} className="field mt-1 py-1.5" />
        </label>
        <label className="text-xs text-ink-faint">
          Dopłata
          <InfoTooltip text="Kwota doliczana do wyceny, jeśli klient wybierze tę opcję. Może być ujemna (rabat)." />
          <input
            name="price_delta"
            type="number"
            step="0.01"
            defaultValue={option.price_delta}
            className="field tabular mt-1 w-24 py-1.5"
          />
        </label>
        <label className="text-xs text-ink-faint">
          Mnożnik
          <InfoTooltip text="Przemnaża całą dotychczasową sumę. 1 = bez zmian, 0.8 = 20% taniej." />
          <input
            name="price_multiplier"
            type="number"
            step="0.01"
            defaultValue={option.price_multiplier}
            className="field tabular mt-1 w-20 py-1.5"
          />
        </label>
        <button type="submit" disabled={pending} className="btn btn-primary px-3 py-1.5 text-xs">
          {pending ? "…" : "Zapisz"}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          disabled={pending}
          className="btn btn-ghost px-3 py-1.5 text-xs"
        >
          Anuluj
        </button>
      </form>
      {state.error && <p className="mt-1 text-xs text-rust-dark">{state.error}</p>}
    </div>
  );
}
