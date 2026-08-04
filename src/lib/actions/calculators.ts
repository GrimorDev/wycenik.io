"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CALCULATOR_TEMPLATES } from "@/lib/calculator/templates";
import { FREE_PLAN, getPlanUsage } from "@/lib/plans";
import { randomSlugSuffix, slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

const CALCULATOR_LIMIT_ERROR = `Osiągnięto limit planu Free (${FREE_PLAN.maxCalculators} kalkulator). Przejdź na wyższy plan, aby dodać kolejny.`;

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

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

// The slug is derived from the name (no manual slug field in the UI), so a
// collision just means retrying with a random suffix rather than surfacing
// an error the user has no field to fix.
async function insertCalculatorWithUniqueSlug(
  supabase: SupabaseServerClient,
  base: { user_id: string; name: string; base_price: number; currency?: string; industry?: string },
): Promise<{ id: string } | { error: string }> {
  const baseSlug = slugify(base.name);

  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${randomSlugSuffix()}`;
    const { data, error } = await supabase
      .from("calculators")
      .insert({ ...base, slug })
      .select("id")
      .single();

    if (!error) return { id: data.id };
    if (error.code !== "23505") return { error: "Nie udało się utworzyć kalkulatora." };
  }

  return { error: "Nie udało się utworzyć kalkulatora." };
}

export async function createCalculator(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const basePrice = Number(formData.get("base_price") ?? 0);

  if (!name) return { error: "Nazwa jest wymagana." };

  const supabase = await createClient();
  const usage = await getPlanUsage(supabase, userId);
  if (usage.calculatorCount >= usage.maxCalculators) {
    return { error: CALCULATOR_LIMIT_ERROR };
  }

  const result = await insertCalculatorWithUniqueSlug(supabase, {
    user_id: userId,
    name,
    base_price: Number.isFinite(basePrice) ? basePrice : 0,
  });

  if ("error" in result) return { error: result.error };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/calculators");
  redirect(`/dashboard/calculators/${result.id}`);
}

export async function createCalculatorFromTemplate(
  templateKey: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) return { error: "Nazwa jest wymagana." };

  const template = CALCULATOR_TEMPLATES.find((t) => t.key === templateKey);
  if (!template) return { error: "Nieznany szablon." };

  const supabase = await createClient();
  const usage = await getPlanUsage(supabase, userId);
  if (usage.calculatorCount >= usage.maxCalculators) {
    return { error: CALCULATOR_LIMIT_ERROR };
  }

  const result = await insertCalculatorWithUniqueSlug(supabase, {
    user_id: userId,
    name,
    industry: template.industry,
    base_price: template.basePrice,
    currency: template.currency,
  });

  if ("error" in result) return { error: result.error };
  const calculator = { id: result.id };

  for (const [qIndex, question] of template.questions.entries()) {
    const { data: createdQuestion, error: qError } = await supabase
      .from("questions")
      .insert({
        calculator_id: calculator.id,
        label: question.label,
        type: question.type,
        required: question.required,
        position: qIndex,
        config: question.config ?? {},
      })
      .select("id")
      .single();

    if (qError || !createdQuestion || !question.options?.length) continue;

    await supabase.from("options").insert(
      question.options.map((option, oIndex) => ({
        question_id: createdQuestion.id,
        label: option.label,
        price_delta: option.priceDelta,
        price_multiplier: option.priceMultiplier,
        position: oIndex,
      })),
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/calculators");
  redirect(`/dashboard/calculators/${calculator.id}`);
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

  if (!name) return { error: "Nazwa jest wymagana." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("calculators")
    .update({
      name,
      description: description || null,
      base_price: Number.isFinite(basePrice) ? basePrice : 0,
      currency: currency || "PLN",
      estimate_spread_percent: Number.isFinite(spreadPercent) ? spreadPercent : 0.15,
    })
    .eq("id", calculatorId);

  if (error) return { error: "Nie udało się zapisać zmian." };

  revalidatePath(`/dashboard/calculators/${calculatorId}`);
  return { error: null };
}

export async function updateWidgetTheme(
  calculatorId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();
  const accentColor = String(formData.get("accent_color") ?? "#b54b24").trim();
  const locale = formData.get("locale") === "en" ? "en" : "pl";
  const cornerStyle = String(formData.get("corner_style") ?? "rounded");
  const useCustomPalette = formData.get("use_custom_palette") === "on";
  const bgColor = String(formData.get("bg_color") ?? "#ffffff").trim();
  const textColor = String(formData.get("text_color") ?? "#1e1b16").trim();
  const borderColor = String(formData.get("border_color") ?? "#e4dac5").trim();
  const allowedDomainInput = String(formData.get("allowed_domain") ?? "").trim();

  const HEX_RE = /^#[0-9a-fA-F]{6}$/;
  if (!HEX_RE.test(accentColor)) {
    return { error: "Kolor akcentu musi być w formacie hex, np. #b54b24." };
  }
  if (!["sharp", "rounded", "soft"].includes(cornerStyle)) {
    return { error: "Nieprawidłowy wariant kształtu." };
  }
  if (useCustomPalette && !(HEX_RE.test(bgColor) && HEX_RE.test(textColor) && HEX_RE.test(borderColor))) {
    return { error: "Kolory palety muszą być w formacie hex." };
  }

  let allowedDomain: string | null = null;
  if (allowedDomainInput) {
    try {
      const withProtocol = /^https?:\/\//i.test(allowedDomainInput)
        ? allowedDomainInput
        : `https://${allowedDomainInput}`;
      allowedDomain = new URL(withProtocol).hostname;
    } catch {
      return { error: "Nieprawidłowa domena. Podaj np. mojafirma.pl." };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("calculators")
    .update({
      accent_color: accentColor,
      locale,
      corner_style: cornerStyle as "sharp" | "rounded" | "soft",
      bg_color: useCustomPalette ? bgColor : null,
      text_color: useCustomPalette ? textColor : null,
      border_color: useCustomPalette ? borderColor : null,
      allowed_domain: allowedDomain,
    })
    .eq("id", calculatorId);

  if (error) return { error: "Nie udało się zapisać wyglądu widgetu." };

  revalidatePath(`/dashboard/calculators/${calculatorId}`);
  revalidatePath(`/dashboard/calculators/${calculatorId}/widget`);
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
  revalidatePath("/dashboard/calculators");
}

export async function deleteCalculator(calculatorId: string) {
  await requireUserId();
  const supabase = await createClient();
  await supabase.from("calculators").delete().eq("id", calculatorId);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/calculators");
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
  const hint = String(formData.get("hint") ?? "").trim();
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
    hint: hint || null,
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
  const hint = String(formData.get("hint") ?? "").trim();
  const required = formData.get("required") === "on";
  const type = String(formData.get("type") ?? "");

  if (!label) return { error: "Treść pytania jest wymagana." };

  const update: {
    label: string;
    hint: string | null;
    required: boolean;
    config?: Record<string, unknown>;
  } = {
    label,
    hint: hint || null,
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

export async function moveQuestion(
  calculatorId: string,
  questionId: string,
  direction: "up" | "down",
) {
  await requireUserId();
  const supabase = await createClient();

  const { data: questions } = await supabase
    .from("questions")
    .select("id,position")
    .eq("calculator_id", calculatorId)
    .order("position", { ascending: true });

  if (!questions) return;

  const index = questions.findIndex((q) => q.id === questionId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= questions.length) return;

  const current = questions[index];
  const swapWith = questions[swapIndex];

  await Promise.all([
    supabase.from("questions").update({ position: swapWith.position }).eq("id", current.id),
    supabase.from("questions").update({ position: current.position }).eq("id", swapWith.id),
  ]);

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

// ── webhooks ───────────────────────────────────────────────────────────

export async function updateWebhookUrl(
  calculatorId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();
  const webhookUrl = String(formData.get("webhook_url") ?? "").trim();

  if (webhookUrl && !/^https:\/\//i.test(webhookUrl)) {
    return { error: "Adres webhooka musi zaczynać się od https://." };
  }

  const supabase = await createClient();

  const update: { webhook_url: string | null; webhook_secret?: string } = {
    webhook_url: webhookUrl || null,
  };

  if (webhookUrl) {
    const { data: existing } = await supabase
      .from("calculators")
      .select("webhook_secret")
      .eq("id", calculatorId)
      .single();
    if (!existing?.webhook_secret) {
      update.webhook_secret = randomBytes(24).toString("hex");
    }
  }

  const { error } = await supabase.from("calculators").update(update).eq("id", calculatorId);
  if (error) return { error: "Nie udało się zapisać adresu webhooka." };

  revalidatePath(`/dashboard/calculators/${calculatorId}/webhooks`);
  return { error: null };
}

export async function regenerateWebhookSecret(calculatorId: string) {
  await requireUserId();
  const supabase = await createClient();
  await supabase
    .from("calculators")
    .update({ webhook_secret: randomBytes(24).toString("hex") })
    .eq("id", calculatorId);
  revalidatePath(`/dashboard/calculators/${calculatorId}/webhooks`);
}
