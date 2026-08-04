import { notFound } from "next/navigation";
import { CalculatorEditorShell } from "@/components/calculator/CalculatorEditorShell";
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
    <CalculatorEditorShell
      calculatorId={id}
      name={calculator.name}
      slug={calculator.slug}
      isPublished={calculator.is_published}
    >
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground">Styling</h2>
        <p className="mt-1 text-sm text-muted-foreground">
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
    </CalculatorEditorShell>
  );
}
