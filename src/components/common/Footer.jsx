import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07080c] relative overflow-hidden text-slate-400">
      {/* Background soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Birthday Wishes
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Beautiful birthday wishes and digital birthday cards. Craft cinematic unboxing moments with music, customized photos, and emotional messages for friends and family worldwide.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10">
                <Zap className="w-3 h-3 text-amber-400" /> Instant Generation
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10">
                <Shield className="w-3 h-3 text-emerald-400" /> Shareable Link
              </span>
            </div>
          </div>

          {/* Column 2: Core Platform Hubs */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Explore Birthday Wishes
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/birthday-wishes" className="hover:text-white transition-colors">Birthday Wishes Hub</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors">Card Templates Gallery</Link></li>
              <li><Link to="/birthday-card-maker" className="hover:text-white transition-colors">Birthday Card Maker</Link></li>
              <li><Link to="/digital-birthday-cards" className="hover:text-white transition-colors">Digital Birthday Cards</Link></li>
              <li><Link to="/birthday-cards-with-music" className="hover:text-white transition-colors">Birthday Cards with Music</Link></li>
              <li><Link to="/birthday-cards-with-photos" className="hover:text-white transition-colors">Birthday Cards with Photos</Link></li>
              <li><Link to="/birthday-ideas" className="hover:text-white transition-colors">Birthday Ideas & Guides</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Company */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Trust & Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Column 4: Popular Categories */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/birthday-wishes-for-mom" className="hover:text-white transition-colors">Birthday Wishes for Mom</Link></li>
              <li><Link to="/birthday-wishes-for-dad" className="hover:text-white transition-colors">Birthday Wishes for Dad</Link></li>
              <li><Link to="/birthday-wishes-for-best-friend" className="hover:text-white transition-colors">Wishes for Best Friend</Link></li>
              <li><Link to="/romantic-birthday-wishes" className="hover:text-white transition-colors">Romantic Birthday Wishes</Link></li>
              <li><Link to="/funny-birthday-wishes" className="hover:text-white transition-colors">Funny Birthday Wishes</Link></li>
              <li><Link to="/heartfelt-birthday-wishes" className="hover:text-white transition-colors">Heartfelt Birthday Wishes</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Birthday Wishes Studio. All rights reserved. Crafted for unforgettable celebrations.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/cookie-policy" className="hover:text-slate-400 transition-colors">Cookies</Link>
            <span>•</span>
            <Link to="/disclaimer" className="hover:text-slate-400 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
