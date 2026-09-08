import React from 'react';
import { Compass, Edit3, Send, Sparkles } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Compass,
    title: 'Choose a Masterpiece',
    desc: 'Explore our catalog of luxury obsidian gold, vintage botanical, cyber neon, and cute pastel greeting cards.',
  },
  {
    step: '02',
    icon: Edit3,
    title: 'Personalize Every Detail',
    desc: 'Add their name, emotional or humorous birthday wishes, upload personal photos, and pick ambient music tracks.',
  },
  {
    step: '03',
    icon: Send,
    title: 'Generate & Share Joy',
    desc: 'Get an instant unique shareable link. Send it via WhatsApp, SMS, or Email and watch their face light up.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Simple 3-Step Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            How AuraWish Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Create and send a personalized digital birthday greeting in under 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#11141e] border border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center group hover:border-brand-500/40 transition-all duration-300"
              >
                {/* Step badge */}
                <span className="text-xs font-mono font-bold text-brand-400/80 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full mb-6">
                  STEP {item.step}
                </span>

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600/30 to-amber-400/30 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-amber-300" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
