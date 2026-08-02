"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCardIcon, GearIcon, GridIcon } from "@/components/icons";

const ITEMS = [
  { href: "/dashboard", label: "Kalkulatory", icon: GridIcon, exact: true },
  { href: "/dashboard/account", label: "Ustawienia konta", icon: GearIcon, exact: false },
  { href: "/dashboard/billing", label: "Subskrypcja", icon: CreditCardIcon, exact: false },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
              active ? "bg-rust/10 text-rust font-medium" : "text-ink-soft hover:bg-rust/5 hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
