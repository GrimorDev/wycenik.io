import Link from "next/link";
import { StatusDotIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS also allows reading any *published* calculator (for the public
  // widget), so this list must be scoped to the owner explicitly.
  const { data: calculators } = await supabase
    .from("calculators")
    .select("id,name,slug,is_published,created_at")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Twoje kalkulatory</h1>
        <Link href="/dashboard/calculators/new" className="btn btn-primary">
          + Nowy kalkulator
        </Link>
      </div>

      {!calculators || calculators.length === 0 ? (
        <div className="ticket-dashed p-8 text-center text-sm text-ink-soft">
          Nie masz jeszcze żadnego kalkulatora.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {calculators.map((calc) => (
            <li key={calc.id} className="ticket flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-display text-lg">{calc.name}</p>
                <p className="tabular mt-0.5 flex items-center gap-2 text-sm text-ink-faint">
                  /{calc.slug}
                  <span
                    className={`flex items-center gap-1 ${calc.is_published ? "text-sage" : "text-ink-faint"}`}
                  >
                    <StatusDotIcon className="h-2.5 w-2.5" filled={calc.is_published} />
                    {calc.is_published ? "Opublikowany" : "Szkic"}
                  </span>
                </p>
              </div>
              <div className="flex gap-5 text-sm">
                <Link
                  href={`/dashboard/calculators/${calc.id}/leads`}
                  className="link-underline font-medium text-ink"
                >
                  Leady
                </Link>
                <Link
                  href={`/dashboard/calculators/${calc.id}`}
                  className="link-underline font-medium text-ink"
                >
                  Edytuj
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
