import { ExportCsvButton } from "@/components/calculator/ExportCsvButton";
import { LeadsTable, type LeadRow } from "@/components/dashboard/LeadsTable";
import { createClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("leads")
    .select("id,name,email,phone,estimated_min,estimated_max,created_at,calculators(name)")
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = (data ?? []) as unknown as Array<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    estimated_min: number;
    estimated_max: number;
    created_at: string;
    calculators: { name: string } | null;
  }>;

  const leads: LeadRow[] = rows.map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    estimated_min: lead.estimated_min,
    estimated_max: lead.estimated_max,
    created_at: lead.created_at,
    calculatorName: lead.calculators?.name ?? "—",
  }));

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Baza leadów</h1>
          <p className="mt-1 text-sm text-slate-500">
            Wszystkie zgłoszenia ze wszystkich Twoich kalkulatorów.
          </p>
        </div>
        <ExportCsvButton leads={leads} filename={`leady-${user?.id ?? "wszystkie"}.csv`} />
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
