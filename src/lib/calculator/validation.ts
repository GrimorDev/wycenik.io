// Shared between the admin app (server-side enforcement) and the widget
// bundle (client-side UX) — keep this file framework-free.

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Accepts a 9-digit Polish number, optionally prefixed with the 48 country code. */
export function isValidPolishPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length === 9) return true;
  if (digitsOnly.length === 11 && digitsOnly.startsWith("48")) return true;
  return false;
}
