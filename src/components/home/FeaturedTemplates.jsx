import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { TemplateCard } from '../gallery/TemplateCard';
import { templateService } from '../../services/templateService';
import { Button } from '../common/Button';

// Prefetch the EditorPage chunk when the user shows intent to open a template.
// Called on pointer-enter of any template card — the chunk will be cached
// by the time they actually click, so the navigation is instant.
let editorPrefetched = false;
function prefetchEditor() {
  if (editorPrefetched) return;
  editorPrefetched = true;
  import('../../pages/EditorPage').catch(() => {});
}

export const FeaturedTemplates = () => {
  const navigate = useNavigate();
  const allTemplates = templateService.getAllTemplates();
  const featured = allTemplates.slice(0, 6);

  // Stable callback — prefetch on first hover over any card
  const handlePointerEnter = useCallback(() => prefetchEditor(), []);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Handcrafted Visual Masterpieces
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Featured Birthday Card Collections
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              From majestic Art Deco gold foil to playful cyber rave party aesthetics, find the
              exact aesthetic that resonates with their personality.
            </p>
          </div>

          <Link to="/templates">
            <Button variant="outline" size="md" icon={Compass} iconPosition="right">
              View All 12+ Templates
            </Button>
          </Link>
        </div>

        {/* Template Grid
            First 3 cards (above-fold on desktop, first visible on mobile) render
            eagerly.  The last 3 are wrapped in a div with loading="lazy"-equivalent
            treatment — they still render immediately in React, but heavy sub-images
            inside TemplateCard already have loading=lazy so the browser won't decode
            them until they approach the viewport.
        */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          onPointerEnter={handlePointerEnter}
        >
          {featured.map((template) => (
            <TemplateCard
              key={template.templateId}
              template={template}
              onQuickPreview={() => navigate(`/create/${template.templateId}`)}
            />
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-14 text-center">
          <Link to="/templates">
            <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="shadow-xl">
              Browse Complete Template Gallery
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
