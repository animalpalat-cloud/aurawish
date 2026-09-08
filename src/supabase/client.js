import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xwpnxzfnlxhghmefvhpv.supabase.co';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_DhA4Zmv2wco650SwKFwR4A_z5tqlxsG';

// Normalize url if bare project ID was passed
const supabaseUrl = rawUrl.startsWith('http') 
  ? rawUrl 
  : `https://${rawUrl}.supabase.co`;
const supabaseAnonKey = rawKey;

let supabaseInstance = null;
let isConfigured = false;

try {
  if (supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes('your-anon')) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    isConfigured = true;
  }
} catch (error) {
  console.warn('Supabase initialization warning:', error.message);
  supabaseInstance = null;
  isConfigured = false;
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = isConfigured;
export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_ANON_KEY = supabaseAnonKey;
