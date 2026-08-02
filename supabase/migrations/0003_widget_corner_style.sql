-- Widget visual variant: controls border-radius across the card, options
-- and inputs (buttons stay pill-shaped in every variant).

alter table calculators
  add column corner_style text not null default 'rounded'
    check (corner_style in ('sharp', 'rounded', 'soft'));
