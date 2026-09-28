-- ═══════════════════════════════════════════════════════════
-- Story image galleries
-- Adds a `gallery` column to stories: a JSONB array of public
-- image URLs, displayed as a carousel on the story page.
-- Images live in Supabase Storage under stories/{slug}/ so each
-- story's files are grouped in their own folder.
-- ═══════════════════════════════════════════════════════════

alter table stories
  add column if not exists gallery jsonb not null default '[]'::jsonb;
