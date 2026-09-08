import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  MessageSquare, 
  ChevronDown, 
  User, 
  Cake, 
  Type, 
  Quote, 
  Heart, 
  PenLine 
} from 'lucide-react';
import { MESSAGE_PRESETS } from '../../data/messagePresets';
import { getFontFamily, containsUrduText, isUrduFont } from '../../data/fontsData';
import { getLanguage, detectScriptAndDirection } from '../../data/languagesData';
import { LanguageSelector } from './LanguageSelector';

export const MessageEditor = ({ cardData, updateField }) => {
  const [showPresets, setShowPresets] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(MESSAGE_PRESETS[0].category);

  const handleApplyPreset = (text) => {
    updateField('message', text);
    setShowPresets(false);
  };

  const selectedFont = cardData.font;
  const currentLang = getLanguage(cardData.language || 'en');
  const isLanguageRtl = (cardData.direction === 'rtl') || (currentLang.direction === 'rtl');

  const isMsgRtl = isLanguageRtl || detectScriptAndDirection(cardData.message, cardData.language).isRtl;
  const isTitleRtl = isLanguageRtl || detectScriptAndDirection(cardData.title, cardData.language).isRtl;
  const isRecipientRtl = isLanguageRtl || detectScriptAndDirection(cardData.recipientName, cardData.language).isRtl;
  const isSubRtl = isLanguageRtl || detectScriptAndDirection(cardData.subtitle, cardData.language).isRtl;
  const isSenderRtl = isLanguageRtl || detectScriptAndDirection(cardData.senderName, cardData.language).isRtl;

  const inputFontStyle = {
    fontFamily: getFontFamily(selectedFont),
  };

  return (
    <div className="space-y-5">
      {/* 1. Independent Language Selector */}
      <LanguageSelector cardData={cardData} updateField={updateField} />

      {/* Recipient Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            <User className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
            <span>Recipient Name *</span>
          </label>
          <input
            type="text"
            value={cardData.recipientName || ''}
            onChange={(e) => updateField('recipientName', e.target.value)}
            placeholder={currentLang.sampleRecipient || "e.g. Alexandra Vance"}
            style={inputFontStyle}
            dir={isRecipientRtl ? 'rtl' : 'ltr'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            <Cake className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Age (Optional)</span>
          </label>
          <input
            type="text"
            value={cardData.age || ''}
            onChange={(e) => updateField('age', e.target.value)}
            placeholder="e.g. 25"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Card Header & Subtitle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            <Type className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
            <span>Card Title</span>
          </label>
          <input
            type="text"
            value={cardData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder={currentLang.sampleTitle || "e.g. Happy Birthday!"}
            style={inputFontStyle}
            dir={isTitleRtl ? 'rtl' : 'ltr'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            <Quote className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Card Subtitle / Tagline</span>
          </label>
          <input
            type="text"
            value={cardData.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder={currentLang.sampleSubtitle || "e.g. Wishing You The Best"}
            style={inputFontStyle}
            dir={isSubRtl ? 'rtl' : 'ltr'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Birthday Message */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
            <span>Birthday Wish Message *</span>
          </label>
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5" />
            AI Message Ideas
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* AI Presets Dropdown */}
        {showPresets && (
          <div className="mb-3 p-3.5 rounded-2xl bg-slate-950/90 border border-brand-500/30 space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2">
              {MESSAGE_PRESETS.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.category
                      ? 'bg-brand-500 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {MESSAGE_PRESETS.find(c => c.category === selectedCategory)?.messages.map((msg, idx) => {
                const itemRtl = detectScriptAndDirection(msg, cardData.language).isRtl;
                return (
                  <div
                    key={idx}
                    onClick={() => handleApplyPreset(msg)}
                    dir={itemRtl ? 'rtl' : 'ltr'}
                    style={{ fontFamily: getFontFamily(selectedFont) }}
                    className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 hover:bg-brand-500/5 cursor-pointer text-xs text-slate-300 transition-all leading-relaxed"
                  >
                    "{msg}"
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="relative">
          <textarea
            rows={4}
            value={cardData.message || ''}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder={currentLang.sampleMessage || "Write your personal heartfelt birthday message..."}
            style={{
              ...inputFontStyle,
              unicodeBidi: 'plaintext'
            }}
            dir={isMsgRtl ? 'rtl' : 'ltr'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500 text-base focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors resize-none leading-relaxed"
          />
        </div>
        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
          <span>{isLanguageRtl ? `🌙 ${currentLang.name} (${currentLang.nativeName}) text direction: RTL` : `🌍 ${currentLang.name} (${currentLang.script} Script)`}</span>
          <span>{(cardData.message || '').length} characters</span>
        </div>
      </div>

      {/* Sender Name */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          <PenLine className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
          <span>Sender Name / Signature</span>
        </label>
        <input
          type="text"
          value={cardData.senderName || ''}
          onChange={(e) => updateField('senderName', e.target.value)}
          placeholder={currentLang.sampleSender || "e.g. With all our love ❤️"}
          style={inputFontStyle}
          dir={isSenderRtl ? 'rtl' : 'ltr'}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
        />
      </div>
    </div>
  );
};

