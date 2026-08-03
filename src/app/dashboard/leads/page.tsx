import { ExportCsvButton } from "@/components/calculator/ExportCsvButton";
import { LeadsSearchBox } from "@/components/dashboard/LeadsSearchBox";
import { LeadsTable, type LeadRow } from "@/components/dashboard/LeadsTable";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { createClient } from "@/lib/supabase/server";

function startOfMonthIso(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("leads")
    .select("id,name,email,phone,estimated_min,estimated_max,created_at,calculators(name)")
    .gte("created_at", startOfMonthIso())
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

  const allLeads: LeadRow[] = rows.map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    estimated_min: lead.estimated_min,
    estimated_max: lead.estimated_max,
    created_at: lead.created_at,
    calculatorName: lead.calculators?.name ?? "—",
  }));

  const query = q?.trim().toLowerCase() ?? "";
  const leads = query
    ? allLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.calculatorName.toLowerCase().includes(query),
      )
    : allLeads;

  return (
    <>
      <PageHeader
        title="Baza leadów"
        subtitle={`${allLeads.length} zgłoszeń w tym miesiącu`}
        actions={
          <>
            <LeadsSearchBox />
            <ExportCsvButton leads={leads} filename={`leady-${user?.id ?? "wszystkie"}.csv`} />
          </>
        }
      />
      <main className="mx-auto w-full max-w-6xl p-6 md:p-10">
        <LeadsTable leads={leads} hasQuery={query.length > 0} />
      </main>
    </>
  );
}
