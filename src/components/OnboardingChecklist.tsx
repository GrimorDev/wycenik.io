import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

interface Step {
  label: string;
  done: boolean;
  href?: string;
}

export function OnboardingChecklist({ steps }: { steps: Step[] }) {
  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;

  const currentIndex = steps.findIndex((s) => !s.done);

  return (
    <div className="panel mb-8 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Zacznij zbierać leady</h2>
          <p className="text-sm text-muted-foreground">
            Ukończono {doneCount} z {steps.length} kroków — zostało już niewiele.
          </p>
        </div>
        <div className="w-40">
          <Progress value={(doneCount / steps.length) * 100} className="h-2" />
        </div>
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.label} className="bg-card p-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  step.done ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {step.done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={cn("text-sm font-medium text-foreground", step.done && "text-muted-foreground line-through")}>
                {step.label}
              </span>
            </div>
            {!step.done && i === currentIndex && step.href && (
              <Link
                href={step.href}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
              >
                Wykonaj krok
                <ArrowUpRight className="size-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
