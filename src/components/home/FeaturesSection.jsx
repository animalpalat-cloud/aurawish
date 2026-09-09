import React from 'react';
import { Sparkles, Palette, Share2, Music, Zap, Flame, Crown, Smartphone } from 'lucide-react';

const FEATURES = [
  {
    icon: Crown,
    title: 'Designer Card Templates',
    desc: 'Choose from luxury metallic gold foil, vintage botanical flora, cyber neon party themes, and clean minimalist editorial layouts.',
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  },
  {
    icon: Sparkles,
    title: 'Interactive Digital Unboxing',
    desc: 'Recipients do not just view a static image. They tap an interactive 3D envelope with animated wax seals, particle glows, and celebratory sound effects.',
    color: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
  },
  {
    icon: Palette,
    title: 'Full Creative Personalization',
    desc: 'Customize recipient and sender names, write custom birthday wishes, adjust ages, pick typography styles, and upload favorite photo memories.',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon: Music,
    title: 'Curated Celebration Music',
    desc: 'Enhance your card with high-quality birthday soundtracks including Lofi Birthday Chill, Vintage Music Box, Cinematic Strings, and Acoustic Joy.',
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  },
  {
    icon: Flame,
    title: 'Interactive Make-A-Wish Candle',
    desc: 'Recipients can tap the virtual birthday candle on the card to make a wish and watch celebration confetti sparkle across their screen.',
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  },
  {
    icon: Smartphone,
    title: 'Instant Link Sharing & Export',
    desc: 'Share instantly through a private web link on WhatsApp, SMS, or Email, or export a high-resolution 1080×1080 PNG image for messaging and print.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-[#07080d] border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Built For Meaningful Connections</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Why People Love Sending Birthday Wishes Birthday Cards
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            Standard text messages get buried, and generic store-bought cards get tossed aside. Birthday Wishes blends personalized sentiments with digital craftsmanship to create keepsakes people truly remember.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-[#10131e]/80 border border-slate-800/80 hover:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
