import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  LayoutGrid, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronRight,
  Home,
  Gift,
  Layout,
  Palette,
  Lightbulb,
  Info,
  BookOpen,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from './Toast';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);

  // Close dropdown or mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserDropdown(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdown(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Signed out successfully', 'info');
      setUserDropdown(false);
      navigate('/');
    } catch (e) {
      addToast('Sign out error', 'error');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about/', icon: Info },
    { name: 'Blog', path: '/blog/', icon: BookOpen },
  ];

  const isLinkActive = (path) => {
    if (path === '/') return location.pathname === '/';
    const clean = path.replace(/\/$/, '');
    return location.pathname.startsWith(clean);
  };

  return (
    <header className="site-header sticky top-0 z-40 w-full bg-[#090b10]/92 backdrop-blur-md border-b border-white/[0.07] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          
          {/* Brand / Logo Area */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 sm:gap-3 group py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10] rounded-xl transition-all"
              aria-label="Birthday Wishes Homepage"
            >
              {/* Logo Emblem */}
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 p-[1px] shadow-md shadow-brand-500/20 group-hover:shadow-brand-500/35 transition-all duration-300">
                <div className="w-full h-full bg-[#090b10]/80 rounded-[11px] flex items-center justify-center group-hover:bg-[#090b10]/60 transition-colors">
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
                </div>
              </div>

              {/* Brand Wordmark & Tag */}
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
                  Birthday Wishes
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/25 select-none">
                  Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop & Laptop Navigation Links */}
          <nav 
            className="hidden lg:flex items-center gap-0.5 xl:gap-1.5"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative inline-flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3.5 py-2 text-xs xl:text-[13.5px] font-medium rounded-lg transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10] ${
                    active
                      ? 'text-white bg-white/[0.08] shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${active ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-200'}`} aria-hidden="true" />
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute bottom-1 left-2.5 xl:left-3.5 right-2.5 xl:right-3.5 h-[2px] bg-gradient-to-r from-brand-500 to-amber-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs (Desktop / Tablet) */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-2.5">
            {/* Primary Action: Create Card */}
            <button
              type="button"
              onClick={() => navigate('/templates/')}
              className="inline-flex items-center justify-center gap-1.5 xl:gap-2 h-9 px-3 xl:px-4 rounded-xl text-xs xl:text-sm font-medium text-white bg-gradient-to-r from-brand-600 via-brand-500 to-pink-500 shadow-sm shadow-brand-500/25 hover:shadow-md hover:shadow-brand-500/35 hover:brightness-105 active:scale-[0.98] border border-brand-400/30 transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10]"
            >
              <Sparkles className="w-3.5 h-3.5 xl:w-4 xl:h-4 flex-shrink-0 text-amber-200" aria-hidden="true" />
              <span>Create Card</span>
            </button>

            {/* Auth States */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdown(!userDropdown)}
                  aria-expanded={userDropdown}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 h-9 px-2 py-1 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10]"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User Profile'}
                      className="w-6 h-6 rounded-lg object-cover ring-1 ring-white/20"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-brand-600/30 border border-brand-400/40 flex items-center justify-center text-[11px] font-bold text-brand-200">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5 text-brand-300" aria-hidden="true" />}
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate hidden xl:inline-block">
                    {user.name?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                {/* Dropdown Menu — CSS transition (no framer-motion) */}
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f121a] border border-white/10 shadow-2xl shadow-black/80 p-1.5 z-50 focus:outline-none transition-all duration-150 origin-top-right ${
                    userDropdown
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                  style={{ transform: userDropdown ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)' }}
                >
                  <div className="px-3 py-2 border-b border-white/[0.07] mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard/"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                    <span>My Cards Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 mt-0.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 xl:gap-2">
                {/* Secondary CTA: Sign In */}
                <Link
                  to="/login/"
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-2.5 xl:px-3 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10]"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>Sign In</span>
                </Link>

                {/* Secondary CTA: Sign Up */}
                <Link
                  to="/signup/"
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-3 xl:px-3.5 text-xs sm:text-sm font-medium text-slate-100 bg-white/[0.06] hover:bg-white/[0.12] hover:text-white border border-white/15 hover:border-white/25 rounded-xl transition-all duration-150 whitespace-nowrap shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10]"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile / Tablet Menu Trigger & Mobile Create Shortcut */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Create shortcut for mobile only */}
            <button
              type="button"
              onClick={() => navigate('/templates/')}
              className="sm:hidden inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-brand-600 to-pink-500 shadow-sm border border-brand-400/30 active:scale-[0.97]"
              aria-label="Create Card"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" aria-hidden="true" />
              <span>Create</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.05] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu — CSS transition (no framer-motion) */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 top-[68px] bg-black/60 z-30 lg:hidden transition-opacity duration-200 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        id="mobile-navigation-drawer"
        className={`relative z-40 lg:hidden border-b border-white/[0.08] bg-[#0c0e14]/98 backdrop-blur-md px-4 sm:px-6 pt-3 pb-6 shadow-2xl shadow-black/90 space-y-3 transition-all duration-200 origin-top overflow-hidden ${
          mobileMenuOpen ? 'opacity-100 translate-y-0 max-h-[600px] pointer-events-auto' : 'opacity-0 -translate-y-2 max-h-0 pointer-events-none py-0'
        }`}
      >
              {/* Navigation Links */}
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const active = isLinkActive(link.path);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'text-white bg-white/[0.08] font-semibold border border-white/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-slate-400'}`} aria-hidden="true" />
                        <span>{link.name}</span>
                      </span>
                      {active ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      )}
                    </Link>
                  );
                })}

                {user && (
                  <Link
                    to="/dashboard/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-amber-300 hover:text-amber-200 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <LayoutGrid className="w-4 h-4 text-amber-400" aria-hidden="true" />
                      <span>My Cards Dashboard</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-amber-400/40" />
                  </Link>
                )}
              </nav>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/[0.07] space-y-2.5">
                {/* Create Card Button */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/templates/');
                  }}
                  className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-brand-600 via-brand-500 to-pink-500 shadow-md shadow-brand-500/25 border border-brand-400/30 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" aria-hidden="true" />
                  <span>Create Birthday Card</span>
                </button>

                {/* Auth Actions on Mobile */}
                {user ? (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" aria-hidden="true" />}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-medium text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/login/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl text-sm font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                    >
                      <LogIn className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/signup/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl text-sm font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 transition-colors shadow-sm"
                    >
                      <UserPlus className="w-4 h-4 text-amber-300" aria-hidden="true" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
    </header>
  );
};
