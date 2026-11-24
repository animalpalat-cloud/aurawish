import React, { useState } from 'react';
import { Sparkles, Heart, Gift, BookOpen, Layers } from 'lucide-react';
import { PrintableCardFace } from './PrintableCardFace';
import { getFontFamily } from '../../data/fontsData';
import { cn } from '../../utils/cn';

/**
 * RealisticFoldedCardPreview
 * Shows an interactive 3D simulation of how the card appears once printed and folded.
 */
export const RealisticFoldedCardPreview = ({ cardData = {}, template = {} }) => {
  const [viewSide, setViewSide] = useState('front'); // 'front' or 'inside'
  const fontFam = getFontFamily(cardData.font || template?.fontFamily || 'Playfair Display');
  const accentColor = cardData.themeColor || template?.accentColor || '#E5C07B';

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Switcher tabs */}
      <div className="inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
        <button
          onClick={() => setViewSide('front')}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5",
            viewSide === 'front'
              ? "bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30"
              : "text-slate-400 hover:text-white"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Folded Front Cover</span>
        </button>
        <button
          onClick={() => setViewSide('inside')}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5",
            viewSide === 'inside'
              ? "bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30"
              : "text-slate-400 hover:text-white"
          )}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Opened Inside Spread</span>
        </button>
      </div>

      {/* 3D Realistic Mockup Container */}
      <div className="relative w-full max-w-xl mx-auto py-6 px-2 flex justify-center items-center">
        {/* Subtle desk ambient shadow */}
        <div className="absolute -bottom-4 w-4/5 h-8 bg-black/60 blur-xl rounded-full pointer-events-none" />

        {viewSide === 'front' ? (
          /* Folded Front View */
          <div
            className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border-2 border-slate-800 bg-[#090a0f] transform hover:scale-[1.01] transition-transform duration-300"
            style={{
              fontFamily: fontFam,
              aspectRatio: '5 / 7',
            }}
          >
            {/* Subtle spine fold shadow along left edge */}
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-30 pointer-events-none" />
            {/* Subtle paper sheen / highlight reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06] pointer-events-none z-25" />

            <div className="w-full h-full">
              <PrintableCardFace
                cardData={cardData}
                template={template}
                isTent={false}
              />
            </div>
          </div>
        ) : (
          /* Opened Inside Spread View */
          <div
            className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] border-2 border-slate-800 bg-white text-slate-800 flex flex-row items-stretch"
            style={{
              fontFamily: fontFam,
              aspectRatio: '1.4 / 1',
            }}
          >
            {/* Center spine gutter gradient */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-r from-black/15 via-black/5 to-black/15 z-10 pointer-events-none" />

            {/* Inside Left Panel */}
            <div className="w-1/2 h-full p-6 sm:p-8 bg-slate-50 border-r border-slate-200 flex flex-col justify-center items-center text-center">
              {cardData.photoUrl ? (
                <div className="w-full max-w-[200px] aspect-square rounded-xl overflow-hidden shadow border-2 border-white">
                  <img src={cardData.photoUrl} alt="Memory" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="space-y-3">
                  <Heart className="w-8 h-8 text-rose-400 mx-auto" />
                  <p className="text-xs text-slate-500 font-sans tracking-wide">
                    A special birthday memory to cherish.
                  </p>
                </div>
              )}
            </div>

            {/* Inside Right Panel */}
            <div className="w-1/2 h-full p-6 sm:p-8 bg-white flex flex-col justify-between text-left">
              <div className="space-y-3 pt-2">
                <p className="text-sm font-bold text-slate-900" style={{ color: accentColor }}>
                  Dearest {cardData.recipientName || 'Someone Special'},
                </p>
                <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                  {cardData.insideMessage || cardData.message || 'Wishing you the happiest of birthdays with all my love!'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                <p className="font-serif italic text-slate-800 text-sm">{cardData.senderName || 'Your Loved One'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        💡 This realistic 3D preview demonstrates how your card displays once folded along the center guideline.
      </p>
    </div>
  );
};
