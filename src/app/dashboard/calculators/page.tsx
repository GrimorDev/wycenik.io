import { CalculatorsTable } from "@/components/dashboard/CalculatorsTable";
import { NewCalculatorModal } from "@/components/dashboard/NewCalculatorModal";
import { getCalculatorsWithStats } from "@/lib/dashboard-data";
import { getPlanUsage } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

export default async function CalculatorsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const calculators = user ? await getCalculatorsWithStats(supabase, user.id) : [];
  const usage = user ? await getPlanUsage(supabase, user.id) : null;
  const atCalculatorLimit = usage ? usage.calculatorCount >= usage.maxCalculators : false;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Kalkulatory</h1>
          <p className="mt-1 text-sm text-slate-500">Wszystkie Twoje kalkulatory wyceny.</p>
        </div>
        <NewCalculatorModal
          disabled={atCalculatorLimit}
          disabledReason={atCalculatorLimit ? "Osiągnięto limit planu Free — przejdź na wyższy plan." : undefined}
        />
      </div>

      <CalculatorsTable calculators={calculators} />
    </div>
  );
}
