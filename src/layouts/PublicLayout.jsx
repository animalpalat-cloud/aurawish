import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};