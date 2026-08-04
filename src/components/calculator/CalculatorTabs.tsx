"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

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
    <nav className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all",
              active ? "bg-background text-foreground shadow" : "hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
