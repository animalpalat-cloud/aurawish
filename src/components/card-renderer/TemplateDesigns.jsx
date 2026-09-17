import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Crown,
  Heart,
  Star,
  Cake,
  PartyPopper,
  Flame,
  Flower2,
  Music,
  Camera,
  Gift,
  Award,
  Zap,
  Smile,
  Compass,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { PhotoFrame } from './PhotoFrame';
import { cn } from '../../utils/cn';

// 1. Luxury Obsidian & Gold
export const LuxuryBorderedLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#090a0f] border-2 border-amber-400/40 shadow-[0_0_50px_rgba(229,192,123,0.15)] text-center overflow-hidden">
      <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 rounded-tl-lg" />
      <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/80 rounded-tr-lg" />
      <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/80 rounded-bl-lg" />
      <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 rounded-br-lg" />

      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 text-slate-950 mb-6 shadow-lg shadow-amber-500/30">
        <Crown className="w-6 h-6" />
      </div>

      <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-semibold mb-2">
        {data.subtitle || 'Exclusive Birthday Celebration'}
      </p>

      <h1 className="text-2xl xs:text-3xl sm:text-5xl font-display font-black text-gold-foil tracking-tight mb-4 break-words-safe">
        {data.title || 'Happy Birthday'}
      </h1>

      <div className="my-6 py-2 px-4 sm:px-6 rounded-full inline-block max-w-full bg-white/[0.04] border border-amber-400/30">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-display font-bold text-amber-200 tracking-wide break-words-safe">
          {data.recipientName || 'Someone Special'}
          {data.age && <span className="text-base sm:text-lg font-normal text-amber-400/70 ml-2">({data.age})</span>}
        </h2>
      </div>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="luxury-gold" />
        </div>
      )}

      <p className="text-sm sm:text-lg text-slate-300 font-serif leading-relaxed max-w-lg mx-auto my-6 italic break-words-safe">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-8 pt-4 border-t border-amber-400/20 text-sm font-sans tracking-widest text-amber-300 uppercase">
          ✦ With distinction, {data.senderName} ✦
        </div>
      )}
    </div>
  );
};

// 2. Botanical Champagne Elegance
export const BotanicalFrameLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#1e1914] border border-amber-200/30 shadow-2xl text-center overflow-hidden">
      <div className="text-amber-200/50 text-2xl tracking-widest mb-3">🌿 ✦ 🌿</div>

      <p className="text-xs tracking-widest uppercase text-amber-200/80 font-medium mb-2">
        {data.subtitle || 'A Moment of Grace'}
      </p>

      <h1 className="text-3xl sm:text-4xl font-serif italic font-bold text-amber-100 mb-3">
        {data.title || 'Wishing You Joy'}
      </h1>

      <h2 className="text-2xl sm:text-3xl font-serif text-amber-300 font-bold mb-6">
        {data.recipientName}
        {data.age && <span className="text-base font-normal text-amber-200/60 ml-2">({data.age})</span>}
      </h2>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="polaroid" />
        </div>
      )}

      <p className="text-base sm:text-lg text-amber-100/90 font-serif leading-relaxed max-w-lg mx-auto my-6">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-6 font-script text-2xl text-amber-200">
          {data.senderName}
        </div>
      )}
    </div>
  );
};

// 3. Cyber Neon Rave Party
export const NeonCyberLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#0a0517] border-2 border-cyan-400/60 shadow-[0_0_40px_rgba(0,240,255,0.25)] text-center overflow-hidden">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-mono uppercase tracking-widest mb-4">
        <PartyPopper className="w-3.5 h-3.5" /> SYSTEM CELEBRATION ACTIVE
      </div>

      <h1 className="text-2xl xs:text-3xl sm:text-5xl font-outfit font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 tracking-tight drop-shadow-[0_0_20px_rgba(0,240,255,0.5)] mb-3 break-words-safe">
        {data.title || 'LEVEL UNLOCKED!'}
      </h1>

      <div className="my-4 max-w-full inline-block">
        <span className="text-xl xs:text-2xl sm:text-3xl font-outfit font-extrabold text-white px-3 sm:px-4 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.3)] break-words-safe inline-block max-w-full">
          {data.recipientName}
          {data.age && <span className="text-cyan-300 ml-2">#{data.age}</span>}
        </span>
      </div>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="cyber-glow" />
        </div>
      )}

      <p className="text-sm sm:text-lg text-cyan-100 font-sans leading-relaxed max-w-lg mx-auto my-6 font-medium break-words-safe">
        {data.message}
      </p>

      {data.senderName && (
        <div className="mt-6 text-sm font-mono tracking-wider text-fuchsia-400">
          // CREW: {data.senderName} 🪩
        </div>
      )}
    </div>
  );
};

// 4. Cute Pastel Bubble
export const CuteBubbleLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#281927] border-2 border-pink-400/50 shadow-2xl text-center overflow-hidden">
      <div className="text-3xl mb-2 animate-bounce">🎂 ✨ 🎈</div>

      <p className="text-xs uppercase font-bold text-pink-300 tracking-wider mb-1">
        {data.subtitle || 'Big Birthday Hugs!'}
      </p>

      <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-pink-200 mb-3">
        {data.title || 'Happy Birthday!'}
      </h1>

      <h2 className="text-2xl sm:text-3xl font-outfit font-bold text-white mb-4">
        {data.recipientName} 🌸
        {data.age && <span className="text-lg text-pink-300 font-medium ml-2">({data.age})</span>}
      </h2>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="polaroid" />
        </div>
      )}

      <p className="text-base sm:text-lg text-pink-100/90 font-sans leading-relaxed max-w-lg mx-auto my-6">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-6 text-sm font-semibold text-pink-300">
          With endless love, {data.senderName} 💕
        </div>
      )}
    </div>
  );
};

// 5. Vintage Polaroid Journal
export const PolaroidJournalLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#1b1916] border border-amber-600/30 shadow-2xl text-center overflow-hidden">
      <div className="text-amber-500/80 text-xl font-script mb-2">Chapter of Memories</div>

      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 mb-2">
        {data.title}
      </h1>

      <h2 className="text-xl sm:text-2xl font-serif text-amber-300 mb-6">
        {data.recipientName}
      </h2>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="polaroid" />
        </div>
      )}

      <p className="text-base sm:text-lg text-amber-100/90 font-serif italic leading-relaxed max-w-lg mx-auto my-6">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-6 font-script text-2xl sm:text-3xl text-amber-300">
          ~ {data.senderName} ~
        </div>
      )}
    </div>
  );
};

// 6. Midnight Velvet Rose
export const RomanticVelvetLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#230810] border-2 border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.2)] text-center overflow-hidden">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 mb-4">
        <Heart className="w-5 h-5 fill-rose-500" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-rose-100 mb-2">
        {data.title || 'Happy Birthday, My Love'}
      </h1>

      <h2 className="text-2xl sm:text-3xl font-serif text-rose-300 font-semibold mb-6">
        {data.recipientName}
      </h2>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="polaroid" />
        </div>
      )}

      <p className="text-base sm:text-lg text-rose-100 font-serif italic leading-relaxed max-w-lg mx-auto my-6">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-6 font-script text-2xl text-rose-300">
          Forever Yours, {data.senderName} ❤️
        </div>
      )}
    </div>
  );
};

// 7. Editorial Chic Layout
export const EditorialChicLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#0d0d0f] border border-slate-700/60 shadow-2xl text-left overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
        <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">VOL. 24 / SPECIAL ISSUE</span>
        <span className="text-[11px] font-mono tracking-widest text-amber-400 font-bold uppercase">✦ BIRTHDAY EXCLUSIVE</span>
      </div>

      <p className="text-xs uppercase font-semibold tracking-[0.2em] text-slate-400 mb-1">
        {data.subtitle || 'Front Page Profile'}
      </p>

      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
        {data.title || 'A Legend In The Making'}
      </h1>

      <div className="flex items-baseline gap-3 my-4">
        <span className="text-2xl sm:text-3xl font-serif italic font-bold text-amber-300">
          {data.recipientName}
        </span>
        {data.age && <span className="text-sm font-mono text-slate-400">[{data.age}]</span>}
      </div>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="polaroid" />
        </div>
      )}

      <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed border-l-2 border-amber-400/60 pl-4 my-6">
        {data.message}
      </p>

      {data.senderName && (
        <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>SIGNED: {data.senderName}</span>
          <span>LIMITED EDITION</span>
        </div>
      )}
    </div>
  );
};

// 8. Floral Meadow Layout
export const FloralMeadowLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#162018] border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] text-center overflow-hidden">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 mb-4">
        <Flower2 className="w-6 h-6" />
      </div>

      <p className="text-xs uppercase tracking-[0.25em] text-emerald-300 font-medium mb-1">
        {data.subtitle || 'Blossoming New Chapter'}
      </p>

      <h1 className="text-3xl sm:text-4xl font-serif italic font-bold text-emerald-100 mb-3">
        {data.title || 'May Your Year Bloom'}
      </h1>

      <h2 className="text-2xl sm:text-3xl font-serif text-emerald-300 font-bold mb-5">
        {data.recipientName} 🌸
        {data.age && <span className="text-base text-emerald-400/80 ml-2">({data.age})</span>}
      </h2>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="polaroid" />
        </div>
      )}

      <p className="text-base sm:text-lg text-emerald-100/90 font-serif leading-relaxed max-w-lg mx-auto my-6">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-6 font-script text-2xl text-emerald-300">
          With warmest love, {data.senderName}
        </div>
      )}
    </div>
  );
};

// 9. Kinetic Particle Rave Layout
export const KineticPartyLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#12071f] border-2 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.3)] text-center overflow-hidden">
      <div className="text-3xl mb-2 animate-spin-slow">🪩 ✨ ⚡</div>

      <p className="text-xs uppercase font-mono tracking-widest text-amber-300 mb-1">
        {data.subtitle || 'BIGGEST NIGHT OF THE YEAR'}
      </p>

      <h1 className="text-3xl sm:text-5xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 mb-4">
        {data.title || 'PARTY TIME!'}
      </h1>

      <h2 className="text-2xl sm:text-3xl font-outfit font-black text-white px-5 py-2 rounded-2xl inline-block bg-purple-900/50 border border-purple-400/40 shadow-lg">
        {data.recipientName}
        {data.age && <span className="text-amber-300 ml-2">· {data.age}</span>}
      </h2>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="cyber-glow" />
        </div>
      )}

      <p className="text-base sm:text-lg text-purple-100 font-sans leading-relaxed max-w-lg mx-auto my-6 font-medium">
        {data.message}
      </p>

      {data.senderName && (
        <div className="mt-6 text-sm font-semibold tracking-wider text-pink-300">
          🎉 Party with {data.senderName} 🎉
        </div>
      )}
    </div>
  );
};

// 10. Warm Hearth Family Layout
export const WarmFamilyLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#1c140e] border border-amber-500/30 shadow-2xl text-center overflow-hidden">
      <div className="text-amber-400 text-2xl mb-2">🏡 ❤️ ☀️</div>

      <p className="text-xs tracking-widest uppercase text-amber-300/80 font-medium mb-1">
        {data.subtitle || 'Heart of Our Family'}
      </p>

      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 mb-3">
        {data.title || 'Happy Birthday With All Our Hearts'}
      </h1>

      <h2 className="text-2xl sm:text-3xl font-serif text-amber-300 font-bold mb-5">
        {data.recipientName}
      </h2>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="polaroid" />
        </div>
      )}

      <p className="text-base sm:text-lg text-amber-100/90 font-serif leading-relaxed max-w-lg mx-auto my-6 italic">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-6 font-script text-2xl text-amber-300">
          Forever grateful, {data.senderName}
        </div>
      )}
    </div>
  );
};

// 11. Glassmorphic Aura Layout
export const GlassmorphicAuraLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-center overflow-hidden">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-300/30 text-cyan-200 text-xs font-mono uppercase tracking-widest mb-4">
        <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> AURA DIMENSIONAL SPECIAL
      </div>

      <h1 className="text-3xl sm:text-5xl font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-300 to-indigo-300 tracking-tight drop-shadow-md mb-3">
        {data.title || 'Shine Limitless'}
      </h1>

      <div className="my-4">
        <span className="text-2xl sm:text-3xl font-outfit font-bold text-white px-5 py-2 rounded-2xl bg-white/5 border border-white/20 backdrop-blur-md shadow-inner">
          {data.recipientName}
          {data.age && <span className="text-cyan-300 ml-2">✦ {data.age}</span>}
        </span>
      </div>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="cyber-glow" />
        </div>
      )}

      <p className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed max-w-lg mx-auto my-6">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-6 text-sm font-medium tracking-wider text-cyan-200">
          From {data.senderName} ✨
        </div>
      )}
    </div>
  );
};

// 12. Comic Hero Pop Layout
export const ComicHeroPopLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#ffd000] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center overflow-hidden">
      <div className="inline-block px-4 py-1 bg-black text-white font-black text-xs uppercase tracking-widest -rotate-2 mb-4 border-2 border-white shadow-md">
        ★ BOOM! IT'S YOUR DAY! ★
      </div>

      <h1 className="text-3xl sm:text-5xl font-outfit font-black text-black uppercase tracking-tight transform -rotate-1 mb-3 drop-shadow-[2px_2px_0px_#ffffff]">
        {data.title || 'SUPER BIRTHDAY!'}
      </h1>

      <div className="my-4">
        <span className="text-2xl sm:text-3xl font-black text-white px-6 py-2 rounded-none bg-rose-600 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
          {data.recipientName}
          {data.age && <span className="text-yellow-300 ml-2">Lv.{data.age}</span>}
        </span>
      </div>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="polaroid" />
        </div>
      )}

      <p className="text-base sm:text-lg text-black font-bold font-sans leading-relaxed max-w-lg mx-auto my-6 bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-6 text-base font-black text-black tracking-wide">
          🦸‍♂️ Squad Member: {data.senderName}
        </div>
      )}
    </div>
  );
};

// 13. Split Screen Gallery Layout
export const SplitGalleryLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-[#14161f] border border-slate-700/80 shadow-2xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="order-2 md:order-1 text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Camera className="w-3.5 h-3.5" /> MEMORY SPOTLIGHT
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            {data.title || 'Celebrating You'}
          </h1>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-amber-300">
            {data.recipientName}
            {data.age && <span className="text-sm font-normal text-slate-400 ml-2">({data.age})</span>}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            "{data.message}"
          </p>
          {data.senderName && (
            <div className="pt-2 text-xs font-mono uppercase tracking-widest text-brand-400">
              Capturing memories with {data.senderName}
            </div>
          )}
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          {data.photoUrl ? (
            <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="polaroid" />
          ) : (
            <div className="w-full aspect-square rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center p-4 text-center">
              <Camera className="w-10 h-10 text-slate-500 mb-2" />
              <p className="text-xs text-slate-400">Custom portrait photo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 14. Corporate Prestige Layout
export const CorporatePrestigeLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#0c121e] border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] text-center overflow-hidden">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-blue-900/30 border border-blue-500/40 text-blue-300 text-xs font-mono uppercase tracking-widest mb-6">
        <Award className="w-4 h-4 text-blue-400" /> EXECUTIVE HONORS & RECOGNITION
      </div>

      <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400 mb-2">
        {data.subtitle || 'Distinguished Milestone Recognition'}
      </p>

      <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
        {data.title || 'Wishing You Continued Success'}
      </h1>

      <div className="my-5 py-2 px-6 rounded-lg inline-block bg-blue-950/60 border border-blue-400/30">
        <h2 className="text-2xl sm:text-3xl font-display font-semibold text-blue-200">
          {data.recipientName}
        </h2>
      </div>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="luxury-gold" />
        </div>
      )}

      <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-lg mx-auto my-6">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-8 pt-4 border-t border-slate-800 text-xs font-mono tracking-widest text-slate-400 uppercase">
          Presented on behalf of: {data.senderName}
        </div>
      )}
    </div>
  );
};

// 15. Starlight Cinema Poster Layout
export const CinemaPosterLayout = ({ data }) => {
  return (
    <div className="relative p-6 sm:p-10 rounded-3xl bg-[#050608] border-2 border-red-600/40 shadow-[0_0_60px_rgba(220,38,38,0.2)] text-center overflow-hidden">
      <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-red-400 border-b border-red-900/50 pb-2 mb-6 uppercase">
        <span>★ WORLD PREMIERE ★</span>
        <span>ONE NIGHT ONLY</span>
      </div>

      <p className="text-xs uppercase font-mono tracking-[0.3em] text-amber-400 font-bold mb-1">
        {data.subtitle || 'A BLOCKBUSTER YEAR'}
      </p>

      <h1 className="text-4xl sm:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tight uppercase leading-none mb-4">
        {data.title || 'THE LEGEND'}
      </h1>

      <div className="my-4">
        <span className="text-2xl sm:text-3xl font-serif italic text-amber-300 font-bold">
          STARRING: {data.recipientName}
        </span>
      </div>

      {data.photoUrl && (
        <div className="my-6">
          <PhotoFrame photoUrl={data.photoUrl} recipientName={data.recipientName} styleType="polaroid" />
        </div>
      )}

      <p className="text-sm sm:text-base text-slate-300 font-serif leading-relaxed max-w-lg mx-auto my-6 italic">
        "{data.message}"
      </p>

      {data.senderName && (
        <div className="mt-6 pt-4 border-t border-red-950/60 text-[11px] font-mono tracking-widest text-slate-400 uppercase">
          DIRECTED BY: {data.senderName} | PRODUCED WITH LOVE
        </div>
      )}
    </div>
  );
};
