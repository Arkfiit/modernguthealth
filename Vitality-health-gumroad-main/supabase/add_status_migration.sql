-- Migration: Add status column for Draft/Publish and updated policies.

-- 1. Add status columns
ALTER TABLE public.program_phases ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
ALTER TABLE public.program_modules ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
ALTER TABLE public.program_lessons ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'));

-- 2. Update Public Read Policies to only allow 'published' Phase, Module, Lesson
-- (Admins can still read drafts because the "admin write" policy gives ALL access).

DROP POLICY IF EXISTS "public read phases" ON public.program_phases;
CREATE POLICY "public read phases" ON public.program_phases
FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "public read modules" ON public.program_modules;
CREATE POLICY "public read modules" ON public.program_modules
FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "public read lessons" ON public.program_lessons;
CREATE POLICY "public read lessons" ON public.program_lessons
FOR SELECT USING (status = 'published');

-- (Note: you can run a script to set all existing content to 'published' so it doesn't disappear from the site)
-- UPDATE public.program_phases SET status = 'published';
-- UPDATE public.program_modules SET status = 'published';
-- UPDATE public.program_lessons SET status = 'published';
