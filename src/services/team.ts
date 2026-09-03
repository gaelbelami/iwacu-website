import { getSupabase, localize } from "@/lib/supabase";

type Locale = "en" | "fr";

export async function getActiveTeamMembers(locale: Locale) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  if (error || !data) return null;

  return data.map((m) => ({
    id: m.id,
    name: localize(m.name, locale),
    role: localize(m.role, locale),
    bio: localize(m.bio, locale),
    imagePlaceholder: m.image_url || localize(m.image_placeholder, locale),
  }));
}
