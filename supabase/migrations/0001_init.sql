-- Wycenik.io initial schema: profiles, calculators, questions, options, leads.

create extension if not exists "pgcrypto";

-- ── profiles ────────────────────────────────────────────────────────────
-- One row per authenticated user, extends auth.users.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_name text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are self-readable"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles are self-updatable"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── calculators ─────────────────────────────────────────────────────────
create table calculators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  base_price numeric not null default 0,
  currency text not null default 'PLN',
  -- Estimates are shown as a min/max range: total * (1 - spread) .. total * (1 + spread).
  estimate_spread_percent numeric not null default 0.15,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index calculators_user_id_idx on calculators (user_id);

alter table calculators enable row level security;

create policy "calculators are owner-readable"
  on calculators for select
  using (auth.uid() = user_id);

create policy "published calculators are publicly readable"
  on calculators for select
  using (is_published = true);

create policy "calculators are owner-writable"
  on calculators for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── questions ───────────────────────────────────────────────────────────
create table questions (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references calculators (id) on delete cascade,
  label text not null,
  type text not null check (type in ('number_slider', 'single_choice', 'checkbox')),
  -- e.g. { "min": 0, "max": 200, "step": 1, "unit": "m2", "price_per_unit": 15 }
  config jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  required boolean not null default true,
  created_at timestamptz not null default now()
);

create index questions_calculator_id_idx on questions (calculator_id);

alter table questions enable row level security;

create policy "questions are readable when calculator is readable"
  on questions for select
  using (
    exists (
      select 1 from calculators c
      where c.id = questions.calculator_id
        and (c.user_id = auth.uid() or c.is_published = true)
    )
  );

create policy "questions are writable by calculator owner"
  on questions for all
  using (
    exists (
      select 1 from calculators c
      where c.id = questions.calculator_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from calculators c
      where c.id = questions.calculator_id and c.user_id = auth.uid()
    )
  );

-- ── options ─────────────────────────────────────────────────────────────
-- Choices for single_choice / checkbox questions. Not used by number_slider.
create table options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions (id) on delete cascade,
  label text not null,
  price_delta numeric not null default 0,
  price_multiplier numeric not null default 1,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index options_question_id_idx on options (question_id);

alter table options enable row level security;

create policy "options are readable when calculator is readable"
  on options for select
  using (
    exists (
      select 1 from questions q
      join calculators c on c.id = q.calculator_id
      where q.id = options.question_id
        and (c.user_id = auth.uid() or c.is_published = true)
    )
  );

create policy "options are writable by calculator owner"
  on options for all
  using (
    exists (
      select 1 from questions q
      join calculators c on c.id = q.calculator_id
      where q.id = options.question_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from questions q
      join calculators c on c.id = q.calculator_id
      where q.id = options.question_id and c.user_id = auth.uid()
    )
  );

-- ── leads ───────────────────────────────────────────────────────────────
-- Written server-side only (service-role client), after gated capture.
create table leads (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references calculators (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  answers jsonb not null default '{}'::jsonb,
  estimated_min numeric not null,
  estimated_max numeric not null,
  created_at timestamptz not null default now()
);

create index leads_calculator_id_idx on leads (calculator_id);

alter table leads enable row level security;

create policy "leads are readable by calculator owner"
  on leads for select
  using (
    exists (
      select 1 from calculators c
      where c.id = leads.calculator_id and c.user_id = auth.uid()
    )
  );

-- No insert/update/delete policies for anon/authenticated: leads are
-- written exclusively through the server-side admin client after the
-- widget submits the gated lead-capture form.
