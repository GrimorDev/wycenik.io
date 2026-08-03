"use client";

import { useState } from "react";

const PLATFORMS = [
  {
    key: "wordpress",
    label: "WordPress",
    steps: [
      "Otwórz stronę lub wpis w edytorze bloków.",
      'Dodaj blok "Własny HTML".',
      "Wklej skopiowany kod i zapisz zmiany.",
    ],
  },
  {
    key: "webflow",
    label: "Webflow",
    steps: [
      'Dodaj element "Embed" w miejscu, gdzie ma pojawić się kalkulator.',
      "Wklej skopiowany kod do okna embedu.",
      "Opublikuj stronę.",
    ],
  },
  {
    key: "html",
    label: "Czysty HTML",
    steps: [
      "Otwórz plik HTML swojej strony w edytorze.",
      "Wklej kod tuż przed zamykającym tagiem </body>.",
      "Zapisz i wgraj plik na serwer.",
    ],
  },
] as const;

export function InstallInstructions() {
  const [active, setActive] = useState<(typeof PLATFORMS)[number]["key"]>("wordpress");
  const platform = PLATFORMS.find((p) => p.key === active) ?? PLATFORMS[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-slate-900">Instrukcja instalacji</p>
      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1">
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setActive(p.key)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
              active === p.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <ol className="space-y-2.5">
        {platform.steps.map((step, i) => (
          <li key={step} className="flex gap-2.5 text-sm text-slate-600">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-mint text-xs font-medium text-brand-mint-ink">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-brand-mint p-3 text-xs text-brand-mint-ink">
        Widget ładuje się asynchronicznie i nie spowalnia strony. Zmiany w edytorze pojawiają się
        u klientów bez ponownego wklejania kodu.
      </div>
    </div>
  );
}
