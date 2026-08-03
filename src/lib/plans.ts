import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Single hardcoded free tier — no paid plans/Stripe yet, so this is the
// only plan every account is on today.
export const FREE_PLAN = {
  name: "Free",
  maxCalculators: 1,
  maxLeadsPerMonth: 10,
} as const;

export interface PlanUsage {
  calculatorCount: number;
  leadsThisMonth: number;
  maxCalculators: number;
  maxLeadsPerMonth: number;
}

function startOfMonthIso(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function getPlanUsage(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<PlanUsage> {
  const { data: calculators } = await supabase.from("calculators").select("id").eq("user_id", userId);

  const calculatorIds = (calculators ?? []).map((c) => c.id);

  let leadsThisMonth = 0;
  if (calculatorIds.length > 0) {
    const { count } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .in("calculator_id", calculatorIds)
      .gte("created_at", startOfMonthIso());
    leadsThisMonth = count ?? 0;
  }

  return {
    calculatorCount: calculatorIds.length,
    leadsThisMonth,
    maxCalculators: FREE_PLAN.maxCalculators,
    maxLeadsPerMonth: FREE_PLAN.maxLeadsPerMonth,
  };
}

export async function isLeadLimitReached(
  supabase: SupabaseClient<Database>,
  ownerUserId: string,
): Promise<boolean> {
  const usage = await getPlanUsage(supabase, ownerUserId);
  return usage.leadsThisMonth >= usage.maxLeadsPerMonth;
}
