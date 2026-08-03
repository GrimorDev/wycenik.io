"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  calculatorId: string;
}

export function CalculatorTabs({ calculatorId }: Props) {
  const pathname = usePathname();
  const base = `/dashboard/calculators/${calculatorId}`;

  const tabs = [
    { href: base, label: "Pytania" },
    { href: `${base}/pricing`, label: "Ustawienia wyceny" },
    { href: `${base}/widget`, label: "Styling" },
    { href: `${base}/webhooks`, label: "Integracje" },
  ];

  return (
    <nav className="inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
              active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
