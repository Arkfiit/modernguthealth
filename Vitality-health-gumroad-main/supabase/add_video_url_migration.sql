-- Add video_url column to program_lessons for per-lesson hero video embeds.
-- Run this in the Supabase SQL editor.
ALTER TABLE public.program_lessons ADD COLUMN IF NOT EXISTS video_url text;
