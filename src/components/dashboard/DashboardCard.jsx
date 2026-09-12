import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Edit3, Share2, Copy, Trash2, Calendar, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';
import { templateService } from '../../services/templateService';

export const DashboardCard = ({
  card,
  onShare,
  onDuplicate,
  onDelete,
}) => {
  const template = templateService.getTemplateByIdSync(card.templateId);
  const formattedDate = new Date(card.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-[#11141e] border border-slate-800 hover:border-brand-500/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="gold">
            {template?.name || 'Custom Card'}
          </Badge>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>

        {/* Card Thumbnail / Preview Banner */}
        <div className={`relative h-36 rounded-2xl bg-gradient-to-tr ${template?.previewGradient || 'from-slate-900 to-slate-800'} p-4 flex flex-col justify-between border border-white/10 overflow-hidden mb-4`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-serif italic text-amber-200/90">{card.title || 'Happy Birthday'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 text-slate-300 font-mono">
              👁️ {card.views || 0} views
            </span>
          </div>

          <div className="z-10">
            <h3 className="text-lg font-bold text-white tracking-tight truncate">
              {card.recipientName}
              {card.age && <span className="text-amber-300 text-sm ml-1">({card.age})</span>}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1 italic mt-0.5">
              "{card.message}"
            </p>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1">
        <Link
          to={`/card/${card.shareId}`}
          target="_blank"
          className="p-2 rounded-xl text-slate-400 hover:text-brand-300 hover:bg-brand-500/10 transition-colors"
          title="Open public recipient link"
        >
          <Eye className="w-4 h-4" />
        </Link>

        <Link
          to={`/create/${card.templateId}?edit=${card.id}`}
          className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors"
          title="Edit card"
        >
          <Edit3 className="w-4 h-4" />
        </Link>

        <button
          type="button"
          onClick={() => onShare(card)}
          className="p-2 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
          title="Share link"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDuplicate(card.id)}
          className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          title="Duplicate card"
        >
          <Copy className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(card.id)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete card"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
