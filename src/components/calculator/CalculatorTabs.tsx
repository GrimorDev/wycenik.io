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
    { href: base, label: "Edycja" },
    { href: `${base}/widget`, label: "Wygląd widgetu" },
    { href: `${base}/webhooks`, label: "Webhooki" },
    { href: `${base}/leads`, label: "Leady" },
  ];

  return (
    <nav className="tab-row">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`tab ${pathname === tab.href ? "tab-active" : ""}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
