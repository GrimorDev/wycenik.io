"use client";

import { useActionState } from "react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { updateCalculatorDetails, type ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

const FIELD_CLASS =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20";

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
      <label className="block text-sm text-slate-600">
        Nazwa
        <input name="name" required defaultValue={name} className={`mt-1 ${FIELD_CLASS}`} />
      </label>
      <label className="block text-sm text-slate-600">
        Opis (opcjonalnie)
        <textarea name="description" defaultValue={description ?? ""} rows={2} className={`mt-1 ${FIELD_CLASS}`} />
      </label>
      <div className="grid grid-cols-3 gap-4">
        <label className="block text-sm text-slate-600">
          Cena bazowa
          <InfoTooltip text="Minimalna kwota, od której zaczynasz wycenę — np. koszt dojazdu lub minimalna wartość zlecenia." />
          <input name="base_price" type="number" step="0.01" defaultValue={basePrice} className={`tabular mt-1 ${FIELD_CLASS}`} />
        </label>
        <label className="block text-sm text-slate-600">
          Waluta
          <input name="currency" defaultValue={currency} className={`tabular mt-1 ${FIELD_CLASS}`} />
        </label>
        <label className="block text-sm text-slate-600">
          Widełki wyceny (%)
          <InfoTooltip text="Zalecane 10–15%. Klienci chętniej zostawiają kontakt, widząc przedział cenowy (np. 1500–1800 zł), niż jedną sztywną kwotę." />
          <input
            name="estimate_spread_percent"
            type="number"
            step="1"
            min="0"
            max="100"
            defaultValue={Math.round(estimateSpreadPercent * 100)}
            className={`tabular mt-1 ${FIELD_CLASS}`}
          />
        </label>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-[10px] bg-brand-accent px-4 py-2 text-sm font-medium text-brand-accent-ink transition-colors hover:bg-brand-accent-hover disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : "Zapisz zmiany"}
      </button>
    </form>
  );
}
