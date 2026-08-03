import { createHmac } from "node:crypto";
import type { AnswersMap, CalculatorConfig, PriceEstimate } from "@/lib/calculator/types";
import { createAdminClient } from "@/lib/supabase/admin";

const REQUEST_TIMEOUT_MS = 10_000;

interface LeadWebhookInput {
  calculatorId: string;
  webhookUrl: string | null;
  webhookSecret: string | null;
  name: string;
  email: string;
  phone: string;
  config: CalculatorConfig;
  answers: AnswersMap;
  estimate: PriceEstimate;
}

interface WebhookAnswer {
  question_id: string;
  title: string;
  value: string;
}

function describeAnswer(
  config: CalculatorConfig,
  questionId: string,
  answer: AnswersMap[string],
): WebhookAnswer | null {
  const question = config.questions.find((q) => q.id === questionId);
  if (!question) return null;

  if (answer.type === "number_slider") {
    const unit = question.type === "number_slider" ? question.config.unit : undefined;
    return {
      question_id: questionId,
      title: question.label,
      value: unit ? `${answer.value} ${unit}` : String(answer.value),
    };
  }

  const options = question.type !== "number_slider" ? question.options : [];

  if (answer.type === "single_choice") {
    const option = options.find((o) => o.id === answer.optionId);
    return { question_id: questionId, title: question.label, value: option?.label ?? answer.optionId };
  }

  const labels = answer.optionIds.map((optionId) => options.find((o) => o.id === optionId)?.label ?? optionId);
  return { question_id: questionId, title: question.label, value: labels.join(", ") };
}

/**
 * Fire-and-forget: callers should invoke this without awaiting so a slow or
 * unreachable receiver never delays the widget's own response to the
 * end customer. Every attempt (success or failure) is logged.
 */
export async function dispatchLeadWebhook(input: LeadWebhookInput): Promise<void> {
  if (!input.webhookUrl) return;

  const payload = {
    event: "lead.created",
    created_at: new Date().toISOString(),
    calculator: { id: input.calculatorId, name: input.config.name },
    lead: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      answers: Object.entries(input.answers)
        .map(([questionId, answer]) => describeAnswer(input.config, questionId, answer))
        .filter((entry): entry is WebhookAnswer => entry !== null),
    },
    summary: {
      total_price: input.estimate.point,
      price_min: input.estimate.min,
      price_max: input.estimate.max,
      currency: input.estimate.currency,
    },
  };

  const body = JSON.stringify(payload);
  const signature = input.webhookSecret
    ? createHmac("sha256", input.webhookSecret).update(body).digest("hex")
    : null;

  const startedAt = Date.now();
  let statusCode: number | null = null;
  let errorMessage: string | null = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(input.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(signature ? { "X-Wycenik-Signature": `sha256=${signature}` } : {}),
        },
        body,
        signal: controller.signal,
      });
      statusCode = res.status;
    } finally {
      clearTimeout(timeout);
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Unknown error";
  }

  const responseTimeMs = Date.now() - startedAt;

  try {
    await createAdminClient().from("webhook_logs").insert({
      calculator_id: input.calculatorId,
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      attempts: 1,
      error: errorMessage,
    });
  } catch {
    // Logging is best-effort; a failure here must not surface anywhere.
  }
}
