import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

/**
 * Supabase client for server-side data fetching.
 * Returns null if env vars are not configured (falls back to mock data).
 */
export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Helper to get localized field from JSONB column.
 * e.g., row.title = { en: "Shelter", fr: "Abri" }
 *       localize(row.title, "fr") → "Abri"
 */
export function localize(
  field: Record<string, string> | string | undefined | null,
  locale: string
): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[locale] || field["en"] || "";
}
