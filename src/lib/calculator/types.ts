export type QuestionType = "number_slider" | "single_choice" | "checkbox";

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  unit?: string;
  pricePerUnit: number;
}

export interface CalculatorOption {
  id: string;
  label: string;
  priceDelta: number;
  priceMultiplier: number;
  position: number;
}

export interface NumberSliderQuestion {
  id: string;
  type: "number_slider";
  label: string;
  required: boolean;
  position: number;
  config: SliderConfig;
  options?: never;
}

export interface ChoiceQuestion {
  id: string;
  type: "single_choice" | "checkbox";
  label: string;
  required: boolean;
  position: number;
  config?: Record<string, never>;
  options: CalculatorOption[];
}

export type CalculatorQuestion = NumberSliderQuestion | ChoiceQuestion;

export interface CalculatorConfig {
  id: string;
  name: string;
  basePrice: number;
  currency: string;
  /** Fractional spread applied around the point estimate, e.g. 0.15 = +/-15%. */
  estimateSpreadPercent: number;
  /** Widget accent color as a hex string, e.g. "#b54b24". */
  accentColor: string;
  locale: "pl" | "en";
  cornerStyle: "sharp" | "rounded" | "soft";
  /** Full palette overrides; null means auto-adapt to light/dark preference. */
  bgColor: string | null;
  textColor: string | null;
  borderColor: string | null;
  questions: CalculatorQuestion[];
}

export type Answer =
  | { questionId: string; type: "number_slider"; value: number }
  | { questionId: string; type: "single_choice"; optionId: string }
  | { questionId: string; type: "checkbox"; optionIds: string[] };

export type AnswersMap = Record<string, Answer>;

export interface PriceBreakdownEntry {
  questionId: string;
  label: string;
  amount: number;
}

export interface PriceEstimate {
  point: number;
  min: number;
  max: number;
  currency: string;
  breakdown: PriceBreakdownEntry[];
}
