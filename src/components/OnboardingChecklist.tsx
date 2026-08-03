import { CheckCircleIcon, CircleIcon } from "@/components/icons";

interface Step {
  label: string;
  done: boolean;
}

export function OnboardingChecklist({ steps }: { steps: Step[] }) {
  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;

  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="ticket mb-8 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-base">Uruchomienie w 4 krokach</p>
        <span className="tabular text-xs text-ink-faint">
          {doneCount}/{steps.length}
        </span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-rust transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {steps.map((step) => (
          <li
            key={step.label}
            className={`flex items-center gap-2 text-sm ${step.done ? "text-ink-faint line-through" : "text-ink-soft"}`}
          >
            {step.done ? (
              <CheckCircleIcon className="h-4 w-4 shrink-0 text-sage" />
            ) : (
              <CircleIcon className="h-4 w-4 shrink-0 text-ink-faint" />
            )}
            {step.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
