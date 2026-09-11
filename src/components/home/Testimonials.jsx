import React from 'react';
import { Star, Heart } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Elena Rostova',
    role: 'Created a card for her best friend',
    text: 'My best friend loved the velvet card design with our trip photo and background music. Having an interactive link instead of a flat JPG made it feel like a real gift.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    stars: 5,
  },
  {
    name: 'Marcus Vance',
    role: 'Created a milestone card for his mom',
    text: 'The gold filigree design was beautiful, and the interactive candle feature was a hit during our family video call. Very easy to personalize in just a couple minutes.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    stars: 5,
  },
  {
    name: 'Chloe Lin',
    role: 'Sent a card to her brother',
    text: 'I put together the Cyber Neon card quickly on my phone during lunch. The share link opened seamlessly on WhatsApp without him needing to download any app.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    stars: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-[#07080d] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Loved by Celebrators Everywhere
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            See how heartfelt birthday greetings turned into unforgettable moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#10131e] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed mb-6">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  loading="lazy"
                  decoding="async"
                  width="40"
                  height="40"
                  className="w-10 h-10 rounded-full object-cover border border-brand-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-slate-400">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
