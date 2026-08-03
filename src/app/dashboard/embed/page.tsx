import { CalculatorPicker } from "@/components/dashboard/CalculatorPicker";
import { EmbedCodeBlock } from "@/components/dashboard/EmbedCodeBlock";
import { InstallInstructions } from "@/components/dashboard/InstallInstructions";
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
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Osadzanie</h1>
          <p className="mt-1 text-sm text-slate-500">Wklej kod na swoją stronę — widget działa w kilkanaście sekund.</p>
        </div>
        {rows.length > 0 && <CalculatorPicker calculators={rows} selectedId={active?.id} />}
      </div>

      {!active ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Najpierw stwórz kalkulator, aby uzyskać kod do osadzenia.
        </div>
      ) : !active.is_published ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Opublikuj kalkulator „{active.name}”, aby otrzymać kod do wklejenia na stronę.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <EmbedCodeBlock
            title="Skrypt JS"
            code={`<script src="${origin}/widget.js" data-calculator="${active.slug}"></script>`}
          />
          <InstallInstructions />
        </div>
      )}
    </div>
  );
}
