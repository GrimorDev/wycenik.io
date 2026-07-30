import Link from "next/link";
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Twoje kalkulatory</h1>
        <Link
          href="/dashboard/calculators/new"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          + Nowy kalkulator
        </Link>
      </div>

      {!calculators || calculators.length === 0 ? (
        <p className="text-sm text-zinc-500">Nie masz jeszcze żadnego kalkulatora.</p>
      ) : (
        <ul className="divide-y divide-black/10 rounded-2xl border border-black/10 dark:divide-white/10 dark:border-white/10">
          {calculators.map((calc) => (
            <li key={calc.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium">{calc.name}</p>
                <p className="text-sm text-zinc-500">
                  /{calc.slug} · {calc.is_published ? "Opublikowany" : "Szkic"}
                </p>
              </div>
              <div className="flex gap-4 text-sm">
                <Link href={`/dashboard/calculators/${calc.id}/leads`} className="font-medium text-foreground underline">
                  Leady
                </Link>
                <Link href={`/dashboard/calculators/${calc.id}`} className="font-medium text-foreground underline">
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
