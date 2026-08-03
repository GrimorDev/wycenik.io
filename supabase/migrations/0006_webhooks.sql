-- Per-calculator outbound webhook, fired (async, best-effort) whenever a
-- lead is created. webhook_secret is used to HMAC-sign delivery payloads
-- so receivers can verify authenticity.

alter table calculators
  add column webhook_url text,
  add column webhook_secret text;

create table webhook_logs (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references calculators (id) on delete cascade,
  status_code integer,
  response_time_ms integer,
  attempts integer not null default 1,
  error text,
  created_at timestamptz not null default now()
);

create index webhook_logs_calculator_id_idx on webhook_logs (calculator_id);

alter table webhook_logs enable row level security;

create policy "webhook_logs are readable by calculator owner"
  on webhook_logs for select
  using (
    exists (
      select 1 from calculators c
      where c.id = webhook_logs.calculator_id and c.user_id = auth.uid()
    )
  );

-- No insert/update/delete policies for anon/authenticated: log rows are
-- written exclusively by the server-side admin client after each
-- delivery attempt.
