-- Optional domain restriction for the widget. Null (default) means "allow
-- embedding on any domain" — the current behavior. When set, the widget's
-- public API routes reject requests whose Origin doesn't match, as a
-- best-effort deterrent against copy-pasting someone else's embed code
-- (not a strict security boundary: requests without an Origin header
-- degrade to "allowed", since that's indistinguishable from same-origin
-- testing).

alter table calculators
  add column allowed_domain text;
