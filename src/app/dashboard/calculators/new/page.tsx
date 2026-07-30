"use client";

import { useActionState } from "react";
import { createCalculator, type ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

export default function NewCalculatorPage() {
  const [state, formAction, pending] = useActionState(createCalculator, initialState);

  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold">Nowy kalkulator</h1>
      <form action={formAction} className="space-y-4">
        <label className="block text-sm">
          Nazwa
          <input
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
        </label>
        <label className="block text-sm">
          Slug (adres w widgecie, np. sprzatanie)
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Małe litery, cyfry i myślniki"
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
        </label>
        <label className="block text-sm">
          Cena bazowa (PLN)
          <input
            name="base_price"
            type="number"
            step="0.01"
            defaultValue={0}
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
        </label>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {pending ? "Tworzenie…" : "Utwórz kalkulator"}
        </button>
      </form>
    </div>
  );
}
