import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

// PERFORMANCE: Removed framer-motion — uses CSS transitions instead
// Same visual effect (fade + slide) at zero JS cost.
export const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 350);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-brand-500/50 shadow-xl shadow-black/40 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:ring-offset-2 focus:ring-offset-[#090b10] group ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      <ArrowUp
        className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 text-brand-400 group-hover:text-brand-300"
        aria-hidden="true"
      />
    </button>
  );
};
