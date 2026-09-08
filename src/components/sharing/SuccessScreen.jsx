import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Share2, Eye, LayoutGrid, PlusCircle, Sparkles, Copy, Check, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../common/Button';
import { soundService } from '../../services/soundService';
import { useToast } from '../common/Toast';
import { DownloadModal } from './DownloadModal';
import { templateService } from '../../services/templateService';

export const SuccessScreen = ({ card, onShareAgain }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = React.useState(false);

  const resolvedTemplate = templateService.getTemplateById(card.templateId);
  const shareUrl = `${window.location.origin}/card/${card.shareId}`;

  useEffect(() => {
    soundService.playFx('chime');
    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#E5C07B', '#d946ef', '#06b6d4', '#f43f5e', '#fbbf24']
      });
    } catch (e) {}
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast('Card link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-lg w-full bg-[#11141e] border border-brand-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30 text-white">
          <Sparkles className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
          Your Birthday Card Is Ready! 🎉
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Personalized for <strong className="text-white">{card.recipientName}</strong>. Download your card video/image or share the live link below!
        </p>

        {/* Primary Download Callout Button */}
        <div className="mb-6">
          <Button
            variant="primary"
            size="lg"
            icon={Download}
            onClick={() => setIsDownloadOpen(true)}
            className="w-full py-3.5 text-base shadow-xl shadow-brand-500/25 cursor-pointer"
          >
            Download Card (MP4 / PNG)
          </Button>
        </div>

        {/* Link Box */}
        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 mb-6">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-300 px-2 focus:outline-none truncate font-mono"
          />
          <Button
            variant={copied ? "primary" : "secondary"}
            size="sm"
            icon={copied ? Check : Copy}
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy Link'}
          </Button>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="secondary" size="md" icon={Eye} className="w-full">
              Test Live Card
            </Button>
          </a>

          <Button
            variant="secondary"
            size="md"
            icon={Share2}
            onClick={onShareAgain}
            className="flex-1"
          >
            Share Options
          </Button>
        </div>

        {/* Download Modal Component */}
        <DownloadModal
          isOpen={isDownloadOpen}
          onClose={() => setIsDownloadOpen(false)}
          cardData={card}
          template={resolvedTemplate}
        />

        {/* Footer links */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <Link to="/dashboard" className="hover:text-white flex items-center gap-1 transition-colors">
            <LayoutGrid className="w-3.5 h-3.5" />
            Go to Dashboard
          </Link>
          <Link to="/templates" className="hover:text-white flex items-center gap-1 text-brand-400 transition-colors">
            <PlusCircle className="w-3.5 h-3.5" />
            Create Another Card
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
