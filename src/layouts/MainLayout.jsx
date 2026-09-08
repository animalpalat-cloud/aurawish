import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { BackToTopButton } from '../components/common/BackToTopButton';

export const MainLayout = () => {
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
