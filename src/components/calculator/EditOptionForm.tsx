"use client";

import { useActionState } from "react";
import { deleteOption, updateOption, type ActionState } from "@/lib/actions/calculators";
import type { RawOption } from "@/lib/calculator/mapper";

const initialState: ActionState = { error: null };

export function EditOptionForm({
  calculatorId,
  option,
}: {
  calculatorId: string;
  option: RawOption;
}) {
  const action = updateOption.bind(null, calculatorId, option.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-2">
        <form action={formAction} className="flex flex-1 flex-wrap items-end gap-2">
          <label className="flex-1 text-xs text-ink-faint">
            Opcja
            <input name="label" required defaultValue={option.label} className="field mt-1 py-1.5" />
          </label>
          <label className="text-xs text-ink-faint">
            Dopłata
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
            <input
              name="price_multiplier"
              type="number"
              step="0.01"
              defaultValue={option.price_multiplier}
              className="field tabular mt-1 w-20 py-1.5"
            />
          </label>
          <button type="submit" disabled={pending} className="btn btn-ghost px-3 py-1.5 text-xs">
            {pending ? "…" : "Zapisz"}
          </button>
        </form>
        <form action={deleteOption.bind(null, calculatorId, option.id)}>
          <button type="submit" className="link-underline px-1 py-1.5 text-xs text-rust-dark">
            Usuń
          </button>
        </form>
      </div>
      {state.error && <p className="mt-1 text-xs text-rust-dark">{state.error}</p>}
    </div>
  );
}
