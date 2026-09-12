// Firebase initialization — used ONLY for Google OAuth
// All other application data stays in Supabase
//
// PERFORMANCE OPTIMIZATION:
// Firebase is initialized LAZILY — only when actually needed for Google Sign-In.
// This prevents the ~93 KB Firebase auth iframe from blocking initial page render.
// The homepage and all content pages can now render immediately without waiting
// for Firebase to initialize and fetch auth state.

let firebaseApp = null;
let firebaseAuth = null;
let googleProvider = null;
let isFirebaseConfigured = false;
let initializationPromise = null;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Lazy initialization of Firebase — only runs when actually needed.
 * Returns a promise that resolves when Firebase is ready.
 */
async function initializeFirebase() {
  // Return existing initialization if already in progress or complete
  if (initializationPromise) return initializationPromise;
  
  // Already initialized
  if (firebaseApp && firebaseAuth && googleProvider) {
    return Promise.resolve({ firebaseApp, firebaseAuth, googleProvider, isFirebaseConfigured });
  }

  initializationPromise = (async () => {
    try {
      // Only initialize if config values are present
      if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
        // Dynamic import to avoid loading Firebase code until needed
        const { initializeApp } = await import('firebase/app');
        const { getAuth, GoogleAuthProvider } = await import('firebase/auth');
        
        firebaseApp = initializeApp(firebaseConfig);
        firebaseAuth = getAuth(firebaseApp);
        googleProvider = new GoogleAuthProvider();
        googleProvider.addScope('email');
        googleProvider.addScope('profile');
        isFirebaseConfigured = true;
        
        return { firebaseApp, firebaseAuth, googleProvider, isFirebaseConfigured };
      }
      
      return { firebaseApp: null, firebaseAuth: null, googleProvider: null, isFirebaseConfigured: false };
    } catch (error) {
      console.warn('Firebase initialization warning:', error.message);
      isFirebaseConfigured = false;
      return { firebaseApp: null, firebaseAuth: null, googleProvider: null, isFirebaseConfigured: false };
    }
  })();

  return initializationPromise;
}

/**
 * Get Firebase auth synchronously (may be null if not yet initialized).
 * Use initializeFirebase() if you need to ensure it's initialized.
 */
function getFirebaseAuth() {
  return firebaseAuth;
}

/**
 * Get Google provider synchronously (may be null if not yet initialized).
 */
function getGoogleProvider() {
  return googleProvider;
}

/**
 * Check if Firebase is configured (doesn't trigger initialization).
 */
function checkFirebaseConfigured() {
  return isFirebaseConfigured || (
    firebaseConfig.apiKey && 
    firebaseConfig.authDomain && 
    firebaseConfig.projectId
  );
}

export { 
  firebaseApp, 
  firebaseAuth, 
  googleProvider, 
  isFirebaseConfigured,
  initializeFirebase,
  getFirebaseAuth,
  getGoogleProvider,
  checkFirebaseConfigured
};
