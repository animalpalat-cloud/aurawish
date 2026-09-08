import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Type, Palette, Check, Search, Globe2, Languages, Sparkles, Filter } from 'lucide-react';
import {
  ALL_FONTS,
  FONT_CATEGORIES,
  loadFont,
  getFontFamily,
  getFontsForLanguage,
  isUrduFont,
  preloadUrduFonts,
  preloadMultilingualFonts
} from '../../data/fontsData';
import { getLanguage } from '../../data/languagesData';

const COLOR_PALETTES = [
  { id: '#E5C07B', name: 'Gold Foil', bg: 'bg-[#E5C07B]' },
  { id: '#d946ef', name: 'Neon Fuchsia', bg: 'bg-[#d946ef]' },
  { id: '#00F0FF', name: 'Cyber Cyan', bg: 'bg-[#00F0FF]' },
  { id: '#f43f5e', name: 'Velvet Rose', bg: 'bg-[#f43f5e]' },
  { id: '#34D399', name: 'Emerald Sage', bg: 'bg-[#34D399]' },
  { id: '#FB923C', name: 'Sunset Amber', bg: 'bg-[#FB923C]' },
  { id: '#C084FC', name: 'Cosmic Violet', bg: 'bg-[#C084FC]' },
  { id: '#F8FAFC', name: 'Pure Platinum', bg: 'bg-[#F8FAFC]' },
];

export const ThemeSelector = ({ cardData, updateField }) => {
  const [fontSearch, setFontSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('compatible'); // Default to compatible with current language
  const [loadedFontIds, setLoadedFontIds] = useState(new Set());

  const currentLang = getLanguage(cardData.language || 'en');

  // Preload fonts and load currently selected font
  useEffect(() => {
    preloadMultilingualFonts();
    preloadUrduFonts();
    if (cardData.font) {
      loadFont(cardData.font).then(() => {
        setLoadedFontIds(prev => new Set([...prev, cardData.font]));
      });
    }
  }, [cardData.font]);

  // Dynamically compute category tabs with language-compatible tab first
  const dynamicCategories = useMemo(() => {
    const langLabel = `${currentLang.name} Compatible`;
    return [
      { id: 'compatible', label: `✨ ${langLabel}` },
      ...FONT_CATEGORIES
    ];
  }, [currentLang]);

  const filteredFonts = useMemo(() => {
    let fonts;
    if (activeCategory === 'compatible') {
      fonts = getFontsForLanguage(cardData.language || 'en');
    } else if (activeCategory === 'all') {
      fonts = ALL_FONTS;
    } else if (activeCategory === 'urdu') {
      fonts = ALL_FONTS.filter(f => f.isUrdu || f.supportedLanguages?.includes('ur'));
    } else {
      fonts = ALL_FONTS.filter(f => f.category === activeCategory);
    }

    if (fontSearch.trim()) {
      const q = fontSearch.toLowerCase();
      fonts = fonts.filter(f =>
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.id && f.id.toLowerCase().includes(q)) ||
        (f.nameEn && f.nameEn.toLowerCase().includes(q)) ||
        (f.previewText && f.previewText.toLowerCase().includes(q)) ||
        (f.preview && f.preview.toLowerCase().includes(q)) ||
        (f.category && f.category.toLowerCase().includes(q))
      );
    }

    return fonts;
  }, [activeCategory, fontSearch, cardData.language]);

  // Load visible fonts so previews render with their exact font
  useEffect(() => {
    filteredFonts.slice(0, 15).forEach(f => {
      loadFont(f.id);
    });
  }, [filteredFonts]);

  const handleFontSelect = useCallback(async (fontId) => {
    await loadFont(fontId);
    setLoadedFontIds(prev => new Set([...prev, fontId]));
    updateField('font', fontId);
  }, [updateField]);

  const totalCount = ALL_FONTS.length;
  const selectedFontObj = ALL_FONTS.find(f => f.id === cardData.font || f.family === cardData.font);

  return (
    <div className="space-y-6">
      
      {/* Typography Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-brand-400" />
            Card Typography ({totalCount} Fonts)
          </label>
          {selectedFontObj && (
            <span className="text-[11px] text-brand-300 font-medium bg-brand-500/10 px-2 py-0.5 rounded-lg border border-brand-500/20">
              {selectedFontObj.isUrdu ? `${selectedFontObj.name} (${selectedFontObj.category})` : selectedFontObj.name}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={fontSearch}
            onChange={(e) => setFontSearch(e.target.value)}
            placeholder="تلاش کریں... / Search fonts (e.g. Nastaliq, Amiri, Playfair)"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-3 pb-2 border-b border-slate-800/50">
          {dynamicCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Font List */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {filteredFonts.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500">
              کوئی فونٹ نہیں ملا / No fonts found matching "{fontSearch}"
            </div>
          )}
          {filteredFonts.map((font) => {
            const isSelected = cardData.font === font.id || cardData.font === font.family;
            const isRtl = Boolean(font.isUrdu || font.language === 'urdu');
            const fontCssFamily = getFontFamily(font.id);
            const previewSample = font.previewText || (isRtl ? 'سالگرہ مبارک! خوش رہیں' : font.preview);

            return (
              <button
                key={font.id}
                type="button"
                onClick={() => handleFontSelect(font.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500/15 text-white ring-1 ring-brand-500 shadow-sm'
                    : 'border-slate-800/60 bg-slate-900/40 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {font.name} {font.nameEn && font.nameEn !== font.name && <span className="text-[10px] text-slate-400 font-normal">({font.nameEn})</span>}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                      {font.category}
                    </span>
                    {isRtl && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium shrink-0 flex items-center gap-1">
                        <Languages className="w-2.5 h-2.5" />
                        اردو
                      </span>
                    )}
                  </div>
                  
                  {/* Real visual preview rendered with its OWN exact font */}
                  <p
                    className={`mt-1 text-slate-100 ${isRtl ? 'text-base leading-relaxed py-0.5' : 'text-xs truncate text-slate-300'}`}
                    style={{
                      fontFamily: fontCssFamily,
                      direction: isRtl ? 'rtl' : 'ltr',
                      unicodeBidi: 'plaintext'
                    }}
                  >
                    {previewSample}
                  </p>
                </div>

                <div className="shrink-0 ml-3">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-700 group-hover:border-slate-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-2 text-[11px] text-slate-500 text-center">
          Showing {filteredFonts.length} of {totalCount} fonts • Real-time typography rendering
        </div>
      </div>

      {/* Accent Color Palette */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          Accent Glow & Theme Color
        </label>
        <div className="grid grid-cols-4 gap-2.5">
          {COLOR_PALETTES.map((color) => {
            const isSelected = cardData.themeColor === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => updateField('themeColor', color.id)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-white bg-white/10 ring-1 ring-white'
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${color.bg} shadow-md border border-white/20 flex items-center justify-center`}>
                  {isSelected && <Check className="w-3 h-3 text-slate-950 font-bold" />}
                </div>
                <span className="text-[11px] font-medium text-slate-300 truncate w-full text-center">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
