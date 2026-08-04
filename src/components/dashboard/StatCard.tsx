import { TrendingUp } from "lucide-react";

interface Trend {
  direction: "up" | "down" | "flat";
  text: string;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: Trend;
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-accent-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="font-dashboard-display mt-3 text-3xl font-semibold text-foreground">{value}</p>
      {trend && (
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          {trend.direction !== "flat" && (
            <TrendingUp
              className={`size-3 ${trend.direction === "down" ? "rotate-180 text-destructive" : "text-brand"}`}
            />
          )}
          {trend.text}
        </p>
      )}
    </div>
  );
}
