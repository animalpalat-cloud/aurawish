import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Sign Up Page — /admin/signup
// Creates a new Firebase admin account.
// Completely separate from the public-facing /signup page.
// ─────────────────────────────────────────────────────────────────────────────

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
];

export const AdminSignupPage = () => {
  const navigate = useNavigate();
  const { adminSignUp, isAdminAuthenticated, adminLoading } = useAdminAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!adminLoading && isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdminAuthenticated, adminLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await adminSignUp(email, password, name);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      let msg = 'Failed to create admin account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please choose a stronger password.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090B10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full blur-3xl opacity-18"
        style={{ background: 'radial-gradient(ellipse, #6366f1 0%, #4338ca 50%, transparent 100%)' }}
      />

      <div
        className="w-full max-w-md bg-[#11141e] border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10"
        style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 32px 64px -16px rgba(0,0,0,0.7)' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[10px] font-semibold uppercase tracking-widest mb-3">
            Admin Panel
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Create Admin Account
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Register a new administrator account.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* Form */}
        <form id="admin-signup-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="admin-signup-name" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="admin-signup-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="admin-signup-email" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="admin-signup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="admin-signup-password" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="admin-signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password strength indicators */}
            {password && (
              <div className="mt-2 space-y-1">
                {PASSWORD_RULES.map(({ label, test }) => (
                  <div key={label} className={`flex items-center gap-1.5 text-[10px] transition-colors ${test(password) ? 'text-emerald-400' : 'text-slate-600'}`}>
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="admin-signup-confirm" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="admin-signup-confirm"
                type={showConfirm ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                  confirmPassword && password !== confirmPassword
                    ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1.5 text-[10px] text-rose-400">Passwords do not match</p>
            )}
          </div>

          {/* Submit */}
          <button
            id="admin-signup-submit"
            type="submit"
            disabled={loading || (!!confirmPassword && password !== confirmPassword)}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account…
              </>
            ) : (
              <>
                Create Admin Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-7 pt-6 border-t border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/admin"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
          <p className="text-[10px] text-slate-700">
            This is a restricted area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;