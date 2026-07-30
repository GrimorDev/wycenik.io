-- Domain-aware view tracking, lead source domain, and per-calculator widget
-- theming (accent color, language).

alter table calculators
  add column accent_color text not null default '#b54b24',
  add column locale text not null default 'pl' check (locale in ('pl', 'en'));

alter table leads
  add column source_domain text;

create table calculator_views (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references calculators (id) on delete cascade,
  source_domain text,
  created_at timestamptz not null default now()
);

create index calculator_views_calculator_id_idx on calculator_views (calculator_id);

alter table calculator_views enable row level security;

create policy "calculator_views are readable by calculator owner"
  on calculator_views for select
  using (
    exists (
      select 1 from calculators c
      where c.id = calculator_views.calculator_id and c.user_id = auth.uid()
    )
  );

-- No insert/update/delete policies for anon/authenticated: view events are
-- written exclusively through the server-side admin client when the widget
-- fetches its config.
