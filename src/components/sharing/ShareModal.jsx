import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Copy, Check, Share2, Send, MessageCircle, Twitter, Facebook, Mail, QrCode, ExternalLink } from 'lucide-react';
import { useToast } from '../common/Toast';

export const ShareModal = ({
  isOpen,
  onClose,
  shareId,
  recipientName = 'Someone Special'
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const { addToast } = useToast();

  const shareUrl = `${window.location.origin}/card/${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast('Share link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Birthday Greeting for ${recipientName}`,
        text: `Open your special birthday card here! 🎂`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const shareText = encodeURIComponent(`🎂 I created a special birthday greeting card for ${recipientName}! Open it here: `);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      url: `https://api.whatsapp.com/send?text=${shareText}${encodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-slate-700 hover:bg-slate-600 text-white',
      url: `mailto:?subject=A%20Special%20Birthday%20Card%20For%20You!&body=${shareText}${encodedUrl}`,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Birthday Greeting Card"
      subtitle={`Send your personalized card link to ${recipientName}`}
    >
      <div className="space-y-6">
        
        {/* Link Copy Bar */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Unique Card Link
          </label>
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-sm text-slate-200 px-2 focus:outline-none truncate font-mono"
            />
            <Button
              variant={copied ? "primary" : "secondary"}
              size="sm"
              icon={copied ? Check : Copy}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Quick Social Shares */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Share Directly via
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {shareLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl font-medium text-xs shadow-md transition-transform active:scale-95 ${item.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* QR Code toggle */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-4 h-4 text-brand-400" />
            {showQr ? 'Hide QR Code' : 'Show Scan QR Code'}
          </button>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            Open Card in New Tab
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* QR Code Display */}
        {showQr && (
          <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center text-slate-950 animate-in fade-in">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodedUrl}`}
              alt="Card QR Code"
              className="w-40 h-40 object-contain rounded-lg"
            />
            <p className="text-xs text-slate-600 mt-2 font-medium">Scan to open on smartphone</p>
          </div>
        )}

      </div>
    </Modal>
  );
};
