import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

interface Step {
  label: string;
  done: boolean;
  href?: string;
}

export function OnboardingChecklist({ steps }: { steps: Step[] }) {
  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;

  const pct = Math.round((doneCount / steps.length) * 100);
  const currentIndex = steps.findIndex((s) => !s.done);

  return (
    <div className="panel mb-8 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-base font-semibold text-slate-900">Zacznij zbierać leady</p>
          <p className="text-sm text-slate-500">
            Ukończono {doneCount} z {steps.length} kroków — zostało już niewiele.
          </p>
        </div>
        <div className="w-40">
          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-primary/20">
            <div className="h-full rounded-full bg-brand-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.label} className="bg-white p-4">
            <div className="flex items-center gap-2">
              {step.done ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-accent text-brand-accent-ink">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                  {i + 1}
                </span>
              )}
              <p className={`text-sm ${step.done ? "text-slate-400 line-through" : "font-medium text-slate-800"}`}>
                {step.label}
              </p>
            </div>
            {!step.done && i === currentIndex && step.href && (
              <Link
                href={step.href}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-accent hover:text-brand-accent-hover"
              >
                Wykonaj krok
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
