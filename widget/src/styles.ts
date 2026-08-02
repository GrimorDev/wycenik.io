export const WIDGET_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

:host {
  all: initial;
  --wk-paper: #ffffff;
  --wk-ink: #1e1b16;
  --wk-ink-soft: #6b6357;
  --wk-rust: #b54b24;
  --wk-rust-dark: #8a3a1b;
  --wk-line: #e4dac5;
  --wk-line-strong: #d2c4a3;
  --wk-tint: #fbf0e4;
  --wk-radius: 14px;
}

@media (prefers-color-scheme: dark) {
  :host {
    --wk-paper: #201f24;
    --wk-ink: #ede9e2;
    --wk-ink-soft: #9e9a92;
    --wk-rust: #e08a52;
    --wk-rust-dark: #f0a06c;
    --wk-line: #2c2a30;
    --wk-line-strong: #3a373e;
    --wk-tint: #2c2317;
  }
}

.wk-widget {
  font-family: "Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  max-width: 480px;
  border: 1px solid var(--wk-line);
  border-radius: var(--wk-radius);
  padding: 22px;
  box-sizing: border-box;
  background: var(--wk-paper);
  color: var(--wk-ink);
  font-size: 14px;
  line-height: 1.45;
  box-shadow: 0 1px 0 var(--wk-line-strong);
}
.wk-widget *, .wk-widget *::before, .wk-widget *::after { box-sizing: border-box; }

.wk-progress { height: 5px; background: var(--wk-line); border-radius: 999px; overflow: hidden; margin-bottom: 18px; }
.wk-progress-bar { height: 100%; background: var(--wk-rust); transition: width .25s ease; }

.wk-step h3 {
  margin: 0 0 6px;
  font-family: "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.01em;
}
.wk-hint { color: var(--wk-ink-soft); font-size: 13px; margin: 0 0 14px; }

.wk-slider input[type="range"] {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--wk-line-strong);
  border-radius: 999px;
  outline: none;
}
.wk-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--wk-rust);
  border: 3px solid var(--wk-paper);
  box-shadow: 0 0 0 1.5px var(--wk-rust);
  cursor: pointer;
}
.wk-slider input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--wk-rust);
  border: 3px solid var(--wk-paper);
  box-shadow: 0 0 0 1.5px var(--wk-rust);
  cursor: pointer;
}
.wk-slider-value {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-weight: 600;
  margin-top: 10px;
  font-size: 15px;
}

.wk-options { display: flex; flex-direction: column; gap: 8px; }
.wk-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 13px;
  border: 1.5px solid var(--wk-line);
  border-radius: calc(var(--wk-radius) * 0.7);
  cursor: pointer;
  transition: border-color .15s ease, background-color .15s ease;
}
.wk-option:hover { border-color: var(--wk-line-strong); }
.wk-option-selected { border-color: var(--wk-rust); background: var(--wk-tint); }
.wk-option input { accent-color: var(--wk-rust); width: 16px; height: 16px; flex-shrink: 0; }

.wk-step label { display: block; font-size: 13px; margin-bottom: 12px; color: var(--wk-ink-soft); }
.wk-step input[type="text"],
.wk-step input[type="email"],
.wk-step input[type="tel"] {
  width: 100%;
  margin-top: 5px;
  padding: 9px 11px;
  border: 1.5px solid var(--wk-line-strong);
  border-radius: calc(var(--wk-radius) * 0.65);
  font-size: 14px;
  font-family: inherit;
  background: var(--wk-paper);
  color: var(--wk-ink);
}
.wk-step input:focus {
  outline: none;
  border-color: var(--wk-rust);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wk-rust) 18%, transparent);
}

.wk-actions { display: flex; justify-content: space-between; gap: 8px; margin-top: 18px; }
.wk-btn {
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: transform .1s ease, background-color .15s ease, opacity .15s ease;
}
.wk-btn:active { transform: scale(0.97); }
.wk-btn-primary { background: var(--wk-rust); color: var(--wk-paper); }
.wk-btn-primary:hover { background: var(--wk-rust-dark); }
.wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
.wk-btn-secondary { background: transparent; color: var(--wk-ink-soft); border: 1.5px solid var(--wk-line-strong); }
.wk-btn-secondary:disabled { opacity: .3; cursor: not-allowed; }

.wk-result { text-align: center; padding: 8px 0 4px; }
.wk-result-label {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--wk-rust);
  border: 1.5px solid var(--wk-rust);
  border-radius: 999px;
  padding: 3px 10px;
  display: inline-block;
  transform: rotate(-2deg);
}
.wk-price {
  font-family: "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  font-size: 30px;
  color: var(--wk-ink);
  margin: 12px 0 6px;
}
.wk-center { padding: 28px; text-align: center; color: var(--wk-ink-soft); }
.wk-error { color: #c0392b; }

.wk-powered {
  margin: 16px 0 0;
  padding-top: 12px;
  border-top: 1px solid var(--wk-line);
  text-align: center;
  font-size: 11px;
  color: var(--wk-ink-soft);
}
.wk-powered a {
  color: inherit;
  font-weight: 600;
  text-decoration: none;
}
.wk-powered a:hover { text-decoration: underline; }
`;
