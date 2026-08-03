import { notFound } from "next/navigation";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { CalculatorTabs } from "@/components/calculator/CalculatorTabs";
import { DetailsForm } from "@/components/calculator/DetailsForm";
import { createClient } from "@/lib/supabase/server";

function topDomainsFrom(rows: { source_domain: string | null }[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (!row.source_domain) continue;
    counts.set(row.source_domain, (counts.get(row.source_domain) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}

export default async function CalculatorPricingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: calculator, error } = await supabase
    .from("calculators")
    .select("id,name,slug,description,base_price,currency,estimate_spread_percent,is_published,user_id")
    .eq("id", id)
    .single();

  if (error || !calculator || calculator.user_id !== user?.id) {
    notFound();
  }

  const [{ count: viewCount }, { count: leadCount }, { data: viewRows }] = await Promise.all([
    supabase.from("calculator_views").select("id", { count: "exact", head: true }).eq("calculator_id", id),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("calculator_id", id),
    supabase
      .from("calculator_views")
      .select("source_domain")
      .eq("calculator_id", id)
      .not("source_domain", "is", null)
      .limit(2000),
  ]);

  const views = viewCount ?? 0;
  const leads = leadCount ?? 0;
  const conversion = views > 0 ? ((leads / views) * 100).toFixed(1) : "0.0";
  const topDomains = topDomainsFrom(viewRows ?? []);

  return (
    <>
      <CalculatorHeader
        calculatorId={calculator.id}
        name={calculator.name}
        slug={calculator.slug}
        isPublished={calculator.is_published}
      />
      <main className="mx-auto w-full max-w-3xl p-6 md:p-10">
        <div className="mb-6">
          <CalculatorTabs calculatorId={calculator.id} />
        </div>

        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Statystyki</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="panel p-4 text-center">
                <p className="tabular text-2xl font-semibold text-slate-900">{views}</p>
                <p className="mt-1 text-xs text-slate-400">Wyświetlenia</p>
              </div>
              <div className="panel p-4 text-center">
                <p className="tabular text-2xl font-semibold text-slate-900">{leads}</p>
                <p className="mt-1 text-xs text-slate-400">Leady</p>
              </div>
              <div className="panel p-4 text-center">
                <p className="tabular text-2xl font-semibold text-slate-900">{conversion}%</p>
                <p className="mt-1 text-xs text-slate-400">Konwersja</p>
              </div>
            </div>
            {topDomains.length > 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Aktywny na domenach</p>
                <ul className="space-y-1">
                  {topDomains.map(([domain, count]) => (
                    <li key={domain} className="flex items-center justify-between text-sm">
                      <span className="tabular text-slate-600">{domain}</span>
                      <span className="tabular text-slate-400">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Ustawienia wyceny</h2>
            <div className="panel p-6">
              <DetailsForm
                calculatorId={calculator.id}
                name={calculator.name}
                description={calculator.description}
                basePrice={calculator.base_price}
                currency={calculator.currency}
                estimateSpreadPercent={calculator.estimate_spread_percent}
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
