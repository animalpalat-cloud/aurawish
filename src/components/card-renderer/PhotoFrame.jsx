import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export const PhotoFrame = ({
  photoUrl,
  recipientName,
  styleType = 'polaroid',
  accentColor = '#E5C07B',
  className
}) => {
  if (!photoUrl) return null;

  if (styleType === 'polaroid') {
    return (
      <motion.div
        whileHover={{ scale: 1.03, rotate: 0 }}
        initial={{ rotate: -2, scale: 0.95 }}
        animate={{ rotate: -1.5, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={cn(
          "relative bg-[#fbfbfb] text-slate-900 p-3 sm:p-4 pb-8 sm:pb-10 rounded shadow-2xl border border-white/20 mx-auto max-w-[260px] sm:max-w-[300px]",
          className
        )}
      >
        {/* Vintage tape sticker */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-100/70 border border-amber-200/50 -rotate-2 shadow-sm rounded-sm backdrop-blur-sm" />

        <div className="relative aspect-square overflow-hidden rounded bg-slate-200 shadow-inner">
          <img
            src={photoUrl}
            alt={recipientName || 'Birthday Photo'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="font-script text-center text-slate-800 text-lg sm:text-xl mt-2 truncate">
          {recipientName || 'Unforgettable Moments'} ✨
        </p>
      </motion.div>
    );
  }

  if (styleType === 'luxury-gold') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={cn(
          "relative p-1.5 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-[0_0_30px_rgba(229,192,123,0.3)] mx-auto max-w-[240px] sm:max-w-[280px]",
          className
        )}
      >
        <div className="relative aspect-square rounded-[14px] overflow-hidden bg-slate-950">
          <img
            src={photoUrl}
            alt={recipientName || 'Birthday Portrait'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      </motion.div>
    );
  }

  if (styleType === 'cyber-glow') {
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        className={cn(
          "relative p-1 rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] mx-auto max-w-[240px] sm:max-w-[280px]",
          className
        )}
      >
        <div className="relative aspect-square rounded-[14px] overflow-hidden bg-slate-950">
          <img
            src={photoUrl}
            alt={recipientName || 'Birthday Rave'}
            className="w-full h-full object-cover contrast-105"
            loading="lazy"
          />
        </div>
      </motion.div>
    );
  }

  // Default clean circular or rounded frame
  return (
    <div className={cn("relative mx-auto max-w-[220px] sm:max-w-[260px]", className)}>
      <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
        <img
          src={photoUrl}
          alt={recipientName || 'Birthday Photo'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};
