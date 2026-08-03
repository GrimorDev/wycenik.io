import { notFound } from "next/navigation";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { WebhookSettingsForm } from "@/components/calculator/WebhookSettingsForm";
import { createClient } from "@/lib/supabase/server";

function StatusBadge({ statusCode, error }: { statusCode: number | null; error: string | null }) {
  if (error) {
    return <span className="tabular rounded-full bg-rust/10 px-2 py-0.5 text-xs text-rust-dark">błąd</span>;
  }
  if (statusCode && statusCode >= 200 && statusCode < 300) {
    return (
      <span className="tabular rounded-full bg-emerald-600/10 px-2 py-0.5 text-xs text-emerald-700">
        {statusCode} OK
      </span>
    );
  }
  return (
    <span className="tabular rounded-full bg-rust/10 px-2 py-0.5 text-xs text-rust-dark">
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
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <CalculatorHeader
        calculatorId={id}
        name={calculator.name}
        slug={calculator.slug}
        isPublished={calculator.is_published}
      />

      <div>
        <h2 className="font-display text-xl">Webhooki</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Wysyłamy POST z danymi każdego nowego leada pod wskazany adres — podłącz Make, Zapiera
          albo własny endpoint.
        </p>
      </div>

      <div className="ticket p-6">
        <WebhookSettingsForm
          calculatorId={calculator.id}
          webhookUrl={calculator.webhook_url}
          webhookSecret={calculator.webhook_secret}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-ink-soft">Ostatnie dostarczenia</h2>
        {rows.length === 0 ? (
          <div className="ticket-dashed p-8 text-center text-sm text-ink-soft">
            Brak jeszcze żadnych wysyłek.
          </div>
        ) : (
          <div className="ticket overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-dashed border-line-strong text-ink-faint">
                <tr>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Czas odpowiedzi</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3">
                      <StatusBadge statusCode={log.status_code} error={log.error} />
                    </td>
                    <td className="tabular px-4 py-3 text-ink-soft">
                      {log.response_time_ms != null ? `${log.response_time_ms} ms` : "—"}
                    </td>
                    <td className="tabular px-4 py-3 text-ink-faint">
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
  );
}
