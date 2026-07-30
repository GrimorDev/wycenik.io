"use client";

import { useActionState } from "react";
import { updateCalculatorDetails, type ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

interface Props {
  calculatorId: string;
  name: string;
  description: string | null;
  basePrice: number;
  currency: string;
  estimateSpreadPercent: number;
}

export function DetailsForm({
  calculatorId,
  name,
  description,
  basePrice,
  currency,
  estimateSpreadPercent,
}: Props) {
  const action = updateCalculatorDetails.bind(null, calculatorId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        Nazwa
        <input
          name="name"
          required
          defaultValue={name}
          className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
        />
      </label>
      <label className="block text-sm">
        Opis (opcjonalnie)
        <textarea
          name="description"
          defaultValue={description ?? ""}
          rows={2}
          className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
        />
      </label>
      <div className="grid grid-cols-3 gap-4">
        <label className="block text-sm">
          Cena bazowa
          <input
            name="base_price"
            type="number"
            step="0.01"
            defaultValue={basePrice}
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
        </label>
        <label className="block text-sm">
          Waluta
          <input
            name="currency"
            defaultValue={currency}
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
        </label>
        <label className="block text-sm">
          Widełki wyceny (%)
          <input
            name="estimate_spread_percent"
            type="number"
            step="1"
            min="0"
            max="100"
            defaultValue={Math.round(estimateSpreadPercent * 100)}
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
        </label>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {pending ? "Zapisywanie…" : "Zapisz zmiany"}
      </button>
    </form>
  );
}
