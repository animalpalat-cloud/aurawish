-- ============================================================
-- Migration: Add Audio Birthday Card & Audio Greeting Card
-- blog categories to the live Supabase blog_categories table.
--
-- HOW TO RUN:
--   1. Open your Supabase project dashboard.
--   2. Go to SQL Editor -> New Query.
--   3. Paste this entire file and click Run.
--
-- This script is idempotent - safe to run multiple times.
-- ON CONFLICT (slug) DO UPDATE keeps data fresh without duplicates.
-- ============================================================

INSERT INTO public.blog_categories (name, slug, description, subtopics)
VALUES
(
  'Audio Birthday Card',
  'audio-birthday-card',
  'Tips, ideas, and guides for creating, personalising, and sharing audio birthday cards with music, voice messages, and custom soundtracks.',
  '["Birthday Card Music Ideas", "Custom Audio Messages", "Voice Message Cards", "Music Choices for Cards", "Digital Card Sending Tips", "Personalised Audio Gifts", "Audio Card Platforms"]'::jsonb
),
(
  'Audio Greeting Card',
  'audio-greeting-card',
  'Everything about audio greeting cards - how to create them, what music to choose, and how to make them memorable for any celebration.',
  '["Greeting Card Music", "Occasion-Based Audio Cards", "Custom Voice Greetings", "Music for Every Occasion", "Digital Greeting Tips", "Animated Audio Cards", "Shareable Audio Greetings"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  subtopics   = EXCLUDED.subtopics,
  updated_at  = timezone('utc'::text, now());

-- Verify the rows were inserted / updated:
SELECT id, name, slug, jsonb_array_length(subtopics) AS subtopic_count, created_at
FROM public.blog_categories
WHERE slug IN ('audio-birthday-card', 'audio-greeting-card');
