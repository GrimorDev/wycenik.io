import { CalculatorPicker } from "@/components/dashboard/CalculatorPicker";
import { EmbedCodeBlock } from "@/components/dashboard/EmbedCodeBlock";
import { InstallInstructions } from "@/components/dashboard/InstallInstructions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getOrigin } from "@/lib/origin";
import { createClient } from "@/lib/supabase/server";

export default async function EmbedPage({
  searchParams,
}: {
  searchParams: Promise<{ calculator?: string }>;
}) {
  const { calculator: selectedId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: calculators } = await supabase
    .from("calculators")
    .select("id,name,slug,is_published")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const rows = calculators ?? [];
  const active = rows.find((c) => c.id === selectedId) ?? rows[0];
  const origin = await getOrigin();

  return (
    <>
      <PageHeader
        title="Osadzanie"
        subtitle="Wklej kod na swoją stronę — widget działa w kilkanaście sekund."
        actions={rows.length > 0 ? <CalculatorPicker calculators={rows} selectedId={active?.id} /> : undefined}
      />
      <main className="mx-auto w-full max-w-5xl p-6 md:p-10">
        {!active ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Najpierw stwórz kalkulator, aby uzyskać kod do osadzenia.
          </div>
        ) : !active.is_published ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Opublikuj kalkulator „{active.name}”, aby otrzymać kod do wklejenia na stronę.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <EmbedCodeBlock
              title="Skrypt JS"
              code={`<script src="${origin}/widget.js" data-calculator="${active.slug}"></script>`}
            />
            <InstallInstructions />
          </div>
        )}
      </main>
    </>
  );
}
