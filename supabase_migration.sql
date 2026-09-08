-- ==========================================================
-- SUPABASE AUTH & PROFILES ENHANCEMENT MIGRATION
-- Supports Hybrid Auth: Supabase (Email/Password) + Firebase (Google OAuth)
-- ==========================================================

-- 1. Add firebase_uid column and auth_provider to existing profiles table if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'firebase_uid'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN firebase_uid TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'auth_provider'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN auth_provider TEXT DEFAULT 'email';
  END IF;
END $$;

-- 2. Performance indexes for quick user lookup
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON public.profiles (firebase_uid);

-- 3. Update RLS policies to allow authenticated user or matching profile upsert
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id OR (auth.jwt() ->> 'email') = email);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (true);
