// Starter question sets so a new user doesn't face a blank calculator.
// Pure data — safe to import from both server actions and client components.

export interface TemplateOption {
  label: string;
  priceDelta: number;
  priceMultiplier: number;
}

export interface TemplateQuestion {
  label: string;
  type: "number_slider" | "single_choice" | "checkbox";
  required: boolean;
  config?: { min: number; max: number; step: number; unit?: string; pricePerUnit: number };
  options?: TemplateOption[];
}

export interface CalculatorTemplate {
  key: string;
  title: string;
  industry: string;
  description: string;
  basePrice: number;
  currency: string;
  questions: TemplateQuestion[];
}

export const CALCULATOR_TEMPLATES: CalculatorTemplate[] = [
  {
    key: "sprzatanie",
    title: "Sprzątanie",
    industry: "Usługi porządkowe",
    description: "Metraż, częstotliwość i dodatki jak mycie okien czy pranie dywanów.",
    basePrice: 80,
    currency: "PLN",
    questions: [
      {
        label: "Metraż mieszkania",
        type: "number_slider",
        required: true,
        config: { min: 0, max: 300, step: 5, unit: "m2", pricePerUnit: 2 },
      },
      {
        label: "Częstotliwość sprzątania",
        type: "single_choice",
        required: true,
        options: [
          { label: "Jednorazowo", priceDelta: 0, priceMultiplier: 1 },
          { label: "Co tydzień", priceDelta: 0, priceMultiplier: 0.85 },
          { label: "Co dwa tygodnie", priceDelta: 0, priceMultiplier: 0.92 },
        ],
      },
      {
        label: "Dodatki",
        type: "checkbox",
        required: false,
        options: [
          { label: "Mycie okien", priceDelta: 50, priceMultiplier: 1 },
          { label: "Czyszczenie lodówki", priceDelta: 30, priceMultiplier: 1 },
          { label: "Pranie dywanów", priceDelta: 80, priceMultiplier: 1 },
        ],
      },
    ],
  },
  {
    key: "wykonczenia",
    title: "Wykończenia wnętrz i remonty",
    industry: "Budownictwo",
    description: "Metraż, stan mieszkania i zakres prac (łazienka, kuchnia, podłogi).",
    basePrice: 500,
    currency: "PLN",
    questions: [
      {
        label: "Metraż do wykończenia",
        type: "number_slider",
        required: true,
        config: { min: 20, max: 250, step: 5, unit: "m2", pricePerUnit: 120 },
      },
      {
        label: "Stan mieszkania",
        type: "single_choice",
        required: true,
        options: [
          { label: "Stan deweloperski", priceDelta: 0, priceMultiplier: 1 },
          { label: "Stan wtórny / do remontu", priceDelta: 0, priceMultiplier: 1.2 },
        ],
      },
      {
        label: "Zakres prac",
        type: "checkbox",
        required: false,
        options: [
          { label: "Łazienka — płytki i armatura", priceDelta: 3000, priceMultiplier: 1 },
          { label: "Kuchnia — zabudowa", priceDelta: 8000, priceMultiplier: 1 },
          { label: "Podłogi", priceDelta: 2500, priceMultiplier: 1 },
          { label: "Malowanie ścian", priceDelta: 1500, priceMultiplier: 1 },
        ],
      },
    ],
  },
  {
    key: "strony-www",
    title: "Strony WWW i marketing",
    industry: "Agencja interaktywna",
    description: "Typ strony, liczba podstron i usługi dodatkowe jak SEO czy copywriting.",
    basePrice: 1500,
    currency: "PLN",
    questions: [
      {
        label: "Typ strony",
        type: "single_choice",
        required: true,
        options: [
          { label: "Strona wizytówka", priceDelta: 0, priceMultiplier: 1 },
          { label: "Landing page", priceDelta: 500, priceMultiplier: 1 },
          { label: "Sklep internetowy", priceDelta: 3000, priceMultiplier: 1.1 },
        ],
      },
      {
        label: "Liczba podstron",
        type: "number_slider",
        required: true,
        config: { min: 1, max: 20, step: 1, unit: "podstron", pricePerUnit: 150 },
      },
      {
        label: "Dodatkowe usługi",
        type: "checkbox",
        required: false,
        options: [
          { label: "Copywriting", priceDelta: 800, priceMultiplier: 1 },
          { label: "Integracja płatności", priceDelta: 600, priceMultiplier: 1 },
          { label: "SEO na start", priceDelta: 1000, priceMultiplier: 1 },
        ],
      },
    ],
  },
];
