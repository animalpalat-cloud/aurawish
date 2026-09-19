import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LogOut, LayoutDashboard, FileText, Menu, X, ChevronRight } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// AdminShell — shared chrome for all admin pages.
// Provides sidebar navigation + top header. Wraps page content.
// ─────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Dashboard',        href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Blog Management',  href: '/admin/blog',      icon: FileText },
];

export const AdminShell = ({ children, title = 'Admin Panel' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, adminSignOut } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await adminSignOut();
    navigate('/admin', { replace: true });
  };

  const initials = adminUser?.displayName
    ? adminUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (adminUser?.email?.[0] || 'A').toUpperCase();

  const SidebarContent = () => (
    <nav className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/80">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Admin Panel</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Birthday Wishes</p>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href || location.pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />}
            </Link>
          );
        })}
      </div>

      {/* User area */}
      <div className="px-3 py-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/60">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{adminUser?.displayName || 'Admin'}</p>
            <p className="text-[10px] text-slate-500 truncate">{adminUser?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#090B10] text-white flex">
      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-[#0d1117] border-r border-slate-800/80 fixed top-0 left-0 h-full z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ────────────────────────── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-[#0d1117] border-r border-slate-800/80 h-full flex flex-col z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#090B10]/95 backdrop-blur-sm border-b border-slate-800/80 h-14 flex items-center justify-between px-4 sm:px-6 gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-white tracking-tight">{title}</h1>
          </div>
          {/* Admin badge — mobile only (desktop shows in sidebar) */}
          <div className="lg:hidden flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[9px] font-bold">
              {initials}
            </div>
            <span className="text-[11px] text-indigo-300 font-medium hidden sm:inline truncate max-w-[100px]">
              {adminUser?.email}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;