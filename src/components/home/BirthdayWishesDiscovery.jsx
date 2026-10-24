import React, { useState } from 'react';
import { Heart, Users, Sparkles, Compass, ArrowRight, Quote, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const RELATIONSHIP_CATEGORIES = [
  {
    title: 'Birthday Wishes for Mom',
    badge: 'Family',
    desc: 'Gentle, loving, and deeply grateful messages thanking her for endless love, sacrifices, and warmth.',
    sample: 'To the woman who gave me everything: may your special day be filled with all the comfort and joy you bring to our family.',
    templateSlug: 'botanical-grace',
  },
  {
    title: 'Birthday Wishes for Dad',
    badge: 'Family',
    desc: 'Respectful, warm, and heartfelt birthday greetings honoring his guidance, strength, and quiet wisdom.',
    sample: 'Happy Birthday, Dad! Thank you for being our constant rock, our wisdom, and our greatest cheerleader.',
    templateSlug: 'executive-classic',
  },
  {
    title: 'Birthday Wishes for Best Friend',
    badge: 'Friendship',
    desc: 'Lively, memorable wishes packed with shared memories, laughter, inside jokes, and loyal affection.',
    sample: 'Happy Birthday to my favorite partner in crime! Thank you for standing by me through every wild chapter.',
    templateSlug: 'film-memories',
  },
  {
    title: 'Birthday Wishes for Sister',
    badge: 'Family',
    desc: 'Sweet, protective, and playful birthday wishes celebrating a lifelong bond and friendship.',
    sample: 'Happy Birthday to my sister and first best friend. The world is brighter, kinder, and so much funnier with you.',
    templateSlug: 'sweet-pastel',
  },
  {
    title: 'Birthday Wishes for Brother',
    badge: 'Family',
    desc: 'Energetic, brotherly, and supportive messages celebrating his milestones and character.',
    sample: 'Happy Birthday, bro! Keep aiming higher and inspiring everyone around you with your relentless drive.',
    templateSlug: 'cyber-neon',
  },
  {
    title: 'Birthday Wishes for Partner & Spouse',
    badge: 'Romance',
    desc: 'Deeply romantic and tender birthday greetings crafted for husbands, wives, boyfriends, and girlfriends.',
    sample: 'To the love of my life: celebrating you today is the easiest thing in the world. I love you more with every passing sunrise.',
    templateSlug: 'velvet-luxury',
  },
  {
    title: 'Birthday Wishes for Kids & Teens',
    badge: 'Celebration',
    desc: 'Playful, cheerful, and encouraging greetings designed to bring wide grins to younger celebrators.',
    sample: 'Happy Birthday, superstar! Wishing you a giant cake, endless fun games, and a year full of awesome adventures!',
    templateSlug: 'cute-bubble',
  },
  {
    title: 'Birthday Wishes for Colleagues',
    badge: 'Professional',
    desc: 'Polite, inspiring, and professional birthday wishes suitable for coworkers, mentors, and team leads.',
    sample: 'Wishing you a prosperous milestone birthday and a fantastic year of professional breakthroughs and personal happiness.',
    templateSlug: 'monochrome-modern',
  },
];

const STYLE_COLLECTIONS = [
  {
    style: 'Heartfelt & Emotional',
    summary: 'Sincere expressions of gratitude, quiet reflection, and deep affection that touch the heart.',
    keywords: 'emotional birthday wishes, meaningful birthday message',
  },
  {
    style: 'Funny & Playful',
    summary: 'Lighthearted jokes, playful teasing about getting older, and witty greetings to spark laughter.',
    keywords: 'funny birthday quotes, hilarious birthday cards',
  },
  {
    style: 'Short & Meaningful',
    summary: 'Concise, impactful greetings designed for busy days, instant messages, and elegant card cards.',
    keywords: 'short birthday wishes, quick birthday greeting',
  },
  {
    style: 'Inspirational & Milestones',
    summary: 'Uplifting reflections for 18th, 21st, 30th, 50th, and 60th milestone celebrations.',
    keywords: 'milestone birthday wishes, inspirational birthday message',
  },
];

export const BirthdayWishesDiscovery = () => {
  const [selectedRelationship, setSelectedRelationship] = useState(RELATIONSHIP_CATEGORIES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopySample = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#080a10] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Curated Birthday Messages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Find the Perfect Birthday Wishes for Everyone You Love
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Struggling to find the right words? Explore our thoughtful collection of birthday greetings organized by relationship and tone, then drop them directly into your personalized card.
          </p>
        </div>

        {/* Interactive Relationship Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left: Relationship Selectors */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {RELATIONSHIP_CATEGORIES.map((cat, idx) => {
              const isSelected = selectedRelationship.title === cat.title;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedRelationship(cat)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-500/15 border-brand-500/50 shadow-lg shadow-brand-500/10'
                      : 'bg-[#10131e]/70 border-slate-800 hover:border-slate-700 hover:bg-[#131726]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-brand-300 bg-brand-500/10 px-2.5 py-0.5 rounded-full">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Category Preview Card */}
          <div className="lg:col-span-5 bg-[#0e111a] border border-brand-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl sticky top-28">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                Selected Inspiration
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {selectedRelationship.badge}
              </span>
            </div>

            <h3 className="text-xl font-display font-bold text-white mb-2">
              {selectedRelationship.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              {selectedRelationship.desc}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative mb-6">
              <Quote className="w-6 h-6 text-brand-400/40 absolute top-3 right-3" />
              <p className="text-sm text-slate-200 font-serif italic leading-relaxed pr-6">
                "{selectedRelationship.sample}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/create/${selectedRelationship.templateSlug}/`}
                className="flex-1 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-brand-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Customize in Card Maker</span>
              </Link>

              <button
                type="button"
                onClick={() => handleCopySample(selectedRelationship.sample)}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : null}
                <span>{copied ? 'Copied!' : 'Copy Wish'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Styles & Tone Breakdown */}
        <div className="pt-10 border-t border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Explore Birthday Messages by Style & Tone
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Choose the emotional frequency that fits your relationship best.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STYLE_COLLECTIONS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0d1017] border border-slate-800/90 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-base font-bold text-white mb-2">{item.style}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {item.summary}
                  </p>
                </div>
                <Link
                  to="/templates/"
                  aria-label={`Browse matching cards: ${item.style}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10] rounded-sm"
                >
                  <span>Browse Matching Cards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
