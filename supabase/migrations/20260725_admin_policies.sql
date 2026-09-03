-- ═══════════════════════════════════════════════════════════
-- Admin RLS Policies — Phase 4
-- Only authenticated users can write to content tables
-- ═══════════════════════════════════════════════════════════

-- Write access for authenticated users on all content tables
create policy "Admin write access" on site_settings for all
  using (auth.role() = 'authenticated');

create policy "Admin write access" on homepage for all
  using (auth.role() = 'authenticated');

create policy "Admin write access" on work_programs for all
  using (auth.role() = 'authenticated');

create policy "Admin write access" on stories for all
  using (auth.role() = 'authenticated');

create policy "Admin write access" on team_members for all
  using (auth.role() = 'authenticated');

create policy "Admin write access" on timeline_events for all
  using (auth.role() = 'authenticated');

create policy "Admin write access" on org_values for all
  using (auth.role() = 'authenticated');

create policy "Admin write access" on about_content for all
  using (auth.role() = 'authenticated');

create policy "Admin write access" on impact_stats for all
  using (auth.role() = 'authenticated');

-- Newsletter: authenticated can read all subscribers
create policy "Admin read subscribers" on newsletter_subscribers for select
  using (auth.role() = 'authenticated');

create policy "Admin write subscribers" on newsletter_subscribers for all
  using (auth.role() = 'authenticated');

-- ─── Storage Bucket for Images ───────────────────────────
-- Run this SQL in the Supabase SQL Editor after creating the bucket
insert into storage.buckets (id, name, public) values ('images', 'images', true);

create policy "Public read images" on storage.objects for select
  using (bucket_id = 'images');
create policy "Admin upload images" on storage.objects for insert
  with check (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Admin update images" on storage.objects for update
  using (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Admin delete images" on storage.objects for delete
  using (bucket_id = 'images' and auth.role() = 'authenticated');
