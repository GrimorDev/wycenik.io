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
    <div className="panel overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/60 text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">Kalkulator</th>
            <th className="hidden px-5 py-3 font-medium md:table-cell">Odsłony</th>
            <th className="hidden px-5 py-3 font-medium md:table-cell">Leady</th>
            <th className="hidden px-5 py-3 font-medium lg:table-cell">Konwersja</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 text-right font-medium">Akcje</th>
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
              <td className="tabular hidden px-5 py-4 text-slate-700 md:table-cell">{calc.views}</td>
              <td className="tabular hidden px-5 py-4 text-slate-700 md:table-cell">{calc.leads}</td>
              <td className="hidden px-5 py-4 lg:table-cell">
                <span className="tabular rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {calc.conversion.toFixed(1)}%
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <PublishToggle calculatorId={calc.id} isPublished={calc.isPublished} />
                  <span className="text-xs text-slate-500">{calc.isPublished ? "Aktywny" : "Wstrzymany"}</span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-4">
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
