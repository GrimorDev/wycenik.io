import { describe, expect, it } from "vitest";
import { calculatePrice } from "@/lib/calculator/engine";
import type { CalculatorConfig } from "@/lib/calculator/types";

const config: CalculatorConfig = {
  id: "calc-1",
  name: "Kalkulator Sprzątania",
  basePrice: 100,
  currency: "PLN",
  estimateSpreadPercent: 0.1,
  questions: [
    {
      id: "q-area",
      type: "number_slider",
      label: "Metraż",
      required: true,
      position: 0,
      config: { min: 0, max: 300, step: 1, unit: "m2", pricePerUnit: 2 },
    },
    {
      id: "q-frequency",
      type: "single_choice",
      label: "Częstotliwość",
      required: true,
      position: 1,
      options: [
        { id: "opt-once", label: "Jednorazowo", priceDelta: 0, priceMultiplier: 1, position: 0 },
        { id: "opt-weekly", label: "Co tydzień", priceDelta: 0, priceMultiplier: 0.8, position: 1 },
      ],
    },
    {
      id: "q-extras",
      type: "checkbox",
      label: "Dodatki",
      required: false,
      position: 2,
      options: [
        { id: "opt-windows", label: "Mycie okien", priceDelta: 50, priceMultiplier: 1, position: 0 },
        { id: "opt-fridge", label: "Lodówka", priceDelta: 30, priceMultiplier: 1, position: 1 },
      ],
    },
  ],
};

describe("calculatePrice", () => {
  it("sums base price, slider value, and option deltas", () => {
    const result = calculatePrice(config, {
      "q-area": { questionId: "q-area", type: "number_slider", value: 50 },
      "q-frequency": { questionId: "q-frequency", type: "single_choice", optionId: "opt-once" },
    });

    // 100 base + 50*2 area = 200, multiplier 1
    expect(result.point).toBe(200);
    expect(result.min).toBe(180);
    expect(result.max).toBe(220);
    expect(result.currency).toBe("PLN");
  });

  it("applies option price multipliers on top of the subtotal", () => {
    const result = calculatePrice(config, {
      "q-area": { questionId: "q-area", type: "number_slider", value: 50 },
      "q-frequency": { questionId: "q-frequency", type: "single_choice", optionId: "opt-weekly" },
    });

    // (100 + 100) * 0.8 = 160
    expect(result.point).toBe(160);
  });

  it("sums checkbox option deltas", () => {
    const result = calculatePrice(config, {
      "q-area": { questionId: "q-area", type: "number_slider", value: 0 },
      "q-frequency": { questionId: "q-frequency", type: "single_choice", optionId: "opt-once" },
      "q-extras": {
        questionId: "q-extras",
        type: "checkbox",
        optionIds: ["opt-windows", "opt-fridge"],
      },
    });

    // 100 base + 0 area + 50 + 30 extras = 180
    expect(result.point).toBe(180);
  });

  it("skips optional questions that were not answered", () => {
    const result = calculatePrice(config, {
      "q-area": { questionId: "q-area", type: "number_slider", value: 0 },
      "q-frequency": { questionId: "q-frequency", type: "single_choice", optionId: "opt-once" },
    });

    expect(result.point).toBe(100);
    expect(result.breakdown).toHaveLength(2);
  });

  it("throws when a required question is unanswered", () => {
    expect(() =>
      calculatePrice(config, {
        "q-frequency": { questionId: "q-frequency", type: "single_choice", optionId: "opt-once" },
      }),
    ).toThrow(/Missing answer/);
  });

  it("throws when an option id does not exist on the question", () => {
    expect(() =>
      calculatePrice(config, {
        "q-area": { questionId: "q-area", type: "number_slider", value: 0 },
        "q-frequency": { questionId: "q-frequency", type: "single_choice", optionId: "does-not-exist" },
      }),
    ).toThrow(/Unknown option/);
  });

  it("clamps slider values to the configured min/max range", () => {
    const result = calculatePrice(config, {
      "q-area": { questionId: "q-area", type: "number_slider", value: 9999 },
      "q-frequency": { questionId: "q-frequency", type: "single_choice", optionId: "opt-once" },
    });

    // clamped to max=300 -> 100 + 300*2 = 700
    expect(result.point).toBe(700);
  });

  it("never returns a negative minimum", () => {
    const cheapConfig: CalculatorConfig = {
      ...config,
      basePrice: 10,
      estimateSpreadPercent: 1.5,
    };
    const result = calculatePrice(cheapConfig, {
      "q-area": { questionId: "q-area", type: "number_slider", value: 0 },
      "q-frequency": { questionId: "q-frequency", type: "single_choice", optionId: "opt-once" },
    });

    expect(result.min).toBe(0);
  });
});
