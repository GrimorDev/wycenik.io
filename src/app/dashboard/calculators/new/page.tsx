"use client";

import { useActionState } from "react";
import { createCalculator, type ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

export default function NewCalculatorPage() {
  const [state, formAction, pending] = useActionState(createCalculator, initialState);

  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-6 font-display text-3xl">Nowy kalkulator</h1>
      <form action={formAction} className="ticket space-y-4 p-6">
        <label className="block text-sm text-ink-soft">
          Nazwa
          <input name="name" required className="field mt-1" />
        </label>
        <label className="block text-sm text-ink-soft">
          Slug (adres w widgecie, np. sprzatanie)
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Małe litery, cyfry i myślniki"
            className="field tabular mt-1"
          />
        </label>
        <label className="block text-sm text-ink-soft">
          Cena bazowa (PLN)
          <input name="base_price" type="number" step="0.01" defaultValue={0} className="field tabular mt-1" />
        </label>
        {state.error && <p className="text-sm text-rust-dark">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? "Tworzenie…" : "Utwórz kalkulator"}
        </button>
      </form>
    </div>
  );
}
