// One-off dev seed: creates a demo auth user + a published "Sprzątanie"
// calculator so the widget/API can be exercised end-to-end locally.
// Usage: npx tsx scripts/seed-demo-calculator.ts
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(url, serviceKey);

const DEMO_EMAIL = "demo-owner@wycenik.io";
const DEMO_SLUG = "sprzatanie-demo";

async function main() {
  const { data: existing } = await admin
    .from("calculators")
    .select("id,slug")
    .eq("slug", DEMO_SLUG)
    .maybeSingle();

  if (existing) {
    console.log(`Demo calculator already exists: ${DEMO_SLUG} (${existing.id})`);
    return;
  }

  let userId: string;
  const { data: created, error: createUserError } =
    await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: crypto.randomUUID(),
      email_confirm: true,
    });

  if (createUserError) {
    if (!createUserError.message.includes("already been registered")) {
      throw createUserError;
    }
    const { data: list, error: listError } = await admin.auth.admin.listUsers();
    if (listError) throw listError;
    const found = list.users.find((u) => u.email === DEMO_EMAIL);
    if (!found) throw new Error("Demo user should exist but was not found");
    userId = found.id;
  } else {
    userId = created.user.id;
  }

  const { data: calculator, error: calcError } = await admin
    .from("calculators")
    .insert({
      user_id: userId,
      name: "Kalkulator Sprzątania",
      slug: DEMO_SLUG,
      description: "Przykładowy kalkulator wyceny usług sprzątania.",
      base_price: 100,
      currency: "PLN",
      estimate_spread_percent: 0.15,
      is_published: true,
    })
    .select("id")
    .single();

  if (calcError) throw calcError;

  const { data: areaQuestion, error: areaError } = await admin
    .from("questions")
    .insert({
      calculator_id: calculator.id,
      label: "Metraż mieszkania",
      type: "number_slider",
      config: { min: 0, max: 300, step: 5, unit: "m2", pricePerUnit: 2 },
      position: 0,
      required: true,
    })
    .select("id")
    .single();
  if (areaError) throw areaError;

  const { data: freqQuestion, error: freqError } = await admin
    .from("questions")
    .insert({
      calculator_id: calculator.id,
      label: "Częstotliwość sprzątania",
      type: "single_choice",
      position: 1,
      required: true,
    })
    .select("id")
    .single();
  if (freqError) throw freqError;

  const { error: freqOptionsError } = await admin.from("options").insert([
    { question_id: freqQuestion.id, label: "Jednorazowo", price_delta: 0, price_multiplier: 1, position: 0 },
    { question_id: freqQuestion.id, label: "Co tydzień", price_delta: 0, price_multiplier: 0.8, position: 1 },
    { question_id: freqQuestion.id, label: "Co dwa tygodnie", price_delta: 0, price_multiplier: 0.9, position: 2 },
  ]);
  if (freqOptionsError) throw freqOptionsError;

  const { data: extrasQuestion, error: extrasError } = await admin
    .from("questions")
    .insert({
      calculator_id: calculator.id,
      label: "Dodatki",
      type: "checkbox",
      position: 2,
      required: false,
    })
    .select("id")
    .single();
  if (extrasError) throw extrasError;

  const { error: extrasOptionsError } = await admin.from("options").insert([
    { question_id: extrasQuestion.id, label: "Mycie okien", price_delta: 50, price_multiplier: 1, position: 0 },
    { question_id: extrasQuestion.id, label: "Czyszczenie lodówki", price_delta: 30, price_multiplier: 1, position: 1 },
  ]);
  if (extrasOptionsError) throw extrasOptionsError;

  console.log(`Seeded demo calculator "${DEMO_SLUG}" (${calculator.id})`);
  console.log(`Questions: ${areaQuestion.id}, ${freqQuestion.id}, ${extrasQuestion.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
