"use client";

import { useActionState } from "react";
import { InfoTooltip } from "@/components/InfoTooltip";
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
      <label className="block text-sm text-ink-soft">
        Nazwa
        <input name="name" required defaultValue={name} className="field mt-1" />
      </label>
      <label className="block text-sm text-ink-soft">
        Opis (opcjonalnie)
        <textarea name="description" defaultValue={description ?? ""} rows={2} className="field mt-1" />
      </label>
      <div className="grid grid-cols-3 gap-4">
        <label className="block text-sm text-ink-soft">
          Cena bazowa
          <InfoTooltip text="Minimalna kwota, od której zaczynasz wycenę — np. koszt dojazdu lub minimalna wartość zlecenia." />
          <input name="base_price" type="number" step="0.01" defaultValue={basePrice} className="field tabular mt-1" />
        </label>
        <label className="block text-sm text-ink-soft">
          Waluta
          <input name="currency" defaultValue={currency} className="field tabular mt-1" />
        </label>
        <label className="block text-sm text-ink-soft">
          Widełki wyceny (%)
          <InfoTooltip text="Zalecane 10–15%. Klienci chętniej zostawiają kontakt, widząc przedział cenowy (np. 1500–1800 zł), niż jedną sztywną kwotę." />
          <input
            name="estimate_spread_percent"
            type="number"
            step="1"
            min="0"
            max="100"
            defaultValue={Math.round(estimateSpreadPercent * 100)}
            className="field tabular mt-1"
          />
        </label>
      </div>

      {state.error && <p className="text-sm text-rust-dark">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Zapisywanie…" : "Zapisz zmiany"}
      </button>
    </form>
  );
}
