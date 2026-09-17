import React, { useState } from 'react';
import { MessageSquare, Palette, ImagePlus, Wand2, Sparkles, RotateCcw } from 'lucide-react';
import { MessageEditor } from './MessageEditor';
import { ThemeSelector } from './ThemeSelector';
import { PhotoUploader } from './PhotoUploader';
import { EffectSelector } from './EffectSelector';
import { MusicSelector } from './MusicSelector';

export const EditorSidebar = ({
  cardData,
  updateField,
  template,
  resetToTemplateDefaults
}) => {
  const [activeTab, setActiveTab] = useState('content');

  const tabs = [
    { id: 'content', label: 'Message & Info', icon: MessageSquare },
    { id: 'photo', label: 'Photo Slot', icon: ImagePlus },
    { id: 'theme', label: 'Typography & Colors', icon: Palette },
    { id: 'effects', label: 'Effects & Music', icon: Wand2 },
  ];

  return (
    <div className="w-full bg-[#0d1017] border border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl flex flex-col h-full">
      {/* Studio Brand Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 flex items-center justify-center shadow-md shadow-brand-500/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold font-display text-white tracking-wide flex items-center gap-1.5">
              Birthday Wishes
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/15 text-amber-300 border border-amber-400/25 font-sans font-medium">STUDIO</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={resetToTemplateDefaults}
          title="Reset to original template presets"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full pb-3 mb-4 border-b border-slate-800/60 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === 'content' && (
          <MessageEditor cardData={cardData} updateField={updateField} />
        )}

        {activeTab === 'photo' && (
          <PhotoUploader cardData={cardData} updateField={updateField} />
        )}

        {activeTab === 'theme' && (
          <ThemeSelector cardData={cardData} updateField={updateField} />
        )}

        {activeTab === 'effects' && (
          <div className="space-y-6">
            <EffectSelector cardData={cardData} updateField={updateField} />
            <div className="border-t border-slate-800 pt-6">
              <MusicSelector cardData={cardData} updateField={updateField} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
