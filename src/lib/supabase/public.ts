import { createClient } from "@supabase/supabase-js";

/**
 * Untyped anon-key client for public, unauthenticated reads (e.g. the
 * embeddable widget fetching a published calculator's config). Nested
 * selects across tables aren't representable in our hand-written Database
 * type, so callers should validate/cast the shape at the boundary — see
 * lib/calculator/mapper.ts.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
