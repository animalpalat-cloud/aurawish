-- ==========================================================
-- SUPABASE POSTGRESQL SCHEMA FOR BIRTHDAY CARD MAKER
-- Project: AuraWish Birthday Card Maker
-- ==========================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- 2. CREATE CORE TABLES
-- ==========================================================

-- PROFILES (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- TEMPLATES
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'all',
  description TEXT,
  thumbnail_url TEXT,
  preview_url TEXT,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CARDS
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  share_id TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  sender_name TEXT,
  message TEXT,
  age TEXT,
  photo_url TEXT,
  theme_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  animation_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  music_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'published' | 'archived'
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CARD ASSETS (Images, audio, attachments)
CREATE TABLE IF NOT EXISTS public.card_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  asset_type TEXT NOT NULL DEFAULT 'image',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, template_id)
);

-- ==========================================================
-- 3. CREATE PERFORMANCE INDEXES
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_cards_share_id ON public.cards (share_id);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards (user_id);
CREATE INDEX IF NOT EXISTS idx_cards_template_id ON public.cards (template_id);
CREATE INDEX IF NOT EXISTS idx_cards_status ON public.cards (status);

CREATE INDEX IF NOT EXISTS idx_templates_slug ON public.templates (slug);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates (category);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON public.templates (is_active);

CREATE INDEX IF NOT EXISTS idx_card_assets_card_id ON public.card_assets (card_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites (user_id);

-- ==========================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==========================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 4.1 PROFILES POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 4.2 TEMPLATES POLICIES
DROP POLICY IF EXISTS "Active templates are viewable by all users" ON public.templates;
CREATE POLICY "Active templates are viewable by all users" 
  ON public.templates FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Only authenticated admins can manage templates" ON public.templates;
CREATE POLICY "Only authenticated admins can manage templates" 
  ON public.templates FOR ALL 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- 4.3 CARDS POLICIES
-- Anyone can view published cards by share_id (Public Card Experience)
DROP POLICY IF EXISTS "Anyone can view published cards" ON public.cards;
CREATE POLICY "Anyone can view published cards" 
  ON public.cards FOR SELECT 
  USING (status = 'published' OR auth.uid() = user_id OR user_id IS NULL);

-- Authenticated users can manage their own cards
DROP POLICY IF EXISTS "Users can insert own cards" ON public.cards;
CREATE POLICY "Users can insert own cards" 
  ON public.cards FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update own cards" ON public.cards;
CREATE POLICY "Users can update own cards" 
  ON public.cards FOR UPDATE 
  USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can delete own cards" ON public.cards;
CREATE POLICY "Users can delete own cards" 
  ON public.cards FOR DELETE 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 4.4 CARD ASSETS POLICIES
DROP POLICY IF EXISTS "Anyone can view assets of readable cards" ON public.card_assets;
CREATE POLICY "Anyone can view assets of readable cards" 
  ON public.card_assets FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can insert card assets" ON public.card_assets;
CREATE POLICY "Users can insert card assets" 
  ON public.card_assets FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete card assets" ON public.card_assets;
CREATE POLICY "Users can delete card assets" 
  ON public.card_assets FOR DELETE 
  USING (true);

-- 4.5 FAVORITES POLICIES
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
CREATE POLICY "Users can view own favorites" 
  ON public.favorites FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
CREATE POLICY "Users can manage own favorites" 
  ON public.favorites FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- 5. STORAGE BUCKET CREATION & POLICIES (card-images)
-- ==========================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'card-images',
  'card-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view card images" ON storage.objects;
CREATE POLICY "Public can view card images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'card-images');

DROP POLICY IF EXISTS "Anyone can upload card images" ON storage.objects;
CREATE POLICY "Anyone can upload card images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'card-images'
    AND (storage.extension(name) = 'webp' OR storage.extension(name) = 'jpg' OR storage.extension(name) = 'jpeg' OR storage.extension(name) = 'png')
  );

DROP POLICY IF EXISTS "Anyone can delete card images" ON storage.objects;
CREATE POLICY "Anyone can delete card images" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'card-images');

-- ==========================================================
-- 6. MUSIC TRACKS TABLE & STORAGE
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.music_tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  mood TEXT NOT NULL,
  duration TEXT NOT NULL,
  bpm INTEGER DEFAULT 100,
  audio_url TEXT,
  thumbnail_url TEXT,
  description TEXT,
  instruments JSONB DEFAULT '[]'::jsonb,
  relationship_tags JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;

-- Public can read active music tracks
DROP POLICY IF EXISTS "Public can read active music tracks" ON public.music_tracks;
CREATE POLICY "Public can read active music tracks"
  ON public.music_tracks FOR SELECT
  USING (is_active = true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_music_tracks_category ON public.music_tracks(category);
CREATE INDEX IF NOT EXISTS idx_music_tracks_mood ON public.music_tracks(mood);
CREATE INDEX IF NOT EXISTS idx_music_tracks_featured ON public.music_tracks(is_featured);

-- Audio Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'birthday-audio',
  'birthday-audio',
  true,
  20971520, -- 20MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];

-- ==========================================================
-- 7. BLOG POSTS TABLE & POLICIES
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  excerpt        TEXT,
  content        JSONB, -- Array of sections: [{h2: string, body: string}]
  featured_image TEXT,
  category       TEXT,
  author         TEXT NOT NULL DEFAULT 'Admin',
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Blog Performance Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts (status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts (published_at DESC NULLS LAST);

-- Blog RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
DROP POLICY IF EXISTS "Public read published blog posts" ON public.blog_posts;
CREATE POLICY "Public read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

-- Admin full access (managed via frontend Firebase admin auth guard)
DROP POLICY IF EXISTS "Admin full access to blog posts" ON public.blog_posts;
CREATE POLICY "Admin full access to blog posts"
  ON public.blog_posts FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==========================================================
-- 8. BLOG IMAGES STORAGE BUCKET & POLICIES (blog-images)
-- ==========================================================

-- 1. Create or update the dedicated 'blog-images' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Storage RLS Policies for blog-images
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
CREATE POLICY "Public can view blog images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Anyone can upload blog images" ON storage.objects;
CREATE POLICY "Anyone can upload blog images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Anyone can update blog images" ON storage.objects;
CREATE POLICY "Anyone can update blog images" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Anyone can delete blog images" ON storage.objects;
CREATE POLICY "Anyone can delete blog images" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'blog-images');



