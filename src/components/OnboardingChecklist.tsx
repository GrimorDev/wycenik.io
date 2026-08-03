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
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-900">Zacznij zbierać leady</p>
          <p className="mt-0.5 text-sm text-slate-500">
            Ukończono {doneCount} z {steps.length} kroków — zostało już niewiele.
          </p>
        </div>
        <div className="h-1.5 w-32 shrink-0 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              {step.done ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[11px] text-slate-500">
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
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                Wykonaj krok
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
