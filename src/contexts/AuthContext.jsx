import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize with cached user immediately (synchronous, no delay)
  const [user, setUser] = useState(() => authService.getCurrentUser());
  // Start as false to not block rendering
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync from local cache is already done in initial state
    // Set up auth observers but don't block rendering
    const unsubscribe = authService.initAuthObserver((updatedUser) => {
      setUser(updatedUser);
      setLoading(false);
    });

    // No timeout needed — we already have the cached user from initial state
    // Set loading to false immediately since we're not blocking anything
    setLoading(false);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email, password) => {
    const loggedUser = await authService.login({ email, password });
    setUser(loggedUser);
    return loggedUser;
  };

  const registerWithEmail = async (name, email, password) => {
    const newUser = await authService.register({ name, email, password });
    setUser(newUser);
    return newUser;
  };

  const loginWithGoogle = async () => {
    const googleUser = await authService.loginWithGoogle();
    setUser(googleUser);
    return googleUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
