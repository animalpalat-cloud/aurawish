-- ============================================================
-- Migration: Add Puppy Training blog category with subtopics
-- to the live Supabase blog_categories table.
--
-- Category UUID: ce965e41-cd7b-45cc-8aa2-43d4ee22d5b0
--
-- HOW TO RUN:
--   1. Open your Supabase project dashboard.
--   2. Go to SQL Editor -> New Query.
--   3. Paste this entire file and click Run.
--
-- This script is idempotent - safe to run multiple times.
-- ON CONFLICT (slug) DO UPDATE keeps data fresh without duplicates.
-- ============================================================

INSERT INTO public.blog_categories (id, name, slug, description, subtopics)
VALUES
(
  'ce965e41-cd7b-45cc-8aa2-43d4ee22d5b0',
  'Puppy Training',
  'puppy-training',
  'Complete guides, schedules, breed-specific tips, and problem-solving solutions for training puppies.',
  '["Breed Training Guides", "Behavior & Problem Solving", "Schedules & Potty/Crate Training"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  subtopics   = EXCLUDED.subtopics,
  updated_at  = timezone('utc'::text, now());

-- Verify the row was inserted / updated:
SELECT id, name, slug, jsonb_array_length(subtopics) AS subtopic_count, created_at
FROM public.blog_categories
WHERE slug = 'puppy-training';
