import type { AnswersMap, CalculatorConfig } from "../../src/lib/calculator/types";

export interface LeadEstimate {
  min: number;
  max: number;
  currency: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  answers: AnswersMap;
}

export async function fetchCalculatorConfig(
  apiBase: string,
  slug: string,
): Promise<CalculatorConfig> {
  const res = await fetch(`${apiBase}/api/calculators/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    throw new Error("Nie udało się wczytać kalkulatora.");
  }
  return res.json();
}

export async function submitLead(
  apiBase: string,
  slug: string,
  payload: LeadPayload,
): Promise<LeadEstimate> {
  const res = await fetch(
    `${apiBase}/api/calculators/${encodeURIComponent(slug)}/leads`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Nie udało się wysłać formularza.");
  }
  return data as LeadEstimate;
}
