import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  Sparkles, BookOpen, Clock, ArrowRight,
  Search, X, Loader2, Dog, Filter, CheckCircle2,
  Calendar, Award, Heart, HelpCircle, ShieldAlert
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { blogService } from '../services/blogService';
import { getBlogImageUrl } from './BirthdayIdeasHubPage';
import {
  PUPPY_TRAINING_CATEGORY,
  PUPPY_TRAINING_SUBCATS_BY_SLUG,
  SUBCAT_NAME_TO_SLUG,
  SUBCAT_SLUG_TO_NAME
} from '../data/categoryConfig';

// Fallback sample posts for Puppy Training if DB is empty on first launch
const SAMPLE_PUPPY_POSTS = [
  {
    slug: 'belgian-malinois-puppy-training-guide',
    title: 'Belgian Malinois Puppy Training Guide: Focus, Drive & Early Discipline',
    excerpt: 'Step-by-step socialization, crate routines, and bite-inhibition strategies for high-drive Belgian Malinois puppies in their first 6 months.',
    category: 'Puppy Training',
    subcategory: 'Breed Training Guides',
    featured_image: '',
    readTime: '6 min read',
    _fromSupabase: false,
  },
  {
    slug: 'stop-puppy-biting-nipping-fast',
    title: 'How to Stop Puppy Biting & Nipping Fast: Proven Redirection Methods',
    excerpt: 'Tired of needle-sharp puppy teeth? Discover humane, scientifically backed redirection techniques to stop puppy biting within 14 days.',
    category: 'Puppy Training',
    subcategory: 'Behavior & Problem Solving',
    featured_image: '',
    readTime: '5 min read',
    _fromSupabase: false,
  },
  {
    slug: '4-month-puppy-crate-potty-schedule',
    title: 'The Ultimate 4-Month Puppy Schedule: Crate, Potty & Sleep Routines',
    excerpt: 'A realistic, hour-by-hour daily timetable for 16-week-old puppies covering feeding times, nap cycles, and stress-free potty training.',
    category: 'Puppy Training',
    subcategory: 'Schedules & Potty/Crate Training',
    featured_image: '',
    readTime: '7 min read',
    _fromSupabase: false,
  },
  {
    slug: 'french-bulldog-puppy-potty-training',
    title: 'French Bulldog Puppy Training: Overcoming Stubborn Potty Habits',
    excerpt: 'Gentle, positive reinforcement tactics tailored for Frenchies to establish strong potty habits and prevent separation anxiety.',
    category: 'Puppy Training',
    subcategory: 'Breed Training Guides',
    featured_image: '',
    readTime: '5 min read',
    _fromSupabase: false,
  },
  {
    slug: 'puppy-excited-peeing-submissive-urination',
    title: 'How to Handle Puppy Excited Peeing & Submissive Urination Calmly',
    excerpt: 'Understand why young puppies leak when greeting guests or hearing greetings, and how calm management resolves the behavior naturally.',
    category: 'Puppy Training',
    subcategory: 'Behavior & Problem Solving',
    featured_image: '',
    readTime: '4 min read',
    _fromSupabase: false,
  },
  {
    slug: 'puppy-crate-training-first-night-routine',
    title: 'Puppy Crate Training: The Stress-Free First Night & Daily Blueprint',
    excerpt: 'Step-by-step guidance to ensure your puppy sleeps through the night in their crate without crying or anxiety.',
    category: 'Puppy Training',
    subcategory: 'Schedules & Potty/Crate Training',
    featured_image: '',
    readTime: '6 min read',
    _fromSupabase: false,
  }
];

function mapSupabasePost(post) {
  return {
    slug:           post.slug,
    title:          post.title,
    excerpt:        post.excerpt || '',
    category:       post.category || 'Puppy Training',
    subcategory:    post.subcategory || '',
    featured_image: post.featured_image || '',
    readTime: post.content && Array.isArray(post.content)
      ? `${Math.max(1, Math.ceil(post.content.reduce((acc, s) => acc + (s.body?.length || 0), 0) / 1000))} min read`
      : '5 min read',
    _fromSupabase: true,
  };
}

export const PuppyTrainingHubPage = () => {
  const { subcategorySlug, param } = useParams();
  // 'param' comes from the resolver route (/puppy-training/:param), 'subcategorySlug' from direct route
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState(SAMPLE_PUPPY_POSTS);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Active subcategory derived from either route parameter or search query
  const activeSubcategorySlug = subcategorySlug || param || searchParams.get('sub') || '';
  const activeSubcategory = activeSubcategorySlug ? PUPPY_TRAINING_SUBCATS_BY_SLUG[activeSubcategorySlug] : null;
  const activeSubcategoryName = activeSubcategory?.name || SUBCAT_SLUG_TO_NAME[activeSubcategorySlug] || '';

  // Fetch published posts from Supabase for "Puppy Training" category
  useEffect(() => {
    let cancelled = false;
    setFetchLoading(true);

    blogService.getPublishedPosts('puppy-training')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(mapSupabasePost);
          setArticles(mapped);
        } else {
          // If no posts yet in Supabase for puppy-training, retain sample fallback
          setArticles(SAMPLE_PUPPY_POSTS);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch puppy training posts:', err);
        setArticles(SAMPLE_PUPPY_POSTS);
      })
      .finally(() => {
        if (!cancelled) setFetchLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // Filter posts by search and selected subcategory
  const filtered = useMemo(() => {
    return articles.filter(a => {
      // Subcategory filter
      if (activeSubcategoryName && a.subcategory) {
        if (a.subcategory.toLowerCase() !== activeSubcategoryName.toLowerCase()) {
          return false;
        }
      }

      // Search query filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesExcerpt = a.excerpt.toLowerCase().includes(q);
        const matchesSubcat = (a.subcategory || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesExcerpt && !matchesSubcat) return false;
      }

      return true;
    });
  }, [articles, activeSubcategoryName, search]);

  const [featured, ...rest] = filtered;
  const showSearch = search.trim().length > 0;

  // SEO metadata calculation
  const pageTitle = activeSubcategory
    ? `${activeSubcategory.name} - Puppy Training Guides | AuraWish`
    : 'Puppy Training - Guides, Schedules & Breed Solutions | AuraWish';

  const pageDescription = activeSubcategory
    ? activeSubcategory.description
    : PUPPY_TRAINING_CATEGORY.description;

  const canonicalUrl = activeSubcategory
    ? activeSubcategory.route
    : '/puppy-training';

  // Structured Data (CollectionPage / ItemList)
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": `https://birthdaywishly.com${canonicalUrl}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": filtered.slice(0, 10).map((post, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": post.title,
        "url": `https://birthdaywishly.com/puppy-training/${post.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-[#090B10]">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        schemaJson={collectionSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <Breadcrumbs
          items={[
            { label: 'Puppy Training', href: '/puppy-training' },
            ...(activeSubcategory ? [{ label: activeSubcategory.name, href: activeSubcategory.route }] : [])
          ]}
        />

        {/* ── HERO HEADER ─────────────────────────────────────────── */}
        <div className="relative text-center max-w-3xl mx-auto mt-6 mb-12 space-y-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-[220px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #10b981 0%, #059669 50%, transparent 100%)' }}
          />

          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold tracking-wide">
            <Dog className="w-3.5 h-3.5 text-emerald-400" />
            Puppy Training Hub
          </div>

          <h1 className="relative text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            {activeSubcategory ? (
              <>
                {activeSubcategory.name}
              </>
            ) : (
              <>
                Puppy Training{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Guides &amp; Schedules
                </span>
              </>
            )}
          </h1>

          <p className="relative text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {pageDescription}
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              id="puppy-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search puppy guides (e.g. biting, French Bulldog, crate)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#11141e] border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 transition-all"
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
        </div>

        {/* ── SUB-CATEGORY FILTER BAR ──────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filter by Training Area</span>
            </div>
            {activeSubcategory && (
              <Link
                to="/puppy-training"
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                Show All Topics
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              to="/puppy-training"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border shrink-0 ${
                !activeSubcategorySlug
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-[#11141e] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              All Puppy Topics
            </Link>

            {PUPPY_TRAINING_CATEGORY.subcategories.map(sub => {
              const isActive = activeSubcategorySlug === sub.slug;
              return (
                <Link
                  key={sub.slug}
                  to={sub.route}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-[#11141e] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{sub.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── LOADING SKELETON ─────────────────────────────────────── */}
        {fetchLoading && articles.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl bg-[#11141e] border border-slate-800 overflow-hidden animate-pulse">
                <div className="h-40 bg-slate-800/50" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-800 rounded w-1/3" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── RESULTS ──────────────────────────────────────────────── */}
        {!fetchLoading && (
          filtered.length === 0 ? (
            <div className="text-center py-20 space-y-4 rounded-2xl bg-[#11141e]/50 border border-slate-800/80">
              <Dog className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-semibold">No guides found</p>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                No puppy training articles found for your current search or sub-category filter.
              </p>
              <Link
                to="/puppy-training"
                onClick={() => setSearch('')}
                className="inline-block text-emerald-400 text-xs hover:text-emerald-300 font-medium underline underline-offset-4"
              >
                Clear filters and view all puppy guides
              </Link>
            </div>
          ) : (
            <>
              {/* Featured article */}
              {!showSearch && !activeSubcategorySlug && featured && (
                <div className="mb-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Featured Puppy Guide
                  </p>
                  <PuppyFeaturedCard article={featured} />
                </div>
              )}

              {/* Grid of articles */}
              <div>
                {!showSearch && !activeSubcategorySlug && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-5">
                    All Training Guides ({filtered.length})
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(showSearch || activeSubcategorySlug ? filtered : rest).map((article) => (
                    <PuppyArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            </>
          )
        )}

        {/* ── CTA BANNER ───────────────────────────────────────────── */}
        <div className="mt-16 relative overflow-hidden rounded-3xl border border-emerald-500/20 text-center p-8 sm:p-12 bg-gradient-to-br from-emerald-950/30 via-[#11141e] to-teal-950/20">
          <div aria-hidden="true" className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
          <div className="relative space-y-4 max-w-xl mx-auto">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-400">
              <Dog className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Consistent Training Builds Lifelong Companionship
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore our structured breed-specific workflows, 4-month schedules, and potty training routines to raise a confident, well-adjusted dog.
            </p>
            <div className="pt-2">
              <Link to="/puppy-training">
                <Button variant="primary" size="md" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  Browse All Guides
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
function PuppyFeaturedCard({ article }) {
  const imageUrl = getBlogImageUrl(article.featured_image);

  return (
    <Link
      to={`/puppy-training/${article.slug}`}
      id={`puppy-featured-${article.slug}`}
      className="group flex flex-col sm:flex-row rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_40px_-8px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 bg-[#11141e]"
    >
      <div
        className="relative flex-shrink-0 sm:w-80 h-56 sm:h-auto flex items-center justify-center overflow-hidden bg-slate-900"
        style={{ background: !imageUrl ? 'linear-gradient(135deg, rgba(16,185,129,0.4) 0%, rgba(17,20,30,0.95) 100%)' : undefined }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <Dog className="w-20 h-20 text-emerald-400/25 group-hover:text-emerald-400/40 transition-colors" />
        )}
        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-white bg-black/60 border border-white/20 rounded-full px-2.5 py-1 backdrop-blur-md">
          Featured
        </span>
      </div>
      <div className="flex flex-col justify-between p-7 sm:p-8 flex-1 min-w-0">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-semibold bg-emerald-500/15 border-emerald-500/30 text-emerald-300">
              {article.subcategory || 'Puppy Training'}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-200 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>
        <div className="pt-6 flex items-center gap-2 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
          <span>Read complete guide</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REGULAR ARTICLE CARD
// ─────────────────────────────────────────────────────────────────────────────
function PuppyArticleCard({ article }) {
  const imageUrl = getBlogImageUrl(article.featured_image);

  return (
    <Link
      to={`/puppy-training/${article.slug}`}
      id={`puppy-card-${article.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/35 bg-[#11141e] transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.7)] hover:-translate-y-1"
    >
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden bg-slate-900"
        style={{ background: !imageUrl ? 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(17,20,30,0.95) 100%)' : undefined }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <Dog className="w-12 h-12 text-emerald-400/25 group-hover:text-emerald-400/40 transition-colors" />
        )}
      </div>
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-semibold bg-emerald-500/15 border-emerald-500/30 text-emerald-300 truncate max-w-[170px]">
            {article.subcategory || 'Puppy Training'}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-600 flex-shrink-0">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>
        <h2 className="text-[15px] font-bold text-white group-hover:text-emerald-200 transition-colors leading-snug line-clamp-2">
          {article.title}
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>
        <div className="pt-3 mt-auto border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            Read guide
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>
    </Link>
  );
}

export default PuppyTrainingHubPage;
