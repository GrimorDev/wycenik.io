import Link from "next/link";
import { CalculatorsTable } from "@/components/dashboard/CalculatorsTable";
import { NewCalculatorModal } from "@/components/dashboard/NewCalculatorModal";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { CursorClickIcon, EyeIcon, UsersIcon } from "@/components/icons";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";
import { getCalculatorsWithStats } from "@/lib/dashboard-data";
import { getPlanUsage } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_ACCENT_COLOR = "#b54b24";
const DEFAULT_CORNER_STYLE = "rounded";
const DAY_MS = 24 * 60 * 60 * 1000;

function trendFor(current: number, previous: number, unit: "count" | "points" = "count") {
  const delta = current - previous;
  const sign = delta >= 0 ? "+" : "";
  const direction = delta === 0 ? ("flat" as const) : delta > 0 ? ("up" as const) : ("down" as const);

  if (unit === "points") {
    if (delta === 0) return { direction, text: "bez zmian" };
    return { direction, text: `${sign}${delta.toFixed(1)} pkt proc. vs. poprzedni okres` };
  }

  if (delta === 0) return { direction, text: "bez zmian" };
  if (previous === 0) return { direction, text: `${sign}${delta} vs. poprzedni okres` };

  const pct = Math.round((delta / previous) * 100);
  return { direction, text: `${sign}${delta} (${sign}${pct}%) vs. poprzedni okres` };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: calculators } = await supabase
    .from("calculators")
    .select("id,accent_color,corner_style,bg_color")
    .eq("user_id", user?.id ?? "");

  const calculatorIds = (calculators ?? []).map((c) => c.id);

  const now = new Date();
  const periodStart = new Date(now.getTime() - 30 * DAY_MS).toISOString();
  const previousPeriodStart = new Date(now.getTime() - 60 * DAY_MS).toISOString();

  let hasQuestions = false;
  let leadsThisPeriod = 0;
  let leadsPreviousPeriod = 0;
  let viewsThisPeriod = 0;
  let viewsPreviousPeriod = 0;

  if (calculatorIds.length > 0) {
    const [{ count: questionCount }, leadsNow, leadsPrev, viewsNow, viewsPrev] = await Promise.all([
      supabase.from("questions").select("id", { count: "exact", head: true }).in("calculator_id", calculatorIds),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .in("calculator_id", calculatorIds)
        .gte("created_at", periodStart),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .in("calculator_id", calculatorIds)
        .gte("created_at", previousPeriodStart)
        .lt("created_at", periodStart),
      supabase
        .from("calculator_views")
        .select("id", { count: "exact", head: true })
        .in("calculator_id", calculatorIds)
        .gte("created_at", periodStart),
      supabase
        .from("calculator_views")
        .select("id", { count: "exact", head: true })
        .in("calculator_id", calculatorIds)
        .gte("created_at", previousPeriodStart)
        .lt("created_at", periodStart),
    ]);
    hasQuestions = (questionCount ?? 0) > 0;
    leadsThisPeriod = leadsNow.count ?? 0;
    leadsPreviousPeriod = leadsPrev.count ?? 0;
    viewsThisPeriod = viewsNow.count ?? 0;
    viewsPreviousPeriod = viewsPrev.count ?? 0;
  }

  const hasCustomizedAppearance = (calculators ?? []).some(
    (c) =>
      c.accent_color !== DEFAULT_ACCENT_COLOR ||
      c.corner_style !== DEFAULT_CORNER_STYLE ||
      c.bg_color !== null,
  );

  const usage = user ? await getPlanUsage(supabase, user.id) : null;
  const calculatorsWithStats = user ? await getCalculatorsWithStats(supabase, user.id) : [];
  const hasViews = calculatorsWithStats.some((c) => c.views > 0);
  const hasLeads = calculatorsWithStats.some((c) => c.leads > 0);
  const atCalculatorLimit = usage ? usage.calculatorCount >= usage.maxCalculators : false;

  const conversionThisPeriod = viewsThisPeriod > 0 ? (leadsThisPeriod / viewsThisPeriod) * 100 : 0;
  const conversionPreviousPeriod = viewsPreviousPeriod > 0 ? (leadsPreviousPeriod / viewsPreviousPeriod) * 100 : 0;

  const onboardingSteps = [
    { label: "Stwórz kalkulator", done: calculatorIds.length > 0 && hasQuestions },
    { label: "Dostosuj kolory", done: hasCustomizedAppearance },
    {
      label: "Osadź widget",
      done: hasViews,
      href: calculatorIds[0] ? `/dashboard/embed?calculator=${calculatorIds[0]}` : "/dashboard/embed",
    },
    { label: "Zdobądź pierwszego leada", done: hasLeads },
  ];

  return (
    <>
      <PageHeader
        title="Pulpit"
        subtitle="Przegląd wyników Twoich kalkulatorów w ostatnich 30 dniach."
        actions={
          <NewCalculatorModal
            disabled={atCalculatorLimit}
            disabledReason={atCalculatorLimit ? "Osiągnięto limit planu Free — przejdź na wyższy plan." : undefined}
          />
        }
      />
      <main className="mx-auto w-full max-w-6xl p-6 md:p-10">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Odebrane leady"
            value={String(leadsThisPeriod)}
            icon={UsersIcon}
            trend={trendFor(leadsThisPeriod, leadsPreviousPeriod)}
          />
          <StatCard
            label="Odsłony widgetu"
            value={String(viewsThisPeriod)}
            icon={EyeIcon}
            trend={trendFor(viewsThisPeriod, viewsPreviousPeriod)}
          />
          <StatCard
            label="Stopa konwersji"
            value={`${conversionThisPeriod.toFixed(1)}%`}
            icon={CursorClickIcon}
            trend={trendFor(conversionThisPeriod, conversionPreviousPeriod, "points")}
          />
        </div>

        <OnboardingChecklist steps={onboardingSteps} />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Twoje kalkulatory</h2>
          <Link href="/dashboard/leads" className="text-sm font-medium text-brand-accent hover:text-brand-accent-hover">
            Zobacz leady
          </Link>
        </div>
        <CalculatorsTable calculators={calculatorsWithStats} />
      </main>
    </>
  );
}
