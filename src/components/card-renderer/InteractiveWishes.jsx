import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { soundService } from '../../services/soundService';
import confetti from 'canvas-confetti';

export const InteractiveWishes = ({ recipientName = 'Friend' }) => {
  const [isBlown, setIsBlown] = useState(false);
  const [isWishing, setIsWishing] = useState(false);

  /*
   * PERF FIX: The candle flame runs a Framer Motion infinite loop
   * (scale + opacity + y, 1.2 s, repeat: Infinity).  When the card is
   * below the fold — or inside a scrolled-away Live Preview — that rAF
   * loop still fires every frame, burning GPU/CPU unnecessarily.
   *
   * IntersectionObserver gate: we track whether the component root is
   * in the viewport and only run the animation while it is visible.
   * When the user scrolls away the motion component unmounts and all
   * animation work stops immediately.
   */
  const rootRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleBlowCandle = () => {
    if (isBlown) return;
    setIsWishing(true);
    soundService.playFx('blow');

    setTimeout(() => {
      setIsBlown(true);
      setIsWishing(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#FFD700', '#FF69B4', '#00FFFF', '#FFA500'],
        });
      } catch (e) {}
    }, 400);
  };

  return (
    <div
      ref={rootRef}
      className="mt-8 pt-6 border-t border-white/10 text-center relative z-30"
    >
      <div className="inline-flex flex-col items-center">

        {/* Interactive Candle */}
        <button
          onClick={handleBlowCandle}
          disabled={isBlown}
          className={`group relative flex flex-col items-center transition-all p-3 rounded-2xl ${
            isBlown
              ? 'cursor-default'
              : 'hover:scale-105 active:scale-95 cursor-pointer bg-white/5 hover:bg-white/10'
          }`}
          title={isBlown ? 'Wish made!' : 'Click to make a wish & blow out the candle!'}
        >
          {/* Flame / Smoke — only animate while visible */}
          <div className="h-8 flex items-center justify-center">
            {!isBlown ? (
              isVisible ? (
                <motion.div
                  animate={{
                    scale:   [1, 1.15, 0.95, 1],
                    opacity: [0.9, 1, 0.85, 0.9],
                    y:       [0, -2, 1, 0],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ willChange: 'transform, opacity' }}
                  className="w-5 h-7 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_15px_rgba(251,191,36,0.9)]"
                />
              ) : (
                /* Static placeholder while off-screen — identical visual at rest position */
                <div className="w-5 h-7 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
              )
            ) : (
              isVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0, 0.8, 0], y: -20 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ willChange: 'transform, opacity' }}
                  className="text-xs text-slate-400 font-mono"
                >
                  💨 ~ ✨
                </motion.div>
              )
            )}
          </div>

          {/* Candle Body */}
          <div className="w-4 h-10 rounded-sm bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 shadow-md border border-amber-400/40 relative">
            <div className="absolute inset-0 bg-repeat-y bg-[linear-gradient(45deg,transparent_25%,rgba(217,70,239,0.3)_25%,rgba(217,70,239,0.3)_50%,transparent_50%,transparent_75%,rgba(217,70,239,0.3)_75%)] bg-[length:10px_10px]" />
          </div>

          {/* Candle Plate */}
          <div className="w-12 h-1.5 bg-amber-400/80 rounded-full mt-0.5 shadow-sm" />

          {/* Action Caption */}
          <div className="mt-3">
            {!isBlown ? (
              <span className="text-xs font-medium text-amber-300 flex items-center gap-1.5 group-hover:text-amber-200">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Tap to Make a Birthday Wish!
              </span>
            ) : (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Wish Sealed in the Stars! ✨
              </motion.span>
            )}
          </div>
        </button>

      </div>
    </div>
  );
};
