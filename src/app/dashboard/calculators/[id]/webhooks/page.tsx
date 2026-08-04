import { notFound } from "next/navigation";
import { CalculatorEditorShell } from "@/components/calculator/CalculatorEditorShell";
import { CalculatorPreviewPane } from "@/components/calculator/CalculatorPreviewPane";
import { WebhookSettingsForm } from "@/components/calculator/WebhookSettingsForm";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toCalculatorConfig, type RawCalculator } from "@/lib/calculator/mapper";
import { createClient } from "@/lib/supabase/server";

const CALCULATOR_SELECT =
  "id,name,slug,base_price,currency,estimate_spread_percent,accent_color,locale,corner_style,bg_color,text_color,border_color,is_published,user_id,webhook_url,webhook_secret,questions(id,label,hint,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

function StatusBadge({ statusCode, error }: { statusCode: number | null; error: string | null }) {
  if (error) {
    return (
      <Badge variant="destructive" className="font-mono">
        błąd
      </Badge>
    );
  }
  if (statusCode && statusCode >= 200 && statusCode < 300) {
    return (
      <Badge className="font-mono bg-brand text-brand-foreground hover:bg-brand/90">
        {statusCode} OK
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="font-mono">
      {statusCode ?? "brak odpowiedzi"}
    </Badge>
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
      <div className="max-w-xl space-y-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">Integracje</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Wysyłamy POST z danymi każdego nowego leada pod wskazany adres — podłącz Make, Zapiera
            albo własny endpoint.
          </p>
        </div>

        <div className="panel space-y-4 p-4">
          <WebhookSettingsForm
            calculatorId={calculator.id}
            webhookUrl={calculator.webhook_url}
            webhookSecret={calculator.webhook_secret}
          />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground">Ostatnie dostarczenia</h3>
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Brak jeszcze żadnych wysyłek.
            </div>
          ) : (
            <div className="panel overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-surface/60 hover:bg-surface/60">
                    <TableHead>Status</TableHead>
                    <TableHead>Czas odpowiedzi</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <StatusBadge statusCode={log.status_code} error={log.error} />
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {log.response_time_ms != null ? `${log.response_time_ms} ms` : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {new Date(log.created_at).toLocaleString("pl-PL")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </CalculatorEditorShell>
  );
}
