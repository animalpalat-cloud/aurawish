import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Sparkles, Music, Image, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { getFeaturePageBySlug, PRODUCT_FEATURE_PAGES } from '../data/productFeaturesData';

export const CardMakerLandingPage = ({ explicitSlug }) => {
  const { slug: routeSlug } = useParams();
  const slug = explicitSlug || routeSlug || 'birthday-card-maker';
  const pageData = getFeaturePageBySlug(slug) || PRODUCT_FEATURE_PAGES[0];

  return (
    <div className="py-10 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={pageData.seoTitle}
        description={pageData.seoDescription}
        canonicalUrl={`/${slug}`}
      />

      <Breadcrumbs
        items={[
          { label: 'Card Maker', href: '/birthday-card-maker' },
          { label: pageData.title, href: `/${slug}` }
        ]}
      />

      {/* Hero */}
      <div className="my-8 sm:my-12 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Birthday Wishes Online Studio</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
          {pageData.h1}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          {pageData.intro}
        </p>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <Link to="/templates">
            <Button variant="gold" size="lg" icon={Sparkles}>
              Start Creating Now — Free
            </Button>
          </Link>
          <Link to="/birthday-wishes">
            <Button variant="secondary" size="lg">
              Browse Birthday Wishes
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature capabilities grid */}
      <div className="my-14 space-y-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Engineered for Magical Celebration Moments
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real interactive capabilities built directly into every Birthday Wishes card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageData.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#11141e] border border-slate-800 space-y-3 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Step studio workflow */}
      <div className="my-16 p-8 sm:p-12 rounded-3xl bg-[#11141e] border border-slate-800 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">How the Studio Works</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Create and send a personalized digital birthday card in under two minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-300 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-bold text-white">Choose a Template</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick from velvet luxury, cyberpunk neon, gentle botanical, or playful pastel designs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-bold text-white">Personalize Content</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add the celebrator's name, upload a favorite photograph, select celebration audio, and write your heartfelt wish.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-sm font-bold text-white">Share or Download</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Send an instant share link for interactive 3D envelope unboxing, or export as high-resolution PNG or animated MP4.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link to="/templates">
            <Button variant="primary" size="lg" icon={Sparkles}>
              Launch Card Studio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardMakerLandingPage;
