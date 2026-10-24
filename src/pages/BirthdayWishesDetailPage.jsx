import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Sparkles, Heart, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { WishCard } from '../components/common/WishCard';
import { Button } from '../components/common/Button';
import { getWishCategoryBySlug, ALL_WISH_CATEGORIES } from '../data/birthdayWishesData';

export const BirthdayWishesDetailPage = ({ explicitSlug }) => {
  const { slug: routeSlug } = useParams();
  const slug = explicitSlug || routeSlug;
  const category = getWishCategoryBySlug(slug);

  if (!category) {
    return <Navigate to="/birthday-wishes/" replace />;
  }

  const otherCategories = ALL_WISH_CATEGORIES
    .filter(c => c.slug !== category.slug)
    .slice(0, 4);

  // FAQ Schema if available
  const faqSchema = category.faqs && category.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": category.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  } : null;

  return (
    <div className="py-10 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={category.seoTitle}
        description={category.seoDescription}
        canonicalUrl={`/${category.slug}/`}
        schemaJson={faqSchema}
      />

      <Breadcrumbs
        items={[
          { label: 'Birthday Wishes', href: '/birthday-wishes/' },
          { label: category.title, href: `/${category.slug}/` }
        ]}
      />

      {/* Hero */}
      <div className="my-8 sm:my-12 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 text-brand-400" />
          <span>{category.navLabel} Collection</span>
        </div>

        <h1 className="text-2xl xs:text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight break-words-safe">
          {category.h1}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          {category.intro}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link to={`/create/${category.recommendedTemplate || 'velvet-luxury'}/`} className="w-full sm:w-auto">
            <Button variant="gold" size="md" icon={Sparkles} className="w-full sm:w-auto">
              Create a Card with These Wishes
            </Button>
          </Link>
          <Link to="/templates/" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full sm:w-auto">
              View Recommended Templates
            </Button>
          </Link>
        </div>
      </div>

      {/* Writing Tips & Emotional Guidance */}
      {category.writingTips && category.writingTips.length > 0 && (
        <div className="my-10 p-6 sm:p-8 rounded-3xl bg-[#11141e] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>How to Personalize Your Message</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Helpful Writing Tips for {category.title}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {category.writingTips.map((tip, idx) => (
              <li key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Wishes Grid */}
      <div className="my-12 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-display font-bold text-white">
            Curated Wishes & Quotes ({category.wishes.length})
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Click "Put in Card" to send directly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {category.wishes.map((wish, idx) => (
            <WishCard
              key={idx}
              wish={wish}
              templateId={category.recommendedTemplate || 'velvet-luxury'}
            />
          ))}
        </div>
      </div>

      {/* FAQs Section if present */}
      {category.faqs && category.faqs.length > 0 && (
        <div className="my-14 space-y-6 border-t border-slate-800 pt-10">
          <div className="flex items-center gap-2 text-brand-400 font-semibold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Common Questions About {category.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#11141e] border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Categories Navigation */}
      <div className="my-14 space-y-6 border-t border-slate-800 pt-10">
        <h2 className="text-xl font-bold text-white">
          Explore Related Birthday Wish Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {otherCategories.map((other) => (
            <Link
              key={other.slug}
              to={`/${other.slug}/`}
              className="p-4 rounded-xl bg-[#11141e] border border-slate-800 hover:border-brand-500/40 transition-all text-center group"
            >
              <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                {other.title}
              </h3>
              <span className="text-[11px] text-slate-500 mt-1 inline-block">
                View wishes &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BirthdayWishesDetailPage;
