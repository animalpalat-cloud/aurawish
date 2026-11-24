import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Type,
  FileText,
  Palette,
  Image as ImageIcon,
  Printer,
  Download,
  RotateCcw,
  Scissors,
  Check,
  ChevronDown,
  Layers,
  Heart,
  Sliders,
  HelpCircle,
  FileDown
} from 'lucide-react';
import { ALL_FONTS, getFontFamily } from '../../data/fontsData';
import { MESSAGE_PRESETS } from '../../data/messagePresets';
import { PAPER_SIZES, PRINT_LAYOUTS } from '../../services/printablePdfService';
import { validateImageFile } from '../../services/storageService';
import { cn } from '../../utils/cn';

const COLOR_PRESETS = [
  { name: 'Metallic Gold', hex: '#E5C07B' },
  { name: 'Rose Gold', hex: '#F43F5E' },
  { name: 'Electric Cyan', hex: '#06B6D4' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Royal Violet', hex: '#A855F7' },
  { name: 'Warm Amber', hex: '#F59E0B' },
  { name: 'Silver Slate', hex: '#94A3B8' },
  { name: 'Crimson', hex: '#E11D48' },
];

export const PrintableCardCustomizer = ({
  cardData,
  updateField,
  resetDefaults,
  paperSize,
  setPaperSize,
  layoutFormat,
  setLayoutFormat,
  showGuides,
  setShowGuides,
  includeInsidePage,
  setIncludeInsidePage,
  onDownloadPdf,
  onDirectPrint,
  isGeneratingPdf,
  downloadProgress,
}) => {
  const [activeTab, setActiveTab] = useState('text'); // 'layout' | 'text' | 'style' | 'photo'
  const [showPresetModal, setShowPresetModal] = useState(false);
  const fileInputRef = useRef(null);

  // Local image upload handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        updateField('photoUrl', loadEvent.target.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert(err.message || 'Invalid image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    updateField('photoUrl', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-[#11141e] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      
      {/* ── ACTION BAR (Sticky & Prominent) ──────────────────────────────── */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>{downloadProgress?.status || 'Generating 300 DPI PDF…'}</span>
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                <span>Download Free PDF Card</span>
              </>
            )}
          </button>

          <button
            onClick={onDirectPrint}
            disabled={isGeneratingPdf}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all border border-slate-700 shadow-md"
            title="Open browser print preview directly"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">Print Directly</span>
            <span className="xs:hidden">Print</span>
          </button>
        </div>

        {isGeneratingPdf && downloadProgress?.percent && (
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${downloadProgress.percent}%` }}
            />
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Check className="w-3.5 h-3.5" /> High-Resolution 300 DPI Output
          </span>
          <button
            onClick={resetDefaults}
            className="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Card</span>
          </button>
        </div>
      </div>

      {/* ── CUSTOMIZER TABS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/80 rounded-2xl border border-slate-800">
        {[
          { id: 'layout', label: 'Paper & Format', icon: Layers },
          { id: 'text', label: 'Message & Names', icon: FileText },
          { id: 'style', label: 'Fonts & Colors', icon: Palette },
          { id: 'photo', label: 'Photo Memory', icon: ImageIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-2.5 px-1.5 sm:px-3 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all",
                isActive
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: PAPER & FORMAT SETTINGS ──────────────────────────────── */}
      {activeTab === 'layout' && (
        <div className="space-y-5">
          {/* Paper Size */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Paper Size</span>
              <span className="text-[11px] text-slate-400 font-normal">Choose your printer paper</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(PAPER_SIZES).map((ps) => {
                const isSelected = paperSize === ps.id;
                return (
                  <button
                    key={ps.id}
                    onClick={() => setPaperSize(ps.id)}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all",
                      isSelected
                        ? "border-amber-400 bg-amber-400/10 text-white shadow-md shadow-amber-400/10"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-white">{ps.name}</p>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{ps.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Layout / Folding Style */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Foldable / Printable Format</span>
              <span className="text-[11px] text-slate-400 font-normal">Orientation &amp; folding</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(PRINT_LAYOUTS).map((lo) => {
                const isSelected = layoutFormat === lo.id;
                return (
                  <button
                    key={lo.id}
                    onClick={() => setLayoutFormat(lo.id)}
                    className={cn(
                      "p-3.5 rounded-2xl border text-left transition-all",
                      isSelected
                        ? "border-amber-400 bg-amber-400/10 text-white shadow-md shadow-amber-400/10"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-white">{lo.name}</p>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">{lo.description}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300 font-mono">
                      Folded: {lo.foldedSizeLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guide Toggles */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-slate-200 flex items-center gap-2">
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
                <span>Show Fold &amp; Cut Guide Lines</span>
              </span>
              <input
                type="checkbox"
                checked={showGuides}
                onChange={(e) => setShowGuides(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400/20 bg-slate-950"
              />
            </label>

            {(layoutFormat === 'half-fold-side' || layoutFormat === 'half-fold-top') && (
              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-800">
                <span className="text-xs font-medium text-slate-200 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-brand-400" />
                  <span>Include Inside Message Page (Page 2 in PDF)</span>
                </span>
                <input
                  type="checkbox"
                  checked={includeInsidePage}
                  onChange={(e) => setIncludeInsidePage(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-brand-500 focus:ring-brand-400/20 bg-slate-950"
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: TEXT & MESSAGES ─────────────────────────────────────── */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Recipient's Name
              </label>
              <input
                type="text"
                value={cardData.recipientName || ''}
                onChange={(e) => updateField('recipientName', e.target.value)}
                placeholder="e.g. Mom, Bestie, Michael"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Age / Milestone <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={cardData.age || ''}
                onChange={(e) => updateField('age', e.target.value)}
                placeholder="e.g. 21, 30th, 50"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Card Title
              </label>
              <input
                type="text"
                value={cardData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Happy Birthday"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Card Subtitle / Header
              </label>
              <input
                type="text"
                value={cardData.subtitle || ''}
                onChange={(e) => updateField('subtitle', e.target.value)}
                placeholder="A Special Birthday Celebration"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>

          {/* Main Birthday Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Front Card Message
              </label>
              <button
                type="button"
                onClick={() => setShowPresetModal(true)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Browse Wish Presets</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={cardData.message || ''}
              onChange={(e) => updateField('message', e.target.value)}
              placeholder="Write your custom birthday wish here..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none leading-relaxed"
            />
          </div>

          {/* Inside Message (for Foldable Cards) */}
          {(layoutFormat === 'half-fold-side' || layoutFormat === 'half-fold-top') && includeInsidePage && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-300 mb-1.5">
                Inside Card Extended Message (Page 2)
              </label>
              <textarea
                rows={3}
                value={cardData.insideMessage || ''}
                onChange={(e) => updateField('insideMessage', e.target.value)}
                placeholder="Special heartfelt letter or memory to print inside the card..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-brand-500/30 text-sm text-white placeholder:text-slate-600 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 outline-none leading-relaxed"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Sender Signature / Name
            </label>
            <input
              type="text"
              value={cardData.senderName || ''}
              onChange={(e) => updateField('senderName', e.target.value)}
              placeholder="e.g. With love, David &amp; Family"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
            />
          </div>
        </div>
      )}

      {/* ── TAB 3: FONTS & COLORS ───────────────────────────────────────── */}
      {activeTab === 'style' && (
        <div className="space-y-5">
          {/* Font Family Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Typography Style (Google Fonts)
            </label>
            <select
              value={cardData.font || 'Playfair Display'}
              onChange={(e) => updateField('font', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none cursor-pointer"
            >
              <optgroup label="🌟 English & Latin Fonts">
                {ALL_FONTS.filter((f) => f.supportedLanguages?.includes('en')).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.category})
                  </option>
                ))}
              </optgroup>
              <optgroup label="✒️ Urdu & Arabic Fonts (Nastaliq / Naskh)">
                {ALL_FONTS.filter((f) => f.isUrdu || f.supportedLanguages?.includes('ur') || f.category === 'Nastaliq' || f.category === 'Naskh').map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.nameEn ? `(${f.nameEn})` : ''} — {f.category}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌸 Hindi & Devanagari Fonts">
                {ALL_FONTS.filter((f) => f.supportedLanguages?.includes('hi') || f.scripts?.includes('devanagari')).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — {f.category}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌍 Global & World Fonts">
                {ALL_FONTS.filter((f) => 
                  !f.supportedLanguages?.includes('en') && 
                  !f.isUrdu && 
                  !f.supportedLanguages?.includes('ur') && 
                  !f.supportedLanguages?.includes('hi') &&
                  f.category !== 'Nastaliq' && 
                  f.category !== 'Naskh'
                ).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.nameEn ? `(${f.nameEn})` : ''} — {f.category}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Theme Accent Color */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Card Accent &amp; Foil Color
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {COLOR_PRESETS.map((col) => {
                const isSelected = (cardData.themeColor || '#E5C07B') === col.hex;
                return (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => updateField('themeColor', col.hex)}
                    className={cn(
                      "p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all",
                      isSelected
                        ? "border-white bg-slate-800/80 shadow-md"
                        : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                    )}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/30 shadow-inner"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                      {col.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: PHOTO UPLOAD ─────────────────────────────────────────── */}
      {activeTab === 'photo' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            {cardData.photoUrl ? (
              <div className="space-y-3">
                <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-lg">
                  <img src={cardData.photoUrl} alt="Uploaded Photo" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all border border-slate-700"
                  >
                    Change Photo
                  </button>
                  <button
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 transition-all border border-rose-500/20"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/25 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Add a Personal Photo</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Upload a favorite portrait, selfie, or memory to display on the card.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Choose Photo from Device</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            🔒 Photos are processed locally in your browser for privacy and instant print rendering.
          </p>
        </div>
      )}

      {/* ── WISH PRESETS MODAL ─────────────────────────────────────────── */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141e] border border-slate-800 rounded-3xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Select a Birthday Wish Message</h3>
                <p className="text-xs text-slate-400 mt-0.5">Click any message to insert it directly into your card</p>
              </div>
              <button
                onClick={() => setShowPresetModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {MESSAGE_PRESETS.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {group.category}
                  </h4>
                  <div className="space-y-2">
                    {group.messages.map((msg, mIdx) => (
                      <button
                        key={mIdx}
                        onClick={() => {
                          updateField('message', msg);
                          setShowPresetModal(false);
                        }}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-850 text-left text-xs leading-relaxed text-slate-300 hover:text-white transition-all"
                      >
                        "{msg}"
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
