-- Optional full color overrides for the widget. Null means "keep adapting
-- automatically to the visitor's light/dark preference" (current default);
-- once set, all three are applied as a fixed palette regardless of
-- prefers-color-scheme.

alter table calculators
  add column bg_color text,
  add column text_color text,
  add column border_color text;
