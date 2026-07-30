import Link from "next/link";
import { notFound } from "next/navigation";
import { ExportCsvButton } from "@/components/calculator/ExportCsvButton";
import { createClient } from "@/lib/supabase/server";

export default async function CalculatorLeadsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: calculator } = await supabase
    .from("calculators")
    .select("id,name,slug,user_id")
    .eq("id", id)
    .single();

  if (!calculator || calculator.user_id !== user?.id) {
    notFound();
  }

  const { data: leads } = await supabase
    .from("leads")
    .select("id,name,email,phone,estimated_min,estimated_max,created_at")
    .eq("calculator_id", id)
    .order("created_at", { ascending: false });

  const rows = leads ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <Link href={`/dashboard/calculators/${id}`} className="text-sm text-zinc-500 underline">
          ← {calculator.name}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Leady</h1>
          <ExportCsvButton leads={rows} filename={`leady-${calculator.slug}.csv`} />
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">Brak leadów jeszcze.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-zinc-500 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 font-medium">Imię</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Telefon</th>
                <th className="px-4 py-3 font-medium">Wycena</th>
                <th className="px-4 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {rows.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">
                    {lead.estimated_min}–{lead.estimated_max}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(lead.created_at).toLocaleString("pl-PL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
