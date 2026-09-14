import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { BackToTopButton } from '../components/common/BackToTopButton';

export const MainLayout = () => {
  // Toggle a DOM class only — never React state — so scrolling does not
  // re-render the homepage card tree. Used to pause decorative CSS animations.
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    const onScroll = () => {
      root.classList.add('is-scrolling');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.classList.remove('is-scrolling'), 140);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
      root.classList.remove('is-scrolling');
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#090b10] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};
