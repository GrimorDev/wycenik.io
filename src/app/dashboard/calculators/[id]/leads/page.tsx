import { notFound } from "next/navigation";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
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
    .select("id,name,slug,is_published,user_id")
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
      <CalculatorHeader
        calculatorId={id}
        name={calculator.name}
        slug={calculator.slug}
        isPublished={calculator.is_published}
      />

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">Leady</h2>
        <ExportCsvButton leads={rows} filename={`leady-${calculator.slug}.csv`} />
      </div>

      {rows.length === 0 ? (
        <div className="ticket-dashed p-8 text-center text-sm text-ink-soft">Brak leadów jeszcze.</div>
      ) : (
        <div className="ticket overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-dashed border-line-strong text-ink-faint">
              <tr>
                <th className="px-4 py-3 font-medium">Imię</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Telefon</th>
                <th className="px-4 py-3 font-medium">Wycena od</th>
                <th className="px-4 py-3 font-medium">Wycena do</th>
                <th className="px-4 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="tabular px-4 py-3">{lead.phone}</td>
                  <td className="tabular px-4 py-3 text-rust">{lead.estimated_min}</td>
                  <td className="tabular px-4 py-3 text-rust">{lead.estimated_max}</td>
                  <td className="tabular px-4 py-3 text-ink-faint">
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
