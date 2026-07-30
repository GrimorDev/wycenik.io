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
  accentColor: string;
  locale: "pl" | "en";
}

export function DetailsForm({
  calculatorId,
  name,
  description,
  basePrice,
  currency,
  estimateSpreadPercent,
  accentColor,
  locale,
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
          <input name="base_price" type="number" step="0.01" defaultValue={basePrice} className="field tabular mt-1" />
        </label>
        <label className="block text-sm text-ink-soft">
          Waluta
          <input name="currency" defaultValue={currency} className="field tabular mt-1" />
        </label>
        <label className="block text-sm text-ink-soft">
          Widełki wyceny (%)
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

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">Wygląd widgetu</p>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm text-ink-soft">
            Kolor akcentu
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                name="accent_color"
                defaultValue={accentColor}
                className="h-9 w-12 cursor-pointer rounded-lg border border-line-strong bg-transparent p-1"
              />
              <span className="tabular text-xs text-ink-faint">{accentColor}</span>
            </div>
          </label>
          <label className="block text-sm text-ink-soft">
            Język widgetu
            <select name="locale" defaultValue={locale} className="field mt-1">
              <option value="pl">Polski</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>
      </div>

      {state.error && <p className="text-sm text-rust-dark">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Zapisywanie…" : "Zapisz zmiany"}
      </button>
    </form>
  );
}
