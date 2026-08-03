"use client";

import { useRouter } from "next/navigation";

interface Option {
  id: string;
  name: string;
}

export function CalculatorPicker({ calculators, selectedId }: { calculators: Option[]; selectedId?: string }) {
  const router = useRouter();

  return (
    <select
      value={selectedId ?? ""}
      onChange={(e) => router.push(`/dashboard/embed?calculator=${e.target.value}`)}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
    >
      {calculators.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
