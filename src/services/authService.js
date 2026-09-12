// Authentication Service
// Combines Supabase (Email/Password & Database Profile Sync) + Firebase (Google OAuth)
//
// PERFORMANCE OPTIMIZATION:
// Both Supabase AND Firebase initialization are now LAZY — they only load when
// the user actually needs them (login, signup, Google sign-in, etc.).
// This removes ~444 KB of vendor JS from the critical render path.
//
// The homepage and all public pages now render without loading either auth SDK.

import { getSupabaseClient } from '../supabase/lazyClient';
import { initializeFirebase, getFirebaseAuth, checkFirebaseConfigured } from './firebase';

const LOCAL_USER_KEY = 'aurawish_auth_user';

export const authService = {
  /**
   * Normalize user data into standard format
   */
  formatUser(profile) {
    if (!profile) return null;
    return {
      id: profile.id,
      email: profile.email,
      name: profile.display_name || profile.name || (profile.email ? profile.email.split('@')[0] : 'User'),
      avatar: profile.avatar_url || profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.display_name || profile.email || 'Aura')}&backgroundColor=d946ef,ec4899,f59e0b`,
      provider: profile.auth_provider || 'email',
      firebaseUid: profile.firebase_uid || null,
      supabaseId: profile.supabase_auth_id || profile.id,
      plan: 'Pro Creator',
      isAuthenticated: true
    };
  },

  /**
   * Synchronize or upsert a user profile into Supabase profiles table
   */
  async syncUserProfile({ id, email, displayName, avatarUrl, provider, firebaseUid, supabaseAuthId }) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    
    if (!supabase || !isSupabaseConfigured) {
      const localUser = this.formatUser({
        id: id || firebaseUid || `user_${Date.now()}`,
        email,
        display_name: displayName,
        avatar_url: avatarUrl,
        auth_provider: provider,
        firebase_uid: firebaseUid,
        supabase_auth_id: supabaseAuthId
      });
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
      return localUser;
    }

    try {
      // 1. Check if user profile exists by email or id
      let existingProfile = null;
      if (email) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        existingProfile = data;
      }

      if (!existingProfile && id) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        existingProfile = data;
      }

      const profilePayload = {
        id: existingProfile?.id || id || (supabaseAuthId || undefined),
        email,
        display_name: displayName || existingProfile?.display_name || (email ? email.split('@')[0] : 'Creator'),
        avatar_url: avatarUrl || existingProfile?.avatar_url,
        updated_at: new Date().toISOString()
      };

      // If id is provided or existing profile exists, upsert
      let saved = null;
      if (existingProfile) {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            display_name: profilePayload.display_name,
            avatar_url: profilePayload.avatar_url,
            updated_at: profilePayload.updated_at
          })
          .eq('id', existingProfile.id)
          .select()
          .single();
        saved = error ? existingProfile : data;
      } else if (id || supabaseAuthId) {
        const { data, error } = await supabase
          .from('profiles')
          .upsert([profilePayload])
          .select()
          .single();
        saved = error ? profilePayload : data;
      } else {
        saved = profilePayload;
      }

      const formatted = this.formatUser({
        ...saved,
        auth_provider: provider,
        firebase_uid: firebaseUid,
        supabase_auth_id: supabaseAuthId || existingProfile?.id || id
      });

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(formatted));
      return formatted;
    } catch (err) {
      console.warn('Profile sync warning:', err.message);
      const fallback = this.formatUser({
        id: id || firebaseUid || `user_${Date.now()}`,
        email,
        display_name: displayName,
        avatar_url: avatarUrl,
        auth_provider: provider,
        firebase_uid: firebaseUid
      });
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(fallback));
      return fallback;
    }
  },

  /**
   * Get cached current user synchronously
   */
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(LOCAL_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Sign up with Email + Password via Supabase Auth
   */
  async register({ name, email, password }) {
    if (!email || !password) throw new Error('Email and password are required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    const { supabase, isSupabaseConfigured } = await getSupabaseClient();

    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        const profile = await this.syncUserProfile({
          id: data.user.id,
          email: data.user.email,
          displayName: name,
          provider: 'email',
          supabaseAuthId: data.user.id
        });
        return profile;
      }
    }

    // Local fallback if Supabase not configured
    const user = await this.syncUserProfile({
      id: `user_${Date.now()}`,
      email,
      displayName: name,
      provider: 'email'
    });
    return user;
  },

  /**
   * Sign in with Email + Password via Supabase Auth
   */
  async login({ email, password }) {
    if (!email || !password) throw new Error('Email and password are required');

    const { supabase, isSupabaseConfigured } = await getSupabaseClient();

    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.user) {
        const profile = await this.syncUserProfile({
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.user_metadata?.display_name,
          provider: 'email',
          supabaseAuthId: data.user.id
        });
        return profile;
      }
    }

    // Local fallback
    const user = await this.syncUserProfile({
      id: `user_${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      provider: 'email'
    });
    return user;
  },

  /**
   * Sign in with Google via Firebase Popup
   * PERFORMANCE: Firebase is initialized lazily only when this method is called
   */
  async loginWithGoogle() {
    // Check if Firebase can be configured
    if (!checkFirebaseConfigured()) {
      throw new Error('Google Sign-In is temporarily unavailable. Firebase is not configured.');
    }

    try {
      // Lazy initialization — Firebase loads only when user clicks "Sign in with Google"
      const { firebaseAuth, googleProvider } = await initializeFirebase();
      
      if (!firebaseAuth || !googleProvider) {
        throw new Error('Google Sign-In initialization failed');
      }

      // Dynamic import of Firebase auth functions
      const firebaseAuthModule = await import('firebase/auth');
      
      const result = await firebaseAuthModule.signInWithPopup(firebaseAuth, googleProvider);
      const fbUser = result.user;

      if (!fbUser) throw new Error('Google Sign-In failed to retrieve user');

      const syncedUser = await this.syncUserProfile({
        id: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        avatarUrl: fbUser.photoURL,
        provider: 'google',
        firebaseUid: fbUser.uid
      });

      return syncedUser;
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed before finishing');
      } else if (err.code === 'auth/cancelled-popup-request') {
        throw new Error('Popup request was replaced by another operation');
      }
      throw err;
    }
  },

  /**
   * Reset password for email via Supabase
   */
  async resetPassword(email) {
    if (!email) throw new Error('Please enter your email address');

    const { supabase, isSupabaseConfigured } = await getSupabaseClient();

    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) throw error;
      return true;
    }

    return true;
  },

  /**
   * Complete Sign Out (clears Firebase + Supabase + Local storage)
   */
  async logout() {
    try {
      // Only sign out from Firebase if it's been initialized
      const firebaseAuth = getFirebaseAuth();
      if (firebaseAuth) {
        const firebaseAuthModule = await import('firebase/auth');
        await firebaseAuthModule.signOut(firebaseAuth).catch(() => {});
      }
      
      // Lazy load supabase for sign out
      const { supabase, isSupabaseConfigured } = await getSupabaseClient();
      if (supabase && isSupabaseConfigured) {
        await supabase.auth.signOut().catch(() => {});
      }
    } catch (e) {
      console.warn('Sign out warning:', e);
    } finally {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  },

  /**
   * Setup session observers
   * PERFORMANCE: Both Supabase and Firebase observers set up lazily to avoid blocking initial render
   */
  initAuthObserver(callback) {
    let supabaseSub = null;
    let fbUnsub = null;

    // 1. Supabase Auth state listener (lazy — loads after idle)
    const setupSupabaseObserver = async () => {
      try {
        const { supabase, isSupabaseConfigured } = await getSupabaseClient();
        if (!supabase || !isSupabaseConfigured) return;

        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const user = await this.syncUserProfile({
              id: session.user.id,
              email: session.user.email,
              displayName: session.user.user_metadata?.display_name,
              provider: 'email',
              supabaseAuthId: session.user.id
            });
            callback(user);
          } else {
            // If no supabase session and no firebase user, clear
            const firebaseAuth = getFirebaseAuth();
            if (!firebaseAuth?.currentUser) {
              const cached = this.getCurrentUser();
              if (cached?.provider === 'email') {
                localStorage.removeItem(LOCAL_USER_KEY);
                callback(null);
              }
            }
          }
        });
        supabaseSub = data?.subscription;
      } catch (err) {
        console.warn('Supabase observer setup deferred:', err.message);
      }
    };

    // 2. Firebase Auth state listener (lazy - only if Firebase was initialized)
    const setupFirebaseObserver = async () => {
      // Only set up observer if Firebase can be configured
      if (!checkFirebaseConfigured()) return;
      
      try {
        // Initialize Firebase lazily
        const { firebaseAuth } = await initializeFirebase();
        
        if (firebaseAuth) {
          const firebaseAuthModule = await import('firebase/auth');
          
          fbUnsub = firebaseAuthModule.onAuthStateChanged(firebaseAuth, async (fbUser) => {
            if (fbUser) {
              const user = await this.syncUserProfile({
                id: fbUser.uid,
                email: fbUser.email,
                displayName: fbUser.displayName,
                avatarUrl: fbUser.photoURL,
                provider: 'google',
                firebaseUid: fbUser.uid
              });
              callback(user);
            }
          });
        }
      } catch (err) {
        console.warn('Firebase observer setup deferred:', err.message);
      }
    };

    // Use requestIdleCallback to defer auth observer setup until browser is idle
    // This ensures it doesn't compete with critical rendering work
    if (typeof window !== 'undefined') {
      const scheduleIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
      scheduleIdle(() => {
        setupSupabaseObserver();
        setupFirebaseObserver();
      });
    }

    return () => {
      if (supabaseSub) supabaseSub.unsubscribe?.();
      if (fbUnsub) fbUnsub();
    };
  }
};
