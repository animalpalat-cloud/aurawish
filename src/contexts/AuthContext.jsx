import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial sync from cache or observer
    const initialUser = authService.getCurrentUser();
    if (initialUser) {
      setUser(initialUser);
    }

    const unsubscribe = authService.initAuthObserver((updatedUser) => {
      setUser(updatedUser);
      setLoading(false);
    });

    // Mark loading false after brief initial sync
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => {
      clearTimeout(timer);
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
