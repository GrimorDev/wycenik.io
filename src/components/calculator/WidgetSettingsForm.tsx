"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWidgetTheme, type ActionState } from "@/lib/actions/calculators";
import { cn } from "@/lib/cn";
import type { Locale } from "../../../widget/src/strings";
import { WidgetPreview } from "./WidgetPreview";

const initialState: ActionState = { error: null };

type CornerStyle = "sharp" | "rounded" | "soft";

const CORNER_LABELS: Record<CornerStyle, string> = {
  sharp: "Ostre",
  rounded: "Zaokrąglone",
  soft: "Bardzo zaokrąglone",
};

const DEFAULT_BG = "#ffffff";
const DEFAULT_TEXT = "#1e1b16";
const DEFAULT_BORDER = "#e4dac5";

interface Props {
  calculatorId: string;
  accentColor: string;
  locale: Locale;
  cornerStyle: CornerStyle;
  bgColor: string | null;
  textColor: string | null;
  borderColor: string | null;
  allowedDomain: string | null;
}

export function WidgetSettingsForm({
  calculatorId,
  accentColor,
  locale,
  cornerStyle,
  bgColor,
  textColor,
  borderColor,
  allowedDomain,
}: Props) {
  const [color, setColor] = useState(accentColor);
  const [loc, setLoc] = useState<Locale>(locale);
  const [corner, setCorner] = useState<CornerStyle>(cornerStyle);
  const [customPalette, setCustomPalette] = useState(Boolean(bgColor && textColor && borderColor));
  const [bg, setBg] = useState(bgColor ?? DEFAULT_BG);
  const [text, setText] = useState(textColor ?? DEFAULT_TEXT);
  const [border, setBorder] = useState(borderColor ?? DEFAULT_BORDER);

  const action = updateWidgetTheme.bind(null, calculatorId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="grid max-w-3xl gap-8 md:grid-cols-2">
      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="accent-color">Kolor akcentu</Label>
          <div className="flex items-center gap-2">
            <input
              id="accent-color"
              type="color"
              name="accent_color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1"
            />
            <span className="font-mono text-xs text-muted-foreground">{color}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="widget-locale">Język widgetu</Label>
          <select
            id="widget-locale"
            name="locale"
            value={loc}
            onChange={(e) => setLoc(e.target.value as Locale)}
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
                variant={corner === key ? "brand" : "outline"}
                size="sm"
                onClick={() => setCorner(key)}
              >
                {CORNER_LABELS[key]}
              </Button>
            ))}
            <input type="hidden" name="corner_style" value={corner} />
          </div>
        </div>

        <div className="space-y-3 border-t border-border pt-5">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="use_custom_palette"
              checked={customPalette}
              onChange={(e) => setCustomPalette(e.target.checked)}
              className="accent-brand"
            />
            Własne kolory tła, tekstu i obramowania
          </label>
          <p className="text-xs text-muted-foreground">
            Wyłączone: widget sam dopasowuje się do jasnego/ciemnego motywu odwiedzającego.
          </p>

          {customPalette && (
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Tło</Label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    name="bg_color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-md border border-input bg-transparent p-1"
                  />
                  <span className="font-mono text-xs">{bg}</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tekst</Label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    name="text_color"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-md border border-input bg-transparent p-1"
                  />
                  <span className="font-mono text-xs">{text}</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Obramowanie</Label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    name="border_color"
                    value={border}
                    onChange={(e) => setBorder(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-md border border-input bg-transparent p-1"
                  />
                  <span className="font-mono text-xs">{border}</span>
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

      <div>
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Podgląd na żywo</p>
        <div className={cn("flex justify-center rounded-xl border border-border bg-card p-6")}>
          <WidgetPreview
            accentColor={color}
            locale={loc}
            cornerStyle={corner}
            bgColor={customPalette ? bg : null}
            textColor={customPalette ? text : null}
            borderColor={customPalette ? border : null}
          />
        </div>
      </div>
    </div>
  );
}
