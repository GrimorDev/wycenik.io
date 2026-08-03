import Link from "next/link";
import { StatusDotIcon } from "@/components/icons";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_ACCENT_COLOR = "#b54b24";
const DEFAULT_CORNER_STYLE = "rounded";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS also allows reading any *published* calculator (for the public
  // widget), so this list must be scoped to the owner explicitly.
  const { data: calculators } = await supabase
    .from("calculators")
    .select("id,name,slug,is_published,created_at,accent_color,corner_style,bg_color")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const calculatorIds = (calculators ?? []).map((c) => c.id);

  let hasQuestions = false;
  let hasViews = false;
  let hasLeads = false;

  if (calculatorIds.length > 0) {
    const [{ count: questionCount }, { count: viewCount }, { count: leadCount }] = await Promise.all([
      supabase.from("questions").select("id", { count: "exact", head: true }).in("calculator_id", calculatorIds),
      supabase
        .from("calculator_views")
        .select("id", { count: "exact", head: true })
        .in("calculator_id", calculatorIds),
      supabase.from("leads").select("id", { count: "exact", head: true }).in("calculator_id", calculatorIds),
    ]);
    hasQuestions = (questionCount ?? 0) > 0;
    hasViews = (viewCount ?? 0) > 0;
    hasLeads = (leadCount ?? 0) > 0;
  }

  const hasCustomizedAppearance = (calculators ?? []).some(
    (c) =>
      c.accent_color !== DEFAULT_ACCENT_COLOR ||
      c.corner_style !== DEFAULT_CORNER_STYLE ||
      c.bg_color !== null,
  );

  const onboardingSteps = [
    { label: "Skonfiguruj kalkulator", done: calculatorIds.length > 0 && hasQuestions },
    { label: "Dostosuj kolory do swojej strony", done: hasCustomizedAppearance },
    { label: "Wklej kod na swoją stronę WWW", done: hasViews },
    { label: "Odbierz pierwszego leada", done: hasLeads },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <OnboardingChecklist steps={onboardingSteps} />

      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Twoje kalkulatory</h1>
        <Link href="/dashboard/calculators/new" className="btn btn-primary">
          + Nowy kalkulator
        </Link>
      </div>

      {!calculators || calculators.length === 0 ? (
        <div className="ticket-dashed p-8 text-center text-sm text-ink-soft">
          Nie masz jeszcze żadnego kalkulatora.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {calculators.map((calc) => (
            <li key={calc.id} className="ticket flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-display text-lg">{calc.name}</p>
                <p className="tabular mt-0.5 flex items-center gap-2 text-sm text-ink-faint">
                  /{calc.slug}
                  <span
                    className={`flex items-center gap-1 ${calc.is_published ? "text-sage" : "text-ink-faint"}`}
                  >
                    <StatusDotIcon className="h-2.5 w-2.5" filled={calc.is_published} />
                    {calc.is_published ? "Opublikowany" : "Szkic"}
                  </span>
                </p>
              </div>
              <div className="flex gap-5 text-sm">
                <Link
                  href={`/dashboard/calculators/${calc.id}/leads`}
                  className="link-underline font-medium text-ink"
                >
                  Leady
                </Link>
                <Link
                  href={`/dashboard/calculators/${calc.id}`}
                  className="link-underline font-medium text-ink"
                >
                  Edytuj
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
