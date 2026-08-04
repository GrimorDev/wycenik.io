-- Industry/category label shown in the calculators list, e.g.
-- "Usługi porządkowe" or "Własny scenariusz" for calculators built from
-- scratch.
alter table calculators
  add column industry text not null default 'Własny scenariusz';
