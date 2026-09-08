import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Smartphone, Monitor, Bookmark, Share2, Download, Maximize2, ZoomIn } from 'lucide-react';
import { UniversalCardRenderer } from '../card-renderer/UniversalCardRenderer';
import { Button } from '../common/Button';
import { DownloadModal } from '../sharing/DownloadModal';

export const LivePreviewPane = ({
  cardData,
  template,
  onGenerateCard,
  onSaveDraft,
  isSaving = false
}) => {
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('fit'); // 'fit' | 1

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [autoScale, setAutoScale] = useState(1);
  const [cardNaturalHeight, setCardNaturalHeight] = useState(0);

  // Base card width for each mode
  const targetWidth = previewMode === 'mobile' ? 376 : 580; // 360 + 16 border for mobile shell

  // Measure the card's actual rendered height at full size so we can scale it correctly.
  // We use a ResizeObserver on the card element itself rather than guessing a fixed height.
  const measureCard = useCallback(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;
    const height = cardEl.scrollHeight || cardEl.offsetHeight;
    if (height > 0 && height !== cardNaturalHeight) {
      setCardNaturalHeight(height);
    }
  }, [cardNaturalHeight]);

  // Observe the card for size changes (content, images loading, etc.)
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    // Initial measurement
    measureCard();

    let ro;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(measureCard);
      ro.observe(cardEl);
    }

    return () => { if (ro) ro.disconnect(); };
  }, [measureCard, previewMode, cardData, template]);

  // Auto-fit calculation: uses the measured card height instead of a hardcoded estimate
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateScale = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      if (!containerWidth || !containerHeight) return;

      // Use measured card height, falling back to a reasonable default
      const effectiveHeight = cardNaturalHeight > 0
        ? cardNaturalHeight
        : (previewMode === 'mobile' ? 720 : 800);

      // Padding to keep card from touching edges
      const pad = 32;
      const availW = Math.max(100, containerWidth - pad);
      const availH = Math.max(100, containerHeight - pad);

      const scaleW = availW / targetWidth;
      const scaleH = availH / effectiveHeight;

      const computed = Math.min(scaleW, scaleH);
      // Cap at 1.0 so we never upscale
      setAutoScale(Math.min(computed, 1.0));
    };

    calculateScale();

    let ro;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(calculateScale);
      ro.observe(container);
    } else {
      window.addEventListener('resize', calculateScale);
    }
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', calculateScale);
    };
  }, [previewMode, cardNaturalHeight, targetWidth, cardData, template]);

  const activeScale = zoomLevel === 'fit' ? autoScale : zoomLevel;

  // Wrapper dimensions: collapse the layout box to match the visually scaled size.
  // This is the KEY fix: transform: scale() does NOT change layout box size, so we
  // explicitly size the outer wrapper to (targetWidth * activeScale) x (cardNaturalHeight * activeScale).
  const effectiveH = cardNaturalHeight > 0
    ? cardNaturalHeight
    : (previewMode === 'mobile' ? 720 : 800);
  const wrapperWidth = Math.round(targetWidth * activeScale);
  const wrapperHeight = Math.round(effectiveH * activeScale);

  return (
    <div className="w-full bg-[#0d1017] border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col h-full relative overflow-hidden">
      
      {/* ===== TOP TOOLBAR ===== */}
      <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Real-Time Live Canvas
          </span>
          <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono">
            ({Math.round(activeScale * 100)}%)
          </span>
        </div>

        {/* Zoom & Viewport Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom switch */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs gap-1">
            <button
              type="button"
              onClick={() => setZoomLevel('fit')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                zoomLevel === 'fit'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Auto-fit card to window"
            >
              <Maximize2 className="w-3 h-3" aria-hidden="true" />
              <span>Fit</span>
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                zoomLevel === 1
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="100% Actual Size"
            >
              <ZoomIn className="w-3 h-3" aria-hidden="true" />
              <span>100%</span>
            </button>
          </div>

          {/* Viewport switch */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setPreviewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                previewMode === 'desktop'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                previewMode === 'mobile'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== PREVIEW STAGE ===== */}
      {/* The container uses flexbox centering. The inner "sizer" div collapses
          its layout box to the *scaled* card dimensions so centering and
          overflow-auto work on the visual size, not the unscaled natural size. */}
      <div
        ref={containerRef}
        className="flex-1 w-full min-h-0 flex items-center justify-center overflow-auto relative"
        style={{ padding: '8px' }}
      >
        {/* Sizer wrapper: its width/height equal the SCALED card dimensions */}
        <div
          style={{
            width: `${wrapperWidth}px`,
            height: `${wrapperHeight}px`,
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {/* Inner: full-size card positioned at top-left, then scaled down.
              transformOrigin is top-left so the card aligns with the sizer box. */}
          <div
            ref={cardRef}
            style={{
              width: `${targetWidth}px`,
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `scale(${activeScale})`,
              transformOrigin: 'top left',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {previewMode === 'mobile' ? (
              // Mobile Phone Shell Mockup
              <div className="relative w-[360px] mx-auto rounded-[42px] border-[8px] border-slate-800 bg-[#090b10] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden p-3 min-h-[640px] flex flex-col justify-center">
                {/* Phone notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-30" />
                <div className="py-4">
                  <UniversalCardRenderer
                    cardData={cardData}
                    template={template}
                    showInteractiveWish={true}
                  />
                </div>
              </div>
            ) : (
              // Desktop Card Canvas
              <UniversalCardRenderer
                cardData={cardData}
                template={template}
                showInteractiveWish={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        {/* Left: Save Draft */}
        <div>
          <Button
            variant="secondary"
            size="md"
            icon={Bookmark}
            onClick={onSaveDraft}
            disabled={isSaving}
            className="w-full sm:w-auto text-slate-300 hover:text-white"
          >
            Save Draft
          </Button>
        </div>

        {/* Right: Download & Generate Shareable Card */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={() => setIsDownloadOpen(true)}
            className="flex-1 sm:flex-initial sm:min-w-[120px] border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-white shadow-sm"
          >
            Download
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Share2}
            onClick={onGenerateCard}
            loading={isSaving}
            className="flex-1 sm:flex-initial sm:min-w-[210px] shadow-lg shadow-brand-500/20 font-semibold"
          >
            Generate Shareable Card
          </Button>
        </div>
      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        cardData={cardData}
        template={template}
      />
    </div>
  );
};
