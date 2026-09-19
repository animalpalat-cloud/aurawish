import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Layout
// Wraps all /admin routes with AdminAuthProvider.
// Deliberately has NO site Navbar or Footer — admin is a separate product surface.
// ─────────────────────────────────────────────────────────────────────────────

export const AdminLayout = () => {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-[#090B10]">
        <Outlet />
      </div>
    </AdminAuthProvider>
  );
};

export default AdminLayout;