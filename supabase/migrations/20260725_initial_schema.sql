-- ═══════════════════════════════════════════════════════════
-- Iwacu Collective Center — Database Schema
-- Phase 3: Supabase + PostgreSQL
-- ═══════════════════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Site Settings ────────────────────────────────────────
create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  site_name text not null default 'Iwacu Collective Center',
  email text,
  locations jsonb default '[]'::jsonb,
  legal_name text,
  registration_number text,
  social_links jsonb default '{}'::jsonb,
  content jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ─── Homepage Content ─────────────────────────────────────
create table if not exists homepage (
  id uuid primary key default uuid_generate_v4(),
  hero jsonb not null default '{}'::jsonb,
  urgent_band jsonb not null default '{}'::jsonb,
  mission jsonb not null default '{}'::jsonb,
  impact jsonb not null default '{}'::jsonb,
  donate jsonb not null default '{}'::jsonb,
  footer_content jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ─── Work Programs ────────────────────────────────────────
create table if not exists work_programs (
  id uuid primary key default uuid_generate_v4(),
  sort_order integer not null default 0,
  title jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- ─── Stories / News ───────────────────────────────────────
create table if not exists stories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title jsonb not null default '{}'::jsonb,
  excerpt jsonb not null default '{}'::jsonb,
  body jsonb not null default '{}'::jsonb,
  image_url text,
  image_placeholder jsonb default '{}'::jsonb,
  tag jsonb default '{}'::jsonb,
  tag_variant text default 'default',
  location text,
  category text,
  author_name text,
  author_initials text,
  read_time integer,
  is_featured boolean default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Team Members ─────────────────────────────────────────
create table if not exists team_members (
  id uuid primary key default uuid_generate_v4(),
  name jsonb not null default '{}'::jsonb,
  role jsonb not null default '{}'::jsonb,
  bio jsonb not null default '{}'::jsonb,
  image_url text,
  image_placeholder jsonb default '{}'::jsonb,
  sort_order integer not null default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- ─── Timeline Events ──────────────────────────────────────
create table if not exists timeline_events (
  id uuid primary key default uuid_generate_v4(),
  year text not null,
  title jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- ─── Organizational Values ────────────────────────────────
create table if not exists org_values (
  id uuid primary key default uuid_generate_v4(),
  number text not null,
  title jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- ─── About Page Content ──────────────────────────────────
create table if not exists about_content (
  id uuid primary key default uuid_generate_v4(),
  hero jsonb not null default '{}'::jsonb,
  our_story jsonb not null default '{}'::jsonb,
  contact_cta jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ─── Impact Statistics ────────────────────────────────────
create table if not exists impact_stats (
  id uuid primary key default uuid_generate_v4(),
  kicker jsonb not null default '{}'::jsonb,
  number text not null,
  suffix text default '',
  label jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- ─── Newsletter Subscribers ───────────────────────────────
create table if not exists newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz,
  source text default 'website'
);

-- ─── Indexes ──────────────────────────────────────────────
create index if not exists idx_stories_status on stories(status);
create index if not exists idx_stories_published on stories(published_at desc);
create index if not exists idx_stories_featured on stories(is_featured) where is_featured = true;
create index if not exists idx_stories_slug on stories(slug);
create index if not exists idx_work_programs_order on work_programs(sort_order);
create index if not exists idx_team_members_order on team_members(sort_order);
create index if not exists idx_timeline_order on timeline_events(sort_order);
create index if not exists idx_org_values_order on org_values(sort_order);
create index if not exists idx_impact_stats_order on impact_stats(sort_order);
create index if not exists idx_newsletter_email on newsletter_subscribers(email);

-- ─── Row Level Security (for Phase 4 admin panel) ────────
alter table site_settings enable row level security;
alter table homepage enable row level security;
alter table work_programs enable row level security;
alter table stories enable row level security;
alter table team_members enable row level security;
alter table timeline_events enable row level security;
alter table org_values enable row level security;
alter table about_content enable row level security;
alter table impact_stats enable row level security;
alter table newsletter_subscribers enable row level security;

-- Public read access for all content tables
create policy "Public read access" on site_settings for select using (true);
create policy "Public read access" on homepage for select using (true);
create policy "Public read access" on work_programs for select using (true);
create policy "Public read access" on stories for select using (status = 'published');
create policy "Public read access" on team_members for select using (true);
create policy "Public read access" on timeline_events for select using (true);
create policy "Public read access" on org_values for select using (true);
create policy "Public read access" on about_content for select using (true);
create policy "Public read access" on impact_stats for select using (true);

-- Newsletter: anyone can insert, only admins can read
create policy "Public subscribe" on newsletter_subscribers for insert
  with check (true);
