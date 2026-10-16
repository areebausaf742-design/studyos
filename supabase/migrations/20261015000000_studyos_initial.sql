create extension if not exists "pgcrypto";

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 240),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.exams_deadlines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null check (char_length(trim(subject)) between 1 and 120),
  title text not null check (char_length(trim(title)) between 1 and 240),
  date date not null,
  type text not null check (type in ('exam', 'deadline')),
  created_at timestamptz not null default now()
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  duration_seconds integer not null check (duration_seconds > 0),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.subjects enable row level security;
alter table public.tasks enable row level security;
alter table public.exams_deadlines enable row level security;
alter table public.focus_sessions enable row level security;

create policy "Users manage their subjects" on public.subjects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their exams and deadlines" on public.exams_deadlines
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their focus sessions" on public.focus_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists subjects_user_id_idx on public.subjects(user_id);
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_subject_id_idx on public.tasks(subject_id);
create index if not exists exams_deadlines_user_id_idx on public.exams_deadlines(user_id);
create index if not exists focus_sessions_user_id_idx on public.focus_sessions(user_id);
