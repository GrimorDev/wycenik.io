"use client";

import { useState } from "react";
import { LeadDetailSheet } from "@/components/dashboard/LeadDetailSheet";
import type { CalculatorConfig } from "@/lib/calculator/types";

export interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  estimated_min: number;
  estimated_max: number;
  created_at: string;
  calculatorId: string;
  calculatorName: string;
  answers: Record<string, unknown>;
}

export function LeadsTable({
  leads,
  hasQuery,
  configsById,
}: {
  leads: LeadRow[];
  hasQuery: boolean;
  configsById: Record<string, CalculatorConfig>;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = leads.find((l) => l.id === activeId) ?? null;

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        {hasQuery ? "Brak wyników dla tego wyszukiwania." : "Brak leadów jeszcze."}
      </div>
    );
  }

  return (
    <>
      <div className="panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/60 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Kontakt</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Telefon</th>
              <th className="hidden px-5 py-3 font-medium lg:table-cell">Kalkulator</th>
              <th className="px-5 py-3 font-medium">Kwota</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">Data</th>
              <th className="px-5 py-3 text-right font-medium">Szczegóły</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setActiveId(lead.id)}
                className="cursor-pointer hover:bg-slate-50/60"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.email}</p>
                </td>
                <td className="tabular hidden px-5 py-4 text-slate-600 md:table-cell">
                  {lead.phone ?? "—"}
                </td>
                <td className="hidden px-5 py-4 lg:table-cell">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {lead.calculatorName}
                  </span>
                </td>
                <td className="tabular px-5 py-4 font-medium text-brand-accent">
                  {lead.estimated_min}–{lead.estimated_max} zł
                </td>
                <td className="tabular hidden px-5 py-4 text-slate-400 sm:table-cell">
                  {new Date(lead.created_at).toLocaleString("pl-PL")}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(lead.id);
                    }}
                    className="text-sm font-medium text-slate-500 hover:text-slate-800"
                  >
                    Otwórz
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {active && (
        <LeadDetailSheet
          lead={active}
          config={configsById[active.calculatorId]}
          onClose={() => setActiveId(null)}
        />
      )}
    </>
  );
}
