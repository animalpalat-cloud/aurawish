import React, { useEffect } from 'react';
import {
  Sparkles,
  Crown,
  Heart,
  Star,
  Flower2,
  Gift,
  Award,
  PartyPopper,
  Camera,
  Layers,
  Smile
} from 'lucide-react';
import { PhotoFrame } from '../card-renderer/PhotoFrame';
import { getFontFamily, getFontCategory, loadFont, isUrduFont } from '../../data/fontsData';
import { getLanguage, detectScriptAndDirection } from '../../data/languagesData';
import { cn } from '../../utils/cn';

/**
 * PrintableCardFace
 *
 * Professional print-calibrated card front cover component.
 * Features:
 *  - Mathematically anchored decorative borders that never detach across paper sizes (US Letter, A4)
 *  - Strict inner safe zone: heading ("Happy Birthday") maintains safe headroom and never collides with borders
 *  - Lower message ("All the joy...") is guaranteed safe clearance above bottom border and signature
 *  - 100% solid, crisp text rendering (no -webkit-background-clip artifacts or blocking pseudo-elements in PDF)
 *  - Explicit z-index stacking layers (background z:1, borders z:10, text z:20)
 *  - Dynamic adaptability for standard portrait (booklet, 5x7, poster) and horizontal tent cards (half-fold-top)
 */
export const PrintableCardFace = ({
  cardData = {},
  template = {},
  isTent = false,
  paperSize = 'letter',
  layoutFormat = 'half-fold-side',
  className = '',
}) => {
  const selectedFont = cardData.font || template?.fontFamily || 'Playfair Display';

  // Ensure font is loaded when component mounts or font changes
  useEffect(() => {
    if (selectedFont) {
      loadFont(selectedFont);
    }
  }, [selectedFont]);

  const fontFam = getFontFamily(selectedFont);
  const accentColor = cardData.themeColor || template?.accentColor || '#E5C07B';
  const layout = template?.layoutStyle || 'luxury-bordered';

  const currentLang = getLanguage(cardData.language || 'en');
  const textContent = `${cardData.message || ''} ${cardData.title || ''} ${cardData.recipientName || ''} ${cardData.subtitle || ''}`;
  const scriptDetection = detectScriptAndDirection(textContent, cardData.language);
  const isRtl = (cardData.direction === 'rtl') || (currentLang.direction === 'rtl') || scriptDetection.isRtl || isUrduFont(selectedFont);
  const fontCategory = getFontCategory(selectedFont);

  // Get theme configuration matching template layoutStyle
  const theme = getThemeConfig(layout, accentColor);

  return (
    <div
      data-printable-card="true"
      data-font-category={fontCategory || undefined}
      dir={isRtl ? 'rtl' : undefined}
      className={cn(
        "relative w-full h-full overflow-hidden printable-card-face select-none transition-colors",
        isRtl && "urdu-text",
        theme.bgClass,
        className
      )}
      style={{
        fontFamily: fontFam,
        '--card-font': fontFam,
        backgroundColor: theme.customBg || undefined,
      }}
    >
      {/* ── LAYER 1: BACKGROUND ACCENTS & TEXTURES (Z-INDEX: 1) ── */}
      <div className="card-bg-layer absolute inset-0 pointer-events-none z-1 overflow-hidden">
        {theme.renderBackgroundGlow ? (
          theme.renderBackgroundGlow(accentColor)
        ) : (
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: accentColor }}
          />
        )}
      </div>

      {/* ── LAYER 2: ANCHORED INNER DECORATIVE BORDER & CORNER ACCENTS (Z-INDEX: 10) ── */}
      <div
        className={cn(
          "card-border-frame absolute pointer-events-none z-10 transition-all",
          isTent ? "inset-3 sm:inset-5" : (paperSize === 'a4' && layoutFormat === 'half-fold-side' ? "inset-3 sm:inset-4" : "inset-4 sm:inset-6"),
          theme.borderClass
        )}
        style={{
          borderColor: theme.borderColor || `${accentColor}50`,
          borderRadius: isTent ? '16px' : '22px',
        }}
      >
        {/* Pinned 4-Corner Ornaments (Anchored directly to border perimeter) */}
        {theme.renderCornerAccents && theme.renderCornerAccents(accentColor, isTent)}
      </div>

      {/* ── LAYER 3: INNER CONTENT SAFE ZONE (Z-INDEX: 20) ── */}
      <div
        className={cn(
          "card-content-safe-area relative z-20 w-full h-full flex flex-col justify-between items-center text-center",
          isTent
            ? "p-5 sm:p-7"
            : (paperSize === 'a4' && layoutFormat === 'half-fold-side' ? "p-4 sm:p-6" : "p-7 sm:p-10")
        )}
      >
        {isTent ? (
          /* TENT CARD LAYOUT (Horizontal aspect ~ 1.54) */
          <TentCardContent
            cardData={cardData}
            template={template}
            theme={theme}
            accentColor={accentColor}
            fontFam={fontFam}
            fontCategory={fontCategory}
            isRtl={isRtl}
            paperSize={paperSize}
            layoutFormat={layoutFormat}
          />
        ) : (
          /* STANDARD PORTRAIT LAYOUT (Booklet Side-Fold, Flat 5x7, Full Page) */
          <PortraitCardContent
            cardData={cardData}
            template={template}
            theme={theme}
            accentColor={accentColor}
            fontFam={fontFam}
            fontCategory={fontCategory}
            isRtl={isRtl}
            paperSize={paperSize}
            layoutFormat={layoutFormat}
          />
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT-AWARE DYNAMIC SIZING & ADAPTATION HELPERS
// Automatically scales font sizes and line heights based on content length,
// script type (Nastaliq, Devanagari, Latin), and container boundaries.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates adaptive font size class and style for the Main Title
 * Prevents awkward single-word wrapping and avoids pushing lower sections down.
 */
function getAdaptiveTitleStyle(titleText = '', fontCategory = '', isRtl = false, hasPhoto = false) {
  const len = (titleText || '').trim().length;
  const isNastaliq = fontCategory === 'nastaliq';

  // Base sizing according to photo presence and length
  let fontSizeRem = hasPhoto ? 1.75 : 2.5; // compact when photo is present
  if (len > 35) {
    fontSizeRem = hasPhoto ? 1.2 : 1.6;
  } else if (len > 24) {
    fontSizeRem = hasPhoto ? 1.35 : 1.9;
  } else if (len > 16) {
    fontSizeRem = hasPhoto ? 1.5 : 2.2;
  }

  // Nastaliq fonts require slightly more vertical line space to avoid glyph clash
  const lineHeight = isNastaliq ? '1.35' : '1.15';

  return {
    fontSize: `clamp(${fontSizeRem * 0.75}rem, 3.8vw, ${fontSizeRem}rem)`,
    lineHeight,
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  };
}

/**
 * Calculates adaptive font size and padding for the Recipient Name
 * Scales smoothly for long names so the text stays strictly inside the pill.
 */
function getAdaptiveRecipientStyle(nameText = '', fontCategory = '', hasPhoto = false) {
  const len = (nameText || '').trim().length;
  const isNastaliq = fontCategory === 'nastaliq';

  let fontSizePx = hasPhoto ? 18 : 22; // default
  let paddingY = hasPhoto ? 5 : 8;
  let paddingX = hasPhoto ? 16 : 22;

  if (len > 28) {
    fontSizePx = hasPhoto ? 12 : 13;
    paddingY = 4;
    paddingX = 12;
  } else if (len > 20) {
    fontSizePx = hasPhoto ? 13 : 15;
    paddingY = 5;
    paddingX = 14;
  } else if (len > 14) {
    fontSizePx = hasPhoto ? 15 : 18;
    paddingY = 5;
    paddingX = 16;
  }

  return {
    fontSizePx,
    paddingY,
    paddingX,
    lineHeight: isNastaliq ? '1.3' : '1.1',
  };
}

/**
 * Calculates adaptive font size for the Message Body
 * Prevents long messages from overflowing borders or colliding with signature.
 * Accommodates Nastaliq vertical extent and photo presence by scaling font size appropriately.
 */
function getAdaptiveMessageStyle(messageText = '', fontCategory = '', hasPhoto = false) {
  const len = (messageText || '').trim().length;
  const isNastaliq = fontCategory === 'nastaliq';

  // Base sizing according to photo presence, script and length
  let fontSizeRem = hasPhoto ? (isNastaliq ? 0.72 : 0.78) : (isNastaliq ? 0.85 : 0.95);
  if (len > 200) {
    fontSizeRem = hasPhoto ? (isNastaliq ? 0.58 : 0.64) : (isNastaliq ? 0.68 : 0.75);
  } else if (len > 130) {
    fontSizeRem = hasPhoto ? (isNastaliq ? 0.64 : 0.70) : (isNastaliq ? 0.74 : 0.82);
  } else if (len > 80) {
    fontSizeRem = hasPhoto ? (isNastaliq ? 0.68 : 0.74) : (isNastaliq ? 0.78 : 0.88);
  }

  const lineHeight = isNastaliq ? '1.45' : '1.45';

  return {
    fontSize: `${fontSizeRem}rem`,
    lineHeight,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STANDARD PORTRAIT CARD CONTENT (Booklet Front, 5×7" Postcard, Full-Page)
// ─────────────────────────────────────────────────────────────────────────────
function PortraitCardContent({ cardData, template, theme, accentColor, fontFam, fontCategory, isRtl, paperSize = 'letter', layoutFormat = 'half-fold-side' }) {
  const hasPhoto = Boolean(cardData.photoUrl);
  const isA4Booklet = paperSize === 'a4' && layoutFormat === 'half-fold-side';

  const titleStyle = getAdaptiveTitleStyle(cardData.title, fontCategory, isRtl, hasPhoto);
  const recipientStyle = getAdaptiveRecipientStyle(cardData.recipientName, fontCategory, hasPhoto);
  const messageStyle = getAdaptiveMessageStyle(cardData.message, fontCategory, hasPhoto);

  return (
    <>
      {/* ── TOP SECTION: Emblem, Subtitle & Headline ── */}
      <div className={cn(
        "w-full flex flex-col items-center pt-0.5",
        hasPhoto || isA4Booklet ? "space-y-0.5 sm:space-y-1" : "space-y-2"
      )}>
        {/* Top Decorative Icon / Emblem */}
        {theme.topIcon ? (
          <div
            className={cn(
              "rounded-full flex items-center justify-center shadow-md mb-0.5 border",
              hasPhoto || isA4Booklet ? "w-7 h-7 sm:w-8 sm:h-8" : "w-10 h-10 sm:w-12 sm:h-12"
            )}
            style={{
              backgroundColor: `${accentColor}20`,
              borderColor: `${accentColor}40`,
              color: accentColor,
            }}
          >
            {theme.topIcon}
          </div>
        ) : (
          <div className={cn(
            "mb-0.5 tracking-widest opacity-85",
            hasPhoto || isA4Booklet ? "text-sm sm:text-base" : "text-xl sm:text-2xl"
          )}>
            {theme.headerEmoji || '✦ ✨ ✦'}
          </div>
        )}

        {/* Subtitle / Occasion Tag */}
        <p
          className={cn(
            "font-semibold uppercase tracking-[0.2em] text-center w-full px-4",
            hasPhoto || isA4Booklet ? "text-[9px] sm:text-[10px]" : "text-[11px] sm:text-xs"
          )}
          style={{ color: theme.subtitleColor || `${accentColor}DD`, lineHeight: '1.3' }}
        >
          {cardData.subtitle || theme.defaultSubtitle || 'Exclusive Birthday Celebration'}
        </p>

        {/* Main Title ("Happy Birthday") — Protected with Dynamic Fluid Font Size */}
        <h1
          className={cn(
            "font-display font-black tracking-tight px-2 max-w-full break-words",
            theme.titleClass
          )}
          style={{
            color: theme.titleColor || accentColor,
            fontFamily: fontFam,
            fontSize: isA4Booklet && hasPhoto ? 'clamp(1.15rem, 3.2vw, 1.55rem)' : titleStyle.fontSize,
            lineHeight: titleStyle.lineHeight,
          }}
        >
          {cardData.title || 'Happy Birthday'}
        </h1>
      </div>

      {/* ── MIDDLE SECTION: Recipient Badge, Photo Frame & Message ── */}
      <div className={cn(
        "w-full flex flex-col items-center justify-center my-auto max-w-md",
        hasPhoto
          ? (fontCategory === 'nastaliq' || isA4Booklet ? "py-0.5 space-y-1" : "py-1 space-y-2")
          : (fontCategory === 'nastaliq' || isA4Booklet ? "py-1 space-y-1.5 sm:space-y-2" : "py-2 space-y-3 sm:space-y-4")
      )}>
        {/* Recipient Pill / Banner with Dynamic Content Sizing */}
        <div
          data-recipient-pill="true"
          className="recipient-pill-container"
          style={{
            display: 'inline-block',
            borderRadius: '9999px',
            border: `1px solid ${theme.recipientBorder || `${accentColor}35`}`,
            backgroundColor: theme.recipientBg || `${accentColor}15`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            maxWidth: '92%',
          }}
        >
          <div
            style={{
              display: 'table',
              paddingTop: `${Math.max(3, recipientStyle.paddingY - (isA4Booklet ? 1 : 0))}px`,
              paddingBottom: `${Math.max(4, recipientStyle.paddingY + (hasPhoto ? 1 : 2))}px`,
              paddingLeft: `${recipientStyle.paddingX}px`,
              paddingRight: `${recipientStyle.paddingX}px`,
              maxWidth: '100%',
            }}
          >
            <span
              className="font-display font-bold tracking-wide"
              style={{
                display: 'table-cell',
                verticalAlign: 'middle',
                color: theme.recipientTextColor || '#FFFFFF',
                fontSize: `${isA4Booklet && hasPhoto ? Math.min(15, recipientStyle.fontSizePx) : recipientStyle.fontSizePx}px`,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: recipientStyle.lineHeight,
                position: 'relative',
                top: '-2px',
                overflow: 'visible',
              }}
            >
              {cardData.recipientName || 'Someone Special'}
            </span>
            {cardData.age && (
              <span
                className="font-semibold"
                style={{
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  paddingLeft: isRtl ? '0px' : '8px',
                  paddingRight: isRtl ? '8px' : '0px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: `${accentColor}30`,
                    color: accentColor,
                    borderRadius: '9999px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    paddingLeft: '7px',
                    paddingRight: '7px',
                    fontSize: `${Math.max(10, recipientStyle.fontSizePx - 8)}px`,
                    lineHeight: '1.2',
                    overflow: 'visible',
                  }}
                >
                  {cardData.age}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Optional User Photo Frame — Proportionally adaptive to preserve message room */}
        {hasPhoto && (
          <div
            className={cn(
              "rounded-xl overflow-hidden shadow-lg border-2 p-0.5 max-w-full flex items-center justify-center",
              isA4Booklet
                ? (fontCategory === 'nastaliq' ? "w-16 h-16 sm:w-20 sm:h-20" : "w-20 h-20 sm:w-24 sm:h-24")
                : (fontCategory === 'nastaliq' ? "w-20 h-20 sm:w-24 sm:h-24" : "w-24 h-24 sm:w-28 sm:h-28")
            )}
            style={{
              borderColor: `${accentColor}50`,
              backgroundColor: `${accentColor}10`,
              maxHeight: isA4Booklet ? (fontCategory === 'nastaliq' ? '88px' : '105px') : (fontCategory === 'nastaliq' ? '110px' : '130px'),
            }}
          >
            <img
              src={cardData.photoUrl}
              alt={cardData.recipientName || 'Birthday Photo'}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        {/* Heartfelt Birthday Message — Guaranteed safe clearance inside borders */}
        <div className="px-2 w-full max-w-sm sm:max-w-md mx-auto">
          <p
            className={cn(
              "font-serif italic text-center",
              hasPhoto ? "text-slate-300" : "text-slate-200"
            )}
            style={{
              color: theme.messageColor || undefined,
              fontSize: isA4Booklet && hasPhoto && fontCategory === 'nastaliq' ? '0.65rem' : messageStyle.fontSize,
              lineHeight: messageStyle.lineHeight,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              overflow: 'visible',
            }}
          >
            &ldquo;{cardData.message || 'Wishing you the happiest birthday filled with love, laughter, and unforgettable moments!'}&rdquo;
          </p>
        </div>
      </div>

      {/* ── BOTTOM SECTION: Sender Signature & Closure ── */}
      <div className="w-full pt-1.5 pb-0.5 border-t border-dashed" style={{ borderColor: `${accentColor}25` }}>
        <p
          className="text-xs sm:text-sm font-sans uppercase font-medium text-center w-full px-3"
          style={{
            color: theme.senderColor || `${accentColor}CC`,
            letterSpacing: '0.12em',
            lineHeight: '1.5',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            overflow: 'visible',
          }}
        >
          {cardData.senderName ? (
            <span>✦ With love, {cardData.senderName} ✦</span>
          ) : (
            <span>✦ Happy Birthday ✦</span>
          )}
        </p>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TENT CARD CONTENT (Half-Fold-Top, Wide aspect ratio ~ 1.54)
// ─────────────────────────────────────────────────────────────────────────────
function TentCardContent({ cardData, template, theme, accentColor, fontFam, fontCategory, isRtl }) {
  const hasPhoto = Boolean(cardData.photoUrl);
  const titleStyle = getAdaptiveTitleStyle(cardData.title, fontCategory, isRtl, hasPhoto);
  const recipientStyle = getAdaptiveRecipientStyle(cardData.recipientName, fontCategory, hasPhoto);
  const messageStyle = getAdaptiveMessageStyle(cardData.message, fontCategory, hasPhoto);

  if (hasPhoto) {
    // 2-Column balanced layout for horizontal tent cards with photos
    return (
      <div className="w-full h-full flex flex-row items-center justify-between gap-6 px-4">
        {/* Left Column: Photo & Recipient */}
        <div className="w-5/12 flex flex-col items-center justify-center space-y-3">
          <div
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-xl border-2 p-1"
            style={{ borderColor: `${accentColor}60`, backgroundColor: `${accentColor}15` }}
          >
            <img
              src={cardData.photoUrl}
              alt={cardData.recipientName || 'Birthday Photo'}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div
            data-recipient-pill="true"
            className="recipient-pill-container"
            style={{
              display: 'inline-block',
              borderRadius: '9999px',
              border: `1px solid ${accentColor}40`,
              backgroundColor: `${accentColor}20`,
              maxWidth: '92%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              overflow: 'visible',
            }}
          >
            <div
              style={{
                display: 'table',
                paddingTop: `${Math.max(4, recipientStyle.paddingY - 2)}px`,
                paddingBottom: `${Math.max(6, recipientStyle.paddingY + 1)}px`,
                paddingLeft: `${recipientStyle.paddingX}px`,
                paddingRight: `${recipientStyle.paddingX}px`,
                maxWidth: '100%',
              }}
            >
              <span
                className="font-bold tracking-wide"
                style={{
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  color: theme.recipientTextColor || '#FFFFFF',
                  fontSize: `${Math.min(18, recipientStyle.fontSizePx)}px`,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  lineHeight: recipientStyle.lineHeight,
                  position: 'relative',
                  top: '-2px',
                  overflow: 'visible',
                }}
              >
                {cardData.recipientName || 'Someone Special'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Message & Signature */}
        <div className="w-7/12 flex flex-col justify-center text-left space-y-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: `${accentColor}CC` }}>
            {cardData.subtitle || theme.defaultSubtitle || 'A Momentous Celebration'}
          </p>

          <h1
            className="font-display font-black tracking-tight"
            style={{
              color: theme.titleColor || accentColor,
              fontFamily: fontFam,
              fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
              lineHeight: titleStyle.lineHeight,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {cardData.title || 'Happy Birthday!'}
          </h1>

          <p
            className="font-serif italic text-slate-300"
            style={{
              color: theme.messageColor || undefined,
              fontSize: messageStyle.fontSize,
              lineHeight: messageStyle.lineHeight,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              overflow: 'visible',
            }}
          >
            &ldquo;{cardData.message || 'Wishing you all the joy and happiness your heart can hold.'}&rdquo;
          </p>

          <div className="pt-2 border-t border-dashed" style={{ borderColor: `${accentColor}30` }}>
            <p className="text-xs font-sans tracking-wider uppercase" style={{ color: `${accentColor}EE`, lineHeight: '1.6' }}>
              ✦ {cardData.senderName ? `With love, ${cardData.senderName}` : 'Happy Birthday'} ✦
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Without photo: Compact, balanced horizontal tent card flow
  return (
    <>
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-3 pt-1 border-b border-dashed pb-2" style={{ borderColor: `${accentColor}25` }}>
        <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-slate-400">
          ✦ {cardData.subtitle || theme.defaultSubtitle || 'SPECIAL EDITION'} ✦
        </span>
        <span className="text-xs font-bold tracking-wider" style={{ color: accentColor }}>
          CELEBRATING YOU
        </span>
      </div>

      {/* Main Title & Recipient */}
      <div className="w-full flex flex-col items-center my-auto space-y-2 py-1">
        <h1
          className="font-display font-black tracking-tight"
          style={{
            color: theme.titleColor || accentColor,
            fontFamily: fontFam,
            fontSize: titleStyle.fontSize,
            lineHeight: titleStyle.lineHeight,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {cardData.title || 'Happy Birthday'}
        </h1>

        <div
          data-recipient-pill="true"
          className="recipient-pill-container"
          style={{
            display: 'inline-block',
            borderRadius: '9999px',
            border: `1px solid ${accentColor}40`,
            backgroundColor: `${accentColor}15`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            maxWidth: '92%',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              display: 'table',
              paddingTop: `${recipientStyle.paddingY}px`,
              paddingBottom: `${recipientStyle.paddingY + 3}px`,
              paddingLeft: `${recipientStyle.paddingX}px`,
              paddingRight: `${recipientStyle.paddingX}px`,
              maxWidth: '100%',
            }}
          >
            <span
              className="font-display font-bold tracking-wide"
              style={{
                display: 'table-cell',
                verticalAlign: 'middle',
                color: theme.recipientTextColor || '#FFFFFF',
                fontSize: `${recipientStyle.fontSizePx}px`,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: recipientStyle.lineHeight,
                position: 'relative',
                top: '-2px',
                overflow: 'visible',
              }}
            >
              {cardData.recipientName || 'Someone Special'}
            </span>
            {cardData.age && (
              <span
                className="font-semibold"
                style={{
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  paddingLeft: isRtl ? '0px' : '8px',
                  paddingRight: isRtl ? '8px' : '0px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: `${accentColor}30`,
                    color: accentColor,
                    borderRadius: '9999px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    paddingLeft: '7px',
                    paddingRight: '7px',
                    fontSize: `${Math.max(11, recipientStyle.fontSizePx - 8)}px`,
                    lineHeight: '1.2',
                    overflow: 'visible',
                  }}
                >
                  {cardData.age}
                </span>
              </span>
            )}
          </div>
        </div>

        <p
          className="font-serif italic text-slate-300 max-w-lg mx-auto px-4"
          style={{
            color: theme.messageColor || undefined,
            fontSize: messageStyle.fontSize,
            lineHeight: messageStyle.lineHeight,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            overflow: 'visible',
          }}
        >
          &ldquo;{cardData.message || 'Wishing you the happiest birthday filled with joy and laughter!'}&rdquo;
        </p>
      </div>

      {/* Bottom Signature */}
      <div className="w-full flex items-center justify-between px-3 pt-2 border-t border-dashed" style={{ borderColor: `${accentColor}25` }}>
        <span className="text-[10px] font-mono tracking-wider text-slate-400">
          BIRTHDAY WISHES STUDIO
        </span>
        <span className="text-xs font-sans tracking-widest uppercase font-medium" style={{ color: accentColor }}>
          ✦ {cardData.senderName ? `With love, ${cardData.senderName}` : 'Celebrate Big!'} ✦
        </span>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// THEME CONFIGURATION SELECTOR FOR ALL 15 DESIGN STYLES
// ─────────────────────────────────────────────────────────────────────────────
function getThemeConfig(layoutStyle, accentColor) {
  // Corner L-bracket renderer for luxury and classic borders
  const renderLuxuryCorners = (color, isTent) => {
    const size = isTent ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-7 h-7 sm:w-8 sm:h-8';
    return (
      <>
        <div className={`absolute -top-1 -left-1 ${size} border-t-2 border-l-2 rounded-tl-md pointer-events-none`} style={{ borderColor: color }} />
        <div className={`absolute -top-1 -right-1 ${size} border-t-2 border-r-2 rounded-tr-md pointer-events-none`} style={{ borderColor: color }} />
        <div className={`absolute -bottom-1 -left-1 ${size} border-b-2 border-l-2 rounded-bl-md pointer-events-none`} style={{ borderColor: color }} />
        <div className={`absolute -bottom-1 -right-1 ${size} border-b-2 border-r-2 rounded-br-md pointer-events-none`} style={{ borderColor: color }} />
      </>
    );
  };

  switch (layoutStyle) {
    case 'luxury-bordered':
    case 'art-deco':
    case 'cosmic-celestial':
    case 'crown-prestige':
    case 'gold-filigree':
      return {
        bgClass: 'bg-[#090a0f] text-slate-100',
        borderClass: 'border-2',
        borderColor: 'rgba(245, 158, 11, 0.45)',
        titleColor: '#F59E0B',
        titleClass: 'text-amber-400 font-serif',
        subtitleColor: '#FDE68A',
        defaultSubtitle: 'Exclusive Birthday Celebration',
        topIcon: <Crown className="w-5 h-5 sm:w-6 sm:h-6" />,
        recipientBg: 'rgba(255, 255, 255, 0.05)',
        recipientBorder: 'rgba(245, 158, 11, 0.4)',
        recipientTextColor: '#FDE68A',
        renderCornerAccents: (color, isTent) => renderLuxuryCorners('#F59E0B', isTent),
      };

    case 'botanical-frame':
    case 'botanical-minimal':
    case 'vintage-script':
    case 'ivory-monarch':
      return {
        bgClass: 'bg-[#181512] text-amber-50',
        borderClass: 'border',
        borderColor: 'rgba(245, 218, 175, 0.35)',
        titleColor: '#FEF3C7',
        titleClass: 'font-serif italic font-bold',
        subtitleColor: '#D97706',
        defaultSubtitle: 'A Moment of Grace',
        headerEmoji: '🌿 ✦ 🌿',
        recipientBg: 'rgba(217, 119, 6, 0.15)',
        recipientBorder: 'rgba(245, 218, 175, 0.3)',
        recipientTextColor: '#FDE68A',
        renderCornerAccents: (color, isTent) => renderLuxuryCorners('rgba(245, 218, 175, 0.6)', isTent),
      };

    case 'neon-cyber':
    case 'retro-synth':
    case 'glow-matrix':
    case 'streetwear-hype':
      return {
        bgClass: 'bg-[#0a0517] text-slate-100',
        borderClass: 'border-2',
        borderColor: 'rgba(34, 211, 238, 0.5)',
        titleColor: '#22D3EE',
        titleClass: 'font-outfit uppercase font-black',
        subtitleColor: '#C084FC',
        defaultSubtitle: 'SYSTEM CELEBRATION ACTIVE',
        topIcon: <PartyPopper className="w-5 h-5 text-cyan-400" />,
        recipientBg: 'rgba(34, 211, 238, 0.15)',
        recipientBorder: 'rgba(34, 211, 238, 0.4)',
        recipientTextColor: '#FFFFFF',
        senderColor: '#C084FC',
        renderCornerAccents: (color, isTent) => renderLuxuryCorners('#22D3EE', isTent),
      };

    case 'cute-bubble':
    case 'kids-adventure':
    case 'sweet-candy':
    case 'kawaii-cloud':
      return {
        bgClass: 'bg-[#281927] text-pink-50',
        borderClass: 'border-2',
        borderColor: 'rgba(244, 114, 182, 0.5)',
        titleColor: '#F472B6',
        titleClass: 'font-outfit font-extrabold',
        subtitleColor: '#F9A8D4',
        defaultSubtitle: 'Big Birthday Hugs!',
        headerEmoji: '🎂 ✨ 🎈',
        recipientBg: 'rgba(244, 114, 182, 0.2)',
        recipientBorder: 'rgba(244, 114, 182, 0.4)',
        recipientTextColor: '#FFFFFF',
        senderColor: '#F472B6',
      };

    case 'polaroid-journal':
    case 'bestie-duo':
    case 'film-strip':
    case 'scrapbook-art':
      return {
        bgClass: 'bg-[#1b1916] text-amber-50',
        borderClass: 'border',
        borderColor: 'rgba(217, 119, 6, 0.35)',
        titleColor: '#FEF3C7',
        titleClass: 'font-serif font-bold',
        subtitleColor: '#F59E0B',
        defaultSubtitle: 'Chapter of Memories',
        headerEmoji: '📷 ✦ 🎞️',
        recipientBg: 'rgba(217, 119, 6, 0.15)',
        recipientBorder: 'rgba(217, 119, 6, 0.35)',
        recipientTextColor: '#FDE68A',
        renderCornerAccents: (color, isTent) => renderLuxuryCorners('rgba(217, 119, 6, 0.6)', isTent),
      };

    case 'romantic-velvet':
    case 'crimson-passion':
    case 'candlelight':
    case 'rose-garden':
      return {
        bgClass: 'bg-[#230810] text-rose-50',
        borderClass: 'border-2',
        borderColor: 'rgba(244, 63, 94, 0.4)',
        titleColor: '#FB7185',
        titleClass: 'font-serif font-bold italic',
        subtitleColor: '#FDA4AF',
        defaultSubtitle: 'With All My Heart',
        topIcon: <Heart className="w-5 h-5 text-rose-400 fill-rose-500/40" />,
        recipientBg: 'rgba(244, 63, 94, 0.15)',
        recipientBorder: 'rgba(244, 63, 94, 0.4)',
        recipientTextColor: '#FFF1F2',
        senderColor: '#FB7185',
        renderCornerAccents: (color, isTent) => renderLuxuryCorners('#FB7185', isTent),
      };

    case 'editorial-chic':
    case 'monochrome-bold':
    case 'minimalist-magazine':
    case 'high-fashion':
      return {
        bgClass: 'bg-[#0d0d0f] text-slate-100',
        borderClass: 'border',
        borderColor: 'rgba(148, 163, 184, 0.35)',
        titleColor: '#FFFFFF',
        titleClass: 'font-serif font-bold uppercase tracking-tight',
        subtitleColor: '#94A3B8',
        defaultSubtitle: 'SPECIAL ISSUE / VOL. 24',
        headerEmoji: '✦ EDITORIAL EXCLUSIVE ✦',
        recipientBg: 'rgba(255, 255, 255, 0.08)',
        recipientBorder: 'rgba(255, 255, 255, 0.2)',
        recipientTextColor: '#FDE68A',
        senderColor: '#94A3B8',
      };

    case 'floral-meadow':
    case 'wildflower-delight':
    case 'sakura-blossom':
      return {
        bgClass: 'bg-[#141f17] text-emerald-50',
        borderClass: 'border',
        borderColor: 'rgba(16, 185, 129, 0.35)',
        titleColor: '#6EE7B7',
        titleClass: 'font-serif italic font-bold',
        subtitleColor: '#A7F3D0',
        defaultSubtitle: 'Blossoming New Chapter',
        topIcon: <Flower2 className="w-5 h-5 text-emerald-400" />,
        recipientBg: 'rgba(16, 185, 129, 0.15)',
        recipientBorder: 'rgba(16, 185, 129, 0.35)',
        recipientTextColor: '#FFFFFF',
        senderColor: '#6EE7B7',
        renderCornerAccents: (color, isTent) => renderLuxuryCorners('#10B981', isTent),
      };

    case 'kinetic-party':
    case 'disco-rave':
    case 'fireworks-spectacle':
    case 'confetti-carnival':
      return {
        bgClass: 'bg-[#12071f] text-purple-50',
        borderClass: 'border-2',
        borderColor: 'rgba(168, 85, 247, 0.45)',
        titleColor: '#C084FC',
        titleClass: 'font-outfit font-black uppercase',
        subtitleColor: '#FDE047',
        defaultSubtitle: 'BIGGEST NIGHT OF THE YEAR',
        headerEmoji: '🪩 ✨ ⚡',
        recipientBg: 'rgba(168, 85, 247, 0.25)',
        recipientBorder: 'rgba(168, 85, 247, 0.5)',
        recipientTextColor: '#FFFFFF',
        senderColor: '#F472B6',
        renderCornerAccents: (color, isTent) => renderLuxuryCorners('#C084FC', isTent),
      };

    case 'warm-family':
    case 'hearth-memories':
    case 'storybook-gentle':
    case 'heritage-roots':
      return {
        bgClass: 'bg-[#1c140e] text-amber-50',
        borderClass: 'border',
        borderColor: 'rgba(245, 158, 11, 0.35)',
        titleColor: '#FDE68A',
        titleClass: 'font-serif font-bold',
        subtitleColor: '#FCD34D',
        defaultSubtitle: 'Heart of Our Family',
        headerEmoji: '🏡 ❤️ ☀️',
        recipientBg: 'rgba(245, 158, 11, 0.15)',
        recipientBorder: 'rgba(245, 158, 11, 0.35)',
        recipientTextColor: '#FEF3C7',
        senderColor: '#F59E0B',
      };

    case 'glassmorphic-aura':
    case 'frosted-glass':
    case 'holographic-glow':
      return {
        bgClass: 'bg-[#0c121e] text-cyan-50',
        borderClass: 'border',
        borderColor: 'rgba(34, 211, 238, 0.35)',
        titleColor: '#67E8F9',
        titleClass: 'font-outfit font-extrabold',
        subtitleColor: '#A5F3FC',
        defaultSubtitle: 'AURA SPECIAL EDITION',
        topIcon: <Sparkles className="w-5 h-5 text-cyan-300" />,
        recipientBg: 'rgba(255, 255, 255, 0.08)',
        recipientBorder: 'rgba(34, 211, 238, 0.3)',
        recipientTextColor: '#FFFFFF',
        senderColor: '#67E8F9',
      };

    case 'comic-hero':
    case 'pop-art':
    case 'superhero-boom':
      return {
        bgClass: 'bg-[#ffd000] text-slate-950',
        borderClass: 'border-4 border-black',
        borderColor: '#000000',
        titleColor: '#000000',
        titleClass: 'font-outfit font-black uppercase',
        subtitleColor: '#000000',
        defaultSubtitle: '★ BOOM! IT\'S YOUR DAY! ★',
        headerEmoji: '💥 🦸 💥',
        recipientBg: '#E11D48',
        recipientBorder: '#000000',
        recipientTextColor: '#FFFFFF',
        senderColor: '#000000',
      };

    case 'corporate-prestige':
    case 'executive-honor':
    case 'leadership-milestone':
      return {
        bgClass: 'bg-[#0c121e] text-slate-100',
        borderClass: 'border',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        titleColor: '#93C5FD',
        titleClass: 'font-display font-bold',
        subtitleColor: '#94A3B8',
        defaultSubtitle: 'Distinguished Milestone Recognition',
        topIcon: <Award className="w-5 h-5 text-blue-400" />,
        recipientBg: 'rgba(30, 58, 138, 0.4)',
        recipientBorder: 'rgba(59, 130, 246, 0.4)',
        recipientTextColor: '#BFDBFE',
        senderColor: '#94A3B8',
      };

    case 'cinema-poster':
    case 'hollywood-blockbuster':
    case 'marquee-broadway':
      return {
        bgClass: 'bg-[#050608] text-slate-100',
        borderClass: 'border-2',
        borderColor: 'rgba(220, 38, 38, 0.4)',
        titleColor: '#F87171',
        titleClass: 'font-display font-black uppercase',
        subtitleColor: '#F59E0B',
        defaultSubtitle: 'A BLOCKBUSTER YEAR ★ WORLD PREMIERE',
        headerEmoji: '🎬 ★ 🍿',
        recipientBg: 'rgba(220, 38, 38, 0.15)',
        recipientBorder: 'rgba(220, 38, 38, 0.4)',
        recipientTextColor: '#FDE68A',
        senderColor: '#94A3B8',
        renderCornerAccents: (color, isTent) => renderLuxuryCorners('#DC2626', isTent),
      };

    default:
      return {
        bgClass: 'bg-[#090a0f] text-slate-100',
        borderClass: 'border-2',
        borderColor: `${accentColor}50`,
        titleColor: accentColor,
        titleClass: 'font-display font-black',
        subtitleColor: `${accentColor}DD`,
        defaultSubtitle: 'Celebration Edition',
        topIcon: <Crown className="w-5 h-5" />,
        recipientBg: 'rgba(255, 255, 255, 0.05)',
        recipientBorder: `${accentColor}40`,
        recipientTextColor: '#FFFFFF',
        renderCornerAccents: (color, isTent) => renderLuxuryCorners(accentColor, isTent),
      };
  }
}
