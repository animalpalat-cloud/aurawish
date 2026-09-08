import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Video,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Music,
  Share2,
  Film,
  RefreshCw,
  Copy
} from 'lucide-react';
import { cardExportEngine } from '../../services/exportEngine';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

export const DownloadModal = ({
  isOpen,
  onClose,
  cardData,
  template
}) => {
  const { addToast } = useToast();
  const [exportType, setExportType] = useState(null); // 'video' | 'png' | null
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [exportedResult, setExportedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Cleanup object URLs on unmount or new export
  useEffect(() => {
    return () => {
      if (exportedResult?.url) {
        URL.revokeObjectURL(exportedResult.url);
      }
    };
  }, [exportedResult]);

  if (!isOpen) return null;

  const handleStartExport = async (type) => {
    setExportType(type);
    setIsExporting(true);
    setProgress(0);
    setErrorMsg('');
    setExportedResult(null);

    try {
      if (type === 'png') {
        setStatusText('Generating high-resolution snapshot...');
        setProgress(30);
        const result = await cardExportEngine.exportPNG(cardData, template);
        setProgress(100);
        setStatusText('PNG Image Ready!');
        setExportedResult(result);
        triggerBrowserDownload(result.url, result.filename);
        addToast('High-resolution card downloaded!', 'success');
      } else if (type === 'video') {
        const result = await cardExportEngine.exportVideo(
          cardData,
          template,
          (percent, text) => {
            setProgress(percent);
            setStatusText(text);
          }
        );
        setExportedResult(result);
        triggerBrowserDownload(result.url, result.filename);
        addToast('Animated birthday video downloaded!', 'success');
      }
    } catch (err) {
      console.error('Export failed:', err);
      setErrorMsg(err.message || 'Export failed. Please try downloading as a PNG image.');
      addToast('Export encountered an issue.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCancelExport = () => {
    cardExportEngine.abort();
    setIsExporting(false);
    setStatusText('Export cancelled.');
  };

  const triggerBrowserDownload = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#11141e] border border-brand-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isExporting}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/5 cursor-pointer"
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
            Choose your preferred format for <strong className="text-white">{cardData.recipientName || 'Someone Special'}</strong>
          </p>
        </div>

        {/* Export In-Progress State */}
        {isExporting ? (
          <div className="py-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />

            <div>
              <p className="text-sm font-semibold text-white">{statusText || 'Rendering card...'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{progress}% completed</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-brand-500 to-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

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
          /* Export Complete Success View */
          <div className="py-4 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Your Card Is Ready! 🎉</h3>
              <p className="text-xs text-slate-400 mt-1">
                Saved as <code className="text-brand-300 font-mono text-[11px]">{exportedResult.filename}</code>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                icon={Download}
                onClick={() => triggerBrowserDownload(exportedResult.url, exportedResult.filename)}
                className="flex-1"
              >
                Download Again
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setExportedResult(null);
                  setErrorMsg('');
                }}
                className="flex-1"
              >
                Choose Another Format
              </Button>
            </div>
          </div>
        ) : (
          /* Format Selection Menu */
          <div className="space-y-3.5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Option 1: Animated Video with Music */}
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
                      MP4 Animated Video
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

            {/* Option 2: High-Resolution PNG Image */}
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
                    1080 × 1080 high-res static card for WhatsApp & print
                  </p>
                </div>
              </div>
              <Download className="w-5 h-5 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-500">
                Exports are created client-side. Your photos and messages remain 100% private.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
