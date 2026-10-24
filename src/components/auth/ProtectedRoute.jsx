import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-medium">Verifying studio credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login/?returnTo=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
