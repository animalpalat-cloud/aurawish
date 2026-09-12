import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { Sparkles, Compass, Eye, ArrowRight, ArrowLeft, X, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryFilter } from '../components/gallery/CategoryFilter';
import { SearchBar } from '../components/gallery/SearchBar';
import { TemplateCard } from '../components/gallery/TemplateCard';
import { templateService } from '../services/templateService';
import { UniversalCardRenderer } from '../components/card-renderer/UniversalCardRenderer';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const TemplatesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: routeCategory } = useParams();
  const navigate = useNavigate();

  const initialCategory = routeCategory || searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    if (routeCategory) {
      setSelectedCategory(routeCategory);
    }
  }, [routeCategory]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [templatesList, setTemplatesList] = useState(() => {
    try {
      return templateService.getAllTemplates() || [];
    } catch (e) {
      console.warn('Error reading initial templates:', e);
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadTemplates = async () => {
      try {
        const data = await templateService.fetchTemplatesFromSupabase();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setTemplatesList(data);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, continuing with built-in templates:', err);
      }
    };

    loadTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  const [visibleCount, setVisibleCount] = useState(24);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setVisibleCount(24);
    if (categoryId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const filteredTemplates = useMemo(() => {
    try {
      return templateService.searchTemplates(searchQuery, selectedCategory, sortBy, templatesList) || [];
    } catch (err) {
      console.error("Error filtering templates:", err);
      return [];
    }
  }, [searchQuery, selectedCategory, sortBy, templatesList]);

  // Reset pagination when search query changes
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, sortBy]);

  const visibleTemplates = useMemo(() => {
    return filteredTemplates.slice(0, visibleCount);
  }, [filteredTemplates, visibleCount]);

  const allTemplatesCount = templatesList?.length || 0;

  // Next / Previous template navigation in preview modal
  const handleNextPreview = () => {
    if (!previewTemplate || filteredTemplates.length === 0) return;
    const currentIndex = filteredTemplates.findIndex(
      (t) => t.templateId === previewTemplate.templateId
    );
    const nextIndex = (currentIndex + 1) % filteredTemplates.length;
    setPreviewTemplate(filteredTemplates[nextIndex]);
  };

  const handlePrevPreview = () => {
    if (!previewTemplate || filteredTemplates.length === 0) return;
    const currentIndex = filteredTemplates.findIndex(
      (t) => t.templateId === previewTemplate.templateId
    );
    const prevIndex = (currentIndex - 1 + filteredTemplates.length) % filteredTemplates.length;
    setPreviewTemplate(filteredTemplates[prevIndex]);
  };

  return (
    <div className="py-10 sm:py-16 min-h-[85vh]">
      <SEOHead
        title={selectedCategory !== 'all' ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Birthday Card Templates | Birthday Wishes` : 'Digital Birthday Card Templates - Luxury & Animated Designs | Birthday Wishes'}
        description="Browse 250+ luxury digital birthday card templates. Personalize photos, celebration music, and heartfelt messages with instant 3D unboxing."
        canonicalUrl={selectedCategory !== 'all' ? `/birthday-card-templates/${selectedCategory}` : '/templates'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Card Templates', href: '/templates' },
            ...(selectedCategory !== 'all' ? [{ label: selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1), href: `/birthday-card-templates/${selectedCategory}` }] : [])
          ]}
        />
        
        {/* Header Title Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Birthday Card Catalog ({allTemplatesCount} Designs)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            Digital Birthday Card Templates
          </h1>


          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover professionally crafted birthday card designs for every personality and relationship. Personalize messages, add photos, choose ambient music, and share memorable birthday wishes in minutes.
          </p>
        </div>

        {/* Category Filter Pills */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* Search & Sort Controls */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={filteredTemplates.length}
        />

        {/* Templates Grid or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 pt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
              <div key={idx} className="h-96 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="space-y-10 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {visibleTemplates.map((template) => (
                <TemplateCard
                  key={template.templateId || template.name}
                  template={template}
                  onQuickPreview={(tpl) => setPreviewTemplate(tpl)}
                />
              ))}
            </div>

            {/* Progressive Load More Button */}
            {visibleCount < filteredTemplates.length && (
              <div className="flex flex-col items-center justify-center pt-8 pb-4 space-y-3">
                <p className="text-xs text-slate-400 font-medium">
                  Showing {visibleTemplates.length} of {filteredTemplates.length} designs
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredTemplates.length))}
                  className="px-8 border-brand-500/30 hover:border-brand-500/60 shadow-lg shadow-brand-500/5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-brand-400 mr-2" />
                  Load More Templates ({filteredTemplates.length - visibleTemplates.length} remaining)
                </Button>
              </div>
            )}
          </div>
        ) : allTemplatesCount === 0 ? (
          <div className="text-center py-20 bg-[#11141e]/50 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No templates available yet.</h3>
            <p className="text-sm text-slate-400 mb-6">
              Our studio collection is currently being updated. Please check back shortly.
            </p>
          </div>
        ) : (
          <div className="text-center py-20 bg-[#11141e]/50 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
            <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No matching templates found</h3>
            <p className="text-sm text-slate-400 mb-6">
              Try adjusting your search keywords or switching category filters.
            </p>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSearchQuery('');
                handleCategoryChange('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

      </div>

      {/* Quick Preview Modal with Prev/Next controls */}
      <Modal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate?.name || 'Template Preview'}
        subtitle={previewTemplate?.description}
        maxWidth="max-w-3xl"
      >
        {previewTemplate && (
          <div className="space-y-6">
            <div className="relative max-h-[60vh] overflow-y-auto py-2 px-1">
              <UniversalCardRenderer
                cardData={previewTemplate.defaultData || {}}
                template={previewTemplate}
                showInteractiveWish={true}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              {/* Prev / Next template controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={handlePrevPreview}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredTemplates.findIndex((t) => t.templateId === previewTemplate.templateId) + 1} of {filteredTemplates.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextPreview}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setPreviewTemplate(null)}
                >
                  Close Preview
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => {
                    const id = previewTemplate.templateId;
                    setPreviewTemplate(null);
                    navigate(`/create/${id}`);
                  }}
                >
                  Customize Template
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default TemplatesPage;
