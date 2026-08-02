import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
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
    .select("id,name,user_id,accent_color,locale,corner_style,bg_color,text_color,border_color")
    .eq("id", id)
    .single();

  if (error || !calculator || calculator.user_id !== user?.id) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <Link
          href={`/dashboard/calculators/${id}`}
          className="link-underline flex items-center gap-1.5 text-sm text-ink-soft"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          {calculator.name}
        </Link>
        <h1 className="mt-3 font-display text-3xl">Wygląd widgetu</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Zmiany widoczne są od razu poniżej, ale nie trafią do klientów, dopóki nie klikniesz
          &bdquo;Zapisz wygląd&rdquo;.
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
      />
    </div>
  );
}
