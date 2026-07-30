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
