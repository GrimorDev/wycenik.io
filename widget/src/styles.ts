export const WIDGET_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

:host {
  all: initial;
  --wk-paper: #ffffff;
  --wk-ink: #1e1b16;
  --wk-rust: #b54b24;
  --wk-line: #e4dac5;
  --wk-radius: 14px;
  /* Derived tones so overriding the four vars above always produces a
     coherent look, instead of needing a matching "dark" shade for each. */
  --wk-ink-soft: color-mix(in srgb, var(--wk-ink) 68%, var(--wk-paper));
  --wk-line-strong: color-mix(in srgb, var(--wk-line) 55%, var(--wk-ink));
  --wk-rust-hover: color-mix(in srgb, var(--wk-rust) 85%, black);
  --wk-tint: color-mix(in srgb, var(--wk-rust) 10%, var(--wk-paper));
  --wk-shadow: 0 1px 2px rgba(20, 15, 5, 0.04), 0 16px 40px -12px rgba(20, 15, 5, 0.18);
}

@media (prefers-color-scheme: dark) {
  :host {
    --wk-paper: #201f24;
    --wk-ink: #ede9e2;
    --wk-rust: #e08a52;
    --wk-line: #2c2a30;
    --wk-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 16px 40px -12px rgba(0, 0, 0, 0.5);
  }
}

.wk-widget {
  font-family: "Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  max-width: 480px;
  border: 1px solid var(--wk-line);
  border-radius: var(--wk-radius);
  padding: 26px;
  box-sizing: border-box;
  background: var(--wk-paper);
  color: var(--wk-ink);
  font-size: 14px;
  line-height: 1.45;
  box-shadow: var(--wk-shadow);
}
.wk-widget *, .wk-widget *::before, .wk-widget *::after { box-sizing: border-box; }

.wk-progress-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--wk-ink-soft);
}
.wk-progress-pct {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-weight: 600;
  color: var(--wk-rust);
}
.wk-progress { height: 6px; background: var(--wk-line); border-radius: 999px; overflow: hidden; margin-bottom: 20px; }
.wk-progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--wk-rust), color-mix(in srgb, var(--wk-rust) 70%, white));
  transition: width .3s cubic-bezier(.4,0,.2,1);
}

.wk-step h3 {
  margin: 0 0 6px;
  font-family: "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.01em;
}
.wk-hint { color: var(--wk-ink-soft); font-size: 13px; margin: 0 0 16px; }

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
  box-shadow: 0 0 0 1.5px var(--wk-rust), 0 2px 6px rgba(0,0,0,.15);
  cursor: pointer;
}
.wk-slider input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--wk-rust);
  border: 3px solid var(--wk-paper);
  box-shadow: 0 0 0 1.5px var(--wk-rust), 0 2px 6px rgba(0,0,0,.15);
  cursor: pointer;
}
.wk-slider-value {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-weight: 600;
  margin-top: 12px;
  font-size: 16px;
}

.wk-options { display: flex; flex-direction: column; gap: 9px; }
.wk-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 15px;
  border: 1.5px solid var(--wk-line);
  border-radius: calc(var(--wk-radius) * 0.7);
  cursor: pointer;
  transition: border-color .15s ease, background-color .15s ease, transform .1s ease;
}
.wk-option:hover { border-color: var(--wk-line-strong); background: color-mix(in srgb, var(--wk-ink) 3%, var(--wk-paper)); }
.wk-option:active { transform: scale(0.99); }
.wk-option-selected, .wk-option-selected:hover { border-color: var(--wk-rust); background: var(--wk-tint); }

.wk-option-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.wk-option-indicator {
  flex-shrink: 0;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  border: 2px solid var(--wk-line-strong);
  background: var(--wk-paper);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color .15s ease, background-color .15s ease, transform .15s ease;
}
.wk-option-indicator-square { border-radius: 6px; }
.wk-option-selected .wk-option-indicator {
  border-color: var(--wk-rust);
  background: var(--wk-rust);
  transform: scale(1.05);
}
.wk-check {
  width: 13px;
  height: 13px;
  color: var(--wk-paper);
  opacity: 0;
  transform: scale(0.4);
  transition: opacity .15s ease, transform .15s ease;
}
.wk-option-selected .wk-check { opacity: 1; transform: scale(1); }

.wk-option-label { flex: 1; }

.wk-step label { display: block; font-size: 13px; margin-bottom: 12px; color: var(--wk-ink-soft); }
.wk-step input[type="text"],
.wk-step input[type="email"],
.wk-step input[type="tel"] {
  width: 100%;
  margin-top: 5px;
  padding: 10px 12px;
  border: 1.5px solid var(--wk-line-strong);
  border-radius: calc(var(--wk-radius) * 0.65);
  font-size: 14px;
  font-family: inherit;
  background: var(--wk-paper);
  color: var(--wk-ink);
  transition: border-color .15s ease, box-shadow .15s ease;
}
.wk-step input:focus {
  outline: none;
  border-color: var(--wk-rust);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wk-rust) 18%, transparent);
}

.wk-actions { display: flex; justify-content: space-between; gap: 8px; margin-top: 20px; }
.wk-btn {
  padding: 11px 20px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: transform .12s ease, background-color .15s ease, opacity .15s ease, box-shadow .15s ease;
}
.wk-btn:active { transform: scale(0.96); }
.wk-btn-primary {
  background: var(--wk-rust);
  color: var(--wk-paper);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--wk-rust) 35%, transparent);
}
.wk-btn-primary:hover { background: var(--wk-rust-hover); transform: translateY(-1px); box-shadow: 0 4px 14px color-mix(in srgb, var(--wk-rust) 45%, transparent); }
.wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }
.wk-btn-secondary { background: transparent; color: var(--wk-ink-soft); border: 1.5px solid var(--wk-line-strong); }
.wk-btn-secondary:hover:not(:disabled) { border-color: var(--wk-ink-soft); color: var(--wk-ink); }
.wk-btn-secondary:disabled { opacity: .3; cursor: not-allowed; }

.wk-result { text-align: center; padding: 10px 0 4px; }
.wk-result-label {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--wk-rust);
  border: 1.5px solid var(--wk-rust);
  border-radius: 999px;
  padding: 4px 12px;
  display: inline-block;
  transform: rotate(-2deg);
}
.wk-price {
  font-family: "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 800;
  font-size: 34px;
  letter-spacing: -0.01em;
  color: var(--wk-ink);
  margin: 14px 0 6px;
}
.wk-center { padding: 30px; text-align: center; color: var(--wk-ink-soft); }
.wk-error { color: #c0392b; }

.wk-powered {
  margin: 18px 0 0;
  padding-top: 14px;
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
