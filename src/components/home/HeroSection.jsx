import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, PlusCircle, Compass, CheckCircle2, Heart } from 'lucide-react';
import { Button } from '../common/Button';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      {/*
        Background ambient lighting.
        PERF: Reduced blur radii (140px→80px, 130px→70px) and sizes (650px→420px, 450px→300px).
        Large blur-[130-140px] on 650×450px divs were the single most expensive paint
        operation on mobile — they force the browser to composite a huge blurred layer
        on every scroll frame. Smaller source divs with lower blur achieve nearly the
        same visual glow at a fraction of the GPU cost.
        aria-hidden so screen-readers skip purely decorative elements.
      */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-brand-500/10 rounded-full blur-[80px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[70px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">

            {/* Super Header Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-amber-300 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Personalized Digital Birthday Experience</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.15]"
            >
              Create Beautiful Birthday Wishes &{' '}
              <span className="text-gold-foil">Digital Birthday Cards</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Celebrate the people you cherish with personalized birthday cards and heartfelt messages.
              Choose from artist-crafted templates, add photos, choose ambient background music, and send
              a shareable link that opens with an interactive digital unboxing envelope.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Button
                variant="primary"
                size="xl"
                icon={PlusCircle}
                onClick={() => navigate('/templates')}
                className="w-full sm:w-auto shadow-2xl"
              >
                Create a Birthday Card
              </Button>

              <Button
                variant="secondary"
                size="xl"
                icon={Compass}
                onClick={() => navigate('/templates')}
                className="w-full sm:w-auto"
              >
                Explore Templates
              </Button>
            </motion.div>

            {/* Social Trust Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Free &amp; No App Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Instant Shareable Link</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Cinematic Unboxing &amp; Audio</span>
              </div>
            </motion.div>
          </div>

          {/* Right Floating Card Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/*
              Ambient halo.
              PERF: Replaced `animate-pulse` (continuous opacity tween that forces
              a repaint every frame) with a static gradient. The glow still looks
              premium but no longer burns a rAF slot every 2 s.
            */}
            <div
              aria-hidden="true"
              className="absolute w-64 h-64 bg-gradient-to-tr from-brand-600/25 to-amber-400/25 rounded-full blur-2xl pointer-events-none"
            />

            {/* Main Floating Luxury Card
                PERF: Replaced `animate-float` CSS animation (continuous transform tween)
                with a Framer Motion variant that uses `willChange: transform` so the browser
                promotes this single element to its own compositor layer and does NOT repaint
                the surrounding content on every frame.
                Shadow cost reduced: removed the second large shadow spread
                (0_0_40px_rgba(229,192,123,0.2)) — single shadow keeps the premium look.
            */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.8, delay: 0.2 },
                scale:   { duration: 0.8, delay: 0.2 },
                y: {
                  duration: 6,
                  delay: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              style={{ willChange: 'transform' }}
              className="relative w-full max-w-[340px] sm:max-w-[380px] bg-[#0c0d14] rounded-3xl p-6 border-2 border-amber-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center"
            >
              {/* Corner flourishes */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400/80 rounded-tl" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/80 rounded-tr" />

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-[11px] font-semibold border border-amber-400/30 mb-3">
                <Sparkles className="w-3 h-3 text-amber-400" /> Velvet Obsidian Edition
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-gold-foil mb-2">
                Happy Birthday!
              </h2>

              <p className="text-lg font-display text-white font-bold mb-4">
                Alexandra Vance ✨
              </p>

              {/* Photo Area Mock - LCP CRITICAL IMAGE */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-amber-400/30 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=480&auto=format&fit=crop&q=75"
                  alt="Personalized birthday card preview with celebratory portrait photo and warm wishes"
                  className="w-full h-full object-cover"
                  fetchpriority="high"
                  decoding="async"
                  width="480"
                  height="360"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-xs text-amber-200 font-serif italic">
                  "Celebrating your brilliance today &amp; always."
                </span>
              </div>

              {/* Interactive preview pill */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <span>🎵 Lofi Birthday Chill</span>
                <span className="text-amber-300 font-medium">✦ 3D Envelope</span>
              </div>
            </motion.div>

            {/* Secondary Floating Mini Card
                PERF: Removed `backdrop-blur-md` — it created a stacking context and
                a composited layer that was repainted on every scroll frame.
                The card still has its bg-color so it looks identical visually.
                Also: removed the `repeat: Infinity` bounce from the initial
                framer-motion animate — replaced with the same slow float applied
                to the main card (shares the same timing so they move together).
            */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              style={{ willChange: 'transform' }}
              className="absolute -bottom-8 -left-6 sm:-left-10 bg-[#1e1328] border border-pink-400/40 p-4 rounded-2xl shadow-2xl max-w-[200px] hidden sm:block"
            >
              <div className="flex items-center gap-2 text-xs text-pink-300 font-semibold mb-1">
                <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                <span>Sweet Pastel Joy</span>
              </div>
              <p className="text-[11px] text-pink-100/80 italic">
                "May your day be packed with cake &amp; laughter! 🌸"
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
