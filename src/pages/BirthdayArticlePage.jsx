import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Sparkles, Clock, BookOpen, ArrowLeft, ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { getArticleBySlug, BIRTHDAY_IDEAS } from '../data/birthdayIdeasData';
import { blogService } from '../services/blogService';
import { SUPABASE_URL } from '../supabase/client';
import { PenLine, Wand2, Gift, Laptop } from 'lucide-react';

// ── Category visual config ────────────────────────────────────────────────────
const CATEGORY_VISUALS = {
  'Writing Guides': {
    icon: PenLine,
    gradient: 'linear-gradient(135deg, rgba(109,40,217,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(217,70,239,0.22)',
    pill: 'bg-brand-500/15 border-brand-500/30 text-brand-300',
    sectionAccent: 'border-brand-500/20',
    sectionGlow: 'rgba(217,70,239,0.06)',
    numberColor: 'text-brand-400',
  },
  'Creative Ideas': {
    icon: Wand2,
    gradient: 'linear-gradient(135deg, rgba(180,83,9,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(245,158,11,0.22)',
    pill: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    sectionAccent: 'border-amber-500/20',
    sectionGlow: 'rgba(245,158,11,0.06)',
    numberColor: 'text-amber-400',
  },
  'Surprises': {
    icon: Gift,
    gradient: 'linear-gradient(135deg, rgba(159,18,57,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(244,63,94,0.22)',
    pill: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    sectionAccent: 'border-rose-500/20',
    sectionGlow: 'rgba(244,63,94,0.06)',
    numberColor: 'text-rose-400',
  },
  'Tutorials': {
    icon: Laptop,
    gradient: 'linear-gradient(135deg, rgba(8,70,100,0.65) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(6,182,212,0.22)',
    pill: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    sectionAccent: 'border-cyan-500/20',
    sectionGlow: 'rgba(6,182,212,0.06)',
    numberColor: 'text-cyan-400',
  },
};

const DEFAULT_VISUAL = {
  icon: BookOpen,
  gradient: 'linear-gradient(135deg, rgba(51,65,85,0.55) 0%, rgba(17,20,30,0.95) 100%)',
  glow: 'rgba(100,116,139,0.2)',
  pill: 'bg-slate-500/15 border-slate-500/30 text-slate-300',
  sectionAccent: 'border-slate-700/40',
  sectionGlow: 'rgba(100,116,139,0.04)',
  numberColor: 'text-slate-400',
};

function getVisual(category) {
  return CATEGORY_VISUALS[category] || DEFAULT_VISUAL;
}

export function getBlogImageUrl(image) {
  if (!image || typeof image !== 'string') return '';
  const trimmed = image.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  if (cleanPath.startsWith('blog-images/')) {
    return `${SUPABASE_URL}/storage/v1/object/public/${cleanPath}`;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/blog-images/${cleanPath}`;
}

// Map a Supabase blog_posts row to the article shape this page renders
function mapSupabaseArticle(post) {
  const sections = Array.isArray(post.content) ? post.content : [];
  return {
    slug:           post.slug,
    title:          post.title,
    h1:             post.title,
    excerpt:        post.excerpt || '',
    category:       post.category || 'General',
    author:         post.author || 'Admin',
    featured_image: post.featured_image || '',
    readTime:       sections.length > 0
                      ? `${Math.max(1, Math.ceil(sections.reduce((a, s) => a + (s.body?.length || 0), 0) / 1000))} min read`
                      : '3 min read',
    intro:          post.excerpt || '',
    sections,
    seoTitle:       `${post.title} | Birthday Wishes`,
    seoDescription: post.excerpt || post.title,
    relatedSlugs:   [],
    _fromSupabase:  true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
export const BirthdayArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    blogService.getPostBySlug(slug)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) {
          // Found in Supabase
          setArticle(mapSupabaseArticle(data));
        } else {
          // Fall back to hardcoded data
          const hardcoded = getArticleBySlug(slug);
          if (hardcoded) {
            setArticle(hardcoded);
          } else {
            setNotFound(true);
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        // Network error — try hardcoded
        const hardcoded = getArticleBySlug(slug);
        if (hardcoded) setArticle(hardcoded);
        else setNotFound(true);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B10] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (notFound || !article) {
    return <Navigate to="/birthday-ideas" replace />;
  }

  const vis = getVisual(article.category);
  const Icon = vis.icon;

  // Related articles — from same Supabase set not possible here without extra fetch;
  // use hardcoded related as a reasonable fallback
  const relatedArticles = BIRTHDAY_IDEAS.filter(a =>
    article.relatedSlugs?.includes(a.slug) || (a.slug !== article.slug && a.category === article.category)
  ).slice(0, 2);

  const imageUrl = getBlogImageUrl(article.featured_image);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.h1,
    "description": article.seoDescription,
    ...(imageUrl ? { "image": [imageUrl] } : {}),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://birthdaywishly.com/birthday-ideas/${article.slug}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Birthday Wishes",
      "logo": { "@type": "ImageObject", "url": "https://birthdaywishly.com/logo.png" }
    }
  };

  return (
    <div className="min-h-screen bg-[#090B10]">
      <SEOHead
        title={article.seoTitle}
        description={article.seoDescription}
        canonicalUrl={`/birthday-ideas/${article.slug}`}
        schemaJson={articleSchema}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Birthday Ideas', href: '/birthday-ideas' },
            { label: article.title, href: `/birthday-ideas/${article.slug}` }
          ]}
        />

        {/* ── ARTICLE HERO ─────────────────────────────────── */}
        <div className="mt-8 mb-10">
          <div
            className="relative w-full h-52 sm:h-72 md:h-80 rounded-3xl overflow-hidden flex items-center justify-center mb-8 bg-slate-900 border border-slate-800/80"
            style={{ background: !imageUrl ? vis.gradient : undefined }}
          >
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={article.h1 || article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </>
            ) : (
              <>
                <div aria-hidden="true" className="absolute inset-0 opacity-40"
                  style={{ backgroundImage: DOT_BG, backgroundSize: '22px 22px' }} />
                <div aria-hidden="true" className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at 50% 60%, ${vis.glow} 0%, transparent 65%)` }} />
                <Icon className="relative w-20 h-20 text-white/15" strokeWidth={0.8} />
              </>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${vis.pill}`}>
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight mb-4">
            {article.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed border-b border-slate-800/70 pb-8">
            {article.intro}
          </p>
        </div>

        {/* ── ARTICLE CONTENT ──────────────────────────────── */}
        <article className="space-y-5 mb-12">
          {article.sections.map((section, idx) => (
            <section
              key={idx}
              className={`relative overflow-hidden rounded-2xl border ${vis.sectionAccent} bg-[#11141e]`}
            >
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 bottom-0 w-0.5 rounded-l-2xl"
                style={{ background: `linear-gradient(to bottom, ${vis.glow.replace('0.22', '0.6')}, transparent)` }}
              />
              <div className="p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className={`flex-shrink-0 text-4xl font-display font-black leading-none select-none ${vis.numberColor} opacity-30`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-2 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                      {section.h2}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      {section.body}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </article>

        {/* ── CTA BLOCK ────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 text-center p-8 sm:p-12 mb-12">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(113,29,138,0.28) 0%, rgba(17,20,30,1) 50%, rgba(120,80,10,0.18) 100%)' }} />
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-noise opacity-30" />
          <div className="relative space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Put These Words Into an Interactive Birthday Card
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Start with one of our luxury templates, customize with recipient photo and music,
              and share an unboxing moment.
            </p>
            <div className="pt-1">
              <Link to="/templates">
                <Button variant="gold" size="md" icon={Sparkles}>
                  Create a Card Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── RELATED ARTICLES ─────────────────────────────── */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-slate-800/60 pt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Recommended Guides</h3>
              <Link to="/birthday-ideas" className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map(rel => {
                const relVis = getVisual(rel.category);
                const RelIcon = relVis.icon;
                return (
                  <Link
                    key={rel.slug}
                    to={`/birthday-ideas/${rel.slug}`}
                    className="group flex gap-4 items-start p-5 rounded-2xl bg-[#11141e] border border-slate-800 hover:border-brand-500/35 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
                      style={{ background: relVis.gradient }}>
                      <div aria-hidden="true" className="absolute inset-0 opacity-30"
                        style={{ backgroundImage: DOT_BG, backgroundSize: '12px 12px' }} />
                      <RelIcon className="relative w-6 h-6 text-white/30 group-hover:text-white/45 transition-colors" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[10px] font-semibold block mb-1 ${relVis.pill.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
                        {rel.category}
                      </span>
                      <h4 className="text-sm font-semibold text-white group-hover:text-brand-200 transition-colors leading-snug line-clamp-2">
                        {rel.title}
                      </h4>
                      <span className="flex items-center gap-1 text-[10px] text-slate-600 mt-1.5">
                        <Clock className="w-3 h-3" />
                        {rel.readTime}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div className="mt-10 pt-6 border-t border-slate-800/60">
          <Link to="/birthday-ideas" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to all guides
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BirthdayArticlePage;