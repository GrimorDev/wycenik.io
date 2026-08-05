"use client";

import { useActionState, useState } from "react";
import { FieldHint } from "@/components/calculator/FieldHint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { updateCalculatorDetails, type ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

interface Props {
  calculatorId: string;
  name: string;
  description: string | null;
  basePrice: number;
  currency: string;
  estimateSpreadPercent: number;
}

export function DetailsForm({
  calculatorId,
  name,
  description,
  basePrice,
  currency,
  estimateSpreadPercent,
}: Props) {
  const action = updateCalculatorDetails.bind(null, calculatorId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [spread, setSpread] = useState(Math.round(estimateSpreadPercent * 100));

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="calc-name">Nazwa</Label>
        <Input id="calc-name" name="name" required defaultValue={name} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="calc-description">Opis (opcjonalnie)</Label>
        <textarea
          id="calc-description"
          name="description"
          defaultValue={description ?? ""}
          rows={2}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5" htmlFor="calc-base-price">
            Cena bazowa
            <FieldHint>Minimalna kwota, od której zaczynasz wycenę — np. koszt dojazdu lub minimalna wartość zlecenia.</FieldHint>
          </Label>
          <Input id="calc-base-price" name="base_price" type="number" step="0.01" defaultValue={basePrice} className="font-mono" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="calc-currency">Waluta</Label>
          <Input id="calc-currency" name="currency" defaultValue={currency} className="font-mono" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          Widełki wyceny: ±{spread}%
          <FieldHint>Zalecane 10–15%. Klienci chętniej zostawiają kontakt, widząc przedział cenowy (np. 1500–1800 zł), niż jedną sztywną kwotę.</FieldHint>
        </Label>
        <Slider value={[spread]} min={0} max={40} step={1} onValueChange={([v]) => setSpread(v ?? 0)} />
        <input type="hidden" name="estimate_spread_percent" value={spread} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" variant="brand" disabled={pending}>
        {pending ? "Zapisywanie…" : "Zapisz zmiany"}
      </Button>
    </form>
  );
}
