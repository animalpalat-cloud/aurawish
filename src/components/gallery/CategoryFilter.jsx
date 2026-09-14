import React from 'react';
import {
  Sparkles,
  Crown,
  Feather,
  HeartHandshake,
  PartyPopper,
  Heart,
  Smile,
  Users,
  Baby,
  Layout,
  Laugh,
  UserCheck,
  Flower2,
  Camera,
  Image as ImageIcon,
  Palette,
  Zap,
  Flame,
  Wand2,
  Gift,
  Award,
  Layers,
  Film,
  Compass
} from 'lucide-react';
import { CATEGORIES } from '../../data/templatesMeta';

const ICON_MAP = {
  Sparkles,
  Crown,
  Feather,
  HeartHandshake,
  PartyPopper,
  Heart,
  Smile,
  Users,
  Baby,
  Layout,
  Laugh,
  UserCheck,
  Flower2,
  Camera,
  ImageIcon,
  Palette,
  Zap,
  Flame,
  Wand2,
  Gift,
  Award,
  Layers,
  Film,
  Compass
};

export const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2.5 px-1 no-scrollbar scroll-smooth">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const Icon = ICON_MAP[cat.icon] || Sparkles;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer select-none shrink-0 ${
              isSelected
                ? 'bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 text-white border-brand-400/50 shadow-lg shadow-brand-500/25 scale-[1.03]'
                : 'bg-[#121520]/90 hover:bg-slate-800/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-white animate-pulse' : 'text-slate-400'}`} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
