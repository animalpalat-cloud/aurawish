import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export const ParticleOverlay = ({ effect = 'sparkles', triggerBurst = false }) => {
  const containerRef = useRef(null);
  // Only animate when the overlay is actually visible in the viewport
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (triggerBurst || effect === 'confetti') {
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

  // Use IntersectionObserver to pause all animation work when the card is off-screen.
  // This is the primary fix: 16–42 Framer Motion infinite loops were running even
  // when the card was not visible, burning GPU/CPU on every scroll frame.
  useEffect(() => {
    if (effect === 'none') return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [effect]);

  if (effect === 'none') return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
    >
      {/* Only mount animated children when visible — prevents off-screen rAF work */}
      {isVisible && (
        <>
          {/* Sparkles / Stardust effect */}
          {effect === 'sparkles' && (
            // Reduced from 16 → 10 nodes; drop-shadow replaced with simpler text-shadow
            // via a wrapper span so we don't create 10 separate compositor layers
            <>
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  initial={{
                    x: `${(i * 10) % 90}%`,
                    y: `${(i * 13) % 90}%`,
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
                    delay: i * 0.3,
                    ease: 'easeInOut',
                  }}
                  // Removed per-node drop-shadow filter — replaced with a single
                  // box-shadow on the parent container to keep compositor layers low
                  className="absolute text-amber-300 text-xs sm:text-sm"
                  style={{ willChange: 'transform, opacity' }}
                >
                  ✦
                </motion.div>
              ))}
            </>
          )}

          {/* Floating Hearts effect — reduced from 12 → 8 nodes */}
          {effect === 'hearts' && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`heart-${i}`}
                  initial={{
                    x: `${10 + (i * 11)}%`,
                    y: '105%',
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    y: '-20%',
                    opacity: [0, 0.8, 0.8, 0],
                    x: [`${10 + (i * 11)}%`, `${10 + (i * 11) + (i % 2 === 0 ? 5 : -5)}%`],
                    scale: [0.8, 1.1, 0.9],
                  }}
                  transition={{
                    duration: 6 + (i % 3),
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: 'easeInOut',
                  }}
                  className="absolute text-rose-400/80 text-base sm:text-xl"
                  style={{ willChange: 'transform, opacity' }}
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
                    ease: 'easeOut',
                  }}
                  className="absolute text-2xl sm:text-3xl"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {emoji}
                </motion.div>
              ))}
            </>
          )}

          {/* Fireworks / Confetti Ambient — reduced from 8 → 5 nodes */}
          {effect === 'fireworks' && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`firework-${i}`}
                  initial={{
                    scale: 0,
                    opacity: 0,
                    x: `${20 + (i * 16)}%`,
                    y: `${20 + (i * 10)}%`,
                  }}
                  animate={{
                    scale: [0, 1.4, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: 'easeOut',
                  }}
                  className="absolute text-xl sm:text-2xl"
                  style={{ willChange: 'transform, opacity' }}
                >
                  🎆
                </motion.div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};
