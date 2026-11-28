-- Notes by Sara: reader profiles and email choices.
-- Run once in Supabase: SQL Editor > New query > paste > Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  email_new_lessons boolean not null default false,
  email_freebies boolean not null default false,
  onboarded_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
drop policy if exists "profiles: insert own" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- To see who opted in (Table Editor works too):
-- select email, email_new_lessons, email_freebies, onboarded_at from public.profiles
--   where email_new_lessons or email_freebies order by onboarded_at desc;
