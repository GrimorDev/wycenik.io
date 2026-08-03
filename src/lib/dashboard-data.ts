import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export interface CalculatorSummary {
  id: string;
  name: string;
  slug: string;
  isPublished: boolean;
  views: number;
  leads: number;
  conversion: number;
}

export async function getCalculatorsWithStats(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<CalculatorSummary[]> {
  const { data: calculators } = await supabase
    .from("calculators")
    .select("id,name,slug,is_published,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const rows = calculators ?? [];
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.id);

  const [{ data: viewRows }, { data: leadRows }] = await Promise.all([
    supabase.from("calculator_views").select("calculator_id").in("calculator_id", ids).limit(5000),
    supabase.from("leads").select("calculator_id").in("calculator_id", ids).limit(5000),
  ]);

  const viewCounts = new Map<string, number>();
  for (const v of viewRows ?? []) viewCounts.set(v.calculator_id, (viewCounts.get(v.calculator_id) ?? 0) + 1);
  const leadCounts = new Map<string, number>();
  for (const l of leadRows ?? []) leadCounts.set(l.calculator_id, (leadCounts.get(l.calculator_id) ?? 0) + 1);

  return rows.map((r) => {
    const views = viewCounts.get(r.id) ?? 0;
    const leads = leadCounts.get(r.id) ?? 0;
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      isPublished: r.is_published,
      views,
      leads,
      conversion: views > 0 ? (leads / views) * 100 : 0,
    };
  });
}
