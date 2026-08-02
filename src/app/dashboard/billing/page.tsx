import { redirect } from "next/navigation";
import { CheckCircleIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";

const FEATURES = [
  "Nielimitowana liczba kalkulatorów",
  "Nielimitowane leady i eksport CSV",
  "Widget bez limitu wyświetleń",
  "Personalizacja kolorów i języka widgetu",
];

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl">Subskrypcja</h1>
        <p className="mt-1 text-sm text-ink-soft">Konto: {user.email}</p>
      </div>

      <div className="ticket p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="stamp text-sage">Plan testowy</p>
            <p className="mt-3 font-display text-2xl">Wszystkie funkcje odblokowane</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Płatności są jeszcze w przygotowaniu — na czas testów masz pełny dostęp do wszystkich
          funkcji za darmo, bez ograniczeń czasowych.
        </p>

        <ul className="mt-5 space-y-2">
          {FEATURES.map((feature) => (
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
          title="Płatności będą dostępne wkrótce"
        >
          Płatności wkrótce dostępne
        </button>
      </div>
    </div>
  );
}
