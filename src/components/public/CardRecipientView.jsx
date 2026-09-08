import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, PartyPopper, PlusCircle, Share2, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UniversalCardRenderer } from '../card-renderer/UniversalCardRenderer';
import { Button } from '../common/Button';
import { MusicToggle } from './MusicToggle';
import { soundService } from '../../services/soundService';
import { useToast } from '../common/Toast';
import { DownloadModal } from '../sharing/DownloadModal';

export const CardRecipientView = ({ cardData, template }) => {
  const [loveCount, setLoveCount] = useState(0);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const { addToast } = useToast();

  const handleSendLove = () => {
    setLoveCount(prev => prev + 1);
    soundService.playFx('chime');
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#ec4899', '#f472b6', '#ffd700']
      });
    } catch (e) {}
    addToast('Sent love & confetti to the sender! ❤️', 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Birthday Card for ${cardData.recipientName}`,
        text: `Check out this personalized birthday card!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Card link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08090d] via-[#10131d] to-[#08090d] py-12 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-between">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Music Controller */}
      {cardData.musicTrack && (
        <MusicToggle
          trackId={cardData.musicTrack}
          customAudioUrl={cardData.customAudioUrl || (cardData.musicTrack.startsWith('http') ? cardData.musicTrack : null)}
          customAudioName={cardData.customAudioName}
        />
      )}

      {/* Header Banner */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8 z-10">
        <Link to="/" className="flex items-center gap-2 text-white font-display font-bold text-lg hover:opacity-80 transition-opacity">
          <Sparkles className="w-4 h-4 text-amber-400" />
          AuraWish
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={() => setIsDownloadOpen(true)}
          >
            Download
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Share2}
            onClick={handleShare}
          >
            Share
          </Button>
          <Link to="/templates">
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
            >
              Make a Card
            </Button>
          </Link>
        </div>
      </header>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        cardData={cardData}
        template={template}
      />

      {/* Main Card Reveal Stage */}
      <main className="max-w-2xl mx-auto w-full z-10 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <UniversalCardRenderer
            cardData={cardData}
            template={template}
            showInteractiveWish={true}
          />
        </motion.div>

        {/* Reaction Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleSendLove}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold shadow-lg shadow-rose-500/10 active:scale-95 transition-all"
          >
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Send Love Back {loveCount > 0 && `(${loveCount})`}</span>
          </button>
        </div>
      </main>

      {/* Bottom Footer CTA */}
      <footer className="max-w-xl mx-auto w-full text-center mt-12 pt-6 border-t border-white/10 z-10">
        <p className="text-xs text-slate-400 mb-3">
          Want to surprise your friends, family, or partner with a custom digital card?
        </p>
        <Link to="/templates">
          <Button variant="outline" size="sm" icon={Sparkles}>
            Explore 100+ Free Birthday Templates
          </Button>
        </Link>
      </footer>

    </div>
  );
};
