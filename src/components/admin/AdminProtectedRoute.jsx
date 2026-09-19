import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Protected Route — guards /admin/dashboard and future admin pages.
// Completely separate from the main user ProtectedRoute.
// ─────────────────────────────────────────────────────────────────────────────

export const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, adminLoading } = useAdminAuth();
  const location = useLocation();

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-[#090B10] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-500 font-medium tracking-wide">Verifying admin credentials…</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;