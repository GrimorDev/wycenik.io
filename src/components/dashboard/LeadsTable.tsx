"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";

export interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  estimated_min: number;
  estimated_max: number;
  created_at: string;
  calculatorName: string;
}

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.calculatorName.toLowerCase().includes(q),
    );
  }, [leads, query]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">{leads.length} zgłoszeń łącznie</p>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj po nazwisku, e-mailu…"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          {leads.length === 0 ? "Brak leadów jeszcze." : "Brak wyników dla tego wyszukiwania."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Kontakt</th>
                <th className="px-5 py-3 font-medium">Telefon</th>
                <th className="px-5 py-3 font-medium">Kalkulator</th>
                <th className="px-5 py-3 font-medium">Kwota</th>
                <th className="px-5 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{lead.name}</p>
                    <p className="text-xs text-slate-400">{lead.email}</p>
                  </td>
                  <td className="tabular px-5 py-4 text-slate-600">{lead.phone ?? "—"}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {lead.calculatorName}
                    </span>
                  </td>
                  <td className="tabular px-5 py-4 font-medium text-emerald-700">
                    {lead.estimated_min}–{lead.estimated_max} zł
                  </td>
                  <td className="tabular px-5 py-4 text-slate-400">
                    {new Date(lead.created_at).toLocaleString("pl-PL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
