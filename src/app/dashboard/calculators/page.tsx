import { CalculatorsTable } from "@/components/dashboard/CalculatorsTable";
import { NewCalculatorModal } from "@/components/dashboard/NewCalculatorModal";
import { PageHeader } from "@/components/dashboard/PageHeader";
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
    <>
      <PageHeader
        title="Kalkulatory"
        subtitle="Wszystkie widgety wyceny osadzone na Twoich stronach."
        actions={
          <NewCalculatorModal
            disabled={atCalculatorLimit}
            disabledReason={atCalculatorLimit ? "Osiągnięto limit planu Free — przejdź na wyższy plan." : undefined}
          />
        }
      />
      <main className="mx-auto w-full max-w-6xl p-6 md:p-10">
        <CalculatorsTable calculators={calculators} />
      </main>
    </>
  );
}
