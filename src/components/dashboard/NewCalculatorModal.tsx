"use client";

import { useActionState, useState } from "react";
import { PlusIcon, XIcon } from "@/components/icons";
import {
  createCalculator,
  createCalculatorFromTemplate,
  type ActionState,
} from "@/lib/actions/calculators";
import { CALCULATOR_TEMPLATES, type CalculatorTemplate } from "@/lib/calculator/templates";

const initialState: ActionState = { error: null };

const TEMPLATE_META: Record<string, { emoji: string; category: string; color: string }> = {
  sprzatanie: { emoji: "🧹", category: "Usługi porządkowe", color: "bg-orange-50" },
  wykonczenia: { emoji: "🔧", category: "Budownictwo", color: "bg-blue-50" },
  "strony-www": { emoji: "💻", category: "Agencja interaktywna", color: "bg-indigo-50" },
};

type Selection = { kind: "template"; key: string } | { kind: "blank" };

function shortTitle(title: string): string {
  return title.split(" i ")[0];
}

function templatePills(template: CalculatorTemplate): string[] {
  const pills = [`${template.questions.length} pytania`];
  const slider = template.questions.find((q) => q.type === "number_slider");
  if (slider?.config?.unit) pills.push(`Cena / ${slider.config.unit}`);
  if (template.questions.some((q) => q.type === "checkbox")) pills.push("Dopłaty za usługi");
  return pills;
}

export function NewCalculatorModal({
  disabled,
  disabledReason,
}: {
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<Selection>({
    kind: "template",
    key: CALCULATOR_TEMPLATES[0].key,
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={disabled ? disabledReason : undefined}
        className="flex items-center gap-1.5 rounded-[10px] bg-brand-accent px-4 py-2 text-sm font-medium text-brand-accent-ink transition-colors hover:bg-brand-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PlusIcon className="h-4 w-4" />
        Nowy kalkulator
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Nowy kalkulator</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Zacznij od gotowego szablonu branżowego albo zbuduj wycenę od zera.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid grid-cols-2 gap-3">
                {CALCULATOR_TEMPLATES.map((template) => {
                  const meta = TEMPLATE_META[template.key];
                  const active = selection.kind === "template" && selection.key === template.key;
                  return (
                    <button
                      key={template.key}
                      type="button"
                      onClick={() => setSelection({ kind: "template", key: template.key })}
                      className={`relative rounded-xl border p-3 text-left transition-colors ${
                        active ? "border-brand-accent bg-brand-mint/50" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {active && (
                        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] text-brand-accent-ink">
                          ✓
                        </span>
                      )}
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${meta.color}`}>
                        {meta.emoji}
                      </span>
                      <p className="mt-2 text-sm font-medium text-slate-900">{shortTitle(template.title)}</p>
                      <p className="text-xs text-slate-500">{meta.category}</p>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setSelection({ kind: "blank" })}
                  className={`relative rounded-xl border p-3 text-left transition-colors ${
                    selection.kind === "blank" ? "border-brand-accent bg-brand-mint/50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {selection.kind === "blank" && (
                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] text-brand-accent-ink">
                      ✓
                    </span>
                  )}
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-base">
                    ✨
                  </span>
                  <p className="mt-2 text-sm font-medium text-slate-900">Pusty kalkulator</p>
                  <p className="text-xs text-slate-500">Własny scenariusz</p>
                </button>
              </div>

              {selection.kind === "template" ? (
                <TemplatePanel key={selection.key} templateKey={selection.key} />
              ) : (
                <BlankPanel />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TemplatePanel({ templateKey }: { templateKey: string }) {
  const template = CALCULATOR_TEMPLATES.find((t) => t.key === templateKey);
  const action = createCalculatorFromTemplate.bind(null, templateKey);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (!template) return null;

  return (
    <form action={formAction} className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">{template.title}</p>
      <p className="mt-1 text-xs text-slate-500">{template.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {templatePills(template).map((pill) => (
          <span key={pill} className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600">
            {pill}
          </span>
        ))}
      </div>
      <label className="mt-4 block text-xs font-medium text-slate-600">
        Nazwa kalkulatora
        <input
          name="name"
          required
          defaultValue={`${template.title} — mój widget`}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
        />
      </label>
      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 flex items-center justify-center gap-1.5 rounded-[10px] bg-brand-accent px-4 py-2 text-sm font-medium text-brand-accent-ink transition-colors hover:bg-brand-accent-hover disabled:opacity-60"
      >
        {pending ? "Tworzenie…" : "Utwórz kalkulator →"}
      </button>
    </form>
  );
}

function BlankPanel() {
  const [state, formAction, pending] = useActionState(createCalculator, initialState);

  return (
    <form action={formAction} className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">Pusty kalkulator</p>
      <p className="mt-1 text-xs text-slate-500">Zaczynasz od zera i sam dodajesz wszystkie pytania.</p>
      <label className="mt-4 block text-xs font-medium text-slate-600">
        Nazwa kalkulatora
        <input
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
        />
      </label>
      <label className="mt-3 block text-xs font-medium text-slate-600">
        Cena bazowa (PLN)
        <input
          name="base_price"
          type="number"
          step="0.01"
          defaultValue={0}
          className="tabular mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
        />
      </label>
      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 flex items-center justify-center gap-1.5 rounded-[10px] bg-brand-accent px-4 py-2 text-sm font-medium text-brand-accent-ink transition-colors hover:bg-brand-accent-hover disabled:opacity-60"
      >
        {pending ? "Tworzenie…" : "Utwórz kalkulator →"}
      </button>
    </form>
  );
}
