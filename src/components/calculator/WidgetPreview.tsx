"use client";

import { useEffect, useRef } from "react";
import { WIDGET_CSS } from "../../../widget/src/styles";
import { STRINGS, type Locale } from "../../../widget/src/strings";

interface Props {
  accentColor: string;
  locale: Locale;
  cornerStyle: "sharp" | "rounded" | "soft";
  bgColor: string | null;
  textColor: string | null;
  borderColor: string | null;
}

const RADIUS_MAP: Record<Props["cornerStyle"], string> = {
  sharp: "4px",
  rounded: "14px",
  soft: "28px",
};

const SVG_NS = "http://www.w3.org/2000/svg";

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function checkIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "wk-check");
  svg.setAttribute("viewBox", "0 0 16 16");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M3.5 8.5l3 3 6-6.5");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
}

function buildWidgetPreview(
  t: (typeof STRINGS)["pl"],
  locale: Locale,
  style: string,
): HTMLDivElement {
  const widget = el("div", "wk-widget");
  widget.setAttribute("style", style);

  const progressRow = el("div", "wk-progress-row");
  progressRow.appendChild(el("span", undefined, `${t.step} 2 ${t.stepOf} 4`));
  progressRow.appendChild(el("span", "wk-progress-pct", "45%"));
  widget.appendChild(progressRow);

  const progress = el("div", "wk-progress");
  const progressBar = el("div", "wk-progress-bar");
  progressBar.style.width = "45%";
  progress.appendChild(progressBar);
  widget.appendChild(progress);

  const step = el("div", "wk-step");
  step.appendChild(el("h3", undefined, locale === "en" ? "Sample question" : "Przykładowe pytanie"));

  const options = el("div", "wk-options");
  const optionLabels = locale === "en" ? ["Option A", "Option B"] : ["Opcja A", "Opcja B"];
  optionLabels.forEach((label, i) => {
    const option = el("label", i === 0 ? "wk-option wk-option-selected" : "wk-option");
    const input = document.createElement("input");
    input.type = "radio";
    input.className = "wk-option-input";
    input.disabled = true;
    if (i === 0) input.checked = true;
    const indicator = el("span", "wk-option-indicator");
    indicator.appendChild(checkIcon());
    option.appendChild(input);
    option.appendChild(indicator);
    option.appendChild(el("span", "wk-option-label", label));
    options.appendChild(option);
  });
  step.appendChild(options);

  const actions = el("div", "wk-actions");
  const backBtn = el("button", "wk-btn wk-btn-secondary", t.back);
  backBtn.type = "button";
  backBtn.disabled = true;
  const nextBtn = el("button", "wk-btn wk-btn-primary", t.next);
  nextBtn.type = "button";
  nextBtn.disabled = true;
  actions.appendChild(backBtn);
  actions.appendChild(nextBtn);
  step.appendChild(actions);
  widget.appendChild(step);

  const powered = el("p", "wk-powered");
  powered.appendChild(document.createTextNode("Powered by "));
  powered.appendChild(el("a", undefined, "Wycenik.io"));
  widget.appendChild(powered);

  return widget;
}

export function WidgetPreview({ accentColor, locale, cornerStyle, bgColor, textColor, borderColor }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || shadowRef.current) return;
    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = WIDGET_CSS;
    shadow.appendChild(style);
    shadowRef.current = shadow;
  }, []);

  useEffect(() => {
    const shadow = shadowRef.current;
    if (!shadow) return;
    const previous = shadow.querySelector(".wk-widget");
    if (previous) previous.remove();

    const t = STRINGS[locale];
    const cssStyle = [
      `--wk-rust:${accentColor}`,
      `--wk-radius:${RADIUS_MAP[cornerStyle]}`,
      bgColor && `--wk-paper:${bgColor}`,
      textColor && `--wk-ink:${textColor}`,
      borderColor && `--wk-line:${borderColor}`,
    ]
      .filter(Boolean)
      .join(";");
    shadow.appendChild(buildWidgetPreview(t, locale, cssStyle));
  }, [accentColor, locale, cornerStyle, bgColor, textColor, borderColor]);

  return <div ref={hostRef} />;
}
