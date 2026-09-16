-- VitaCore content CMS schema (run in Supabase SQL editor)
-- Enables admin-only writes for two emails and public reads for program content.

create table if not exists public.program_phases (
  id uuid primary key default gen_random_uuid(),
  program text not null check (program in ('men','women')),
  phase_key text not null,
  label text not null,
  title text not null,
  sort int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  unique (program, phase_key)
);

create table if not exists public.program_modules (
  id uuid primary key default gen_random_uuid(),
  program text not null check (program in ('men','women')),
  phase_key text not null,
  module_key text not null,
  title text not null,
  icon text not null default '📘',
  sort int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  unique (program, module_key),
  constraint program_modules_phase_fk
    foreign key (program, phase_key)
    references public.program_phases(program, phase_key)
    on delete cascade
);

create table if not exists public.program_lessons (
  id uuid primary key default gen_random_uuid(),
  program text not null check (program in ('men','women')),
  module_key text not null,
  lesson_key text not null,
  title text not null,
  duration text not null default '10:00',
  about text not null default '',
  takeaways jsonb not null default '[]'::jsonb,
  -- blocks: [{type:'heading'|'subheading'|'paragraph'|'bullets'|'image'|'video', ...}]
  blocks jsonb not null default '[]'::jsonb,
  sort int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (program, lesson_key),
  constraint program_lessons_module_fk
    foreign key (program, module_key)
    references public.program_modules(program, module_key)
    on delete cascade
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_program_lessons_updated_at on public.program_lessons;
create trigger trg_program_lessons_updated_at
before update on public.program_lessons
for each row execute procedure public.set_updated_at();

alter table public.program_phases enable row level security;
alter table public.program_modules enable row level security;
alter table public.program_lessons enable row level security;

-- Public read (so /program can load content without extra server auth plumbing)
drop policy if exists "public read phases" on public.program_phases;
create policy "public read phases"
on public.program_phases for select
using (status = 'published');

drop policy if exists "public read modules" on public.program_modules;
create policy "public read modules"
on public.program_modules for select
using (status = 'published');

drop policy if exists "public read lessons" on public.program_lessons;
create policy "public read lessons"
on public.program_lessons for select
using (status = 'published');

-- Admin-only writes (based on auth email claim)
create or replace function public.is_admin_email()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() ->> 'email') in (
    'arkfiit@gmail.com',
    'abubakarbaluku5@gmail.com'
  ), false);
$$;

drop policy if exists "admin write phases" on public.program_phases;
create policy "admin write phases"
on public.program_phases for all
using (public.is_admin_email())
with check (public.is_admin_email());

drop policy if exists "admin write modules" on public.program_modules;
create policy "admin write modules"
on public.program_modules for all
using (public.is_admin_email())
with check (public.is_admin_email());

drop policy if exists "admin write lessons" on public.program_lessons;
create policy "admin write lessons"
on public.program_lessons for all
using (public.is_admin_email())
with check (public.is_admin_email());

