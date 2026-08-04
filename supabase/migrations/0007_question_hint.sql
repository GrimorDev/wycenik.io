-- Optional helper text shown under a question in the widget, e.g.
-- "Podaj powierzchnię użytkową".
alter table questions
  add column hint text;
