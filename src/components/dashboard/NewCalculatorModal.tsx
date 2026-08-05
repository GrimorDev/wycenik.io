"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCalculator,
  createCalculatorFromTemplate,
  type ActionState,
} from "@/lib/actions/calculators";
import { CALCULATOR_TEMPLATES, type CalculatorTemplate } from "@/lib/calculator/templates";
import { cn } from "@/lib/cn";

const initialState: ActionState = { error: null };

const TEMPLATE_EMOJI: Record<string, string> = {
  sprzatanie: "🧹",
  wykonczenia: "🔧",
  "strony-www": "💻",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="brand" disabled={disabled} title={disabled ? disabledReason : undefined} onClick={() => setOpen(true)}>
        <Plus className="size-4" /> Nowy kalkulator
      </Button>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nowy kalkulator</DialogTitle>
          <DialogDescription>
            Zacznij od gotowego szablonu branżowego albo zbuduj wycenę od zera.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <div className="grid gap-2 sm:grid-cols-2">
            {CALCULATOR_TEMPLATES.map((template) => {
              const active = selection.kind === "template" && selection.key === template.key;
              return (
                <button
                  key={template.key}
                  type="button"
                  onClick={() => setSelection({ kind: "template", key: template.key })}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all",
                    active
                      ? "border-brand bg-brand-soft/60 shadow-[var(--shadow-card)]"
                      : "border-border hover:border-muted-foreground/40",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xl">{TEMPLATE_EMOJI[template.key]}</span>
                    {active && <Check className="size-4 text-brand" />}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">{shortTitle(template.title)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{template.industry}</p>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setSelection({ kind: "blank" })}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                selection.kind === "blank"
                  ? "border-brand bg-brand-soft/60 shadow-[var(--shadow-card)]"
                  : "border-border hover:border-muted-foreground/40",
              )}
            >
              <div className="flex items-start justify-between">
                <span className="text-xl">✨</span>
                {selection.kind === "blank" && <Check className="size-4 text-brand" />}
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">Pusty kalkulator</p>
              <p className="mt-1 text-xs text-muted-foreground">Własny scenariusz</p>
            </button>
          </div>

          {selection.kind === "template" ? (
            <TemplatePanel key={selection.key} templateKey={selection.key} />
          ) : (
            <BlankPanel />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TemplatePanel({ templateKey }: { templateKey: string }) {
  const template = CALCULATOR_TEMPLATES.find((t) => t.key === templateKey);
  const action = createCalculatorFromTemplate.bind(null, templateKey);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (!template) return null;

  return (
    <form
      action={formAction}
      onSubmit={() => toast.success("Kalkulator utworzony", { description: "Możesz od razu dopasować pytania i wygląd." })}
      className="rounded-xl border border-border bg-surface p-4"
    >
      <p className="text-sm font-semibold text-foreground">{template.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {templatePills(template).map((pill) => (
          <Badge key={pill} variant="secondary" className="font-normal">
            {pill}
          </Badge>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor="calc-name">Nazwa kalkulatora</Label>
        <Input id="calc-name" name="name" required defaultValue={`${template.title} — mój widget`} />
      </div>
      {state.error && <p className="mt-2 text-xs text-destructive">{state.error}</p>}
      <Button type="submit" variant="brand" disabled={pending} className="mt-4 w-full">
        {pending ? "Tworzenie…" : "Utwórz kalkulator"} <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}

function BlankPanel() {
  const [state, formAction, pending] = useActionState(createCalculator, initialState);

  return (
    <form
      action={formAction}
      onSubmit={() => toast.success("Kalkulator utworzony", { description: "Możesz od razu dopasować pytania i wygląd." })}
      className="rounded-xl border border-border bg-surface p-4"
    >
      <p className="text-sm font-semibold text-foreground">Pusty kalkulator</p>
      <p className="mt-1 text-xs text-muted-foreground">Zaczynasz od zera i sam dodajesz wszystkie pytania.</p>
      <div className="mt-4 space-y-2">
        <Label htmlFor="calc-name-blank">Nazwa kalkulatora</Label>
        <Input id="calc-name-blank" name="name" required />
      </div>
      <div className="mt-3 space-y-2">
        <Label htmlFor="calc-base-price">Cena bazowa (PLN)</Label>
        <Input id="calc-base-price" name="base_price" type="number" step="0.01" defaultValue={0} className="font-mono" />
      </div>
      {state.error && <p className="mt-2 text-xs text-destructive">{state.error}</p>}
      <Button type="submit" variant="brand" disabled={pending} className="mt-4 w-full">
        {pending ? "Tworzenie…" : "Utwórz kalkulator"} <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
