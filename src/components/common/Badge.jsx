import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: "bg-brand-500/15 text-brand-300 border-brand-500/30",
    gold: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    slate: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border select-none",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
