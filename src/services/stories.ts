import { getSupabase, localize } from "@/lib/supabase";

type Locale = "en" | "fr";

export async function getPublishedStories(locale: Locale) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return null;

  return data.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: localize(s.title, locale),
    excerpt: localize(s.excerpt, locale),
    body: localize(s.body, locale),
    imagePlaceholder: s.image_url || localize(s.image_placeholder, locale),
    tag: localize(s.tag, locale),
    tagVariant: s.tag_variant || "default",
    meta: s.location || "",
    location: s.location || "",
    category: s.category || "",
    authorName: s.author_name || "",
    authorInitials: s.author_initials || "",
    readTime: s.read_time || 5,
    isFeatured: s.is_featured,
    publishedAt: s.published_at,
  }));
}

export async function getStoryBySlug(slug: string, locale: Locale) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: localize(data.title, locale),
    excerpt: localize(data.excerpt, locale),
    body: localize(data.body, locale),
    imagePlaceholder: data.image_url || localize(data.image_placeholder, locale),
    tag: localize(data.tag, locale),
    tagVariant: data.tag_variant || "default",
    meta: data.location || "",
    location: data.location || "",
    category: data.category || "",
    authorName: data.author_name || "",
    authorInitials: data.author_initials || "",
    readTime: data.read_time || 5,
    isFeatured: data.is_featured,
    publishedAt: data.published_at,
  };
}

export async function getRelatedStories(currentSlug: string, locale: Locale, limit = 3) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("stories")
    .select("*")
    .eq("status", "published")
    .neq("slug", currentSlug)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: localize(s.title, locale),
    excerpt: localize(s.excerpt, locale),
    imagePlaceholder: s.image_url || localize(s.image_placeholder, locale),
    tag: localize(s.tag, locale),
    tagVariant: s.tag_variant || "default",
    meta: s.location || "",
  }));
}
