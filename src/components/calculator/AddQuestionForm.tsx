"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { addQuestion, type ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

const FIELD_CLASS =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20";

export function AddQuestionForm({ calculatorId }: { calculatorId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const action = addQuestion.bind(null, calculatorId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [type, setType] = useState<"number_slider" | "single_choice" | "checkbox">("single_choice");
  const wasPending = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      formRef.current?.reset();
      setType("single_choice");
      setIsAdding(false);
    }
    wasPending.current = pending;
  }, [pending, state.error]);

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="flex w-full items-center justify-center rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-brand-accent hover:text-brand-accent"
      >
        + Dodaj pytanie
      </button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">Dodaj pytanie</p>
      <label className="block text-sm text-slate-600">
        Treść pytania
        <input name="label" required className={`mt-1 ${FIELD_CLASS}`} />
      </label>
      <label className="block text-sm text-slate-600">
        Podpowiedź dla klienta
        <InfoTooltip text="Krótki opis wyświetlany pod pytaniem w widgecie, np. „Podaj powierzchnię użytkową”. Opcjonalne." />
        <input name="hint" placeholder="np. Podaj powierzchnię użytkową" className={`mt-1 ${FIELD_CLASS}`} />
      </label>
      <div className="flex items-end gap-4">
        <label className="block text-sm text-slate-600">
          Typ
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className={`mt-1 ${FIELD_CLASS}`}
          >
            <option value="single_choice">Wybór jednokrotny</option>
            <option value="checkbox">Wybór wielokrotny</option>
            <option value="number_slider">Suwak / zakres</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pb-2.5 text-sm text-slate-600">
          <input type="checkbox" name="required" defaultChecked className="accent-brand-accent" />
          Wymagane
        </label>
      </div>

      {type === "number_slider" && (
        <div className="grid grid-cols-4 gap-3">
          <label className="text-sm text-slate-500">
            Min
            <input name="min" type="number" defaultValue={0} className={`tabular mt-1 ${FIELD_CLASS}`} />
          </label>
          <label className="text-sm text-slate-500">
            Max
            <input name="max" type="number" defaultValue={100} className={`tabular mt-1 ${FIELD_CLASS}`} />
          </label>
          <label className="text-sm text-slate-500">
            Krok
            <input name="step" type="number" defaultValue={1} className={`tabular mt-1 ${FIELD_CLASS}`} />
          </label>
          <label className="text-sm text-slate-500">
            Cena / jednostkę
            <input name="price_per_unit" type="number" step="0.01" defaultValue={0} className={`tabular mt-1 ${FIELD_CLASS}`} />
          </label>
          <label className="col-span-4 text-sm text-slate-500">
            Jednostka (np. m2)
            <input name="unit" className={`mt-1 ${FIELD_CLASS}`} />
          </label>
        </div>
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-brand-accent px-4 py-2 text-sm font-medium text-brand-accent-ink hover:bg-brand-accent-hover disabled:opacity-60"
        >
          {pending ? "Dodawanie…" : "Dodaj pytanie"}
        </button>
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          disabled={pending}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
        >
          Anuluj
        </button>
      </div>
    </form>
  );
}
