import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Printer,
  SlidersHorizontal,
  Check,
  Eye,
  Crown,
  Heart,
  Laugh,
  Flower2,
  Feather
} from 'lucide-react';
import { TEMPLATES } from '../../data/templatesData';
import { cn } from '../../utils/cn';

const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Designs' },
  { id: 'luxury', label: 'Luxury & Gold' },
  { id: 'elegant', label: 'Elegant & Classic' },
  { id: 'cute', label: 'Cute & Playful' },
  { id: 'funny', label: 'Funny & Humor' },
  { id: 'floral', label: 'Floral & Botanical' },
  { id: 'minimal', label: 'Modern Minimal' },
  { id: 'romantic', label: 'Romantic & Love' },
  { id: 'vintage', label: 'Vintage & Retro' },
];

export const PrintableCardGallery = ({ selectedTemplateId, onSelectTemplate }) => {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickPreviewTpl, setQuickPreviewTpl] = useState(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let list = TEMPLATES;

    if (selectedCat !== 'all') {
      list = list.filter((t) => t.category === selectedCat);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
      );
    }

    // Limit to curated 36 designs for optimal browsing performance
    return list.slice(0, 36);
  }, [selectedCat, searchQuery]);

  return (
    <div className="space-y-8">
      {/* ── Search & Category Filter Header ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 w-full md:w-auto scrollbar-thin">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                  isActive
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/15"
                    : "bg-[#11141e] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search printable cards…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#11141e] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
          />
        </div>
      </div>

      {/* ── Template Cards Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((tpl) => {
          const isSelected = selectedTemplateId === tpl.templateId;
          return (
            <div
              key={tpl.templateId}
              className={cn(
                "group relative bg-[#11141e] rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
                isSelected
                  ? "border-amber-400 ring-2 ring-amber-400/30 shadow-amber-400/10"
                  : "border-slate-800/80 hover:border-slate-700"
              )}
            >
              {/* Card Thumbnail / Preview Banner */}
              <div
                className={cn(
                  "relative h-48 p-5 flex flex-col justify-between overflow-hidden bg-gradient-to-br",
                  tpl.previewGradient || "from-slate-900 via-indigo-950 to-slate-950"
                )}
              >
                {/* Subtle paper pattern */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-amber-300 border border-amber-400/30">
                    {tpl.category}
                  </span>
                  {tpl.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                      {tpl.badge}
                    </span>
                  )}
                </div>

                {/* Simulated Card Typography in Thumbnail */}
                <div className="relative z-10 text-center my-auto space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-amber-200/80 font-medium">
                    {tpl.defaultData?.subtitle || 'Celebration Edition'}
                  </p>
                  <p className="text-xl font-display font-extrabold text-white leading-tight drop-shadow">
                    {tpl.defaultData?.title || 'Happy Birthday'}
                  </p>
                  <p className="text-xs font-serif italic text-amber-200">
                    {tpl.defaultData?.recipientName || 'Someone Special'}
                  </p>
                </div>

                {/* Bottom printable indicator */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300">
                  <span className="flex items-center gap-1 font-mono">
                    <Printer className="w-3 h-3 text-amber-400" /> Print-Ready PDF
                  </span>
                  <span className="capitalize">{tpl.fontFamily}</span>
                </div>
              </div>

              {/* Card Footer Information & Action Buttons */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelectTemplate(tpl.templateId)}
                    className={cn(
                      "flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow",
                      isSelected
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-800 hover:bg-amber-400 text-slate-200 hover:text-slate-950"
                    )}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Currently Editing</span>
                      </>
                    ) : (
                      <>
                        <Printer className="w-3.5 h-3.5" />
                        <span>Customize &amp; Print</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setQuickPreviewTpl(tpl)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Quick Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── QUICK PREVIEW MODAL ─────────────────────────────────────────── */}
      {quickPreviewTpl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#11141e] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{quickPreviewTpl.name}</h3>
                <p className="text-xs text-amber-300 capitalize">{quickPreviewTpl.category} Printable Design</p>
              </div>
              <button
                onClick={() => setQuickPreviewTpl(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {quickPreviewTpl.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Layout Format:</span>
                <span className="text-white font-medium">Foldable Booklet &amp; Flat 5x7"</span>
              </div>
              <div className="flex justify-between">
                <span>Supported Paper:</span>
                <span className="text-white font-medium">US Letter &amp; A4</span>
              </div>
              <div className="flex justify-between">
                <span>Print Resolution:</span>
                <span className="text-emerald-400 font-medium">300 DPI High-Res PDF</span>
              </div>
              <div className="flex justify-between">
                <span>Photo Upload:</span>
                <span className="text-white font-medium">{quickPreviewTpl.photoSupport ? 'Yes, Supported' : 'Optional'}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  onSelectTemplate(quickPreviewTpl.templateId);
                  setQuickPreviewTpl(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-lg"
              >
                Load Into Printable Customizer
              </button>
              <button
                onClick={() => setQuickPreviewTpl(null)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
