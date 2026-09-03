import { getSupabase, localize } from "@/lib/supabase";

type Locale = "en" | "fr";

export async function getHomepageData(locale: Locale) {
  // Always load translations as the base
  const en = (await import("@/messages/en.json")).default;
  const fr = (await import("@/messages/fr.json")).default;
  const t = locale === "fr" ? fr : en;

  const supabase = getSupabase();

  if (!supabase) {
    // No Supabase — use translations only
    return buildFromTranslations(t);
  }

  // Supabase is configured — fetch from database and merge
  const { data: homepage } = await supabase
    .from("homepage")
    .select("*")
    .limit(1)
    .single();

  const [{ data: programs }, { data: stats }, { data: storiesData }] =
    await Promise.all([
      supabase.from("work_programs").select("*").eq("active", true).order("sort_order"),
      supabase.from("impact_stats").select("*").eq("active", true).order("sort_order"),
      supabase.from("stories").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(5),
    ]);

  // Merge: translations provide static labels, Supabase provides dynamic content
  const heroFromDb = homepage ? localizeJsonb(homepage.hero, locale) : null;
  const missionFromDb = homepage ? localizeJsonb(homepage.mission, locale) : null;
  const urgentBandFromDb = homepage ? localizeJsonb(homepage.urgent_band, locale) : null;
  const impactFromDb = homepage ? localizeJsonb(homepage.impact, locale) : null;
  const donateFromDb = homepage ? localizeJsonb(homepage.donate, locale) : null;

  return {
    hero: heroFromDb && Object.keys(heroFromDb).length > 0
      ? { ...t.hero, ...heroFromDb }
      : t.hero,

    urgentBand: urgentBandFromDb && Object.keys(urgentBandFromDb).length > 0
      ? { ...t.urgentBand, ...urgentBandFromDb }
      : t.urgentBand,

    mission: missionFromDb && Object.keys(missionFromDb).length > 0
      ? { ...t.mission, ...missionFromDb }
      : t.mission,

    work: {
      eyebrow: t.work.eyebrow,
      heading: t.work.heading,
      headingAccent: t.work.headingAccent,
      items: (programs && programs.length > 0)
        ? programs.map((p, i) => ({
            number: `0${i + 1}`,
            title: localize(p.title, locale),
            description: localize(p.description, locale),
          }))
        : [1, 2, 3].map((i) => ({
            number: `0${i}`,
            title: t.work[`title${i}` as keyof typeof t.work] as string,
            description: t.work[`desc${i}` as keyof typeof t.work] as string,
          })),
    },

    impactStats: (stats && stats.length > 0)
      ? stats.map((s) => ({
          kicker: localize(s.kicker, locale),
          number: s.number,
          suffix: s.suffix || "",
          label: localize(s.label, locale),
        }))
      : [1, 2, 3, 4].map((i) => ({
          kicker: t.impact[`kicker${i}` as keyof typeof t.impact] as string,
          number: t.impact[`number${i}` as keyof typeof t.impact] as string,
          suffix: (t.impact[`suffix${i}` as keyof typeof t.impact] as string) || "",
          label: t.impact[`label${i}` as keyof typeof t.impact] as string,
        })),

    // Impact section heading comes from translations + DB override
    impact: impactFromDb && Object.keys(impactFromDb).length > 0
      ? { heading: t.impact.heading, headingLine2: t.impact.headingLine2, description: t.impact.description, ...impactFromDb }
      : { heading: t.impact.heading, headingLine2: t.impact.headingLine2, description: t.impact.description },

    stories: {
      eyebrow: t.stories.eyebrow,
      heading: t.stories.heading,
      headingLine2: t.stories.headingLine2,
      prevAria: t.stories.prevAria,
      nextAria: t.stories.nextAria,
      readAll: t.stories.readAll,
      items: (storiesData && storiesData.length > 0)
        ? storiesData.map((s) => ({
            id: s.id,
            tag: localize(s.tag, locale),
            tagVariant: s.tag_variant || "default",
            imagePlaceholder: s.image_url || localize(s.image_placeholder, locale),
            meta: s.location || "",
            title: localize(s.title, locale),
          }))
        : [1, 2, 3, 4, 5].map((i) => ({
            id: String(i),
            tag: t.stories[`tag${i}` as keyof typeof t.stories] as string,
            tagVariant: i === 1 || i === 4 ? "success" : i === 2 || i === 5 ? "ongoing" : "default",
            imagePlaceholder: t.stories[`img${i}` as keyof typeof t.stories] as string,
            meta: t.stories[`meta${i}` as keyof typeof t.stories] as string,
            title: t.stories[`title${i}` as keyof typeof t.stories] as string,
          })),
    },

    donate: donateFromDb && Object.keys(donateFromDb).length > 0
      ? { ...t.donate, ...donateFromDb }
      : t.donate,

    nav: t.nav,
    footer: t.footer,
  };
}

function buildFromTranslations(t: any) {
  return {
    hero: t.hero,
    urgentBand: t.urgentBand,
    mission: t.mission,
    impact: {
      heading: t.impact.heading,
      headingLine2: t.impact.headingLine2,
      description: t.impact.description,
    },
    stories: {
      eyebrow: t.stories.eyebrow,
      heading: t.stories.heading,
      headingLine2: t.stories.headingLine2,
      prevAria: t.stories.prevAria,
      nextAria: t.stories.nextAria,
      readAll: t.stories.readAll,
      items: [1, 2, 3, 4, 5].map((i: number) => ({
        id: String(i),
        tag: t.stories[`tag${i}`] as string,
        tagVariant: i === 1 || i === 4 ? "success" : i === 2 || i === 5 ? "ongoing" : "default",
        imagePlaceholder: t.stories[`img${i}`] as string,
        meta: t.stories[`meta${i}`] as string,
        title: t.stories[`title${i}`] as string,
      })),
    },
    donate: t.donate,
    footer: t.footer,
    nav: t.nav,
    work: {
      eyebrow: t.work.eyebrow,
      heading: t.work.heading,
      headingAccent: t.work.headingAccent,
      items: [1, 2, 3].map((i: number) => ({
        number: `0${i}`,
        title: t.work[`title${i}`] as string,
        description: t.work[`desc${i}`] as string,
      })),
    },
    impactStats: [1, 2, 3, 4].map((i: number) => ({
      kicker: t.impact[`kicker${i}`] as string,
      number: t.impact[`number${i}`] as string,
      suffix: (t.impact[`suffix${i}`] as string) || "",
      label: t.impact[`label${i}`] as string,
    })),
  };
}

function localizeJsonb(field: Record<string, Record<string, string>> | undefined | null, locale: string) {
  if (!field) return {};
  return field[locale] || field["en"] || field;
}
