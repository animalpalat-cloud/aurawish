import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { initializeFirebase } from '../services/firebase';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Auth Context
// Uses Firebase email/password directly — completely separate from the main
// user AuthContext which uses Supabase. No shared state between the two.
// ─────────────────────────────────────────────────────────────────────────────

const AdminAuthContext = createContext(null);

const ADMIN_SESSION_KEY = 'admin_auth_user';

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [adminLoading, setAdminLoading] = useState(true);

  // Format Firebase user into a plain object for storage
  const formatAdminUser = useCallback((fbUser) => {
    if (!fbUser) return null;
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
      photoURL: fbUser.photoURL || null,
      isAdmin: true,
    };
  }, []);

  // Set up Firebase onAuthStateChanged observer
  useEffect(() => {
    let unsubscribe = null;

    const setup = async () => {
      try {
        const { firebaseAuth } = await initializeFirebase();
        if (!firebaseAuth) {
          setAdminLoading(false);
          return;
        }

        const { onAuthStateChanged } = await import('firebase/auth');

        unsubscribe = onAuthStateChanged(firebaseAuth, (fbUser) => {
          if (fbUser) {
            const formatted = formatAdminUser(fbUser);
            setAdminUser(formatted);
            localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(formatted));
          } else {
            setAdminUser(null);
            localStorage.removeItem(ADMIN_SESSION_KEY);
          }
          setAdminLoading(false);
        });
      } catch (err) {
        console.warn('Admin auth observer error:', err.message);
        setAdminLoading(false);
      }
    };

    setup();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [formatAdminUser]);

  // Sign in with Firebase email + password
  const adminSignIn = useCallback(async (email, password) => {
    const { firebaseAuth } = await initializeFirebase();
    if (!firebaseAuth) throw new Error('Firebase is not configured. Check your environment variables.');

    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const formatted = formatAdminUser(result.user);
    setAdminUser(formatted);
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(formatted));
    return formatted;
  }, [formatAdminUser]);

  // Create a new admin account with Firebase email + password
  const adminSignUp = useCallback(async (email, password, displayName) => {
    const { firebaseAuth } = await initializeFirebase();
    if (!firebaseAuth) throw new Error('Firebase is not configured. Check your environment variables.');

    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);

    // Optionally set displayName on the Firebase profile
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName }).catch(() => {});
    }

    const formatted = formatAdminUser({ ...result.user, displayName: displayName || result.user.displayName });
    setAdminUser(formatted);
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(formatted));
    return formatted;
  }, [formatAdminUser]);

  // Sign out from Firebase
  const adminSignOut = useCallback(async () => {
    try {
      const { firebaseAuth } = await initializeFirebase();
      if (firebaseAuth) {
        const { signOut } = await import('firebase/auth');
        await signOut(firebaseAuth);
      }
    } catch (err) {
      console.warn('Admin sign-out warning:', err.message);
    } finally {
      setAdminUser(null);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, []);

  const value = useMemo(() => ({
    adminUser,
    adminLoading,
    isAdminAuthenticated: !!adminUser,
    adminSignIn,
    adminSignUp,
    adminSignOut,
  }), [adminUser, adminLoading, adminSignIn, adminSignUp, adminSignOut]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;