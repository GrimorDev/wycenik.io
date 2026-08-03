import { notFound } from "next/navigation";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { CalculatorTabs } from "@/components/calculator/CalculatorTabs";
import { WebhookSettingsForm } from "@/components/calculator/WebhookSettingsForm";
import { createClient } from "@/lib/supabase/server";

function StatusBadge({ statusCode, error }: { statusCode: number | null; error: string | null }) {
  if (error) {
    return <span className="tabular rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">błąd</span>;
  }
  if (statusCode && statusCode >= 200 && statusCode < 300) {
    return (
      <span className="tabular rounded-full bg-brand-mint px-2 py-0.5 text-xs text-brand-mint-ink">
        {statusCode} OK
      </span>
    );
  }
  return (
    <span className="tabular rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
      {statusCode ?? "brak odpowiedzi"}
    </span>
  );
}

export default async function WebhookSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: calculator, error } = await supabase
    .from("calculators")
    .select("id,name,slug,is_published,user_id,webhook_url,webhook_secret")
    .eq("id", id)
    .single();

  if (error || !calculator || calculator.user_id !== user?.id) {
    notFound();
  }

  const { data: logs } = await supabase
    .from("webhook_logs")
    .select("id,status_code,response_time_ms,error,created_at")
    .eq("calculator_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  const rows = logs ?? [];

  return (
    <>
      <CalculatorHeader
        calculatorId={id}
        name={calculator.name}
        slug={calculator.slug}
        isPublished={calculator.is_published}
      />
      <main className="mx-auto w-full max-w-3xl p-6 md:p-10">
        <div className="mb-6">
          <CalculatorTabs calculatorId={id} />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Integracje</h2>
            <p className="mt-1 text-sm text-slate-500">
              Wysyłamy POST z danymi każdego nowego leada pod wskazany adres — podłącz Make, Zapiera
              albo własny endpoint.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <WebhookSettingsForm
              calculatorId={calculator.id}
              webhookUrl={calculator.webhook_url}
              webhookSecret={calculator.webhook_secret}
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-600">Ostatnie dostarczenia</h3>
            {rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                Brak jeszcze żadnych wysyłek.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Czas odpowiedzi</th>
                      <th className="px-4 py-3 font-medium">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((log) => (
                      <tr key={log.id}>
                        <td className="px-4 py-3">
                          <StatusBadge statusCode={log.status_code} error={log.error} />
                        </td>
                        <td className="tabular px-4 py-3 text-slate-600">
                          {log.response_time_ms != null ? `${log.response_time_ms} ms` : "—"}
                        </td>
                        <td className="tabular px-4 py-3 text-slate-400">
                          {new Date(log.created_at).toLocaleString("pl-PL")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
