import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb, BookOpen, Sparkles, Clock, ArrowRight,
  PenLine, Wand2, Gift, Laptop, Search, X, Loader2
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { BIRTHDAY_IDEAS } from '../data/birthdayIdeasData';
import { blogService } from '../services/blogService';
import { SUPABASE_URL } from '../supabase/client';

// ── Category visual config ───────────────────────────────────────────────────
const CATEGORY_VISUALS = {
  'Writing Guides': {
    icon: PenLine,
    gradient: 'linear-gradient(135deg, rgba(109,40,217,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(217,70,239,0.22)',
    pill: 'bg-brand-500/15 border-brand-500/30 text-brand-300',
    arrowColor: 'text-brand-400 group-hover:text-brand-300',
  },
  'Creative Ideas': {
    icon: Wand2,
    gradient: 'linear-gradient(135deg, rgba(180,83,9,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(245,158,11,0.22)',
    pill: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    arrowColor: 'text-amber-400 group-hover:text-amber-300',
  },
  'Surprises': {
    icon: Gift,
    gradient: 'linear-gradient(135deg, rgba(159,18,57,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(244,63,94,0.22)',
    pill: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    arrowColor: 'text-rose-400 group-hover:text-rose-300',
  },
  'Tutorials': {
    icon: Laptop,
    gradient: 'linear-gradient(135deg, rgba(8,70,100,0.65) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(6,182,212,0.22)',
    pill: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    arrowColor: 'text-cyan-400 group-hover:text-cyan-300',
  },
};

const DEFAULT_VISUAL = {
  icon: BookOpen,
  gradient: 'linear-gradient(135deg, rgba(51,65,85,0.55) 0%, rgba(17,20,30,0.95) 100%)',
  glow: 'rgba(100,116,139,0.2)',
  pill: 'bg-slate-500/15 border-slate-500/30 text-slate-300',
  arrowColor: 'text-slate-400 group-hover:text-slate-300',
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

// Map a Supabase blog_posts row to the shape the card components expect
function mapSupabasePost(post) {
  return {
    slug:           post.slug,
    title:          post.title,
    excerpt:        post.excerpt || '',
    category:       post.category || 'General',
    featured_image: post.featured_image || '',
    readTime: post.content && Array.isArray(post.content)
      ? `${Math.max(1, Math.ceil(post.content.reduce((acc, s) => acc + (s.body?.length || 0), 0) / 1000))} min read`
      : '3 min read',
    _fromSupabase: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
export const BirthdayIdeasHubPage = () => {
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState(BIRTHDAY_IDEAS); // start with hardcoded
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch published posts from Supabase; fall back to hardcoded if none returned
  useEffect(() => {
    let cancelled = false;
    setFetchLoading(true);
    blogService.getPublishedPosts()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          setArticles(data.map(mapSupabasePost));
        }
        // If Supabase returns empty or errors, keep hardcoded BIRTHDAY_IDEAS
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setFetchLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = search.trim()
    ? articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    : articles;

  const [featured, ...rest] = filtered;
  const showSearch = search.trim().length > 0;

  // Unique categories for stats
  const categoryCount = new Set(articles.map(a => a.category)).size;

  return (
    <div className="min-h-screen bg-[#090B10]">
      <SEOHead
        title="Birthday Ideas - Message Inspiration, Surprises & Guides | Birthday Wishes"
        description="Explore curated editorial guides on how to write meaningful birthday cards, creative surprise ideas, digital card tips, and etiquette."
        canonicalUrl="/birthday-ideas"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <Breadcrumbs items={[{ label: 'Birthday Ideas', href: '/birthday-ideas' }]} />

        {/* ── HERO HEADER ─────────────────────────────────────────── */}
        <div className="relative text-center max-w-3xl mx-auto mt-8 mb-14 space-y-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #d946ef 0%, #7c3aed 60%, transparent 100%)' }}
          />

          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold tracking-wide">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Celebration Editorial &amp; Guides
          </div>

          <h1 className="relative text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            Birthday Message{' '}
            <span className="text-gold-foil">Inspiration</span> &amp; Ideas
          </h1>

          <p className="relative text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Practical advice, step-by-step writing frameworks, and creative long-distance
            celebration ideas to help you craft heartfelt moments.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto pt-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              id="blog-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search guides (e.g. writing, surprise, card)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#11141e] border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/70 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Stats strip */}
          {!showSearch && (
            <div className="relative flex items-center justify-center gap-8 sm:gap-12 pt-1">
              <div className="text-center">
                <p className="text-xl font-bold text-white">
                  {fetchLoading ? <Loader2 className="w-5 h-5 animate-spin inline text-slate-500" /> : articles.length}
                </p>
                <p className="text-[11px] text-slate-500 tracking-wide">Editorial Guides</p>
              </div>
              <div className="w-px h-8 bg-slate-800" aria-hidden="true" />
              <div className="text-center">
                <p className="text-xl font-bold text-white">{categoryCount}</p>
                <p className="text-[11px] text-slate-500 tracking-wide">Categories</p>
              </div>
              <div className="w-px h-8 bg-slate-800" aria-hidden="true" />
              <div className="text-center">
                <p className="text-xl font-bold text-white">~20 min</p>
                <p className="text-[11px] text-slate-500 tracking-wide">Combined Reading</p>
              </div>
            </div>
          )}
        </div>

        {/* ── LOADING SKELETON ─────────────────────────────────────── */}
        {fetchLoading && articles.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl bg-[#11141e] border border-slate-800 overflow-hidden animate-pulse">
                <div className="h-36 bg-slate-800/50" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-800 rounded w-1/3" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded" />
                  <div className="h-3 bg-slate-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── RESULTS ──────────────────────────────────────────────── */}
        {!fetchLoading && (
          filtered.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <p className="text-3xl">🔍</p>
              <p className="text-slate-400 text-sm">No guides match &ldquo;{search}&rdquo;</p>
              <button
                onClick={() => setSearch('')}
                className="text-brand-400 text-xs hover:text-brand-300 transition-colors underline underline-offset-2"
              >
                Clear search &amp; browse all
              </button>
            </div>
          ) : (
            <>
              {/* Featured article */}
              {!showSearch && featured && (
                <div className="mb-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4">
                    Featured Guide
                  </p>
                  <FeaturedCard article={featured} />
                </div>
              )}

              {/* Grid of articles */}
              {(showSearch ? filtered : rest).length > 0 && (
                <div>
                  {!showSearch && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-5">
                      All Guides
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(showSearch ? filtered : rest).map((article, idx) => (
                      <ArticleCard key={article.slug} article={article} index={idx} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )
        )}

        {/* ── CTA BANNER ───────────────────────────────────────────── */}
        <div className="mt-20 relative overflow-hidden rounded-3xl border border-brand-500/20 text-center p-10 sm:p-14">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(113,29,138,0.28) 0%, rgba(17,20,30,1) 50%, rgba(120,80,10,0.18) 100%)' }} />
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-noise opacity-30" />
          <div className="relative space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Turn These Ideas Into a Live Digital Card
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Ready to put your words into action? Pick any luxury template, customize font
              and music, and share an unboxing moment.
            </p>
            <div className="pt-2">
              <Link to="/templates">
                <Button variant="gold" size="lg" icon={Sparkles}>
                  Explore Card Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED CARD
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedCard({ article }) {
  const vis = getVisual(article.category);
  const Icon = vis.icon;
  const imageUrl = getBlogImageUrl(article.featured_image);

  return (
    <Link
      to={`/birthday-ideas/${article.slug}`}
      id={`blog-featured-${article.slug}`}
      className="group flex flex-col sm:flex-row rounded-3xl overflow-hidden border border-slate-800 hover:border-brand-500/40 transition-all duration-300 hover:shadow-[0_0_40px_-8px_rgba(217,70,239,0.28)] hover:-translate-y-0.5 bg-[#11141e]"
    >
      <div
        className="relative flex-shrink-0 sm:w-72 h-52 sm:h-auto flex items-center justify-center overflow-hidden bg-slate-900 min-h-[180px]"
        style={{ background: !imageUrl ? vis.gradient : undefined }}
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <>
            <div aria-hidden="true" className="absolute inset-0 opacity-40"
              style={{ backgroundImage: DOT_BG, backgroundSize: '22px 22px' }} />
            <div aria-hidden="true" className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 40% 50%, ${vis.glow} 0%, transparent 70%)` }} />
            <Icon className="relative w-16 h-16 text-white/20 group-hover:text-white/30 transition-colors duration-300" strokeWidth={1} />
          </>
        )}
        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/60 border border-white/20 rounded-full px-2.5 py-1 backdrop-blur-md shadow-sm">
          Featured
        </span>
      </div>
      <div className="flex flex-col justify-between p-7 sm:p-8 flex-1 min-w-0">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${vis.pill}`}>
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-brand-200 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>
        <div className="pt-6 flex items-center gap-2 text-sm font-semibold text-brand-400 group-hover:text-brand-300 transition-colors">
          <span>Read complete guide</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE CARD
// ─────────────────────────────────────────────────────────────────────────────
function ArticleCard({ article }) {
  const vis = getVisual(article.category);
  const Icon = vis.icon;
  const imageUrl = getBlogImageUrl(article.featured_image);

  return (
    <Link
      to={`/birthday-ideas/${article.slug}`}
      id={`blog-card-${article.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-slate-800 hover:border-brand-500/35 bg-[#11141e] transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.7)] hover:-translate-y-1"
    >
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden bg-slate-900"
        style={{ background: !imageUrl ? vis.gradient : undefined }}
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <>
            <div aria-hidden="true" className="absolute inset-0 opacity-35"
              style={{ backgroundImage: DOT_BG, backgroundSize: '20px 20px' }} />
            <div aria-hidden="true" className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 60% 40%, ${vis.glow} 0%, transparent 65%)` }} />
            <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <Icon className="relative w-12 h-12 text-white/18 group-hover:text-white/28 transition-colors duration-300" strokeWidth={1} />
          </>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${vis.pill}`}>
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-600 flex-shrink-0">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>
        <h2 className="text-[15px] font-bold text-white group-hover:text-brand-200 transition-colors leading-snug line-clamp-2">
          {article.title}
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>
        <div className="pt-3 mt-auto border-t border-slate-800/60 flex items-center justify-between">
          <span className={`text-[11px] font-semibold transition-colors ${vis.arrowColor}`}>Read guide</span>
          <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-all duration-200 ${vis.arrowColor}`} />
        </div>
      </div>
    </Link>
  );
}

export default BirthdayIdeasHubPage;