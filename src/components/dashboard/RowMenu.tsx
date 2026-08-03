"use client";

import { useState } from "react";
import { MoreIcon } from "@/components/icons";
import { deleteCalculator } from "@/lib/actions/calculators";

export function RowMenu({ calculatorId, calculatorName }: { calculatorId: string; calculatorName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Więcej akcji"
        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <MoreIcon className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
          <form
            action={deleteCalculator.bind(null, calculatorId)}
            onSubmit={(e) => {
              if (!confirm(`Usunąć kalkulator „${calculatorName}”? Tej operacji nie można cofnąć.`)) {
                e.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="w-full rounded-md px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Usuń kalkulator
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
