/**
 * Best-effort hostname of the page embedding the widget, derived from the
 * Origin header (present on cross-origin fetch/CORS requests) with a
 * Referer fallback. Never throws; returns null when neither is present or
 * parseable.
 */
export function extractSourceDomain(request: Request): string | null {
  const origin = request.headers.get("origin") ?? request.headers.get("referer");
  if (!origin) return null;
  try {
    return new URL(origin).hostname;
  } catch {
    return null;
  }
}

function normalizeDomain(domain: string): string {
  return domain.trim().toLowerCase().replace(/^www\./, "");
}

/**
 * Best-effort domain restriction check: not a strict security boundary
 * (requests without a determinable Origin degrade to "allowed"), just a
 * deterrent against someone copy-pasting another site's embed snippet.
 */
export function isDomainAllowed(allowedDomain: string | null, sourceDomain: string | null): boolean {
  if (!allowedDomain) return true;
  if (!sourceDomain) return true;
  return normalizeDomain(sourceDomain) === normalizeDomain(allowedDomain);
}
