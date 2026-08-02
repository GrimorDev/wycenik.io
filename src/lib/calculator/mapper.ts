import type {
  CalculatorConfig,
  CalculatorOption,
  CalculatorQuestion,
  SliderConfig,
} from "@/lib/calculator/types";

export interface RawOption {
  id: string;
  label: string;
  price_delta: number;
  price_multiplier: number;
  position: number;
}

export interface RawQuestion {
  id: string;
  label: string;
  type: "number_slider" | "single_choice" | "checkbox";
  config: Record<string, unknown>;
  position: number;
  required: boolean;
  options: RawOption[];
}

export interface RawCalculator {
  id: string;
  name: string;
  base_price: number;
  currency: string;
  estimate_spread_percent: number;
  accent_color: string;
  locale: "pl" | "en";
  corner_style: "sharp" | "rounded" | "soft";
  bg_color: string | null;
  text_color: string | null;
  border_color: string | null;
  questions: RawQuestion[];
}

function mapOption(option: RawOption): CalculatorOption {
  return {
    id: option.id,
    label: option.label,
    priceDelta: Number(option.price_delta),
    priceMultiplier: Number(option.price_multiplier),
    position: option.position,
  };
}

function mapQuestion(question: RawQuestion): CalculatorQuestion {
  const base = {
    id: question.id,
    label: question.label,
    required: question.required,
    position: question.position,
  };

  if (question.type === "number_slider") {
    return {
      ...base,
      type: "number_slider",
      config: question.config as unknown as SliderConfig,
    };
  }

  return {
    ...base,
    type: question.type,
    options: [...question.options]
      .sort((a, b) => a.position - b.position)
      .map(mapOption),
  };
}

export function toCalculatorConfig(row: RawCalculator): CalculatorConfig {
  return {
    id: row.id,
    name: row.name,
    basePrice: Number(row.base_price),
    currency: row.currency,
    estimateSpreadPercent: Number(row.estimate_spread_percent),
    accentColor: row.accent_color,
    locale: row.locale,
    cornerStyle: row.corner_style,
    bgColor: row.bg_color,
    textColor: row.text_color,
    borderColor: row.border_color,
    questions: [...row.questions]
      .sort((a, b) => a.position - b.position)
      .map(mapQuestion),
  };
}
