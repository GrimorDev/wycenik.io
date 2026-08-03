import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { togglePublish } from "@/lib/actions/calculators";
import { CalculatorTabs } from "./CalculatorTabs";

interface Props {
  calculatorId: string;
  name: string;
  slug: string;
  isPublished: boolean;
  questionCount?: number;
}

export function CalculatorHeader({ calculatorId, name, slug, isPublished, questionCount }: Props) {
  return (
    <div>
      <Link
        href="/dashboard/calculators"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Kalkulatory
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{name}</h1>
          <p className="tabular mt-1 text-sm text-slate-500">
            /{slug}
            {questionCount != null ? ` · ${questionCount} ${questionCount === 1 ? "pytanie" : "pytań"}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isPublished ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            {isPublished ? "Aktywny" : "Szkic"}
          </span>
          <form action={togglePublish.bind(null, calculatorId, !isPublished)}>
            <button
              type="submit"
              className="rounded-[10px] bg-brand-accent px-4 py-1.5 text-sm font-medium text-brand-accent-ink transition-colors hover:bg-brand-accent-hover"
            >
              {isPublished ? "Cofnij publikację" : "Opublikuj"}
            </button>
          </form>
        </div>
      </div>
      <div className="mt-5">
        <CalculatorTabs calculatorId={calculatorId} />
      </div>
    </div>
  );
}
