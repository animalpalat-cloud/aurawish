import React from 'react';
import { cn } from '../../utils/cn';

// PERFORMANCE: Removed framer-motion (whileHover/whileTap) — replaced with CSS active:scale
// CSS transforms are GPU-accelerated and don't require a 128 KB library.
export const Button = React.forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#090b10] disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl hover:scale-[1.02] active:scale-[0.98]";

  const variants = {
    primary: "bg-gradient-to-r from-brand-600 via-brand-500 to-pink-500 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:brightness-110 focus:ring-brand-500 border border-brand-400/30",
    gold: "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-semibold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/35 hover:brightness-110 focus:ring-yellow-400 border border-yellow-300/40",
    secondary: "bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700/80 shadow-sm focus:ring-slate-400 hover:border-slate-600",
    outline: "border border-brand-500/40 hover:border-brand-500 text-brand-300 hover:text-white hover:bg-brand-500/10 focus:ring-brand-500",
    ghost: "text-slate-300 hover:text-white hover:bg-white/5 focus:ring-slate-500",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 focus:ring-rose-500 border border-rose-400/30",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
    xl: "text-lg px-8 py-4 gap-3 font-bold rounded-2xl",
    icon: "p-2.5",
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={cn("w-4 h-4", size === 'lg' && "w-5 h-5", size === 'xl' && "w-6 h-6")} />
      ) : null}

      <span>{children}</span>

      {!loading && Icon && iconPosition === 'right' ? (
        <Icon className={cn("w-4 h-4", size === 'lg' && "w-5 h-5", size === 'xl' && "w-6 h-6")} />
      ) : null}
    </button>
  );
});

Button.displayName = 'Button';
