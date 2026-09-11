import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Sparkles } from 'lucide-react';
import { useToast } from './Toast';

export const WishCard = ({ wish, templateId = 'velvet-luxury' }) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(wish);
    setCopied(true);
    addToast('Wish copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCard = () => {
    // Store selected wish in sessionStorage so editor can prefill message
    sessionStorage.setItem('aurawish_prefill_message', wish);
    navigate(`/create/${templateId}`);
  };

  return (
    <div className="group relative rounded-2xl bg-[#121622]/90 border border-slate-800/80 hover:border-brand-500/40 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 flex flex-col justify-between">
      <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 font-normal">
        “{wish}”
      </p>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5"
          title="Copy message"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>

        <button
          onClick={handleCreateCard}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors py-1.5 px-3 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Put in Card</span>
        </button>
      </div>
    </div>
  );
};

// Memoize WishCard to prevent unnecessary re-renders in lists
const MemoizedWishCard = React.memo(WishCard, (prevProps, nextProps) => {
  // Only re-render if wish text or templateId changes
  return prevProps.wish === nextProps.wish && prevProps.templateId === nextProps.templateId;
});

export { MemoizedWishCard };
export default MemoizedWishCard;
