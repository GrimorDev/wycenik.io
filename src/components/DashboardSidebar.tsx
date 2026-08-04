"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Code2, Gauge, LayoutGrid, Users, Zap } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { GearIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import type { PlanUsage } from "@/lib/plans";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Pulpit", icon: Gauge, exact: true },
  { href: "/dashboard/calculators", label: "Kalkulatory", icon: LayoutGrid, exact: false },
  { href: "/dashboard/leads", label: "Baza leadów", icon: Users, exact: false },
  { href: "/dashboard/embed", label: "Osadzanie", icon: Code2, exact: false },
];

function LimitMeter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-sidebar-foreground/70">{label}</span>
        <span className="font-mono text-sidebar-foreground">
          {used}/{limit}
        </span>
      </div>
      <Progress value={pct} className="h-1.5 bg-sidebar-accent" />
    </div>
  );
}

export function DashboardSidebar({ email, usage }: { email: string; usage: PlanUsage }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col justify-between gap-6 overflow-y-auto bg-sidebar px-4 py-5",
        "md:w-64 lg:sticky lg:top-0 lg:h-screen lg:gap-0",
      )}
    >
      <div>
        <Link href="/dashboard" className="flex items-center gap-2 px-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Zap className="size-4" />
          </span>
          <span className="font-dashboard-display text-lg font-semibold text-sidebar-foreground">
            Wycenik<span className="text-sidebar-primary">.io</span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 border-t border-sidebar-border px-1 pt-4">
          <span className="truncate text-xs text-sidebar-foreground/60">{email}</span>
          <div className="flex shrink-0 items-center gap-2.5">
            <Link
              href="/dashboard/account"
              title="Ustawienia konta"
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <GearIcon className="h-3.5 w-3.5" />
            </Link>
            <LogoutButton className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground" />
          </div>
        </div>

        <div className="space-y-4 rounded-xl bg-sidebar-accent/50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-sidebar-foreground uppercase">
            <BarChart3 className="size-3.5" /> Plan Free
          </div>
          <LimitMeter label="Kalkulatory" used={usage.calculatorCount} limit={usage.maxCalculators} />
          <LimitMeter label="Leady w tym miesiącu" used={usage.leadsThisMonth} limit={usage.maxLeadsPerMonth} />
          <Button asChild variant="brand" size="sm" className="w-full">
            <Link href="/dashboard/billing">Zwiększ limity</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
