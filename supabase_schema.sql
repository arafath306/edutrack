-- ============================================================
-- EduTrack Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text unique,
  avatar text,
  role text default 'STUDENT' check (role in ('STUDENT', 'TEACHER', 'ADMIN', 'MODERATOR', 'CREATOR')),
  xp integer default 0,
  level integer default 1,
  edu_diamonds integer default 0,
  study_streak integer default 0,
  institution_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'STUDENT')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- INSTITUTIONS TABLE
-- ============================================================
create table if not exists public.institutions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  logo text,
  created_at timestamptz default now()
);

-- ============================================================
-- TASKS TABLE
-- ============================================================
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  due_date timestamptz,
  priority integer default 0,
  status text default 'PENDING' check (status in ('PENDING', 'IN_PROGRESS', 'DONE')),
  user_id uuid references public.profiles(id) on delete cascade,
  institution_id uuid references public.institutions(id) on delete set null,
  created_at timestamptz default now()
);

-- ============================================================
-- CHATS & MESSAGES TABLE
-- ============================================================
create table if not exists public.chats (
  id uuid default uuid_generate_v4() primary key,
  name text,
  is_group boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  chat_id uuid references public.chats(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- ============================================================
-- VIDEOS TABLE
-- ============================================================
create table if not exists public.videos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  url text not null,
  creator_id uuid references public.profiles(id) on delete cascade,
  likes integer default 0,
  views integer default 0,
  is_short boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles: Users can read all, update their own
alter table public.profiles enable row level security;

create policy "Anyone can view profiles"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Tasks: Users manage their own tasks
alter table public.tasks enable row level security;

create policy "Users can manage their tasks"
  on public.tasks for all
  using (auth.uid() = user_id);

-- Messages: Authenticated users can read/write
alter table public.messages enable row level security;

create policy "Auth users can view messages"
  on public.messages for select
  using (auth.role() = 'authenticated');

create policy "Auth users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- Videos: Anyone can view, creators manage their own
alter table public.videos enable row level security;

create policy "Anyone can view videos"
  on public.videos for select
  using (true);

create policy "Creators manage their own videos"
  on public.videos for all
  using (auth.uid() = creator_id);

-- ============================================================
-- ENABLE REAL-TIME
-- ============================================================
-- Run these to enable real-time for tables:
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.tasks;
