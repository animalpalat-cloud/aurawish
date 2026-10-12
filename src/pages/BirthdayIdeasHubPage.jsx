import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb, BookOpen, Sparkles, Clock, ArrowRight,
  Search, X, Loader2, FolderTree, Tag, ChevronRight, Layers
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { BIRTHDAY_IDEAS } from '../data/birthdayIdeasData';
import { blogService } from '../services/blogService';
import { SUPABASE_URL } from '../supabase/client';
import {
  getCategoryVisual,
  FALLBACK_CATEGORIES,
  slugifyCategory
} from '../data/categoryConfig';

const DOT_BG = 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)';

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

// Map a Supabase blog_posts row to the shape card components expect
function mapSupabasePost(post) {
  return {
    id:             post.id,
    slug:           post.slug,
    title:          post.title,
    excerpt:        post.excerpt || '',
    category:       post.category || 'General',
    category_id:    post.category_id || null,
    subcategory:    post.subcategory || '',
    featured_image: post.featured_image || '',
    published_at:   post.published_at || '',
    readTime: post.content && Array.isArray(post.content)
      ? `${Math.max(1, Math.ceil(post.content.reduce((acc, s) => acc + (s.body?.length || 0), 0) / 1000))} min read`
      : '3 min read',
    _fromSupabase: true,
  };
}

export const BirthdayIdeasHubPage = () => {
  const [search, setSearch] = useState('');
  // Independent states so Main Categories and Editorial Guides display immediately
  const [categories, setCategories] = useState(() => FALLBACK_CATEGORIES);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [articles, setArticles] = useState(() => BIRTHDAY_IDEAS.map(a => ({ ...a, _fromSupabase: false })));
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  // 1. Fetch categories independently
  useEffect(() => {
    let cancelled = false;
    blogService.getCategoriesSimple()
      .then((catsRes) => {
        if (cancelled) return;
        let fetchedCats = catsRes.data || [];
        if (fetchedCats.length > 0) {
          setCategories(fetchedCats);
        }
      })
      .catch((err) => {
        console.warn('Error fetching categories:', err);
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // 2. Fetch published articles independently
  useEffect(() => {
    let cancelled = false;
    blogService.getPublishedPosts()
      .then((postsRes) => {
        if (cancelled) return;
        if (postsRes.data && postsRes.data.length > 0) {
          setArticles(postsRes.data.map(mapSupabasePost));
        }
      })
      .catch((err) => {
        console.warn('Error fetching articles:', err);
      })
      .finally(() => {
        if (!cancelled) setArticlesLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const fetchLoading = categoriesLoading && articlesLoading;

  // Filtered by text search
  const filteredArticles = useMemo(() => {
    if (!search.trim()) return articles;
    const q = search.toLowerCase();
    return articles.filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q) ||
      (a.subcategory && a.subcategory.toLowerCase().includes(q))
    );
  }, [articles, search]);

  // Group articles by category
  const categoryGroups = useMemo(() => {
    if (categories.length === 0 || articles.length === 0) return [];

    const groups = [];
    const assignedPostIds = new Set();

    categories.forEach(cat => {
      const catNameNorm = cat.name?.toLowerCase().trim();
      const catSlugNorm = cat.slug?.toLowerCase().trim();

      const matchingPosts = articles.filter(post => {
        if (post.category_id && post.category_id === cat.id) return true;
        const postCatNorm = post.category?.toLowerCase().trim();
        return postCatNorm === catNameNorm || postCatNorm === catSlugNorm;
      });

      if (matchingPosts.length > 0) {
        matchingPosts.forEach(p => assignedPostIds.add(p.slug || p.id));
        groups.push({
          category: cat,
          posts: matchingPosts,
        });
      }
    });

    // Unassigned posts fallback group if any exist
    const unassigned = articles.filter(p => !assignedPostIds.has(p.slug || p.id));
    if (unassigned.length > 0) {
      groups.push({
        category: {
          id: 'general-editorial',
          name: 'General Editorial & Celebration Guides',
          slug: 'birthday-ideas',
          description: 'Timeless advice, emotional frameworks, and creative greeting ideas for memorable celebrations.',
          subtopics: ['Celebrations', 'Writing Advice', 'Greeting Tips'],
        },
        posts: unassigned,
      });
    }

    return groups;
  }, [categories, articles]);

  const showSearch = search.trim().length > 0;
  const [featuredPost] = articles;

  // Filtered category groups if user clicked a quick filter pill
  const displayedGroups = useMemo(() => {
    if (activeCategoryFilter === 'all') return categoryGroups;
    return categoryGroups.filter(g => g.category.slug === activeCategoryFilter);
  }, [categoryGroups, activeCategoryFilter]);

  return (
    <div className="min-h-screen bg-[#090B10] w-full overflow-x-hidden">
      <SEOHead
        title="Birthday Ideas & Editorial Guides - Message Inspiration, Surprises & Care | Birthday Wishes"
        description="Explore curated editorial guides on how to write meaningful birthday cards, creative surprise ideas, digital card tips, audio greetings, and etiquette."
        canonicalUrl="/blog"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }]} />

        {/* ── HERO HEADER ─────────────────────────────────────────── */}
        <div className="relative text-center max-w-3xl mx-auto mt-8 mb-12 space-y-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-[220px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #d946ef 0%, #7c3aed 60%, transparent 100%)' }}
          />

          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold tracking-wide">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Celebration Editorial &amp; Guides</span>
          </div>

          <h1 className="relative text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            Birthday Message{' '}
            <span className="text-gold-foil">Inspiration</span> &amp; Guides
          </h1>

          <p className="relative text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Practical advice, audio card guides, pet care insights, and step-by-step
            writing frameworks organized by category to help you craft heartfelt moments.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto pt-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              id="blog-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search across all categories (e.g. audio, dog, writing, card)..."
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
            <div className="relative flex items-center justify-center gap-8 sm:gap-12 pt-2">
              <div className="text-center">
                <p className="text-xl font-bold text-white">
                  {articlesLoading ? <Loader2 className="w-5 h-5 animate-spin inline text-slate-500" /> : articles.length}
                </p>
                <p className="text-[11px] text-slate-500 tracking-wide">Editorial Guides</p>
              </div>
              <div className="w-px h-8 bg-slate-800" aria-hidden="true" />
              <div className="text-center">
                <p className="text-xl font-bold text-white">
                  {categoriesLoading ? <Loader2 className="w-5 h-5 animate-spin inline text-slate-500" /> : categoryGroups.length}
                </p>
                <p className="text-[11px] text-slate-500 tracking-wide">Main Categories</p>
              </div>
              <div className="w-px h-8 bg-slate-800" aria-hidden="true" />
              <div className="text-center">
                <p className="text-xl font-bold text-white">~{Math.max(15, articles.length * 3)} min</p>
                <p className="text-[11px] text-slate-500 tracking-wide">Combined Reading</p>
              </div>
            </div>
          )}
        </div>

        {/* ── QUICK CATEGORY JUMP / FILTER BAR ────────────────────── */}
        {!showSearch && categoryGroups.length > 0 && (
          <div className="mb-14 overflow-x-auto pb-2 scrollbar-thin">
            <div className="flex items-center gap-2 justify-start sm:justify-center min-w-max px-2">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeCategoryFilter === 'all'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                    : 'bg-[#11141e] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Categories ({articles.length})</span>
              </button>

              {categoryGroups.map(({ category: cat, posts: catPosts }) => {
                const vis = getCategoryVisual(cat.name || cat.slug);
                const Icon = vis.icon;
                const isActive = activeCategoryFilter === cat.slug;
                return (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => setActiveCategoryFilter(isActive ? 'all' : cat.slug)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/25'
                        : 'bg-[#11141e] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-slate-300">
                      {catPosts.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LOADING SKELETON ─────────────────────────────────────── */}
        {fetchLoading && (
          <div className="space-y-12">
            {[1, 2].map(block => (
              <div key={block} className="space-y-4">
                <div className="h-8 bg-slate-800/40 rounded-xl w-64 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl bg-[#11141e] border border-slate-800 overflow-hidden animate-pulse">
                      <div className="h-44 bg-slate-800/50" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-slate-800 rounded w-1/3" />
                        <div className="h-4 bg-slate-800 rounded w-3/4" />
                        <div className="h-3 bg-slate-800 rounded" />
                        <div className="h-3 bg-slate-800 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SEARCH RESULTS VIEW ──────────────────────────────────── */}
        {!fetchLoading && showSearch && (
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Search Results for &ldquo;{search}&rdquo;
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Found {filteredArticles.length} matching {filteredArticles.length === 1 ? 'guide' : 'guides'}
                </p>
              </div>
              <button
                onClick={() => setSearch('')}
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium underline underline-offset-2"
              >
                Clear search
              </button>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-20 space-y-4 bg-[#11141e]/50 border border-slate-800/80 rounded-2xl p-10">
                <p className="text-4xl">🔍</p>
                <p className="text-slate-300 font-semibold">No guides match &ldquo;{search}&rdquo;</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching for general keywords like writing, surprise, audio, pet, or dog.
                </p>
                <button
                  onClick={() => setSearch('')}
                  className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-400 transition-colors"
                >
                  Clear search &amp; browse categories
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredArticles.map((article, idx) => (
                  <ArticleCard key={article.slug || idx} article={article} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── DYNAMIC CATEGORY BLOCKS ──────────────────────────────── */}
        {!fetchLoading && !showSearch && (
          <div className="space-y-16">
            {/* Top Featured Guide Banner (if all categories active) */}
            {activeCategoryFilter === 'all' && featuredPost && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                  Editor&apos;s Highlight
                </p>
                <FeaturedCard article={featuredPost} />
              </div>
            )}

            {/* Render a dedicated block for each Main Category */}
            {displayedGroups.map(({ category: cat, posts: catPosts }) => {
              const vis = getCategoryVisual(cat.name || cat.slug);
              const Icon = vis.icon;
              const categoryUrl = `/category/${cat.slug}`;
              const subtopics = Array.isArray(cat.subtopics) ? cat.subtopics : [];

              return (
                <section
                  key={cat.id || cat.slug}
                  id={`category-${cat.slug}`}
                  className="space-y-6 pt-4 border-t border-slate-800/80 first:border-t-0"
                >
                  {/* Category Block Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            color: vis.accentColor || '#ffffff',
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <Link
                              to={categoryUrl}
                              className="text-xl sm:text-2xl font-bold text-white hover:text-brand-300 transition-colors tracking-tight flex items-center gap-2 group"
                            >
                              <span>{cat.name}</span>
                              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                            </Link>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${vis.pill}`}>
                              {catPosts.length} {catPosts.length === 1 ? 'guide' : 'guides'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Category Description */}
                      {cat.description && (
                        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                          {cat.description}
                        </p>
                      )}

                      {/* Subtopics Preview */}
                      {subtopics.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Topics:
                          </span>
                          {subtopics.slice(0, 4).map(st => (
                            <span
                              key={st}
                              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-medium"
                            >
                              {st}
                            </span>
                          ))}
                          {subtopics.length > 4 && (
                            <span className="text-[10px] text-slate-500">
                              +{subtopics.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Dedicated "View All" Button leading to Category Landing Page */}
                    <div className="flex-shrink-0">
                      <Link
                        to={categoryUrl}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 border border-slate-700 hover:border-brand-500/50 hover:bg-slate-800 transition-all shadow-sm group"
                      >
                        <span>View All {cat.name} Guides</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Under each Main Category block, display only the blog posts that belong to that specific category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {catPosts.slice(0, 3).map((article) => (
                      <ArticleCard
                        key={article.slug}
                        article={article}
                        categoryVisual={vis}
                      />
                    ))}

                    {/* Extra "View All" Card if more than 3 posts */}
                    {catPosts.length > 3 && (
                      <Link
                        to={categoryUrl}
                        className="group flex flex-col justify-center items-center text-center p-8 rounded-2xl border border-dashed border-slate-800 hover:border-brand-500/40 bg-[#11141e]/40 hover:bg-[#11141e] transition-all duration-300 min-h-[280px]"
                      >
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            color: vis.accentColor || '#ffffff',
                          }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                          +{catPosts.length - 3} More {cat.name} Guides
                        </h3>
                        <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                          Discover all in-depth articles, schedules, and tips in this category.
                        </p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 group-hover:text-brand-300">
                          <span>Browse all {catPosts.length} articles</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* ── CTA BANNER ───────────────────────────────────────────── */}
        <div className="mt-20 relative overflow-hidden rounded-3xl border border-brand-500/20 text-center p-10 sm:p-14">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(113,29,138,0.28) 0%, rgba(17,20,30,1) 50%, rgba(120,80,10,0.18) 100%)',
            }}
          />
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
  const vis = getCategoryVisual(article.category);
  const Icon = vis.icon;
  const imageUrl = getBlogImageUrl(article.featured_image);
  const isPuppy = article.category === 'Puppy Training' || article.category === 'puppy-training';
  const postUrl = isPuppy ? `/puppy-training/${article.slug}` : `/birthday-ideas/${article.slug}`;

  return (
    <Link
      to={postUrl}
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
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-40"
              style={{ backgroundImage: DOT_BG, backgroundSize: '22px 22px' }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 40% 50%, ${vis.glow} 0%, transparent 70%)` }}
            />
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
            {article.readTime && (
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            )}
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
function ArticleCard({ article, categoryVisual }) {
  const vis = categoryVisual || getCategoryVisual(article.category);
  const Icon = vis.icon;
  const imageUrl = getBlogImageUrl(article.featured_image);
  const isPuppy = article.category === 'Puppy Training' || article.category === 'puppy-training';
  const postUrl = isPuppy ? `/puppy-training/${article.slug}` : `/birthday-ideas/${article.slug}`;

  return (
    <Link
      to={postUrl}
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
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-35"
              style={{ backgroundImage: DOT_BG, backgroundSize: '20px 20px' }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 60% 40%, ${vis.glow} 0%, transparent 65%)` }}
            />
            <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <Icon className="relative w-12 h-12 text-white/18 group-hover:text-white/28 transition-colors duration-300" strokeWidth={1} />
          </>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${vis.pill}`}>
            {article.category}
          </span>
          {article.readTime && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500 flex-shrink-0">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          )}
        </div>
        {article.subcategory && (
          <span className="text-[10px] text-indigo-400 font-medium">
            {article.subcategory}
          </span>
        )}
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