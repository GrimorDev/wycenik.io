import type {
  AnswersMap,
  CalculatorConfig,
  PriceBreakdownEntry,
  PriceEstimate,
} from "@/lib/calculator/types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Computes a Min/Max price estimate from a calculator config and a set of
 * answers. Deltas (number_slider value * pricePerUnit, option priceDelta)
 * are summed into a subtotal on top of basePrice; option priceMultiplier
 * values are applied multiplicatively to that subtotal. The result is then
 * spread into a range using the calculator's estimateSpreadPercent.
 */
export function calculatePrice(
  config: CalculatorConfig,
  answers: AnswersMap,
): PriceEstimate {
  const breakdown: PriceBreakdownEntry[] = [];
  let subtotal = config.basePrice;
  let multiplier = 1;

  for (const question of config.questions) {
    const answer = answers[question.id];

    if (!answer) {
      if (question.required) {
        throw new Error(`Missing answer for required question "${question.id}"`);
      }
      continue;
    }

    if (question.type === "number_slider") {
      if (answer.type !== "number_slider") {
        throw new Error(`Answer type mismatch for question "${question.id}"`);
      }
      const value = clamp(answer.value, question.config.min, question.config.max);
      const amount = value * question.config.pricePerUnit;
      subtotal += amount;
      breakdown.push({ questionId: question.id, label: question.label, amount });
      continue;
    }

    // single_choice / checkbox
    const optionIds =
      answer.type === "single_choice"
        ? [answer.optionId]
        : answer.type === "checkbox"
          ? answer.optionIds
          : (() => {
              throw new Error(`Answer type mismatch for question "${question.id}"`);
            })();

    for (const optionId of optionIds) {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) {
        throw new Error(`Unknown option "${optionId}" for question "${question.id}"`);
      }
      subtotal += option.priceDelta;
      multiplier *= option.priceMultiplier;
      breakdown.push({
        questionId: question.id,
        label: `${question.label}: ${option.label}`,
        amount: option.priceDelta,
      });
    }
  }

  const point = Math.max(0, round2(subtotal * multiplier));
  const spread = config.estimateSpreadPercent;

  return {
    point,
    min: Math.max(0, round2(point * (1 - spread))),
    max: round2(point * (1 + spread)),
    currency: config.currency,
    breakdown,
  };
}
