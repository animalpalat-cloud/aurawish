import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Sparkles, Clock, ArrowRight, ArrowLeft, Search, X, Loader2,
  FolderTree, Tag, ChevronLeft, ChevronRight, BookOpen, Layers
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { blogService } from '../services/blogService';
import { SUPABASE_URL } from '../supabase/client';
import {
  getCategoryVisual,
  FALLBACK_CATEGORIES,
  slugifyCategory
} from '../data/categoryConfig';
import { BIRTHDAY_IDEAS } from '../data/birthdayIdeasData';

const POSTS_PER_PAGE = 9;

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

export const CategoryLandingPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Filters & Pagination
  const [selectedSubtopic, setSelectedSubtopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setSelectedSubtopic('all');
    setSearchQuery('');
    setCurrentPage(1);

    async function loadCategoryAndPosts() {
      try {
        // 1. Fetch category info and all categories
        const [catRes, allCatsRes, postsRes] = await Promise.all([
          blogService.getCategoryBySlug(slug),
          blogService.getCategoriesSimple(),
          blogService.getPublishedPosts(slug),
        ]);

        if (cancelled) return;

        let foundCat = catRes.data;
        if (!foundCat) {
          // Fallback search in fallback categories
          foundCat = FALLBACK_CATEGORIES.find(
            c => c.slug === slug || slugifyCategory(c.name) === slug
          );
        }

        if (!foundCat) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setCategory(foundCat);

        // Store other categories for "Explore other categories" strip
        const otherCats = (allCatsRes.data || FALLBACK_CATEGORIES).filter(
          c => c.slug !== foundCat.slug && c.name?.toLowerCase() !== foundCat.name?.toLowerCase()
        );
        setAllCategories(otherCats);

        // 2. Process posts
        let categoryPosts = [];
        if (postsRes.data && postsRes.data.length > 0) {
          categoryPosts = postsRes.data.map(mapSupabasePost);
        } else {
          // Fallback to hardcoded posts if match
          const hardcodedMatches = BIRTHDAY_IDEAS.filter(
            a => a.category?.toLowerCase() === foundCat.name?.toLowerCase() ||
                 slugifyCategory(a.category) === foundCat.slug
          ).map(a => ({
            ...a,
            category_id: foundCat.id,
            subcategory: '',
            published_at: '',
          }));
          categoryPosts = hardcodedMatches;
        }

        setPosts(categoryPosts);
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading category page:', err);
          // Check fallback categories
          const fb = FALLBACK_CATEGORIES.find(
            c => c.slug === slug || slugifyCategory(c.name) === slug
          );
          if (fb) {
            setCategory(fb);
            const hardcoded = BIRTHDAY_IDEAS.filter(
              a => a.category?.toLowerCase() === fb.name?.toLowerCase()
            );
            setPosts(hardcoded);
          } else {
            setNotFound(true);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategoryAndPosts();
    return () => { cancelled = true; };
  }, [slug]);

  // Filter posts by search query and subtopic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.subcategory && post.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubtopic = selectedSubtopic === 'all' ||
        (post.subcategory && post.subcategory.toLowerCase() === selectedSubtopic.toLowerCase()) ||
        post.title.toLowerCase().includes(selectedSubtopic.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(selectedSubtopic.toLowerCase());

      return matchesSearch && matchesSubtopic;
    });
  }, [posts, searchQuery, selectedSubtopic]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-9 h-9 animate-spin text-brand-500" />
          <p className="text-xs text-slate-400 font-medium tracking-wide">Loading category guides…</p>
        </div>
      </div>
    );
  }

  if (notFound || !category) {
    return <Navigate to="/blog" replace />;
  }

  const vis = getCategoryVisual(category.name || category.slug);
  const Icon = vis.icon;
  const canonicalUrl = `/category/${category.slug}`;

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${category.name} - Blog & Editorial Guides`,
    'description': category.description || `Guides, articles, and ideas in ${category.name}.`,
    'url': `https://www.birthdaywishly.com${canonicalUrl}`,
    'publisher': {
      '@type': 'Organization',
      'name': 'Birthday Wishes',
      'logo': { '@type': 'ImageObject', 'url': 'https://www.birthdaywishly.com/logo.png' }
    }
  };

  const subtopics = Array.isArray(category.subtopics) ? category.subtopics : [];

  return (
    <div className="min-h-screen bg-[#090B10] w-full overflow-x-hidden">
      <SEOHead
        title={`${category.name} - Expert Guides & Ideas | Birthday Wishes`}
        description={category.description || `Explore curated editorial articles, tips, and practical guides in ${category.name}.`}
        canonicalUrl={canonicalUrl}
        schemaJson={categorySchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        {/* Breadcrumbs: Home -> Blog -> Category Name */}
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: category.name, href: canonicalUrl },
          ]}
        />

        {/* ── HERO BANNER ────────────────────────────────────────── */}
        <div className="relative text-center max-w-4xl mx-auto mt-8 mb-14 space-y-5">
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[240px] rounded-full opacity-25 blur-3xl"
            style={{ background: `radial-gradient(ellipse, ${vis.accentColor || '#d946ef'} 0%, #7c3aed 50%, transparent 80%)` }}
          />

          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderColor: 'rgba(255,255,255,0.12)',
              color: vis.accentColor || '#fbcfe8'
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>Category Hub</span>
          </div>

          <h1 className="relative text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            {category.name}
          </h1>

          <p className="relative text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {category.description || `Comprehensive guides, practical advice, and editorial inspiration for ${category.name}.`}
          </p>

          {/* Stats Bar */}
          <div className="relative flex items-center justify-center gap-6 sm:gap-10 pt-2 flex-wrap">
            <div className="text-center">
              <p className="text-xl font-bold text-white">{posts.length}</p>
              <p className="text-[11px] text-slate-500 tracking-wide">
                {posts.length === 1 ? 'Published Guide' : 'Published Guides'}
              </p>
            </div>
            {subtopics.length > 0 && (
              <>
                <div className="w-px h-7 bg-slate-800" aria-hidden="true" />
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{subtopics.length}</p>
                  <p className="text-[11px] text-slate-500 tracking-wide">Featured Subtopics</p>
                </div>
              </>
            )}
            <div className="w-px h-7 bg-slate-800" aria-hidden="true" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">~{Math.max(5, posts.length * 4)} min</p>
              <p className="text-[11px] text-slate-500 tracking-wide">Reading Time</p>
            </div>
          </div>
        </div>

        {/* ── FILTER & SEARCH TOOLBAR ────────────────────────────── */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* In-category Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="category-search"
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Search within ${category.name}…`}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#11141e] border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/70 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Back to all categories link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors self-start md:self-center font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </Link>
          </div>

          {/* Subtopic / Tag Pills */}
          {subtopics.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider pr-1 flex-shrink-0">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Topics:</span>
              </div>
              <button
                onClick={() => {
                  setSelectedSubtopic('all');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                  selectedSubtopic === 'all'
                    ? 'bg-brand-500 text-white font-semibold shadow-sm shadow-brand-500/30'
                    : 'bg-[#11141e] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                All Topics ({posts.length})
              </button>
              {subtopics.map(sub => (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubtopic(sub);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                    selectedSubtopic.toLowerCase() === sub.toLowerCase()
                      ? 'bg-brand-500 text-white font-semibold shadow-sm shadow-brand-500/30'
                      : 'bg-[#11141e] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── ARTICLES GRID ───────────────────────────────────────── */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-4 my-10 bg-[#11141e]/50">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Search className="w-7 h-7" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">No guides found</p>
              <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                {searchQuery || selectedSubtopic !== 'all'
                  ? 'No articles match your active filter. Try resetting search or selecting all topics.'
                  : `Articles for "${category.name}" are being prepared. Check back shortly!`}
              </p>
            </div>
            {(searchQuery || selectedSubtopic !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubtopic('all');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedPosts.map((article, idx) => (
                <CategoryArticleCard
                  key={article.slug || article.id || idx}
                  article={article}
                  categoryVisual={vis}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl bg-[#11141e] border border-slate-800 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                          : 'bg-[#11141e] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl bg-[#11141e] border border-slate-800 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── EXPLORE OTHER CATEGORIES ────────────────────────────── */}
        {allCategories.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-800/80">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Explore Other Categories
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Discover more curated editorial hubs across our collection
                </p>
              </div>
              <Link
                to="/blog"
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allCategories.slice(0, 4).map(otherCat => {
                const otherVis = getCategoryVisual(otherCat.name || otherCat.slug);
                const OtherIcon = otherVis.icon;
                return (
                  <Link
                    key={otherCat.id || otherCat.slug}
                    to={`/category/${otherCat.slug}`}
                    className="group bg-[#11141e] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          color: otherVis.accentColor || '#ffffff',
                        }}
                      >
                        <OtherIcon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-brand-200 transition-colors line-clamp-1">
                        {otherCat.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {otherCat.description || 'Explore expert guides and celebration ideas.'}
                      </p>
                    </div>
                    <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-brand-300">
                      <span>Explore category</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CTA BANNER ─────────────────────────────────────────── */}
        <div className="mt-20 relative overflow-hidden rounded-3xl border border-brand-500/20 text-center p-10 sm:p-14">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(113,29,138,0.28) 0%, rgba(17,20,30,1) 50%, rgba(120,80,10,0.18) 100%)',
            }}
          />
          <div className="relative space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Bring Your Ideas to Life With an Interactive Birthday Card
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Explore luxury card templates, customize custom soundtracks, and deliver an unforgettable digital unboxing experience.
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

// ── Article Card Component ─────────────────────────────────────────────────
function CategoryArticleCard({ article, categoryVisual }) {
  const isPuppy = article.category === 'Puppy Training' || article.category === 'puppy-training';
  const postUrl = isPuppy
    ? `/puppy-training/${article.slug}`
    : `/birthday-ideas/${article.slug}`;

  const imageUrl = getBlogImageUrl(article.featured_image);
  const Icon = categoryVisual.icon;

  return (
    <Link
      to={postUrl}
      id={`cat-card-${article.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-slate-800 hover:border-brand-500/40 bg-[#11141e] transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.7)] hover:-translate-y-1"
    >
      {/* Featured Image or Gradient Fallback */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden bg-slate-900"
        style={{ background: !imageUrl ? categoryVisual.gradient : undefined }}
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
            />
          </>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 60% 40%, ${categoryVisual.glow} 0%, transparent 65%)`,
              }}
            />
            <Icon
              className="relative w-12 h-12 text-white/20 group-hover:text-white/30 transition-colors duration-300"
              strokeWidth={1.2}
            />
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${categoryVisual.pill}`}>
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

        <h3 className="text-[15px] font-bold text-white group-hover:text-brand-200 transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        <div className="pt-3 mt-auto border-t border-slate-800/60 flex items-center justify-between">
          <span className={`text-[11px] font-semibold transition-colors ${categoryVisual.arrowColor}`}>
            Read guide
          </span>
          <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-all duration-200 ${categoryVisual.arrowColor}`} />
        </div>
      </div>
    </Link>
  );
}

export default CategoryLandingPage;
