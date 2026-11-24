import React from 'react';
import {
  Sparkles,
  Scissors,
  Heart,
  Crown,
  Printer,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { PrintableCardFace } from './PrintableCardFace';
import { getFontFamily } from '../../data/fontsData';
import { cn } from '../../utils/cn';

/**
 * Logical Paper Sheet Dimensions (in px)
 * Fixed coordinate system ensuring 100% bit-for-bit preview and PDF export parity.
 */
export function getSheetDimensions(paperSize = 'letter', layoutFormat = 'half-fold-side') {
  const isLandscape = layoutFormat === 'half-fold-side';

  if (paperSize === 'a4') {
    return isLandscape
      ? { width: 1188, height: 840, aspect: '1188 / 840' } // 297 × 210 mm
      : { width: 840, height: 1188, aspect: '840 / 1188' }; // 210 × 297 mm
  }

  // Default: US Letter
  return isLandscape
    ? { width: 1100, height: 850, aspect: '1100 / 850' } // 11 × 8.5 in
    : { width: 850, height: 1100, aspect: '850 / 1100' }; // 8.5 × 11 in
}

/**
 * Standard Card Back Panel
 */
function CardBackPanel({ cardData, template, accentColor = '#E5C07B', isDark = true, isTent = false }) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-between items-center text-center select-none transition-colors",
        isTent ? "p-5 sm:p-7" : "p-8 sm:p-12",
        isDark ? "bg-[#090b10] text-slate-300" : "bg-white text-slate-700"
      )}
    >
      {/* Top watermark */}
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-semibold pt-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Birthday Wishes Studio</span>
      </div>

      {/* Center studio emblem / keepsake seal */}
      <div className={cn("space-y-3 max-w-xs px-4", isTent && "scale-90")}>
        <div
          className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center shadow-lg border"
          style={{
            backgroundColor: `${accentColor}15`,
            borderColor: `${accentColor}40`,
            color: accentColor,
          }}
        >
          <Gift className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold tracking-wide" style={{ color: accentColor }}>
            Handmade Birthday Keepsake
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Personalized especially for{' '}
            <span className="font-semibold text-slate-200">{cardData.recipientName || 'Someone Special'}</span>
          </p>
        </div>

        {/* Space for handwritten note */}
        <div
          className={cn(
            "p-3 rounded-xl border border-dashed text-left space-y-1.5 mt-2",
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
          )}
        >
          <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
            ✦ Handwritten Note or Date
          </p>
          <div className="space-y-2 pt-1">
            <div className={cn("h-px w-full", isDark ? "bg-slate-800" : "bg-slate-200")} />
            <div className={cn("h-px w-full", isDark ? "bg-slate-800" : "bg-slate-200")} />
          </div>
        </div>
      </div>

      {/* Bottom barcode / branding */}
      <div className="space-y-1 pb-1 text-[10px] text-slate-500">
        <div className="flex items-center justify-center gap-1 font-mono tracking-widest text-[9px] opacity-75">
          ||| | |||| || | |||| || ||| | |||
        </div>
        <p className="tracking-wide">
          Crafted &amp; printed with <span className="font-medium text-slate-400">birthdaywishly.com</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Inside message spread (Page 2 for foldable greeting cards)
 */
function CardInsidePanel({ cardData, template, accentColor = '#E5C07B', isDark = false, isTent = false }) {
  const fontFam = getFontFamily(cardData.font || template?.fontFamily || 'Playfair Display');

  return (
    <div
      className={cn(
        "w-full h-full flex select-none",
        isTent ? "flex-col items-stretch" : "flex-row items-stretch",
        isDark ? "bg-[#090b10] text-slate-200" : "bg-white text-slate-800"
      )}
    >
      {/* Inside Left Panel (or Top Half for Tent) */}
      <div
        className={cn(
          "flex flex-col justify-center items-center text-center",
          isTent ? "w-full h-1/2 p-6 border-b border-dashed" : "w-1/2 h-full p-8 sm:p-12 border-r border-dashed",
          isDark ? "border-slate-800 bg-[#0d0f16]/60" : "border-slate-200 bg-slate-50/70"
        )}
      >
        {cardData.photoUrl ? (
          <div className="max-w-[240px] w-full space-y-2">
            <div
              className="rounded-2xl overflow-hidden border-2 shadow-xl aspect-square"
              style={{ borderColor: `${accentColor}40` }}
            >
              <img src={cardData.photoUrl} alt="Birthday Memory" className="w-full h-full object-cover" />
            </div>
            <p className="text-[11px] italic text-slate-400">A special memory to treasure</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-xs text-center">
            <div
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center border"
              style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30`, color: accentColor }}
            >
              <Heart className="w-6 h-6" />
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Special Birthday Sentiment</p>
            <p className="text-sm italic leading-relaxed text-slate-500">
              "May this year bring you boundless happiness, cherished moments, and endless reasons to smile."
            </p>
          </div>
        )}
      </div>

      {/* Inside Right Panel (or Bottom Half for Tent) */}
      <div
        className={cn(
          "flex flex-col justify-between text-left",
          isTent ? "w-full h-1/2 p-6 sm:p-8" : "w-1/2 h-full p-8 sm:p-12",
          isDark ? "bg-[#090b10]" : "bg-white"
        )}
        style={{ fontFamily: fontFam }}
      >
        <div className="space-y-3 pt-2">
          <p className="text-xl sm:text-2xl font-bold" style={{ color: accentColor }}>
            Dearest {cardData.recipientName || 'Someone Special'},
          </p>
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
            {cardData.insideMessage || cardData.message || 'Wishing you the happiest birthday filled with joy and laughter!'}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-sans uppercase tracking-wider">With warmest love,</p>
          <p className="text-base sm:text-lg font-serif italic text-amber-700 dark:text-amber-200">
            {cardData.senderName || 'Your Friend & Family'}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Precision 4-Corner Cut/Trim Guides for Flat 5x7" cards
 */
function CornerCropMarks() {
  const lineStyle = { backgroundColor: '#94a3b8' };
  return (
    <>
      {/* Top Left */}
      <div className="absolute -top-5 -left-5 pointer-events-none w-5 h-5">
        <div className="absolute top-0 right-0 w-3 h-px" style={lineStyle} />
        <div className="absolute bottom-0 right-0 h-3 w-px" style={lineStyle} />
      </div>
      {/* Top Right */}
      <div className="absolute -top-5 -right-5 pointer-events-none w-5 h-5">
        <div className="absolute top-0 left-0 w-3 h-px" style={lineStyle} />
        <div className="absolute bottom-0 left-0 h-3 w-px" style={lineStyle} />
      </div>
      {/* Bottom Left */}
      <div className="absolute -bottom-5 -left-5 pointer-events-none w-5 h-5">
        <div className="absolute top-0 right-0 h-3 w-px" style={lineStyle} />
        <div className="absolute bottom-0 right-0 w-3 h-px" style={lineStyle} />
      </div>
      {/* Bottom Right */}
      <div className="absolute -bottom-5 -right-5 pointer-events-none w-5 h-5">
        <div className="absolute top-0 left-0 h-3 w-px" style={lineStyle} />
        <div className="absolute bottom-0 left-0 w-3 h-px" style={lineStyle} />
      </div>
    </>
  );
}

/**
 * PrintableCardSheet
 *
 * Renders the printable card page at fixed physical/logical sheet dimensions (PDF export)
 * or in responsive preview mode (isPreview=true) using aspect-ratio for fluid scaling.
 *
 * isPreview=true  → width: 100%, aspect-ratio driven — fills container, never clips.
 * isPrintTarget   → fixed pixel dimensions — exact coordinates for html2canvas PDF export.
 */
export const PrintableCardSheet = ({
  cardData = {},
  template = {},
  layoutFormat = 'half-fold-side',
  paperSize = 'letter',
  showGuides = true,
  page = 1, // 1 = Cover/Outside, 2 = Inside Spread
  isPrintTarget = false,
  isPreview = false,
  className = '',
  style = {},
}) => {
  const fontFam = getFontFamily(cardData.font || template?.fontFamily || 'Playfair Display');
  const accentColor = cardData.themeColor || template?.accentColor || '#E5C07B';

  // Get sheet dimensions
  const dims = getSheetDimensions(paperSize, layoutFormat);

  // Preview mode: fluid width + aspect-ratio, no fixed px constraints.
  // Export mode: exact pixel dimensions for html2canvas rasterization.
  const containerStyle = isPreview
    ? {
        width: '100%',
        aspectRatio: `${dims.width} / ${dims.height}`,
        fontFamily: fontFam,
        '--card-font': fontFam,
        ...style,
      }
    : {
        width: `${dims.width}px`,
        height: `${dims.height}px`,
        minWidth: `${dims.width}px`,
        minHeight: `${dims.height}px`,
        fontFamily: fontFam,
        '--card-font': fontFam,
        ...style,
      };

  // ── PAGE 2: INSIDE MESSAGE SPREAD ─────────────────────────────────────────
  if (page === 2) {
    return (
      <div
        id={isPrintTarget ? 'printable-card-page-2' : undefined}
        className={cn(
          "printable-sheet relative rounded-none overflow-hidden bg-white text-slate-800 shadow-2xl print:shadow-none",
          className
        )}
        style={containerStyle}
      >
        <CardInsidePanel
          cardData={cardData}
          template={template}
          accentColor={accentColor}
          isDark={false}
          isTent={layoutFormat === 'half-fold-top'}
        />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 1. FOLDABLE SIDE-FOLD (BOOKLET: Landscape sheet, fold down vertical center)
  // ─────────────────────────────────────────────────────────────────────────
  if (layoutFormat === 'half-fold-side') {
    return (
      <div
        id={isPrintTarget ? 'printable-card-page-1' : undefined}
        className={cn(
          "printable-sheet relative rounded-none overflow-hidden bg-[#090a0f] text-slate-100 flex flex-row items-stretch shadow-2xl print:shadow-none",
          className
        )}
        style={containerStyle}
      >
        {/* Left Column (50%): Card Back Panel */}
        <div className="w-1/2 h-full relative overflow-hidden flex flex-col border-r border-slate-800">
          <CardBackPanel
            cardData={cardData}
            template={template}
            accentColor={accentColor}
            isDark={true}
            isTent={false}
          />
        </div>

        {/* Center Vertical Fold Guideline */}
        {showGuides && (
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-r border-dashed border-amber-400/50 z-30 pointer-events-none flex flex-col justify-between items-center py-4">
            <span className="bg-slate-900/95 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-wider flex items-center gap-1 shadow">
              <Scissors className="w-2.5 h-2.5" /> FOLD IN HALF
            </span>
            <span className="text-[9px] text-amber-400/70 font-mono tracking-widest rotate-90 whitespace-nowrap">
              ▼ CENTER FOLD LINE ▼
            </span>
            <span className="bg-slate-900/95 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-wider flex items-center gap-1 shadow">
              <Scissors className="w-2.5 h-2.5" /> FOLD IN HALF
            </span>
          </div>
        )}

        {/* Right Column (50%): Card Front Cover */}
        <div className="w-1/2 h-full relative overflow-hidden">
          <PrintableCardFace
            cardData={cardData}
            template={template}
            isTent={false}
            paperSize={paperSize}
            layoutFormat={layoutFormat}
          />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. FOLDABLE TOP-FOLD (TENT CARD: Portrait sheet, fold horizontally)
  // ─────────────────────────────────────────────────────────────────────────
  if (layoutFormat === 'half-fold-top') {
    return (
      <div
        id={isPrintTarget ? 'printable-card-page-1' : undefined}
        className={cn(
          "printable-sheet relative rounded-none overflow-hidden bg-[#090a0f] text-slate-100 flex flex-col items-stretch shadow-2xl print:shadow-none",
          className
        )}
        style={containerStyle}
      >
        {/* Top Half (50%): Back Cover (Rotated 180° so it reads upright when folded) */}
        <div className="w-full h-1/2 relative overflow-hidden flex flex-col rotate-180 border-b border-slate-800">
          <CardBackPanel
            cardData={cardData}
            template={template}
            accentColor={accentColor}
            isDark={true}
            isTent={true}
          />
        </div>

        {/* Center Horizontal Fold Guideline */}
        {showGuides && (
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0 border-b border-dashed border-amber-400/50 z-30 pointer-events-none flex justify-between items-center px-6">
            <span className="bg-slate-900/95 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-wider flex items-center gap-1 shadow">
              <Scissors className="w-2.5 h-2.5" /> FOLD HERE
            </span>
            <span className="text-[9px] text-amber-400/70 font-mono tracking-widest">
              ◀ HORIZONTAL TENT FOLD LINE ▶
            </span>
            <span className="bg-slate-900/95 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-wider flex items-center gap-1 shadow">
              <Scissors className="w-2.5 h-2.5" /> FOLD HERE
            </span>
          </div>
        )}

        {/* Bottom Half (50%): Front Cover (Horizontal Tent Orientation) */}
        <div className="w-full h-1/2 relative overflow-hidden">
          <PrintableCardFace
            cardData={cardData}
            template={template}
            isTent={true}
            paperSize={paperSize}
            layoutFormat={layoutFormat}
          />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. FLAT 5" × 7" POSTCARD (Centered on sheet with precision crop marks)
  // ─────────────────────────────────────────────────────────────────────────
  if (layoutFormat === 'flat-5x7') {
    // In preview mode: use percentage-based 5:7 inner card, centered in aspect-ratio sheet.
    // In export mode: use exact calibrated pixel sizes for precise PDF rasterization.
    const cardInnerStyle = isPreview
      ? {
          // 5×7 card centered: on a portrait sheet, card is ~59% wide (5/8.5 of sheet width)
          width: '59%',
          aspectRatio: '5 / 7',
        }
      : {
          width: `${paperSize === 'a4' ? 508 : 500}px`,
          height: `${paperSize === 'a4' ? 711 : 700}px`,
        };

    return (
      <div
        id={isPrintTarget ? 'printable-card-page-1' : undefined}
        className={cn(
          "printable-sheet relative rounded-none overflow-hidden bg-white text-slate-800 flex flex-col items-center justify-center shadow-2xl print:shadow-none",
          className
        )}
        style={containerStyle}
      >
        {/* Top Trim Instructions */}
        {showGuides && (
          <div className="absolute top-[2.5%] left-0 right-0 text-center text-[11px] text-slate-400 font-mono tracking-wider pointer-events-none">
            ✂ Trim along outer corner guides to standard 5" × 7" (Fits A7 Envelopes)
          </div>
        )}

        {/* 5x7 Card Container */}
        <div
          className="relative shadow-2xl overflow-hidden rounded-2xl"
          style={cardInnerStyle}
        >
          {showGuides && <CornerCropMarks />}
          <PrintableCardFace
            cardData={cardData}
            template={template}
            isTent={false}
            paperSize={paperSize}
            layoutFormat={layoutFormat}
          />
        </div>

        {/* Bottom Safety Watermark */}
        {showGuides && (
          <div className="absolute bottom-[2.5%] left-0 right-0 text-center text-[10px] text-slate-400 font-mono tracking-wide pointer-events-none">
            Standard 5.0" × 7.0" Postcard • Birthday Wishes Studio
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. FULL-PAGE KEEPSAKE POSTER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      id={isPrintTarget ? 'printable-card-page-1' : undefined}
      className={cn(
        "printable-sheet relative rounded-none overflow-hidden bg-[#090a0f] text-slate-100 flex flex-col justify-center shadow-2xl print:shadow-none p-6 sm:p-10",
        className
      )}
      style={containerStyle}
    >
      {/* Inner card — uses absolute inset so it fills remaining space regardless of preview vs export mode */}
      <div className="absolute inset-6 sm:inset-10 overflow-hidden rounded-3xl border border-slate-800">
        <PrintableCardFace
          cardData={cardData}
          template={template}
          isTent={false}
        />
      </div>
    </div>
  );
};
