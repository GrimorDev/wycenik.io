"use client";

import { useActionState, useState } from "react";
import { updateWidgetTheme, type ActionState } from "@/lib/actions/calculators";
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
    <div className="grid gap-8 md:grid-cols-2">
      <form action={formAction} className="space-y-5">
        <label className="block text-sm text-ink-soft">
          Kolor akcentu
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              name="accent_color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-lg border border-line-strong bg-transparent p-1"
            />
            <span className="tabular text-xs text-ink-faint">{color}</span>
          </div>
        </label>

        <label className="block text-sm text-ink-soft">
          Język widgetu
          <select
            name="locale"
            value={loc}
            onChange={(e) => setLoc(e.target.value as Locale)}
            className="field mt-1"
          >
            <option value="pl">Polski</option>
            <option value="en">English</option>
          </select>
        </label>

        <div>
          <p className="mb-2 text-sm text-ink-soft">Kształt narożników</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(CORNER_LABELS) as CornerStyle[]).map((key) => (
              <label
                key={key}
                className={`ticket-dashed cursor-pointer p-3 text-center text-xs transition-colors ${
                  corner === key ? "border-rust text-rust" : "text-ink-soft"
                }`}
              >
                <input
                  type="radio"
                  name="corner_style"
                  value={key}
                  checked={corner === key}
                  onChange={() => setCorner(key)}
                  className="sr-only"
                />
                {CORNER_LABELS[key]}
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-dashed border-line-strong pt-5">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              name="use_custom_palette"
              checked={customPalette}
              onChange={(e) => setCustomPalette(e.target.checked)}
              className="accent-rust"
            />
            Własne kolory tła, tekstu i obramowania
          </label>
          <p className="mt-1 text-xs text-ink-faint">
            Wyłączone: widget sam dopasowuje się do jasnego/ciemnego motywu odwiedzającego.
          </p>

          {customPalette && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <label className="text-xs text-ink-faint">
                Tło
                <div className="mt-1 flex items-center gap-1.5">
                  <input
                    type="color"
                    name="bg_color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border border-line-strong bg-transparent p-1"
                  />
                  <span className="tabular">{bg}</span>
                </div>
              </label>
              <label className="text-xs text-ink-faint">
                Tekst
                <div className="mt-1 flex items-center gap-1.5">
                  <input
                    type="color"
                    name="text_color"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border border-line-strong bg-transparent p-1"
                  />
                  <span className="tabular">{text}</span>
                </div>
              </label>
              <label className="text-xs text-ink-faint">
                Obramowanie
                <div className="mt-1 flex items-center gap-1.5">
                  <input
                    type="color"
                    name="border_color"
                    value={border}
                    onChange={(e) => setBorder(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border border-line-strong bg-transparent p-1"
                  />
                  <span className="tabular">{border}</span>
                </div>
              </label>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-line-strong pt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Bezpieczeństwo
          </p>
          <label className="block text-sm text-ink-soft">
            Dozwolona domena (opcjonalnie)
            <input
              name="allowed_domain"
              defaultValue={allowedDomain ?? ""}
              placeholder="mojafirma.pl"
              className="field mt-1"
            />
          </label>
          <p className="mt-1 text-xs text-ink-faint">
            Puste = widget działa wszędzie. Ustawione = widget ładuje się tylko na tej domenie
            (ochrona przed skopiowaniem kodu przez kogoś innego).
          </p>
        </div>

        {state.error && <p className="text-sm text-rust-dark">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? "Zapisywanie…" : "Zapisz wygląd"}
        </button>
      </form>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
          Podgląd na żywo
        </p>
        <div className="ticket flex justify-center p-6">
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
