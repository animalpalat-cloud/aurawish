import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Activity, RefreshCw, Wifi, WifiOff, Users, FileText, AlertCircle } from 'lucide-react';
import { AdminShell } from '../../components/admin/AdminShell';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Analytics Page — /admin/analytics
// Displays real-time active users from Google Analytics (GA4 Data API).
// Data is fetched through /api/analytics (Vercel serverless function) every 30s.
// ─────────────────────────────────────────────────────────────────────────────

const REFRESH_INTERVAL_MS = 30_000; // 30 seconds

// ── Utility ──────────────────────────────────────────────────────────────────
function formatTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function truncatePage(label, max = 40) {
  if (!label || label === '(not set)') return '/';
  if (label.length <= max) return label;
  return label.slice(0, max) + '…';
}

// ── Pulse Ring — animated ring around the live indicator ─────────────────────
const PulseRing = () => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
  </span>
);

// ── Mini bar for page breakdown ───────────────────────────────────────────────
const PageBar = ({ page, users, max }) => {
  const pct = max > 0 ? Math.max(4, Math.round((users / max) * 100)) : 4;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-800/60 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-300 font-mono truncate" title={page}>
          {truncatePage(page)}
        </p>
        <div className="mt-1.5 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="text-xs font-bold text-white tabular-nums flex-shrink-0 w-6 text-right">
        {users}
      </span>
    </div>
  );
};

// ── Countdown ring ────────────────────────────────────────────────────────────
const CountdownRing = ({ secondsLeft, total }) => {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const dash = circ * (secondsLeft / total);
  return (
    <svg width="40" height="40" className="-rotate-90">
      <circle cx="20" cy="20" r={r} fill="none" stroke="#1e293b" strokeWidth="3" />
      <circle
        cx="20" cy="20" r={r} fill="none"
        stroke="#6366f1" strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-linear"
      />
    </svg>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);          // { activeUsers, topPages, fetchedAt }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [online, setOnline] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_INTERVAL_MS / 1000);
  const [history, setHistory] = useState([]);      // last ~20 readings for sparkline

  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics?type=realtime', { cache: 'no-store' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setOnline(true);
      setHistory(prev => {
        const next = [...prev, { t: Date.now(), v: json.activeUsers }];
        return next.slice(-20); // keep last 20 data points
      });
    } catch (e) {
      setError(e.message);
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auto-refresh ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchData();

    timerRef.current = setInterval(() => {
      fetchData();
      setSecondsLeft(REFRESH_INTERVAL_MS / 1000);
    }, REFRESH_INTERVAL_MS);

    countdownRef.current = setInterval(() => {
      setSecondsLeft(prev => (prev <= 1 ? REFRESH_INTERVAL_MS / 1000 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [fetchData]);

  // ── Sparkline ───────────────────────────────────────────────────────────────
  const renderSparkline = () => {
    if (history.length < 2) return null;
    const W = 320, H = 56;
    const maxV = Math.max(...history.map(p => p.v), 1);
    const pts = history.map((p, i) => {
      const x = (i / (history.length - 1)) * W;
      const y = H - (p.v / maxV) * (H - 8) - 4;
      return `${x},${y}`;
    });
    const areaPath = `M ${pts.join(' L ')} L ${W},${H} L 0,${H} Z`;
    const linePath = `M ${pts.join(' L ')}`;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14 mt-3" preserveAspectRatio="none">
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#spark-grad)" />
        <path d={linePath} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const maxPageUsers = data?.topPages?.[0]?.users ?? 1;

  return (
    <AdminShell title="Analytics">
      {/* ── Header row ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Real-time Overview</h2>
          </div>
          <p className="text-xs text-slate-500">
            Powered by Google Analytics · Property ID: <span className="font-mono text-slate-400">555173694</span> · Tag: <span className="font-mono text-slate-400">G-CL04BYZ1GZ</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
            online
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {online ? 'Live' : 'Offline'}
          </div>

          {/* Countdown + manual refresh */}
          <button
            id="analytics-manual-refresh"
            onClick={() => { fetchData(true); setSecondsLeft(REFRESH_INTERVAL_MS / 1000); }}
            disabled={loading}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
            title="Refresh now"
          >
            <CountdownRing secondsLeft={secondsLeft} total={REFRESH_INTERVAL_MS / 1000} />
            <RefreshCw className={`absolute w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Error banner ────────────────────────────────────────── */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Failed to load analytics data</p>
            <p className="text-xs text-rose-400/80 mt-0.5">{error}</p>
            {error.includes('GA4_SERVICE_ACCOUNT_JSON') || error.includes('GA4_PROPERTY_ID') ? (
              <p className="text-xs text-rose-400/60 mt-2">
                Add <code className="bg-rose-500/10 px-1 rounded">GA4_SERVICE_ACCOUNT_JSON</code> and{' '}
                <code className="bg-rose-500/10 px-1 rounded">GA4_PROPERTY_ID</code> to your Vercel environment variables.
              </p>
            ) : null}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column: Active users hero card ─────────────── */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Hero active-users card */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-[#0d1117] p-7">
            {/* Background glow */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)' }}
            />

            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <PulseRing />
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                  Right Now
                </span>
              </div>

              {loading && !data ? (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-slate-800 rounded animate-pulse" />
                    <div className="w-16 h-3 bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-3 mb-2">
                    <p className="text-6xl font-black text-white tabular-nums leading-none">
                      {data?.activeUsers ?? '—'}
                    </p>
                    <div className="mb-2">
                      <Users className="w-6 h-6 text-indigo-400" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">Active users on site</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Last updated · {formatTime(data?.fetchedAt)}
                  </p>
                </>
              )}

              {/* Sparkline history */}
              {renderSparkline()}
              {history.length >= 2 && (
                <p className="text-[10px] text-slate-600 mt-1 text-right">Last {history.length} readings</p>
              )}
            </div>
          </div>

          {/* Auto-refresh info card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Auto Refresh</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((REFRESH_INTERVAL_MS / 1000 - secondsLeft) / (REFRESH_INTERVAL_MS / 1000)) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 flex-shrink-0 w-8 text-right">
                {secondsLeft}s
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Data refreshes automatically every 30 seconds. Click ↻ to refresh now.
            </p>
          </div>
        </div>

        {/* ── Right column: Pages breakdown ───────────────────── */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-[#0d1117] p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-white">Active by Page</h3>
            <span className="ml-auto text-[11px] text-slate-600 font-mono">right now</span>
          </div>

          {loading && !data ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-slate-800 rounded animate-pulse" style={{ width: `${60 + i * 5}%` }} />
                    <div className="h-1 bg-slate-800 rounded animate-pulse" style={{ width: `${80 - i * 8}%` }} />
                  </div>
                  <div className="w-4 h-3 bg-slate-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : !data?.topPages?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="w-10 h-10 text-slate-700 mb-3" />
              <p className="text-sm text-slate-500 font-medium">No active users at this moment</p>
              <p className="text-xs text-slate-600 mt-1">Data will appear as visitors arrive</p>
            </div>
          ) : (
            <div>
              {data.topPages.map((p) => (
                <PageBar key={p.page} page={p.page} users={p.users} max={maxPageUsers} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Setup guide (shown until env vars are configured) ── */}
      {error && (error.includes('Missing') || error.includes('environment')) && (
        <div className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-7">
          <h3 className="text-sm font-bold text-amber-300 mb-4">⚙️ Setup Required — 3 Steps</h3>
          <ol className="space-y-4 text-xs text-slate-400 list-decimal list-inside">
            <li>
              <span className="text-slate-300 font-medium">Create a Google Cloud service account</span>
              <br />
              Go to <span className="font-mono text-amber-300/80">console.cloud.google.com</span> → IAM → Service Accounts → Create.
              Download the JSON key.
            </li>
            <li>
              <span className="text-slate-300 font-medium">Grant the service account access to GA4</span>
              <br />
              In Google Analytics Admin → Property Access Management → Add the service account email with <em>Viewer</em> role.
            </li>
            <li>
              <span className="text-slate-300 font-medium">Add Vercel environment variables</span>
              <br />
              In your Vercel project settings → Environment Variables, add:
              <ul className="mt-2 ml-4 space-y-1">
                <li><code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">GA4_SERVICE_ACCOUNT_JSON</code> — paste the full JSON key content</li>
                <li><code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">GA4_PROPERTY_ID</code> — your GA4 numeric property ID (find in GA4 Admin → Property Settings)</li>
              </ul>
            </li>
          </ol>
        </div>
      )}

      {/* ── Permission guide (shown if Google rejects service account access) ── */}
      {error && (error.toLowerCase().includes('permission') || error.toLowerCase().includes('403')) && (
        <div className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-7">
          <h3 className="text-sm font-bold text-amber-300 mb-2">🔐 Grant GA4 Viewer Permission</h3>
          <p className="text-xs text-slate-300 mb-3">
            The service account authenticated successfully, but Google Analytics needs access to your property.
          </p>
          <ol className="space-y-2 text-xs text-slate-400 list-decimal list-inside">
            <li>Open Google Analytics Admin ⚙️ for Property ID <span className="font-mono text-amber-300">555173694</span></li>
            <li>Click <strong>Property Access Management</strong></li>
            <li>Click <strong>+</strong> (Add users) and enter: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">firebase-adminsdk-fbsvc@aurawish-dbd78.iam.gserviceaccount.com</code></li>
            <li>Select the <strong>Viewer</strong> role and click <strong>Add</strong></li>
          </ol>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminAnalyticsPage;
