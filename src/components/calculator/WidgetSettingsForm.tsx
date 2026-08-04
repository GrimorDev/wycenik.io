"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWidgetTheme, type ActionState } from "@/lib/actions/calculators";
import type { Locale } from "../../../widget/src/strings";

const initialState: ActionState = { error: null };

export type CornerStyle = "sharp" | "rounded" | "soft";

const CORNER_LABELS: Record<CornerStyle, string> = {
  sharp: "Ostre",
  rounded: "Zaokrąglone",
  soft: "Bardzo zaokrąglone",
};

export interface WidgetTheme {
  color: string;
  locale: Locale;
  corner: CornerStyle;
  customPalette: boolean;
  bg: string;
  text: string;
  border: string;
}

interface Props {
  calculatorId: string;
  theme: WidgetTheme;
  onThemeChange: (patch: Partial<WidgetTheme>) => void;
  allowedDomain: string | null;
}

export function WidgetSettingsForm({ calculatorId, theme, onThemeChange, allowedDomain }: Props) {
  const action = updateWidgetTheme.bind(null, calculatorId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="accent-color">Kolor akcentu</Label>
        <div className="flex items-center gap-2">
          <input
            id="accent-color"
            type="color"
            name="accent_color"
            value={theme.color}
            onChange={(e) => onThemeChange({ color: e.target.value })}
            className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1"
          />
          <span className="font-mono text-xs text-muted-foreground">{theme.color}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="widget-locale">Język widgetu</Label>
        <select
          id="widget-locale"
          name="locale"
          value={theme.locale}
          onChange={(e) => onThemeChange({ locale: e.target.value as Locale })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="pl">Polski</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Kształt narożników</Label>
        <div className="flex gap-2">
          {(Object.keys(CORNER_LABELS) as CornerStyle[]).map((key) => (
            <Button
              key={key}
              type="button"
              variant={theme.corner === key ? "brand" : "outline"}
              size="sm"
              onClick={() => onThemeChange({ corner: key })}
            >
              {CORNER_LABELS[key]}
            </Button>
          ))}
          <input type="hidden" name="corner_style" value={theme.corner} />
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-5">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="use_custom_palette"
            checked={theme.customPalette}
            onChange={(e) => onThemeChange({ customPalette: e.target.checked })}
            className="accent-brand"
          />
          Własne kolory tła, tekstu i obramowania
        </label>
        <p className="text-xs text-muted-foreground">
          Wyłączone: widget sam dopasowuje się do jasnego/ciemnego motywu odwiedzającego.
        </p>

        {theme.customPalette && (
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Tło</Label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  name="bg_color"
                  value={theme.bg}
                  onChange={(e) => onThemeChange({ bg: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded-md border border-input bg-transparent p-1"
                />
                <span className="font-mono text-xs">{theme.bg}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Tekst</Label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  name="text_color"
                  value={theme.text}
                  onChange={(e) => onThemeChange({ text: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded-md border border-input bg-transparent p-1"
                />
                <span className="font-mono text-xs">{theme.text}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Obramowanie</Label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  name="border_color"
                  value={theme.border}
                  onChange={(e) => onThemeChange({ border: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded-md border border-input bg-transparent p-1"
                />
                <span className="font-mono text-xs">{theme.border}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-border pt-5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Bezpieczeństwo</p>
        <div className="space-y-1.5">
          <Label htmlFor="allowed-domain">Dozwolona domena (opcjonalnie)</Label>
          <Input id="allowed-domain" name="allowed_domain" defaultValue={allowedDomain ?? ""} placeholder="mojafirma.pl" />
        </div>
        <p className="text-xs text-muted-foreground">
          Puste = widget działa wszędzie. Ustawione = widget ładuje się tylko na tej domenie
          (ochrona przed skopiowaniem kodu przez kogoś innego).
        </p>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" variant="brand" disabled={pending}>
        {pending ? "Zapisywanie…" : "Zapisz wygląd"}
      </Button>
    </form>
  );
}
