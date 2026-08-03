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
    <nav className="flex gap-1 border-b border-slate-200">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-emerald-500 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
