import { notFound } from "next/navigation";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { CalculatorTabs } from "@/components/calculator/CalculatorTabs";
import { WidgetSettingsForm } from "@/components/calculator/WidgetSettingsForm";
import { createClient } from "@/lib/supabase/server";

export default async function WidgetAppearancePage({
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
    .select(
      "id,name,slug,is_published,user_id,accent_color,locale,corner_style,bg_color,text_color,border_color,allowed_domain",
    )
    .eq("id", id)
    .single();

  if (error || !calculator || calculator.user_id !== user?.id) {
    notFound();
  }

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

        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900">Styling</h2>
          <p className="mt-1 text-sm text-slate-500">
            Zmiany widoczne są od razu poniżej, ale nie trafią do klientów, dopóki nie klikniesz
            „Zapisz wygląd”.
          </p>
        </div>

        <WidgetSettingsForm
          calculatorId={calculator.id}
          accentColor={calculator.accent_color}
          locale={calculator.locale}
          cornerStyle={calculator.corner_style}
          bgColor={calculator.bg_color}
          textColor={calculator.text_color}
          borderColor={calculator.border_color}
          allowedDomain={calculator.allowed_domain}
        />
      </main>
    </>
  );
}
