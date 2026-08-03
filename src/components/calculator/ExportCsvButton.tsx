"use client";

interface Lead {
  name: string;
  email: string;
  phone: string | null;
  estimated_min: number;
  estimated_max: number;
  created_at: string;
  calculatorName?: string;
}

function toCsv(leads: Lead[]): string {
  const includeCalculator = leads.some((l) => l.calculatorName != null);
  const header = ["Imię", "E-mail", "Telefon", "Wycena min", "Wycena max", "Data"];
  if (includeCalculator) header.push("Kalkulator");

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = leads.map((lead) => {
    const cols = [
      lead.name,
      lead.email,
      lead.phone ?? "",
      String(lead.estimated_min),
      String(lead.estimated_max),
      new Date(lead.created_at).toLocaleString("pl-PL"),
    ];
    if (includeCalculator) cols.push(lead.calculatorName ?? "");
    return cols.map(escape).join(",");
  });
  return [header.map(escape).join(","), ...rows].join("\r\n");
}

export function ExportCsvButton({ leads, filename }: { leads: Lead[]; filename: string }) {
  function handleExport() {
    const csv = "﻿" + toCsv(leads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={leads.length === 0}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Pobierz CSV
    </button>
  );
}
