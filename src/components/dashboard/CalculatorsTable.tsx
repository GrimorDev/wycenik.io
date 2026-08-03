import Link from "next/link";
import { PublishToggle } from "@/components/dashboard/PublishToggle";
import { RowMenu } from "@/components/dashboard/RowMenu";
import { CodeIcon } from "@/components/icons";
import type { CalculatorSummary } from "@/lib/dashboard-data";

export function CalculatorsTable({ calculators }: { calculators: CalculatorSummary[] }) {
  if (calculators.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Nie masz jeszcze żadnego kalkulatora.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">Kalkulator</th>
            <th className="px-5 py-3 font-medium">Odsłony</th>
            <th className="px-5 py-3 font-medium">Leady</th>
            <th className="px-5 py-3 font-medium">Konwersja</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {calculators.map((calc) => (
            <tr key={calc.id}>
              <td className="px-5 py-4">
                <p className="font-medium text-slate-900">{calc.name}</p>
                <p className="text-xs text-slate-400">
                  {calc.questionCount} {calc.questionCount === 1 ? "pytanie" : "pytań"} ·{" "}
                  <span className="tabular">/{calc.slug}</span>
                </p>
              </td>
              <td className="tabular px-5 py-4 text-slate-700">{calc.views}</td>
              <td className="tabular px-5 py-4 text-slate-700">{calc.leads}</td>
              <td className="px-5 py-4">
                <span className="tabular rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {calc.conversion.toFixed(1)}%
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <PublishToggle calculatorId={calc.id} isPublished={calc.isPublished} />
                  <span className="text-xs text-slate-500">{calc.isPublished ? "Aktywny" : "Szkic"}</span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/embed?calculator=${calc.id}`}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
                  >
                    <CodeIcon className="h-3.5 w-3.5" />
                    Kod
                  </Link>
                  <Link
                    href={`/dashboard/calculators/${calc.id}`}
                    className="rounded-[10px] bg-brand-mint px-3 py-1 text-xs font-medium text-brand-mint-ink hover:opacity-80"
                  >
                    Edytuj
                  </Link>
                  <RowMenu calculatorId={calc.id} calculatorName={calc.name} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
