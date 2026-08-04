"use client";

import { useState } from "react";
import { AdminCalculatorPreview } from "@/components/calculator/AdminCalculatorPreview";
import { DesktopIcon, MobileIcon } from "@/components/icons";
import type { CalculatorConfig } from "@/lib/calculator/types";

export function CalculatorPreviewPane({ config }: { config: CalculatorConfig }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 md:px-10 lg:overflow-y-auto lg:border-l lg:border-t-0">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Podgląd na żywo</p>
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            aria-label="Podgląd na komputer"
            aria-pressed={device === "desktop"}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
              device === "desktop" ? "bg-brand-mint text-brand-mint-ink" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <DesktopIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            aria-label="Podgląd na telefon"
            aria-pressed={device === "mobile"}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
              device === "mobile" ? "bg-brand-mint text-brand-mint-ink" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <MobileIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className={`mx-auto flex justify-center transition-all ${device === "mobile" ? "max-w-[380px]" : "max-w-lg"}`}>
        <AdminCalculatorPreview key={JSON.stringify(config)} config={config} />
      </div>
    </div>
  );
}
