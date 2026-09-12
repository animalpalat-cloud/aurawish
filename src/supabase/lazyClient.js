// Lazy Supabase client loader
// Exports a getter that returns a promise resolving to { supabase, isSupabaseConfigured }
// This ensures the 222 KB @supabase/supabase-js bundle is NOT loaded at startup.

let _clientPromise = null;

export function getSupabaseClient() {
  if (!_clientPromise) {
    _clientPromise = import('./client.js').then((m) => ({
      supabase: m.supabase,
      isSupabaseConfigured: m.isSupabaseConfigured,
    }));
  }
  return _clientPromise;
}
