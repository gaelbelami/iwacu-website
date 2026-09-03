/* ═══════════════════════════════════════════════════════════
   Seed script — syncs translation content into Supabase.
   Run after applying migrations:
     npx tsx supabase/seed/seed.ts

   SAFETY RULES (important!):
   - team_members is NEVER touched here. Real team members,
     names and photos are managed exclusively through the admin
     panel (Supabase). The fictional 2018–2026 members from the
     original seed were removed on 2026-08-07.
   - timeline_events rows are deleted (the previous 2018–2026
     milestones were placeholder fiction; the section is hidden
     on the About page until real milestones exist).
   - Legacy fictional stories are deleted by id, then replaced
     with honest founding-story articles drawn from the Vision
     ICC document.
   ═══════════════════════════════════════════════════════════ */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const key =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

if (!key) {
  console.error(
    "Missing SUPABASE_SECRET_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(url, key);

// Load translations
const en = JSON.parse(
  readFileSync(join(__dirname, "../../src/messages/en.json"), "utf-8")
);
const fr = JSON.parse(
  readFileSync(join(__dirname, "../../src/messages/fr.json"), "utf-8")
);

async function upsert(table: string, data: Record<string, unknown>[]) {
  const { error } = await supabase.from(table).upsert(data, {
    onConflict: "id",
    ignoreDuplicates: false,
  });
  if (error) console.error(`  ✗ ${table}:`, error.message);
  else console.log(`  ✓ ${table}: ${data.length} row(s)`);
}

async function removeRows(table: string, ids: string[]) {
  if (ids.length === 0) return;
  const { error } = await supabase.from(table).delete().in("id", ids);
  if (error) console.error(`  ✗ ${table} delete:`, error.message);
  else console.log(`  ✓ ${table}: removed ${ids.length} legacy row(s)`);
}

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ─── Site Settings ──────────────────────────────────────
  await upsert("site_settings", [
    {
      id: "00000000-0000-0000-0000-000000000001",
      site_name: "Iwacu Collective Center",
      email: "iwacucollective@gmail.com",
      locations: [{ city: "Bujumbura", country: "Burundi", is_hq: true }],
      legal_name: "IWACU COLLECTIVE CENTER",
      // No registration number yet — the organization is in formation.
      registration_number: "",
      content: {
        en: {
          nav: en.nav,
          footer: en.footer,
          meta: en.meta,
        },
        fr: {
          nav: fr.nav,
          footer: fr.footer,
          meta: fr.meta,
        },
      },
    },
  ]);

  // ─── Homepage ───────────────────────────────────────────
  await upsert("homepage", [
    {
      id: "00000000-0000-0000-0000-000000000001",
      hero: {
        en: en.hero,
        fr: fr.hero,
      },
      urgent_band: {
        en: en.urgentBand,
        fr: fr.urgentBand,
      },
      mission: {
        en: en.mission,
        fr: fr.mission,
      },
      impact: {
        en: { heading: en.impact.heading, headingLine2: en.impact.headingLine2, description: en.impact.description },
        fr: { heading: fr.impact.heading, headingLine2: fr.impact.headingLine2, description: fr.impact.description },
      },
      donate: {
        en: en.donate,
        fr: fr.donate,
      },
      footer_content: {
        en: en.footer,
        fr: fr.footer,
      },
    },
  ]);

  // ─── Work Programs (three umbrellas over the nine pillars) ──
  await upsert("work_programs", [
    {
      id: "10000000-0000-0000-0000-000000000001",
      sort_order: 1,
      title: { en: en.work.title1, fr: fr.work.title1 },
      description: { en: en.work.desc1, fr: fr.work.desc1 },
    },
    {
      id: "10000000-0000-0000-0000-000000000002",
      sort_order: 2,
      title: { en: en.work.title2, fr: fr.work.title2 },
      description: { en: en.work.desc2, fr: fr.work.desc2 },
    },
    {
      id: "10000000-0000-0000-0000-000000000003",
      sort_order: 3,
      title: { en: en.work.title3, fr: fr.work.title3 },
      description: { en: en.work.desc3, fr: fr.work.desc3 },
    },
  ]);

  // ─── Impact Stats — the crisis, in sourced numbers ──────
  // (WHO 2025, UN Women 2026, World Bank 2023, MFFPS 2026 —
  //  all figures taken from the Vision ICC document.)
  await upsert("impact_stats", [
    { id: "20000000-0000-0000-0000-000000000001", sort_order: 1, kicker: { en: en.impact.kicker1, fr: fr.impact.kicker1 }, number: en.impact.number1, suffix: en.impact.suffix1 || "", label: { en: en.impact.label1, fr: fr.impact.label1 } },
    { id: "20000000-0000-0000-0000-000000000002", sort_order: 2, kicker: { en: en.impact.kicker2, fr: fr.impact.kicker2 }, number: en.impact.number2, suffix: en.impact.suffix2 || "", label: { en: en.impact.label2, fr: fr.impact.label2 } },
    { id: "20000000-0000-0000-0000-000000000003", sort_order: 3, kicker: { en: en.impact.kicker3, fr: fr.impact.kicker3 }, number: en.impact.number3, suffix: en.impact.suffix3 || "", label: { en: en.impact.label3, fr: fr.impact.label3 } },
    { id: "20000000-0000-0000-0000-000000000004", sort_order: 4, kicker: { en: en.impact.kicker4, fr: fr.impact.kicker4 }, number: en.impact.number4, suffix: en.impact.suffix4 || "", label: { en: en.impact.label4, fr: fr.impact.label4 } },
  ]);

  // ─── Stories ────────────────────────────────────────────
  // 1) Remove the legacy fictional stories (invented people and
  //    events from the July 2026 placeholder seed).
  const legacyStoryIds = [
    "30000000-0000-0000-0000-000000000001",
    "30000000-0000-0000-0000-000000000002",
    "30000000-0000-0000-0000-000000000003",
    "30000000-0000-0000-0000-000000000004",
    "30000000-0000-0000-0000-000000000005",
    "30000000-0000-0000-0000-000000000010",
    "30000000-0000-0000-0000-000000000011",
    "30000000-0000-0000-0000-000000000012",
    "30000000-0000-0000-0000-000000000013",
    "30000000-0000-0000-0000-000000000014",
    "30000000-0000-0000-0000-000000000015",
    "30000000-0000-0000-0000-000000000016",
    "30000000-0000-0000-0000-000000000020",
    "30000000-0000-0000-0000-000000000021",
    "30000000-0000-0000-0000-000000000022",
  ];
  await removeRows("stories", legacyStoryIds);

  // 2) Insert honest founding articles drawn from Vision ICC.docx.
  //    Bodies can be expanded later through the admin panel.
  const foundingStories = [
    {
      id: "31000000-0000-0000-0000-000000000001",
      slug: "why-we-are-building-iwacu",
      title: { en: en.storiesPage.featuredTitle, fr: fr.storiesPage.featuredTitle },
      excerpt: { en: en.storiesPage.featuredExcerpt, fr: fr.storiesPage.featuredExcerpt },
      image_placeholder: { en: en.storiesPage.featuredImg, fr: fr.storiesPage.featuredImg },
      tag: { en: "Voices", fr: "Voix" },
      tag_variant: "voices",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 6,
      is_featured: true,
      status: "published",
      published_at: "2026-08-07T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000002",
      slug: "gbv-burundi-the-numbers",
      title: { en: en.storiesPage.recent1Title, fr: fr.storiesPage.recent1Title },
      excerpt: { en: en.storiesPage.recent1Excerpt, fr: fr.storiesPage.recent1Excerpt },
      image_placeholder: { en: en.storiesPage.recent1Img, fr: fr.storiesPage.recent1Img },
      tag: { en: "Field", fr: "Terrain" },
      tag_variant: "field",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 5,
      status: "published",
      published_at: "2026-08-06T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000003",
      slug: "what-iwacu-means",
      title: { en: en.storiesPage.recent2Title, fr: fr.storiesPage.recent2Title },
      excerpt: { en: en.storiesPage.recent2Excerpt, fr: fr.storiesPage.recent2Excerpt },
      image_placeholder: { en: en.storiesPage.recent2Img, fr: fr.storiesPage.recent2Img },
      tag: { en: "Voices", fr: "Voix" },
      tag_variant: "voices",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 4,
      status: "published",
      published_at: "2026-08-05T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000004",
      slug: "nine-pillars-one-center",
      title: { en: en.storiesPage.recent3Title, fr: fr.storiesPage.recent3Title },
      excerpt: { en: en.storiesPage.recent3Excerpt, fr: fr.storiesPage.recent3Excerpt },
      image_placeholder: { en: en.storiesPage.recent3Img, fr: fr.storiesPage.recent3Img },
      tag: { en: "Ongoing", fr: "En cours" },
      tag_variant: "ongoing",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 6,
      status: "published",
      published_at: "2026-08-04T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000005",
      slug: "positive-masculinity",
      title: { en: en.storiesPage.recent4Title, fr: fr.storiesPage.recent4Title },
      excerpt: { en: en.storiesPage.recent4Excerpt, fr: fr.storiesPage.recent4Excerpt },
      image_placeholder: { en: en.storiesPage.recent4Img, fr: fr.storiesPage.recent4Img },
      tag: { en: "Ongoing", fr: "En cours" },
      tag_variant: "ongoing",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 5,
      status: "published",
      published_at: "2026-08-03T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000006",
      slug: "from-vision-to-ground",
      title: { en: en.storiesPage.recent5Title, fr: fr.storiesPage.recent5Title },
      excerpt: { en: en.storiesPage.recent5Excerpt, fr: fr.storiesPage.recent5Excerpt },
      image_placeholder: { en: en.storiesPage.recent5Img, fr: fr.storiesPage.recent5Img },
      tag: { en: "Field", fr: "Terrain" },
      tag_variant: "field",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 4,
      status: "published",
      published_at: "2026-08-02T00:00:00Z",
    },
  ];

  await upsert("stories", foundingStories);

  // ─── Team Members ───────────────────────────────────────
  // INTENTIONALLY SKIPPED. The team is managed exclusively via
  // the admin panel → Supabase (real names and photos). The
  // fictional members from the original seed were removed.
  console.log("  – team_members: skipped (managed via admin panel)");

  // ─── Timeline Events ────────────────────────────────────
  // The 2018–2026 milestones were placeholder fiction. The
  // section is hidden on the About page; clear the rows so no
  // invented history remains in the database.
  await removeRows("timeline_events", [
    "50000000-0000-0000-0000-000000000001",
    "50000000-0000-0000-0000-000000000002",
    "50000000-0000-0000-0000-000000000003",
    "50000000-0000-0000-0000-000000000004",
    "50000000-0000-0000-0000-000000000005",
    "50000000-0000-0000-0000-000000000006",
  ]);

  // ─── Values — the five real values from the vision doc ──
  await removeRows("org_values", ["60000000-0000-0000-0000-000000000006"]);
  await upsert("org_values", [
    { id: "60000000-0000-0000-0000-000000000001", number: "01", title: { en: en.about.val1Title, fr: fr.about.val1Title }, description: { en: en.about.val1Text, fr: fr.about.val1Text } },
    { id: "60000000-0000-0000-0000-000000000002", number: "02", title: { en: en.about.val2Title, fr: fr.about.val2Title }, description: { en: en.about.val2Text, fr: fr.about.val2Text } },
    { id: "60000000-0000-0000-0000-000000000003", number: "03", title: { en: en.about.val3Title, fr: fr.about.val3Title }, description: { en: en.about.val3Text, fr: fr.about.val3Text } },
    { id: "60000000-0000-0000-0000-000000000004", number: "04", title: { en: en.about.val4Title, fr: fr.about.val4Title }, description: { en: en.about.val4Text, fr: fr.about.val4Text } },
    { id: "60000000-0000-0000-0000-000000000005", number: "05", title: { en: en.about.val5Title, fr: fr.about.val5Title }, description: { en: en.about.val5Text, fr: fr.about.val5Text } },
  ]);

  // ─── About Page Content ─────────────────────────────────
  await upsert("about_content", [
    {
      id: "70000000-0000-0000-0000-000000000001",
      hero: {
        en: {
          eyebrow: en.about.heroEyebrow,
          heading: en.about.heroHeading,
          headingItalic: en.about.heroHeadingItalic,
          description: en.about.heroDescription,
          facts: [
            { key: en.about.factKey1, value: en.about.factVal1 },
            { key: en.about.factKey2, value: en.about.factVal2 },
            { key: en.about.factKey3, value: en.about.factVal3 },
            { key: en.about.factKey4, value: en.about.factVal4 },
          ],
        },
        fr: {
          eyebrow: fr.about.heroEyebrow,
          heading: fr.about.heroHeading,
          headingItalic: fr.about.heroHeadingItalic,
          description: fr.about.heroDescription,
          facts: [
            { key: fr.about.factKey1, value: fr.about.factVal1 },
            { key: fr.about.factKey2, value: fr.about.factVal2 },
            { key: fr.about.factKey3, value: fr.about.factVal3 },
            { key: fr.about.factKey4, value: fr.about.factVal4 },
          ],
        },
      },
      our_story: {
        en: {
          sidebarEyebrow: en.about.storyEyebrow,
          sidebarHeading: en.about.storySidebarHeading,
          paragraphs: [en.about.storyP1, en.about.storyP2],
          beliefHeading: en.about.beliefHeading,
          beliefParagraphs: [en.about.beliefP1, en.about.beliefP2],
          blockquote: en.about.blockquote,
          blockquoteCite: en.about.blockquoteCite,
          notDoHeading: en.about.notDoHeading,
          notDoParagraphs: [en.about.notDoP1, en.about.notDoP2],
          valuesHeading: en.about.valuesHeading,
          valuesDescription: en.about.valuesDescription,
          teamEyebrow: en.about.teamEyebrow,
          teamHeading: en.about.teamHeading,
          teamDescription: en.about.teamDescription,
          timelineEyebrow: en.about.timelineEyebrow,
          timelineHeading: en.about.timelineHeading,
          portraitPlaceholder: en.about.portraitPlaceholder,
          portraitCaptionLeft: en.about.portraitCaptionLeft,
          portraitCaptionRight: en.about.portraitCaptionRight,
        },
        fr: {
          sidebarEyebrow: fr.about.storyEyebrow,
          sidebarHeading: fr.about.storySidebarHeading,
          paragraphs: [fr.about.storyP1, fr.about.storyP2],
          beliefHeading: fr.about.beliefHeading,
          beliefParagraphs: [fr.about.beliefP1, fr.about.beliefP2],
          blockquote: fr.about.blockquote,
          blockquoteCite: fr.about.blockquoteCite,
          notDoHeading: fr.about.notDoHeading,
          notDoParagraphs: [fr.about.notDoP1, fr.about.notDoP2],
          valuesHeading: fr.about.valuesHeading,
          valuesDescription: fr.about.valuesDescription,
          teamEyebrow: fr.about.teamEyebrow,
          teamHeading: fr.about.teamHeading,
          teamDescription: fr.about.teamDescription,
          timelineEyebrow: fr.about.timelineEyebrow,
          timelineHeading: fr.about.timelineHeading,
          portraitPlaceholder: fr.about.portraitPlaceholder,
          portraitCaptionLeft: fr.about.portraitCaptionLeft,
          portraitCaptionRight: fr.about.portraitCaptionRight,
        },
      },
      contact_cta: {
        en: {
          heading: en.about.contactHeading,
          headingItalic: en.about.contactHeadingItalic,
          description: en.about.contactDescription,
          supportWork: en.about.supportWork,
        },
        fr: {
          heading: fr.about.contactHeading,
          headingItalic: fr.about.contactHeadingItalic,
          description: fr.about.contactDescription,
          supportWork: fr.about.supportWork,
        },
      },
    },
  ]);

  console.log("\n✅ Seeding complete!");
}

seed().catch(console.error);
