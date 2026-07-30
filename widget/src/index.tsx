import { render } from "preact";
import { App } from "./App";
import { WIDGET_CSS } from "./styles";

function mount(scriptEl: HTMLScriptElement) {
  const slug = scriptEl.dataset.calculator;
  if (!slug) {
    console.error("[wycenik] Brak atrybutu data-calculator na tagu <script>.");
    return;
  }
  const apiBase = scriptEl.dataset.apiBase ?? new URL(scriptEl.src).origin;

  const host = document.createElement("div");
  scriptEl.insertAdjacentElement("afterend", host);

  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = WIDGET_CSS;
  shadow.appendChild(style);

  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  render(<App apiBase={apiBase} slug={slug} />, mountPoint);
}

const current = document.currentScript as HTMLScriptElement | null;
if (current) {
  mount(current);
} else {
  console.error("[wycenik] Nie można zlokalizować tagu <script> widgetu.");
}
