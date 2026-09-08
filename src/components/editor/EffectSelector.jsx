import React from 'react';
import { Sparkles, Heart, Flame, PartyPopper, Zap, Ban, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

const EFFECTS = [
  { id: 'sparkles', name: 'Stardust Sparkles', icon: Sparkles, desc: 'Floating golden dust & shine', badge: 'Popular' },
  { id: 'confetti', name: 'Party Confetti', icon: PartyPopper, desc: 'Celebratory multi-color blast', badge: 'Festive' },
  { id: 'hearts', name: 'Floating Hearts', icon: Heart, desc: 'Romantic glowing heart particles', badge: 'Love' },
  { id: 'balloons', name: 'Party Balloons', icon: Sparkles, desc: 'Whimsical rising balloons', badge: 'Cute' },
  { id: 'fireworks', name: 'Night Fireworks', icon: Zap, desc: 'Vibrant celebratory sky bursts', badge: 'Exciting' },
  { id: 'none', name: 'Minimal (No Effects)', icon: Ban, desc: 'Clean, distraction-free design', badge: '' },
];

export const EffectSelector = ({ cardData, updateField }) => {
  const handleSelect = (effectId) => {
    updateField('effect', effectId);
    if (effectId === 'confetti') {
      soundService.playFx('pop');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else if (effectId === 'sparkles' || effectId === 'fireworks') {
      soundService.playFx('sparkle');
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        Interactive Celebration Effects
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {EFFECTS.map((eff) => {
          const isSelected = cardData.effect === eff.id;
          const Icon = eff.icon;
          return (
            <button
              key={eff.id}
              type="button"
              onClick={() => handleSelect(eff.id)}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-500/10 ring-1 ring-brand-500 text-white'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                isSelected ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate">{eff.name}</p>
                  {isSelected && <Check className="w-4 h-4 text-brand-400 shrink-0" />}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{eff.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
