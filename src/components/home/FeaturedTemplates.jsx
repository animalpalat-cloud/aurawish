import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { TemplateCard } from '../gallery/TemplateCard';
import { getFeaturedTemplateMeta } from '../../data/templatesMeta';
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

const FEATURED = getFeaturedTemplateMeta();

export const FeaturedTemplates = () => {
  const navigate = useNavigate();
  // PERFORMANCE: Use lightweight metadata instead of full 299KB template data
  // Only 6 templates with minimal data (~2KB instead of ~50KB for 6 full templates)

  // Prefetch the editor chunk only on real hover (desktop). Touch scrolling
  // can fire pointerenter and would otherwise parse a huge JS chunk mid-fling.
  const handlePointerEnter = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      prefetchEditor();
    }
  }, []);

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
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

          <Button
            variant="outline"
            size="md"
            icon={Compass}
            iconPosition="right"
            onClick={() => navigate('/templates')}
          >
            View All 12+ Templates
          </Button>
        </div>

        {/* Template Grid
            PERFORMANCE: Using lightweight template metadata (no full defaultData, config)
            Images inside TemplateCard use loading=lazy for below-fold cards
        */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          onPointerEnter={handlePointerEnter}
        >
          {FEATURED.map((template) => (
            <TemplateCard
              key={template.templateId}
              template={template}
            />
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-14 text-center">
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            className="shadow-xl"
            onClick={() => navigate('/templates')}
          >
            Browse Complete Template Gallery
          </Button>
        </div>
      </div>
    </section>
  );
};
