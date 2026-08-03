import { TrendUpIcon } from "@/components/icons";

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
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="tabular mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      {trend && (
        <p
          className={`mt-1.5 flex items-center gap-1 text-xs ${
            trend.direction === "down" ? "text-red-500" : "text-emerald-600"
          }`}
        >
          {trend.direction !== "flat" && (
            <TrendUpIcon className={`h-3 w-3 ${trend.direction === "down" ? "rotate-180" : ""}`} />
          )}
          {trend.text}
        </p>
      )}
    </div>
  );
}
