"use client";

import { useActionState, useState } from "react";
import { ArrowLeftIcon } from "@/components/icons";
import {
  createCalculator,
  createCalculatorFromTemplate,
  type ActionState,
} from "@/lib/actions/calculators";
import { CALCULATOR_TEMPLATES } from "@/lib/calculator/templates";

const initialState: ActionState = { error: null };

type Selection = { kind: "blank" } | { kind: "template"; key: string };

export default function NewCalculatorPage() {
  const [selection, setSelection] = useState<Selection | null>(null);

  if (!selection) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="mb-2 font-display text-3xl">Nowy kalkulator</h1>
        <p className="mb-8 text-sm text-ink-soft">
          Zacznij od gotowego szablonu — zmienisz tylko ceny — albo od pustej kartki.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CALCULATOR_TEMPLATES.map((template) => (
            <button
              key={template.key}
              type="button"
              onClick={() => setSelection({ kind: "template", key: template.key })}
              className="ticket p-5 text-left transition-colors hover:border-rust"
            >
              <p className="font-display text-lg">{template.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{template.description}</p>
              <p className="tabular mt-3 text-xs text-ink-faint">
                {template.questions.length} pytania · od {template.basePrice} {template.currency}
              </p>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setSelection({ kind: "blank" })}
            className="ticket-dashed p-5 text-left transition-colors hover:border-rust"
          >
            <p className="font-display text-lg">Pusty kalkulator</p>
            <p className="mt-1 text-sm text-ink-soft">
              Zaczynasz od zera i sam dodajesz wszystkie pytania.
            </p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <button
        type="button"
        onClick={() => setSelection(null)}
        className="link-underline mb-6 flex items-center gap-1.5 text-sm text-ink-soft"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Wybierz inny szablon
      </button>

      {selection.kind === "blank" ? (
        <BlankForm />
      ) : (
        <TemplateForm templateKey={selection.key} />
      )}
    </div>
  );
}

function BlankForm() {
  const [state, formAction, pending] = useActionState(createCalculator, initialState);

  return (
    <form action={formAction} className="ticket space-y-4 p-6">
      <h2 className="font-display text-xl">Pusty kalkulator</h2>
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
  );
}

function TemplateForm({ templateKey }: { templateKey: string }) {
  const template = CALCULATOR_TEMPLATES.find((t) => t.key === templateKey);
  const action = createCalculatorFromTemplate.bind(null, templateKey);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (!template) return null;

  return (
    <form action={formAction} className="ticket space-y-4 p-6">
      <h2 className="font-display text-xl">{template.title}</h2>
      <ul className="space-y-1 text-sm text-ink-soft">
        {template.questions.map((q) => (
          <li key={q.label}>• {q.label}</li>
        ))}
      </ul>
      <label className="block text-sm text-ink-soft">
        Nazwa
        <input name="name" required defaultValue={template.title} className="field mt-1" />
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
      <p className="text-xs text-ink-faint">
        Cenę bazową ({template.basePrice} {template.currency}) i wszystkie ceny opcji zmienisz
        później w edytorze.
      </p>
      {state.error && <p className="text-sm text-rust-dark">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Tworzenie…" : "Utwórz kalkulator"}
      </button>
    </form>
  );
}
