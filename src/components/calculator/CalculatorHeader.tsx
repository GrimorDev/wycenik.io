import { togglePublish } from "@/lib/actions/calculators";

interface Props {
  calculatorId: string;
  name: string;
  slug: string;
  isPublished: boolean;
  questionCount?: number;
}

export function CalculatorHeader({ calculatorId, name, slug, isPublished, questionCount }: Props) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/85 px-6 py-4 backdrop-blur md:px-10">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold text-slate-900">{name}</h1>
        <p className="tabular mt-0.5 text-sm text-slate-500">
          /{slug}
          {questionCount != null ? ` · ${questionCount} ${questionCount === 1 ? "pytanie" : "pytań"}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
            isPublished ? "bg-brand-primary text-brand-primary-ink" : "bg-slate-100 text-slate-500"
          }`}
        >
          {isPublished ? "Aktywny" : "Szkic"}
        </span>
        <form action={togglePublish.bind(null, calculatorId, !isPublished)}>
          <button
            type="submit"
            className="rounded-[10px] bg-brand-accent px-4 py-2 text-sm font-medium text-brand-accent-ink transition-colors hover:bg-brand-accent-hover"
          >
            {isPublished ? "Cofnij publikację" : "Opublikuj"}
          </button>
        </form>
      </div>
    </header>
  );
}
