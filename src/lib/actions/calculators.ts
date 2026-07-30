"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionState {
  error: string | null;
}

async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return user.id;
}

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function createCalculator(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const basePrice = Number(formData.get("base_price") ?? 0);

  if (!name) return { error: "Nazwa jest wymagana." };
  if (!SLUG_RE.test(slug)) {
    return { error: "Slug może zawierać tylko małe litery, cyfry i myślniki." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calculators")
    .insert({
      user_id: userId,
      name,
      slug,
      base_price: Number.isFinite(basePrice) ? basePrice : 0,
    })
    .select("id")
    .single();

  if (error) {
    return {
      error: error.code === "23505" ? "Ten slug jest już zajęty." : "Nie udało się utworzyć kalkulatora.",
    };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/calculators/${data.id}`);
}

export async function updateCalculatorDetails(
  calculatorId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const basePrice = Number(formData.get("base_price") ?? 0);
  const currency = String(formData.get("currency") ?? "PLN").trim();
  const spreadPercent = Number(formData.get("estimate_spread_percent") ?? 15) / 100;
  const accentColor = String(formData.get("accent_color") ?? "#b54b24").trim();
  const locale = formData.get("locale") === "en" ? "en" : "pl";

  if (!name) return { error: "Nazwa jest wymagana." };
  if (!/^#[0-9a-fA-F]{6}$/.test(accentColor)) {
    return { error: "Kolor akcentu musi być w formacie hex, np. #b54b24." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("calculators")
    .update({
      name,
      description: description || null,
      base_price: Number.isFinite(basePrice) ? basePrice : 0,
      currency: currency || "PLN",
      estimate_spread_percent: Number.isFinite(spreadPercent) ? spreadPercent : 0.15,
      accent_color: accentColor,
      locale,
    })
    .eq("id", calculatorId);

  if (error) return { error: "Nie udało się zapisać zmian." };

  revalidatePath(`/dashboard/calculators/${calculatorId}`);
  return { error: null };
}

export async function togglePublish(calculatorId: string, isPublished: boolean) {
  await requireUserId();
  const supabase = await createClient();
  await supabase
    .from("calculators")
    .update({ is_published: isPublished })
    .eq("id", calculatorId);
  revalidatePath(`/dashboard/calculators/${calculatorId}`);
  revalidatePath("/dashboard");
}

export async function deleteCalculator(calculatorId: string) {
  await requireUserId();
  const supabase = await createClient();
  await supabase.from("calculators").delete().eq("id", calculatorId);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// ── questions ──────────────────────────────────────────────────────────

export async function addQuestion(
  calculatorId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();
  const label = String(formData.get("label") ?? "").trim();
  const type = String(formData.get("type") ?? "single_choice") as
    | "number_slider"
    | "single_choice"
    | "checkbox";
  const required = formData.get("required") === "on";

  if (!label) return { error: "Treść pytania jest wymagana." };

  const supabase = await createClient();

  const { count } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("calculator_id", calculatorId);

  const config =
    type === "number_slider"
      ? {
          min: Number(formData.get("min") ?? 0),
          max: Number(formData.get("max") ?? 100),
          step: Number(formData.get("step") ?? 1),
          unit: String(formData.get("unit") ?? "").trim() || undefined,
          pricePerUnit: Number(formData.get("price_per_unit") ?? 0),
        }
      : {};

  const { error } = await supabase.from("questions").insert({
    calculator_id: calculatorId,
    label,
    type,
    required,
    position: count ?? 0,
    config,
  });

  if (error) return { error: "Nie udało się dodać pytania." };

  revalidatePath(`/dashboard/calculators/${calculatorId}`);
  return { error: null };
}

export async function updateQuestion(
  calculatorId: string,
  questionId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();
  const label = String(formData.get("label") ?? "").trim();
  const required = formData.get("required") === "on";
  const type = String(formData.get("type") ?? "");

  if (!label) return { error: "Treść pytania jest wymagana." };

  const update: { label: string; required: boolean; config?: Record<string, unknown> } = {
    label,
    required,
  };

  if (type === "number_slider") {
    update.config = {
      min: Number(formData.get("min") ?? 0),
      max: Number(formData.get("max") ?? 100),
      step: Number(formData.get("step") ?? 1),
      unit: String(formData.get("unit") ?? "").trim() || undefined,
      pricePerUnit: Number(formData.get("price_per_unit") ?? 0),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("questions").update(update).eq("id", questionId);

  if (error) return { error: "Nie udało się zapisać pytania." };

  revalidatePath(`/dashboard/calculators/${calculatorId}`);
  return { error: null };
}

export async function deleteQuestion(calculatorId: string, questionId: string) {
  await requireUserId();
  const supabase = await createClient();
  await supabase.from("questions").delete().eq("id", questionId);
  revalidatePath(`/dashboard/calculators/${calculatorId}`);
}

// ── options ────────────────────────────────────────────────────────────

export async function addOption(
  calculatorId: string,
  questionId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();
  const label = String(formData.get("label") ?? "").trim();
  const priceDelta = Number(formData.get("price_delta") ?? 0);
  const priceMultiplier = Number(formData.get("price_multiplier") ?? 1);

  if (!label) return { error: "Treść opcji jest wymagana." };

  const supabase = await createClient();
  const { count } = await supabase
    .from("options")
    .select("id", { count: "exact", head: true })
    .eq("question_id", questionId);

  const { error } = await supabase.from("options").insert({
    question_id: questionId,
    label,
    price_delta: Number.isFinite(priceDelta) ? priceDelta : 0,
    price_multiplier: Number.isFinite(priceMultiplier) && priceMultiplier > 0 ? priceMultiplier : 1,
    position: count ?? 0,
  });

  if (error) return { error: "Nie udało się dodać opcji." };

  revalidatePath(`/dashboard/calculators/${calculatorId}`);
  return { error: null };
}

export async function updateOption(
  calculatorId: string,
  optionId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();
  const label = String(formData.get("label") ?? "").trim();
  const priceDelta = Number(formData.get("price_delta") ?? 0);
  const priceMultiplier = Number(formData.get("price_multiplier") ?? 1);

  if (!label) return { error: "Treść opcji jest wymagana." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("options")
    .update({
      label,
      price_delta: Number.isFinite(priceDelta) ? priceDelta : 0,
      price_multiplier: Number.isFinite(priceMultiplier) && priceMultiplier > 0 ? priceMultiplier : 1,
    })
    .eq("id", optionId);

  if (error) return { error: "Nie udało się zapisać opcji." };

  revalidatePath(`/dashboard/calculators/${calculatorId}`);
  return { error: null };
}

export async function deleteOption(calculatorId: string, optionId: string) {
  await requireUserId();
  const supabase = await createClient();
  await supabase.from("options").delete().eq("id", optionId);
  revalidatePath(`/dashboard/calculators/${calculatorId}`);
}
