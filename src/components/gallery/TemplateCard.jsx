import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Eye, Music, Camera } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

/**
 * Homepage / gallery template preview card.
 * Paint-cheap at rest: no backdrop-filter on idle layers, no hover overlay
 * on touch devices, compositor-only hover on fine pointers.
 */
export const TemplateCard = React.memo(({ template, onQuickPreview }) => {
  const navigate = useNavigate();

  if (!template || !template.templateId) {
    return null;
  }

  const defaultData = template.defaultData || {};
  const subtitle = defaultData.subtitle || 'Birthday Edition';
  const title = defaultData.title || 'Happy Birthday';
  const recipientName = defaultData.recipientName || 'Someone Special';
  const previewGradient = template.previewGradient || 'from-[#11141e] via-[#1a1f2e] to-[#0c0e14]';

  const openEditor = () => navigate(`/create/${template.templateId}/`);
  const openPreview = () => {
    if (onQuickPreview) onQuickPreview(template);
    else openEditor();
  };

  return (
    <article className="template-card group relative bg-[#11141e] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
      <div>
        <div className={`relative h-64 bg-gradient-to-tr ${previewGradient} p-5 flex flex-col justify-between overflow-hidden border-b border-white/[0.08]`}>

          <div className="flex items-center justify-between z-10">
            {template.badge ? (
              <Badge variant="gold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {template.badge}
              </Badge>
            ) : (
              <Badge variant="slate">{template.category || 'Standard'}</Badge>
            )}

            <div className="card-glass-pill flex items-center gap-1.5 text-xs text-white/70 px-2.5 py-1 rounded-full">
              {template.musicSupport && <Music className="w-3 h-3 text-amber-300" />}
              {template.photoSupport && <Camera className="w-3 h-3 text-cyan-300" />}
            </div>
          </div>

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

          {/* Desktop-only hover overlay. Backdrop-filter is applied only while hovered
              so idle cards never keep a full-size blur layer during scroll. */}
          <div className="card-hover-overlay absolute inset-0 bg-black/60 z-20 p-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={openPreview}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-transform hover:scale-105 cursor-pointer"
              title="Quick Preview"
            >
              <Eye className="w-5 h-5" />
            </button>
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={openEditor}
            >
              Customize
            </Button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="template-card-name text-base font-bold text-white">
              {template.name || 'Untitled Template'}
            </h4>
            <span className="text-xs capitalize text-slate-400">{template.category || 'General'}</span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {template.description || 'Customizable digital birthday greeting card.'}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={openPreview}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={openEditor}
        >
          Customize
        </Button>
      </div>
    </article>
  );
}, (prevProps, nextProps) => {
  return prevProps.template?.templateId === nextProps.template?.templateId &&
         prevProps.onQuickPreview === nextProps.onQuickPreview;
});
