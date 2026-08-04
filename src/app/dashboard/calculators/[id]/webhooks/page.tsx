import { notFound } from "next/navigation";
import { CalculatorEditorShell } from "@/components/calculator/CalculatorEditorShell";
import { CalculatorPreviewPane } from "@/components/calculator/CalculatorPreviewPane";
import { WebhookSettingsForm } from "@/components/calculator/WebhookSettingsForm";
import { toCalculatorConfig, type RawCalculator } from "@/lib/calculator/mapper";
import { createClient } from "@/lib/supabase/server";

const CALCULATOR_SELECT =
  "id,name,slug,base_price,currency,estimate_spread_percent,accent_color,locale,corner_style,bg_color,text_color,border_color,is_published,user_id,webhook_url,webhook_secret,questions(id,label,hint,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

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

  const { data, error } = await supabase.from("calculators").select(CALCULATOR_SELECT).eq("id", id).single();

  const calculator = data as unknown as
    | (RawCalculator & {
        slug: string;
        is_published: boolean;
        user_id: string;
        webhook_url: string | null;
        webhook_secret: string | null;
      })
    | null;

  if (error || !calculator || calculator.user_id !== user?.id) {
    notFound();
  }

  const previewConfig = toCalculatorConfig(calculator);

  const { data: logs } = await supabase
    .from("webhook_logs")
    .select("id,status_code,response_time_ms,error,created_at")
    .eq("calculator_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  const rows = logs ?? [];

  return (
    <CalculatorEditorShell
      calculatorId={calculator.id}
      name={calculator.name}
      slug={calculator.slug}
      isPublished={calculator.is_published}
      preview={<CalculatorPreviewPane config={previewConfig} />}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Integracje</h2>
          <p className="mt-1 text-sm text-slate-500">
            Wysyłamy POST z danymi każdego nowego leada pod wskazany adres — podłącz Make, Zapiera
            albo własny endpoint.
          </p>
        </div>

        <div className="panel p-6">
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
            <div className="overflow-x-auto panel">
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
    </CalculatorEditorShell>
  );
}
