import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSupabase } from "@/lib/supabase";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://iwacu.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/about", "/stories", "/donate"];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  // Published stories, both locales
  const supabase = getSupabase();
  if (supabase) {
    const { data: stories } = await supabase
      .from("stories")
      .select("slug, updated_at")
      .eq("status", "published");

    for (const story of stories || []) {
      for (const locale of routing.locales) {
        entries.push({
          url: `${BASE_URL}/${locale}/stories/${story.slug}`,
          lastModified: story.updated_at,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
