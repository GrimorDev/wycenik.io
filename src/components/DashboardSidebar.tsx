"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { BoltIcon, ChartIcon, CodeIcon, GearIcon, GridIcon, UsersIcon } from "@/components/icons";
import type { PlanUsage } from "@/lib/plans";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Pulpit", icon: ChartIcon, exact: true },
  { href: "/dashboard/calculators", label: "Kalkulatory", icon: GridIcon, exact: false },
  { href: "/dashboard/leads", label: "Baza leadów", icon: UsersIcon, exact: false },
  { href: "/dashboard/embed", label: "Osadzanie", icon: CodeIcon, exact: false },
];

export function DashboardSidebar({ email, usage }: { email: string; usage: PlanUsage }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 bg-brand-sidebar px-4 py-5 md:w-64 md:min-h-screen">
      <Link href="/dashboard" className="flex items-center gap-2 px-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-accent text-brand-accent-ink">
          <BoltIcon className="h-4 w-4" />
        </span>
        <span className="text-base font-semibold text-white">
          Wycenik<span className="text-brand-accent">.io</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                active ? "bg-brand-sidebar-active font-medium text-white" : "text-slate-300 hover:bg-brand-sidebar-active/60 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-1 pt-4">
          <span className="truncate text-xs text-slate-400">{email}</span>
          <div className="flex shrink-0 items-center gap-2.5">
            <Link href="/dashboard/account" title="Ustawienia konta" className="text-slate-400 hover:text-slate-200">
              <GearIcon className="h-3.5 w-3.5" />
            </Link>
            <LogoutButton className="text-xs text-slate-400 hover:text-slate-200" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-sidebar-active/40 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-slate-300">
            <ChartIcon className="h-3.5 w-3.5" />
            PLAN FREE
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Kalkulatory</span>
              <span className="tabular text-slate-200">
                {usage.calculatorCount}/{usage.maxCalculators}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Leady w tym miesiącu</span>
              <span className="tabular text-slate-200">
                {usage.leadsThisMonth}/{usage.maxLeadsPerMonth}
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className="mt-4 flex w-full items-center justify-center rounded-[10px] bg-brand-accent px-3 py-2 text-sm font-medium text-brand-accent-ink transition-colors hover:bg-brand-accent-hover"
          >
            Zwiększ limity
          </Link>
        </div>
      </div>
    </aside>
  );
}
