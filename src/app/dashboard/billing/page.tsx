import { redirect } from "next/navigation";
import { CheckCircleIcon } from "@/components/icons";
import { FREE_PLAN, getPlanUsage } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const usage = await getPlanUsage(supabase, user.id);

  const features = [
    `${FREE_PLAN.maxCalculators} ${FREE_PLAN.maxCalculators === 1 ? "kalkulator" : "kalkulatory"}`,
    `${FREE_PLAN.maxLeadsPerMonth} leadów miesięcznie`,
    "Eksport leadów do CSV",
    "Personalizacja kolorów i języka widgetu",
  ];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl">Subskrypcja</h1>
        <p className="mt-1 text-sm text-ink-soft">Konto: {user.email}</p>
      </div>

      <div className="ticket p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="stamp text-sage">Plan Free</p>
            <p className="mt-3 font-display text-2xl">Twoje aktualne limity</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Płatne plany są jeszcze w przygotowaniu. Na razie każde konto ma darmowy limit — poniżej
          Twoje bieżące zużycie.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="ticket-dashed p-4 text-center">
            <p className="tabular font-display text-2xl text-rust">
              {usage.calculatorCount}/{usage.maxCalculators}
            </p>
            <p className="mt-1 text-xs text-ink-faint">Kalkulatory</p>
          </div>
          <div className="ticket-dashed p-4 text-center">
            <p className="tabular font-display text-2xl text-rust">
              {usage.leadsThisMonth}/{usage.maxLeadsPerMonth}
            </p>
            <p className="mt-1 text-xs text-ink-faint">Leady w tym miesiącu</p>
          </div>
        </div>

        <ul className="mt-5 space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-ink-soft">
              <CheckCircleIcon className="h-4 w-4 shrink-0 text-sage" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          type="button"
          disabled
          className="btn btn-ghost mt-6 cursor-not-allowed opacity-50"
          title="Płatne plany z wyższymi limitami będą dostępne wkrótce"
        >
          Płatne plany wkrótce dostępne
        </button>
      </div>
    </div>
  );
}
