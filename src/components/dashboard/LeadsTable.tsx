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

export function LeadsTable({ leads, hasQuery }: { leads: LeadRow[]; hasQuery: boolean }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        {hasQuery ? "Brak wyników dla tego wyszukiwania." : "Brak leadów jeszcze."}
      </div>
    );
  }

  return (
    <div className="panel overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/60 text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">Kontakt</th>
            <th className="px-5 py-3 font-medium">Telefon</th>
            <th className="px-5 py-3 font-medium">Kalkulator</th>
            <th className="px-5 py-3 font-medium">Kwota</th>
            <th className="px-5 py-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
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
              <td className="tabular px-5 py-4 font-medium text-brand-accent">
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
  );
}
