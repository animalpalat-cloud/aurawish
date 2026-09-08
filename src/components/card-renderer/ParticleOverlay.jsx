import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export const ParticleOverlay = ({ effect = 'sparkles', triggerBurst = false }) => {
  useEffect(() => {
    if (triggerBurst || effect === 'confetti') {
      // Fire celebratory confetti cannon
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E5C07B', '#d946ef', '#06b6d4', '#f43f5e', '#3b82f6', '#fbbf24']
        });
      } catch (e) {}
    }
  }, [triggerBurst, effect]);

  if (effect === 'none') return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      
      {/* Sparkles / Stardust effect */}
      {effect === 'sparkles' && (
        <>
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              initial={{
                x: `${Math.random() * 95}%`,
                y: `${Math.random() * 95}%`,
                opacity: 0.2,
                scale: 0.5,
              }}
              animate={{
                opacity: [0.2, 0.9, 0.2],
                scale: [0.6, 1.2, 0.6],
                y: ['-5%', '5%', '-5%'],
              }}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut"
              }}
              className="absolute text-amber-300 text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
            >
              ✦
            </motion.div>
          ))}
        </>
      )}

      {/* Floating Hearts effect */}
      {effect === 'hearts' && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`heart-${i}`}
              initial={{
                x: `${10 + (i * 8)}%`,
                y: '105%',
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                y: '-20%',
                opacity: [0, 0.8, 0.8, 0],
                x: [`${10 + (i * 8)}%`, `${10 + (i * 8) + (i % 2 === 0 ? 5 : -5)}%`],
                scale: [0.8, 1.1, 0.9],
              }}
              transition={{
                duration: 6 + (i % 3),
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut"
              }}
              className="absolute text-rose-400/80 text-base sm:text-xl drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]"
            >
              ❤️
            </motion.div>
          ))}
        </>
      )}

      {/* Floating Balloons effect */}
      {effect === 'balloons' && (
        <>
          {['🎈', '🎉', '🎈', '⭐', '🎈', '✨'].map((emoji, i) => (
            <motion.div
              key={`balloon-${i}`}
              initial={{
                x: `${12 + (i * 15)}%`,
                y: '110%',
                opacity: 0,
              }}
              animate={{
                y: '-25%',
                opacity: [0, 0.9, 0.9, 0],
                x: [`${12 + (i * 15)}%`, `${12 + (i * 15) + (i % 2 === 0 ? 8 : -8)}%`],
              }}
              transition={{
                duration: 8 + (i % 3),
                repeat: Infinity,
                delay: i * 0.9,
                ease: "easeOut"
              }}
              className="absolute text-2xl sm:text-3xl drop-shadow-md"
            >
              {emoji}
            </motion.div>
          ))}
        </>
      )}

      {/* Fireworks / Confetti Ambient */}
      {effect === 'fireworks' && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`firework-${i}`}
              initial={{ scale: 0, opacity: 0, x: `${20 + (i * 10)}%`, y: `${20 + (i * 8)}%` }}
              animate={{
                scale: [0, 1.4, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
              className="absolute text-xl sm:text-2xl"
            >
              🎆
            </motion.div>
          ))}
        </>
      )}

    </div>
  );
};
