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
    throw new Error("load_failed");
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
  if (!res.ok) {
    // Don't surface the server's internal validation message to the widget UI;
    // App.tsx shows a localized, generic error instead.
    throw new Error("submit_failed");
  }
  return (await res.json()) as LeadEstimate;
}
