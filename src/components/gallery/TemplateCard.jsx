import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Eye, Music, Camera } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const TemplateCard = ({ template, onQuickPreview }) => {
  const navigate = useNavigate();

  if (!template || !template.templateId) {
    return null;
  }

  const defaultData = template.defaultData || {};
  const subtitle = defaultData.subtitle || 'Birthday Edition';
  const title = defaultData.title || 'Happy Birthday';
  const recipientName = defaultData.recipientName || 'Someone Special';
  const previewGradient = template.previewGradient || 'from-[#11141e] via-[#1a1f2e] to-[#0c0e14]';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative bg-[#11141e] border border-slate-800 hover:border-brand-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-brand-500/10 flex flex-col justify-between transition-all"
    >
      <div>
        {/* Template Visual Preview Header */}
        <div className={`relative h-64 bg-gradient-to-tr ${previewGradient} p-5 flex flex-col justify-between overflow-hidden border-b border-white/[0.08]`}>
          
          {/* Badges */}
          <div className="flex items-center justify-between z-10">
            {template.badge ? (
              <Badge variant="gold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {template.badge}
              </Badge>
            ) : (
              <Badge variant="slate">{template.category || 'Standard'}</Badge>
            )}

            <div className="flex items-center gap-1.5 text-xs text-white/70 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
              {template.musicSupport && <Music className="w-3 h-3 text-amber-300" />}
              {template.photoSupport && <Camera className="w-3 h-3 text-cyan-300" />}
            </div>
          </div>

          {/* Sample Card Typography Teaser */}
          <div className="z-10 text-center py-2">
            <p className="text-[11px] uppercase tracking-widest text-white/60 font-semibold mb-1">
              {subtitle}
            </p>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight drop-shadow-md">
              {title}
            </h3>
            <p className="text-xs text-amber-200/90 font-medium mt-1">
              For: {recipientName}
            </p>
          </div>

          {/* Quick Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20 p-4">
            <button
              type="button"
              onClick={() => onQuickPreview && onQuickPreview(template)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-105 cursor-pointer"
              title="Quick Preview"
            >
              <Eye className="w-5 h-5" />
            </button>
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate(`/create/${template.templateId}`)}
            >
              Customize
            </Button>
          </div>
        </div>

        {/* Template Info Body */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
              {template.name || 'Untitled Template'}
            </h4>
            <span className="text-xs capitalize text-slate-400">{template.category || 'General'}</span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {template.description || 'Customizable digital birthday greeting card.'}
          </p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-5 pt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onQuickPreview && onQuickPreview(template)}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/create/${template.templateId}`)}
        >
          Customize
        </Button>
      </div>
    </motion.div>
  );
};
