import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Sparkles, Clock, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { getArticleBySlug, BIRTHDAY_IDEAS } from '../data/birthdayIdeasData';

export const BirthdayArticlePage = () => {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return <Navigate to="/birthday-ideas" replace />;
  }

  const relatedArticles = BIRTHDAY_IDEAS.filter(a =>
    article.relatedSlugs?.includes(a.slug) || (a.slug !== article.slug && a.category === article.category)
  ).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.h1,
    "description": article.seoDescription,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://aurawish.com/birthday-ideas/${article.slug}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "AuraWish",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aurawish.com/logo.png"
      }
    }
  };

  return (
    <div className="py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={article.seoTitle}
        description={article.seoDescription}
        canonicalUrl={`/birthday-ideas/${article.slug}`}
        schemaJson={articleSchema}
      />

      <Breadcrumbs
        items={[
          { label: 'Birthday Ideas', href: '/birthday-ideas' },
          { label: article.title, href: `/birthday-ideas/${article.slug}` }
        ]}
      />

      {/* Article Header */}
      <div className="my-8 space-y-4">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 font-medium">
            {article.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
          {article.h1}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed pt-2 border-b border-slate-800 pb-6">
          {article.intro}
        </p>
      </div>

      {/* Article Content Body */}
      <article className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed my-8">
        {article.sections.map((section, idx) => (
          <section key={idx} className="space-y-3 p-6 rounded-2xl bg-[#11141e]/70 border border-slate-800/80">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {section.h2}
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {section.body}
            </p>
          </section>
        ))}
      </article>

      {/* Contextual Card Maker CTA */}
      <div className="my-12 p-8 rounded-3xl bg-gradient-to-r from-brand-900/30 via-[#131724] to-amber-900/20 border border-brand-500/20 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Put These Words Into an Interactive Birthday Card
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Start with one of our luxury templates, customize with recipient photo and music, and share an unboxing moment.
        </p>
        <Link to="/templates">
          <Button variant="gold" size="md" icon={Sparkles}>
            Create a Card Now
          </Button>
        </Link>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="my-12 border-t border-slate-800 pt-8 space-y-4">
          <h3 className="text-lg font-bold text-white">Recommended Celebration Guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                to={`/birthday-ideas/${rel.slug}`}
                className="p-5 rounded-2xl bg-[#11141e] border border-slate-800 hover:border-brand-500/40 transition-all block group"
              >
                <span className="text-[11px] text-brand-300 font-medium block mb-1">
                  {rel.category}
                </span>
                <h4 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors leading-snug">
                  {rel.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayArticlePage;
