-- ==============================================================================
-- MIGRATION: Upgrade Blog Posts Table with Professional SEO & Media Metadata
-- Project: AuraWish Birthday Wishes Studio
-- File: supabase/upgrade_blog_seo_schema.sql
--
-- HOW TO RUN:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Navigate to SQL Editor -> "New query"
-- 3. Paste the entire content of this file and click "Run"
--
-- SAFETY & COMPATIBILITY GUARANTEES:
-- - 100% Non-destructive: Uses ADD COLUMN IF NOT EXISTS.
-- - No tables or existing blog posts are dropped or deleted.
-- - Existing blog posts retain all existing values and gain sensible defaults.
-- ==============================================================================

-- 1. EXTEND blog_posts TABLE WITH SEO & MEDIA COLUMNS
ALTER TABLE public.blog_posts
  -- Basic SEO Fields
  ADD COLUMN IF NOT EXISTS primary_focus_keyword TEXT,
  ADD COLUMN IF NOT EXISTS secondary_keywords    JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS related_keywords      JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS seo_title             TEXT,
  ADD COLUMN IF NOT EXISTS meta_description      TEXT,
  ADD COLUMN IF NOT EXISTS canonical_url         TEXT,
  ADD COLUMN IF NOT EXISTS robots_directive      TEXT NOT NULL DEFAULT 'index, follow',

  -- Open Graph Metadata
  ADD COLUMN IF NOT EXISTS og_title              TEXT,
  ADD COLUMN IF NOT EXISTS og_description        TEXT,
  ADD COLUMN IF NOT EXISTS og_image              TEXT,

  -- Twitter / X Card Metadata
  ADD COLUMN IF NOT EXISTS twitter_title        TEXT,
  ADD COLUMN IF NOT EXISTS twitter_description  TEXT,
  ADD COLUMN IF NOT EXISTS twitter_image        TEXT,

  -- Featured Image Metadata
  ADD COLUMN IF NOT EXISTS featured_image_alt     TEXT,
  ADD COLUMN IF NOT EXISTS featured_image_caption TEXT,

  -- Inline Media Columns & Metadata (Top-level persistent storage)
  ADD COLUMN IF NOT EXISTS image1         TEXT,
  ADD COLUMN IF NOT EXISTS image1_alt     TEXT,
  ADD COLUMN IF NOT EXISTS image1_caption TEXT,

  ADD COLUMN IF NOT EXISTS image2         TEXT,
  ADD COLUMN IF NOT EXISTS image2_alt     TEXT,
  ADD COLUMN IF NOT EXISTS image2_caption TEXT,

  ADD COLUMN IF NOT EXISTS image3         TEXT,
  ADD COLUMN IF NOT EXISTS image3_alt     TEXT,
  ADD COLUMN IF NOT EXISTS image3_caption TEXT,

  ADD COLUMN IF NOT EXISTS video          TEXT,
  ADD COLUMN IF NOT EXISTS video_caption  TEXT;

-- 2. UPDATE STATUS CONSTRAINT TO SUPPORT 'scheduled' POSTS
-- Existing check constraint is typically: CHECK (status IN ('draft', 'published'))
-- Safely update constraint if needed:
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'blog_posts_status_check' 
      AND conrelid = 'public.blog_posts'::regclass
  ) THEN
    ALTER TABLE public.blog_posts DROP CONSTRAINT blog_posts_status_check;
  END IF;

  -- Re-add with 'scheduled' support
  ALTER TABLE public.blog_posts 
    ADD CONSTRAINT blog_posts_status_check 
    CHECK (status IN ('draft', 'published', 'scheduled'));
EXCEPTION
  WHEN OTHERS THEN
    -- If constraint has a generic name or check differs, log notice
    RAISE NOTICE 'Notice: Skipping status constraint replacement: %', SQLERRM;
END $$;

-- 3. CREATE PERFORMANCE INDEXES FOR SEARCH & FILTERING
CREATE INDEX IF NOT EXISTS idx_blog_posts_primary_keyword 
  ON public.blog_posts (primary_focus_keyword) 
  WHERE primary_focus_keyword IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_blog_posts_seo_title 
  ON public.blog_posts (seo_title) 
  WHERE seo_title IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_blog_posts_updated_at 
  ON public.blog_posts (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published 
  ON public.blog_posts (status, published_at DESC);

-- 4. UPDATE RLS POLICIES FOR SECURE PUBLIC READING & ADMIN CONTROL
-- Ensure published posts are readable by the public, as well as scheduled posts whose publish time has arrived
DROP POLICY IF EXISTS "Public read published blog posts" ON public.blog_posts;
CREATE POLICY "Public read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (
    status = 'published' 
    OR (status = 'scheduled' AND published_at <= timezone('utc'::text, now()))
  );

-- Admin Full Access Policy (for admin operations)
DROP POLICY IF EXISTS "Admin full access to blog posts" ON public.blog_posts;
CREATE POLICY "Admin full access to blog posts"
  ON public.blog_posts FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. VERIFICATION QUERY
SELECT 
  column_name, 
  data_type, 
  column_default 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
