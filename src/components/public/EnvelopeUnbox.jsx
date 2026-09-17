import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, MailOpen, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

export const EnvelopeUnbox = ({ cardData, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    soundService.playFx('unseal');

    // Confetti cannon
    setTimeout(() => {
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#E5C07B', '#d946ef', '#06b6d4', '#f43f5e', '#fbbf24', '#ffffff']
        });
      } catch (e) {}
    }, 500);

    // Trigger music if enabled
    if (cardData.musicTrack) {
      soundService.playMusic(cardData.musicTrack);
    }

    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-[#090b10] via-[#121622] to-[#090b10]">
      {/* Soft background glow */}
      <div className="absolute w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Recipient Teaser Intro */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md mb-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-300 text-xs font-medium mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          A Personal Digital Greeting
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Someone special crafted a birthday surprise for you...
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Tap the sealed envelope below to open your personalized card.
        </p>
      </motion.div>

      {/* 3D Wax Seal Envelope Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-20 cursor-pointer group"
        onClick={handleOpen}
      >
        {/* Envelope Body */}
        <div className={`relative w-[300px] xs:w-[340px] sm:w-[400px] max-w-[calc(100vw-2rem)] h-[210px] xs:h-[230px] sm:h-[260px] rounded-2xl bg-gradient-to-tr from-[#1a1c26] via-[#242938] to-[#14161f] border border-amber-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(229,192,123,0.15)] transition-transform duration-500 overflow-hidden ${
          isOpening ? 'scale-105' : 'group-hover:scale-102'
        }`}>
          {/* Envelope Top Flap SVG to scale perfectly across all widths without pixel borders breaking */}
          <svg
            className="absolute top-0 left-0 w-full h-[110px] sm:h-[130px] filter drop-shadow-md pointer-events-none"
            viewBox="0 0 400 130"
            preserveAspectRatio="none"
          >
            <polygon points="0,0 400,0 200,130" fill="#2d3345" />
          </svg>

          {/* Envelope Inner Card Peek */}
          <motion.div
            animate={isOpening ? { y: -80, opacity: 1 } : { y: 0, opacity: 0.6 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-x-4 sm:inset-x-6 top-4 bottom-6 bg-gradient-to-b from-amber-100 to-amber-200 rounded-xl shadow-inner border border-amber-300/60 flex flex-col items-center justify-center p-3 sm:p-4 text-slate-900"
          >
            <p className="text-xs uppercase font-serif tracking-widest text-amber-800 font-bold">
              Personal Invitation
            </p>
            <p className="font-display font-bold text-base sm:text-lg text-slate-900 mt-1 truncate max-w-full px-2">
              {cardData.recipientName || 'Dear Friend'}
            </p>
          </motion.div>

          {/* Gold Wax Seal Button */}
          <motion.div
            animate={isOpening ? { scale: 1.3, opacity: 0, rotate: 45 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-1 shadow-[0_0_25px_rgba(251,191,36,0.6)] flex items-center justify-center border border-amber-200/60 group-hover:scale-110 transition-transform">
              <div className="w-full h-full rounded-full border-2 border-amber-800/40 flex flex-col items-center justify-center bg-gradient-to-b from-amber-500 to-amber-700 text-slate-950">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100 drop-shadow" />
                <span className="text-[9px] font-bold tracking-widest text-amber-100 uppercase">OPEN</span>
              </div>
            </div>
          </motion.div>

          {/* Recipient Label on Front */}
          <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between text-xs text-amber-300/80 font-mono">
            <span className="truncate max-w-[60%]">TO: {cardData.recipientName || 'Friend'}</span>
            <span className="shrink-0">✦ UNBOX ✦</span>
          </div>
        </div>

        {/* Action Prompt */}
        <p className="text-center text-xs font-semibold text-amber-400 mt-6 tracking-wide animate-pulse">
          ✨ Click the Wax Seal to Open ✨
        </p>
      </motion.div>
    </div>
  );
};
