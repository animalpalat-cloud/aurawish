import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart3, Settings, FileText, Bell, ChevronRight, Activity, PenLine, Clock, CheckCircle2 } from 'lucide-react';
import { AdminShell } from '../../components/admin/AdminShell';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { blogService } from '../../services/blogService';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Dashboard Page — /admin/dashboard
// ─────────────────────────────────────────────────────────────────────────────

const colorMap = {
  indigo:  'from-indigo-600 to-indigo-700 shadow-indigo-500/25',
  emerald: 'from-emerald-600 to-emerald-700 shadow-emerald-500/25',
  amber:   'from-amber-500 to-amber-600 shadow-amber-500/25',
  blue:    'from-blue-600 to-blue-700 shadow-blue-500/25',
  rose:    'from-rose-600 to-rose-700 shadow-rose-500/25',
};

const QUICK_LINKS = [
  { label: 'Real-Time Analytics', desc: 'Live visitor traffic and active pages', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Blog Management',   desc: 'Create, edit, publish blog posts',   icon: PenLine,  href: '/admin/blog' },
  { label: 'User Management',   desc: 'View and manage user accounts',       icon: Users,     href: '#' },
  { label: 'Settings',          desc: 'Platform configuration and policies', icon: Settings,  href: '#' },
];

export const AdminDashboardPage = () => {
  const { adminUser } = useAdminAuth();
  const [blogStats, setBlogStats] = useState({ total: 0, published: 0, draft: 0, scheduled: 0 });
  const [liveUsers, setLiveUsers] = useState(null);

  useEffect(() => {
    blogService.getBlogStats().then(stats => {
      setBlogStats(stats);
    }).catch(() => {});

    // Fetch real-time active users from GA4 proxy endpoint
    fetch('/api/analytics?type=realtime')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data.activeUsers === 'number') {
          setLiveUsers(data.activeUsers);
        }
      })
      .catch(() => {});
  }, []);

  const initials = adminUser?.displayName
    ? adminUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (adminUser?.email?.[0] || 'A').toUpperCase();

  const STAT_CARDS = [
    { label: 'Published Posts', value: String(blogStats.published), icon: CheckCircle2, color: 'emerald' },
    { label: 'Draft Posts',     value: String(blogStats.draft),     icon: FileText,     color: 'amber' },
    { label: 'Scheduled Posts', value: String(blogStats.scheduled), icon: Clock,        color: 'blue' },
    { label: 'Live Visitors',   value: liveUsers !== null ? String(liveUsers) : '—', icon: Activity, color: 'indigo' },
  ];

  return (
    <AdminShell title="Dashboard">
      {/* ── Welcome banner ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 p-7 sm:p-9 mb-8">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.22) 0%, rgba(17,20,30,1) 55%, rgba(109,40,217,0.12) 100%)' }} />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Authenticated
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Welcome back,{' '}
              <span className="text-indigo-300">
                {adminUser?.displayName || adminUser?.email?.split('@')[0] || 'Admin'}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Signed in as <span className="text-slate-300 font-medium">{adminUser?.email}</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-xl shadow-indigo-500/30 flex-shrink-0">
            <span className="text-white text-xl font-bold">{initials}</span>
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl bg-[#11141e] border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-colors">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-md`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick links ───────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Admin Areas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map(({ label, desc, icon: Icon, href }) => (
            <Link
              key={label}
              to={href}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-[#11141e] border border-slate-800 hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-indigo-500/15 flex items-center justify-center flex-shrink-0 transition-colors">
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminDashboardPage;