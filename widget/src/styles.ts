export const WIDGET_CSS = `
:host { all: initial; }
.wk-widget {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: 480px;
  border: 1px solid #e2e2e2;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  color: #1a1a1a;
  font-size: 14px;
  line-height: 1.4;
}
.wk-widget *, .wk-widget *::before, .wk-widget *::after { box-sizing: border-box; }
.wk-progress { height: 6px; background: #eee; border-radius: 999px; overflow: hidden; margin-bottom: 16px; }
.wk-progress-bar { height: 100%; background: #2563eb; transition: width .2s ease; }
.wk-step h3 { margin: 0 0 8px; font-size: 18px; }
.wk-hint { color: #666; font-size: 13px; margin: 0 0 12px; }
.wk-slider input[type="range"] { width: 100%; }
.wk-slider-value { font-weight: 600; margin-top: 4px; }
.wk-options { display: flex; flex-direction: column; gap: 8px; }
.wk-option { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; }
.wk-option-selected { border-color: #2563eb; background: #eff6ff; }
.wk-step label { display: block; font-size: 13px; margin-bottom: 12px; }
.wk-step input[type="text"],
.wk-step input[type="email"],
.wk-step input[type="tel"] {
  width: 100%;
  margin-top: 4px;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}
.wk-actions { display: flex; justify-content: space-between; gap: 8px; margin-top: 16px; }
.wk-btn { padding: 10px 16px; border-radius: 8px; border: none; font-size: 14px; cursor: pointer; font-family: inherit; }
.wk-btn-primary { background: #2563eb; color: #fff; }
.wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
.wk-btn-secondary { background: #f3f4f6; color: #1a1a1a; }
.wk-btn-secondary:disabled { opacity: .3; cursor: not-allowed; }
.wk-result { text-align: center; padding: 12px 0; }
.wk-price { font-size: 28px; font-weight: 700; color: #2563eb; margin: 8px 0; }
.wk-center { padding: 24px; text-align: center; color: #666; }
.wk-error { color: #dc2626; }
`;
