import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Music,
  Film,
  Share2,
} from 'lucide-react';
import { cardExportEngine } from '../../services/exportEngine';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

/*
 * Mobile-compatible download helper.
 *
 * Problem: On iOS Safari the `<a download>` trick is silently ignored for
 * blob: URLs — the file never saves.  On Android Chrome it usually works,
 * but some manufacturers restrict it.
 *
 * Strategy (in order of preference):
 *  1. Standard anchor-download (works on desktop + Android Chrome).
 *  2. navigator.share with a File object (works on iOS 15+ via Share Sheet).
 *  3. window.open(url) — last resort that at least lets the user long-press
 *     the video/image in a new tab and save it manually.
 */
async function triggerMobileCompatibleDownload(url, filename, blob) {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isIOS    = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // 1. Anchor download — always attempt first
  try {
    const a = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // On iOS the click is synchronous but the download doesn't trigger;
    // we detect this and fall through to Share Sheet.
    if (!isIOS) return { method: 'anchor' };
  } catch (_) {}

  // 2. Web Share API with File — works on iOS 15+ Safari and Android Chrome
  if (isIOS && navigator.canShare && blob) {
    try {
      const ext  = filename.split('.').pop() || 'webm';
      const mime = blob.type || (ext === 'mp4' ? 'video/mp4' : ext === 'webm' ? 'video/webm' : 'image/png');
      const file = blob instanceof File ? blob : new File([blob], filename, { type: mime });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Birthday Card', text: 'Download your birthday card' });
        return { method: 'share' };
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.warn('Share API failed:', err);
    }
  }

  // 3. Open in new tab — user can long-press to save
  try {
    window.open(url, '_blank', 'noopener');
    return { method: 'open' };
  } catch (_) {}

  return { method: 'none' };
}

// ── Export timeout: max time the whole video export is allowed to take ──────
// The engine has its own internal 30 s recorder.onstop timeout; this outer
// guard ensures the UI never stays in a spinning state no matter what.
const EXPORT_UI_TIMEOUT_MS = 90_000; // 90 s absolute outer limit

export const DownloadModal = ({
  isOpen,
  onClose,
  cardData,
  template,
}) => {
  const { addToast } = useToast();
  const [exportType,    setExportType]    = useState(null);
  const [isExporting,   setIsExporting]   = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [statusText,    setStatusText]    = useState('');
  const [exportedResult, setExportedResult] = useState(null);
  const [errorMsg,      setErrorMsg]      = useState('');
  // Track whether the download happened via Share Sheet so we can show the right CTA
  const [downloadMethod, setDownloadMethod] = useState(null);

  const uiTimeoutRef = useRef(null);

  // Revoke object URL and clear timeout on unmount or result change
  useEffect(() => {
    return () => {
      if (exportedResult?.url) URL.revokeObjectURL(exportedResult.url);
      clearTimeout(uiTimeoutRef.current);
    };
  }, [exportedResult]);

  // If the modal is closed mid-export, abort and clean up
  useEffect(() => {
    if (!isOpen) {
      if (isExporting) {
        cardExportEngine.abort();
        setIsExporting(false);
        clearTimeout(uiTimeoutRef.current);
      }
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const handleStartExport = async (type) => {
    setExportType(type);
    setIsExporting(true);
    setProgress(0);
    setErrorMsg('');
    setExportedResult(null);
    setDownloadMethod(null);

    // Outer UI safety guard — never let the spinner run forever
    clearTimeout(uiTimeoutRef.current);
    uiTimeoutRef.current = setTimeout(() => {
      cardExportEngine.abort();
      setIsExporting(false);
      setErrorMsg(
        'Export took too long and was stopped. Please try downloading as a PNG image, ' +
        'or try again on a faster connection.'
      );
      addToast('Export timed out. Try PNG instead.', 'error');
    }, EXPORT_UI_TIMEOUT_MS);

    try {
      let result;

      if (type === 'png') {
        setStatusText('Generating high-resolution snapshot…');
        setProgress(30);
        result = await cardExportEngine.exportPNG(cardData, template);
        setProgress(100);
        setStatusText('PNG image ready!');
      } else {
        result = await cardExportEngine.exportVideo(
          cardData,
          template,
          (percent, text) => {
            setProgress(percent);
            setStatusText(text);
          },
        );
      }

      clearTimeout(uiTimeoutRef.current);
      setExportedResult(result);

      // Trigger download with mobile-aware fallback
      const dl = await triggerMobileCompatibleDownload(result.url, result.filename, result.blob);
      setDownloadMethod(dl.method);

      if (dl.method === 'share') {
        addToast('Card shared via your device share sheet!', 'success');
      } else if (dl.method === 'open') {
        addToast('Card opened in a new tab — long-press to save.', 'info');
      } else {
        addToast(
          type === 'video'
            ? 'Animated birthday video downloaded!'
            : 'High-resolution card downloaded!',
          'success',
        );
      }
    } catch (err) {
      clearTimeout(uiTimeoutRef.current);
      console.error('Export failed:', err);

      // Never show a cryptic error — give an actionable message
      const msg = err.message?.includes('cancel')
        ? 'Export was cancelled.'
        : err.message?.includes('timed out') || err.message?.includes('timeout')
        ? 'Export timed out. Please try downloading as a PNG image instead.'
        : err.message?.includes('not supported') || err.message?.includes('captureStream')
        ? 'Video export is not supported on this browser. Please download as a PNG image.'
        : err.message || 'Export failed. Please try downloading as a PNG image.';

      setErrorMsg(msg);
      addToast('Export encountered an issue.', 'error');
    } finally {
      clearTimeout(uiTimeoutRef.current);
      setIsExporting(false);
    }
  };

  const handleCancelExport = () => {
    cardExportEngine.abort();
    clearTimeout(uiTimeoutRef.current);
    setIsExporting(false);
    setStatusText('Export cancelled.');
  };

  const handleRetryDownload = async () => {
    if (!exportedResult) return;
    const dl = await triggerMobileCompatibleDownload(
      exportedResult.url,
      exportedResult.filename,
      exportedResult.blob,
    );
    setDownloadMethod(dl.method);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#11141e] border border-brand-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Close */}
        <button
          type="button"
          onClick={() => {
            if (isExporting) handleCancelExport();
            onClose();
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/5 cursor-pointer"
          aria-label="Close download modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/10">
            <Download className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Download Birthday Card
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your preferred format for{' '}
            <strong className="text-white">{cardData.recipientName || 'Someone Special'}</strong>
          </p>
        </div>

        {/* ── Exporting state ── */}
        {isExporting ? (
          <div className="py-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
            <div>
              <p className="text-sm font-semibold text-white">{statusText || 'Preparing…'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{progress}% completed</p>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-brand-500 to-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 px-4">
              {exportType === 'video'
                ? 'Video export may take 20–40 s on mobile devices.'
                : 'Capturing card…'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelExport}
              className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
            >
              Cancel Export
            </Button>
          </div>

        ) : exportedResult ? (
          /* ── Success state ── */
          <div className="py-4 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Your Card Is Ready! 🎉</h3>
              {downloadMethod === 'share' ? (
                <p className="text-xs text-slate-400 mt-1">
                  Shared via your device's share sheet.
                </p>
              ) : downloadMethod === 'open' ? (
                <p className="text-xs text-amber-300 mt-1">
                  Opened in a new tab — long-press the video/image and choose
                  "Save" to keep it.
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-1">
                  Saved as{' '}
                  <code className="text-brand-300 font-mono text-[11px]">
                    {exportedResult.filename}
                  </code>
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                icon={Download}
                onClick={handleRetryDownload}
                className="flex-1"
              >
                {downloadMethod === 'share' ? 'Share Again' : 'Download Again'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setExportedResult(null);
                  setErrorMsg('');
                  setDownloadMethod(null);
                }}
                className="flex-1"
              >
                Choose Another Format
              </Button>
            </div>
          </div>

        ) : (
          /* ── Format selection ── */
          <div className="space-y-3.5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Video option */}
            <button
              type="button"
              onClick={() => handleStartExport('video')}
              className="w-full p-4 rounded-2xl border border-brand-500/40 bg-gradient-to-r from-brand-500/15 via-purple-500/10 to-transparent hover:border-brand-400 hover:scale-[1.01] text-left flex items-center justify-between transition-all group cursor-pointer shadow-lg shadow-brand-500/5"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                      Animated Video
                    </h4>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-300">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Music className="w-3 h-3 text-amber-400" />
                    Includes Birthday Music + Shimmer Animation
                  </p>
                </div>
              </div>
              <Download className="w-5 h-5 text-brand-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* PNG option */}
            <button
              type="button"
              onClick={() => handleStartExport('png')}
              className="w-full p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 hover:scale-[1.01] text-left flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                    PNG Image (Ultra Sharp)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    1080 × 1080 high-res static card for WhatsApp &amp; print
                  </p>
                </div>
              </div>
              <Download className="w-5 h-5 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-500">
                Exports are created on your device. Your photos and messages remain 100% private.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
