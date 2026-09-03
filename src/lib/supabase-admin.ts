import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using the secret key.
 * Use ONLY in Server Actions / server-side code.
 * Bypasses RLS — full access for CRUD operations.
 */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SECRET_KEY!;
  if (!url || !key) throw new Error("Missing Supabase admin credentials");
  return createClient(url, key);
}
