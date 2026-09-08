import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Search, Check, ChevronDown, Sparkles, ArrowRightLeft } from 'lucide-react';
import { LANGUAGES, getLanguage } from '../../data/languagesData';
import { FONT_MAP, loadFont } from '../../data/fontsData';

export const LanguageSelector = ({ cardData, updateField }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const currentLang = getLanguage(cardData.language || 'en');

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = useMemo(() => {
    if (!search.trim()) return LANGUAGES;
    const q = search.toLowerCase();
    return LANGUAGES.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      (l.script && l.script.toLowerCase().includes(q))
    );
  }, [search]);

  const handleSelectLanguage = (lang) => {
    updateField('language', lang.code);
    updateField('direction', lang.direction);

    // If the current font isn't compatible with the new language, switch to the language's default font
    const currentFontObj = FONT_MAP[cardData.font] || FONT_MAP[cardData.font?.toLowerCase()];
    const isCurrentFontCompatible = currentFontObj?.supportedLanguages?.includes(lang.code) ||
      (lang.direction === 'ltr' && (!currentFontObj?.supportedLanguages || currentFontObj?.supportedLanguages?.includes('en')));

    if (!isCurrentFontCompatible && lang.defaultFont) {
      updateField('font', lang.defaultFont);
      loadFont(lang.defaultFont);
    }

    setIsOpen(false);
    setSearch('');
  };

  const handleApplySampleContent = () => {
    if (!currentLang) return;
    updateField('title', currentLang.sampleTitle);
    updateField('subtitle', currentLang.sampleSubtitle);
    updateField('message', currentLang.sampleMessage);
    updateField('recipientName', currentLang.sampleRecipient);
    updateField('senderName', currentLang.sampleSender);
    updateField('direction', currentLang.direction);
    if (currentLang.defaultFont) {
      updateField('font', currentLang.defaultFont);
      loadFont(currentLang.defaultFont);
    }
  };

  const handleToggleDirection = () => {
    const nextDir = cardData.direction === 'rtl' ? 'ltr' : 'rtl';
    updateField('direction', nextDir);
  };

  return (
    <div className="space-y-2 mb-5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-brand-400" />
          Card Language (25 Languages)
        </label>
        
        {/* Direction Indicator / Toggle */}
        <button
          type="button"
          onClick={handleToggleDirection}
          title={`Text Direction: ${cardData.direction === 'rtl' ? 'Right-to-Left (RTL)' : 'Left-to-Right (LTR)'}. Click to toggle.`}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
        >
          <ArrowRightLeft className="w-2.5 h-2.5 text-brand-400" />
          <span>{cardData.direction === 'rtl' ? 'RTL' : 'LTR'}</span>
        </button>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 hover:border-brand-500/60 text-white text-xs font-medium transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-[10px] uppercase font-mono border border-brand-500/30">
              {currentLang.code}
            </span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{currentLang.name}</span>
                <span className="text-slate-400 font-normal">({currentLang.nativeName})</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Script: {currentLang.script} • {currentLang.direction.toUpperCase()}
              </span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-[#0b0e14] border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/60">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search language or script (e.g. Urdu, Japanese, Hindi)..."
                  autoFocus
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Language Options List */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-800/30">
              {filteredLanguages.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No language matching "{search}"
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = (cardData.language || 'en') === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-brand-500/20 text-white border border-brand-500/40'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px] uppercase font-mono">
                          {lang.code}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-white">{lang.name}</span>
                            <span className="text-xs text-brand-400 font-semibold" dir={lang.direction}>
                              {lang.nativeName}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {lang.script} Script • {lang.direction.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-brand-400 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Action: Load Authentic Language Preset */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400">
          Want native birthday wording?
        </span>
        <button
          type="button"
          onClick={handleApplySampleContent}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3" />
          <span>Load {currentLang.name} Greeting</span>
        </button>
      </div>
    </div>
  );
};
