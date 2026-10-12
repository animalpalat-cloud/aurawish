// ─────────────────────────────────────────────────────────────────────────────
// Blog Service
// Supabase CRUD for the blog_posts and blog_categories tables.
// Uses the anon key (read + admin writes).
// Admin writes are safe because the admin panel is protected by Firebase auth.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabaseClient } from '../supabase/lazyClient';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

import { PUPPY_TRAINING_CATEGORY, FALLBACK_CATEGORIES } from '../data/categoryConfig';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── Fast Cache with SessionStorage + Memory Fallback & In-Flight Request Deduplication ──
const memoryCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes fresh cache for public content
const STORAGE_PREFIX = 'bw_blog_cache_';

function getCached(key) {
  // 1. Try memory cache first
  const memItem = memoryCache.get(key);
  if (memItem) {
    if (Date.now() - memItem.time <= CACHE_TTL_MS) {
      return memItem.data;
    }
    memoryCache.delete(key);
  }

  // 2. Try sessionStorage to survive page refreshes & full reloads
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_PREFIX + key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.time <= CACHE_TTL_MS) {
          memoryCache.set(key, parsed);
          return parsed.data;
        }
        window.sessionStorage.removeItem(STORAGE_PREFIX + key);
      }
    } catch {
      // sessionStorage unavailable or quota exceeded
    }
  }

  return null;
}

function setCached(key, data) {
  const item = { data, time: Date.now() };
  memoryCache.set(key, item);

  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(item));
    } catch {
      // quota or private browsing mode
    }
  }
}

export function clearBlogCache() {
  memoryCache.clear();
  inFlightRequests.clear();
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const keysToRemove = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const k = window.sessionStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => window.sessionStorage.removeItem(k));
    } catch {}
  }
}

function sanitizeCategoryId(catId, catName) {
  if (catId && UUID_REGEX.test(catId)) return catId;
  if (catName && (catName.toLowerCase() === 'puppy training' || catName.toLowerCase() === 'puppy-training')) {
    return PUPPY_TRAINING_CATEGORY.id;
  }
  return null;
}

export const blogService = {
  // ── Categories CRUD ───────────────────────────────────────────────────────

  /**
   * Lightweight category fetch — only fetches the blog_categories table.
   * Used by the blog editor dropdown (no post-count subquery).
   */
  async getCategoriesSimple() {
    const cacheKey = 'cats_simple';
    const cached = getCached(cacheKey);
    if (cached) return { data: cached, error: null };

    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }

    const fetchPromise = (async () => {
      try {
        const { supabase, isSupabaseConfigured } = await getSupabaseClient();
        if (!supabase || !isSupabaseConfigured) {
          return { data: [PUPPY_TRAINING_CATEGORY], error: null };
        }

        const { data, error } = await supabase
          .from('blog_categories')
          .select('id, name, slug, description, subtopics')
          .order('name', { ascending: true });

        let cats = (data || []).map(cat => ({
          ...cat,
          subtopics: Array.isArray(cat.subtopics) ? cat.subtopics : [],
        }));

        // Ensure Puppy Training is available even if not yet created via Admin/SQL
        const hasPuppyTraining = cats.some(c => c.slug === PUPPY_TRAINING_CATEGORY.slug || c.name.toLowerCase() === PUPPY_TRAINING_CATEGORY.name.toLowerCase());
        if (!hasPuppyTraining) {
          cats = [...cats, PUPPY_TRAINING_CATEGORY];
        }

        if (!error) {
          setCached(cacheKey, cats);
        }

        return { data: cats, error };
      } finally {
        inFlightRequests.delete(cacheKey);
      }
    })();

    inFlightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  },

  /** Fetch all categories with associated blog post count */
  async getCategories() {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) {
      return { data: [{ ...PUPPY_TRAINING_CATEGORY, post_count: 0 }], error: null };
    }

    try {
      // 1. Fetch all categories
      const { data: categories, error: catError } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true });

      if (catError) throw catError;

      let allCats = categories || [];
      const hasPuppyTraining = allCats.some(c => c.slug === PUPPY_TRAINING_CATEGORY.slug || c.name.toLowerCase() === PUPPY_TRAINING_CATEGORY.name.toLowerCase());
      if (!hasPuppyTraining) {
        allCats = [...allCats, PUPPY_TRAINING_CATEGORY];
      }

      // 2. Fetch post counts grouped or calculate from posts
      const { data: posts, error: postError } = await supabase
        .from('blog_posts')
        .select('id, category_id, category, status');

      const counts = {};
      if (!postError && Array.isArray(posts)) {
        posts.forEach(p => {
          if (p.category_id) {
            counts[p.category_id] = (counts[p.category_id] || 0) + 1;
          } else if (p.category) {
            // Match by name fallback
            const matchingCat = allCats?.find(c => c.name.toLowerCase() === p.category.toLowerCase());
            if (matchingCat) {
              counts[matchingCat.id] = (counts[matchingCat.id] || 0) + 1;
            }
          }
        });
      }

      const categoriesWithCount = allCats.map(cat => ({
        ...cat,
        subtopics: Array.isArray(cat.subtopics) ? cat.subtopics : [],
        post_count: counts[cat.id] || 0,
      }));

      return { data: categoriesWithCount, error: null };
    } catch (err) {
      console.warn('Error fetching categories from Supabase:', err.message);
      return { data: [{ ...PUPPY_TRAINING_CATEGORY, post_count: 0 }], error: err };
    }
  },

  /** Fetch single category by ID */
  async getCategoryById(id) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data && !Array.isArray(data.subtopics)) {
      data.subtopics = [];
    }

    return { data, error };
  },

  /** Fetch single category by Slug */
  async getCategoryBySlug(slug) {
    if (!slug) return { data: null, error: null };
    const cacheKey = `cat_${slug}`;
    const cached = getCached(cacheKey);
    if (cached) return { data: cached, error: null };

    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) {
      const fb = FALLBACK_CATEGORIES.find(c => c.slug === slug || slugify(c.name) === slug);
      return { data: fb || null, error: null };
    }

    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      if (!Array.isArray(data.subtopics)) {
        data.subtopics = [];
      }
      setCached(cacheKey, data);
      return { data, error };
    }

    // Fallback: check FALLBACK_CATEGORIES
    const fb = FALLBACK_CATEGORIES.find(c => c.slug === slug || slugify(c.name) === slug);
    if (fb) {
      setCached(cacheKey, fb);
      return { data: fb, error: null };
    }

    return { data, error };
  },

  /** Create a new category */
  async createCategory({ name, slug, description, subtopics }) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    const finalSlug = slug?.trim() || slugify(name);
    const cleanSubtopics = Array.isArray(subtopics) 
      ? subtopics.filter(t => typeof t === 'string' && t.trim().length > 0)
      : [];

    const payload = {
      name: name?.trim(),
      slug: finalSlug,
      description: description?.trim() || null,
      subtopics: cleanSubtopics,
    };

    const { data, error } = await supabase
      .from('blog_categories')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    clearBlogCache();
    return data;
  },

  /** Update an existing category */
  async updateCategory(id, { name, slug, description, subtopics }) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    const payload = {
      name: name?.trim(),
      slug: slug?.trim() || slugify(name),
      description: description?.trim() || null,
      subtopics: Array.isArray(subtopics) 
        ? subtopics.filter(t => typeof t === 'string' && t.trim().length > 0)
        : [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('blog_categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    clearBlogCache();
    return data;
  },

  /** Delete a category if not in use by any post */
  async deleteCategory(id) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    // 1. Check if category is used by any posts
    const { count, error: countErr } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countErr) throw countErr;

    if (count && count > 0) {
      throw new Error(`Cannot delete this category because ${count} blog post(s) are currently assigned to it. Reassign or delete those posts first.`);
    }

    // 2. Delete category
    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    clearBlogCache();
    return true;
  },

  // ── Public Blog Posts ─────────────────────────────────────────────────────

  /** Fetch all published posts, optionally filtered strictly by category ID or slug, and optional subcategory */
  async getPublishedPosts(categoryFilter = null, subcategoryFilter = null) {
    const cacheKey = `posts_${categoryFilter || 'all'}_${subcategoryFilter || 'all'}`;
    const cached = getCached(cacheKey);
    if (cached) return { data: cached, error: null };

    // Deduplicate identical in-flight requests
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }

    const fetchPromise = (async () => {
      try {
        const { supabase, isSupabaseConfigured } = await getSupabaseClient();
        if (!supabase || !isSupabaseConfigured) return { data: null, error: null };

        // Exclude the multi-megabyte 'content' column for list/card queries to ensure instant network responses (<1s vs 30s+)
        let query = supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, featured_image, category, category_id, subcategory, author, published_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (categoryFilter && categoryFilter !== 'all') {
          // Check if filter is UUID or category name/slug
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryFilter);
          if (isUUID) {
            query = query.eq('category_id', categoryFilter);
          } else {
            // Find category by slug first to filter by category_id or exact category name
            const { data: cat } = await supabase
              .from('blog_categories')
              .select('id, name')
              .eq('slug', categoryFilter)
              .maybeSingle();

            if (cat) {
              query = query.or(`category_id.eq.${cat.id},category.eq."${cat.name}"`);
            } else {
              const fb = FALLBACK_CATEGORIES.find(c => c.slug === categoryFilter || slugify(c.name) === categoryFilter);
              if (fb) {
                query = query.or(`category.eq."${fb.name}",category.eq."${fb.slug}"`);
              } else {
                query = query.eq('category', categoryFilter);
              }
            }
          }
        }

        if (subcategoryFilter && subcategoryFilter !== 'all') {
          query = query.eq('subcategory', subcategoryFilter);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          setCached(cacheKey, data);
        }
        return { data, error };
      } finally {
        inFlightRequests.delete(cacheKey);
      }
    })();

    inFlightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  },

  /** Fetch a single published post by slug */
  async getPostBySlug(slug) {
    if (!slug) return { data: null, error: null };
    const cacheKey = `post_${slug}`;
    const cached = getCached(cacheKey);
    if (cached) return { data: cached, error: null };

    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) return { data: null, error: null };

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    const normalized = normalizePost(data);
    if (normalized) {
      setCached(cacheKey, normalized);
    }
    return { data: normalized, error };
  },

  // ── Admin Blog Posts ──────────────────────────────────────────────────────

  /** Fetch ALL posts (any status) for admin table */
  async getAllPostsAdmin(categoryId = null) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) return { data: [], error: null };

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (categoryId && UUID_REGEX.test(categoryId)) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    return { data: (data || []).map(normalizePost), error };
  },

  /** Fetch a single post by id (admin) */
  async getPostById(id) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    return { data: normalizePost(data), error };
  },

  /** Create a new post with full SEO and media metadata support */
  async createPost(postData) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    const {
      title, slug, excerpt, content, featured_image,
      image1, image2, image3, video,
      featured_image_alt, featured_image_caption,
      image1_alt, image1_caption,
      image2_alt, image2_caption,
      image3_alt, image3_caption,
      video_caption,
      category_id, category, subcategory, author, status, published_at,
      primary_focus_keyword, secondary_keywords, related_keywords,
      seo_title, meta_description, canonical_url, robots_directive,
      og_title, og_description, og_image,
      twitter_title, twitter_description, twitter_image
    } = postData;

    const finalSlug = slug?.trim() || slugify(title);
    const validCategoryId = sanitizeCategoryId(category_id, category);

    // Deep clone content so we can safely attach metadata if fallback is needed
    let cleanContent = Array.isArray(content) ? JSON.parse(JSON.stringify(content)) : (content || []);
    if (!Array.isArray(cleanContent) || cleanContent.length === 0) {
      cleanContent = [{ h2: '', body: '' }];
    }

    const payload = {
      title: title?.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() || null,
      content: cleanContent,
      featured_image: featured_image?.trim() || null,
      category_id: validCategoryId,
      category: category?.trim() || null,
      subcategory: subcategory?.trim() || null,
      author: author?.trim() || 'Admin',
      status: status || 'draft',
      published_at: (status === 'published' || status === 'scheduled')
        ? (published_at || new Date().toISOString())
        : null,
      primary_focus_keyword: primary_focus_keyword?.trim() || null,
      secondary_keywords: Array.isArray(secondary_keywords) ? secondary_keywords : [],
      related_keywords: Array.isArray(related_keywords) ? related_keywords : [],
      seo_title: seo_title?.trim() || null,
      meta_description: meta_description?.trim() || null,
      canonical_url: canonical_url?.trim() || null,
      robots_directive: robots_directive?.trim() || 'index, follow',
      og_title: og_title?.trim() || null,
      og_description: og_description?.trim() || null,
      og_image: og_image?.trim() || null,
      twitter_title: twitter_title?.trim() || null,
      twitter_description: twitter_description?.trim() || null,
      twitter_image: twitter_image?.trim() || null,
      featured_image_alt: featured_image_alt?.trim() || null,
      featured_image_caption: featured_image_caption?.trim() || null,
      image1: image1?.trim() || null,
      image1_alt: image1_alt?.trim() || null,
      image1_caption: image1_caption?.trim() || null,
      image2: image2?.trim() || null,
      image2_alt: image2_alt?.trim() || null,
      image2_caption: image2_caption?.trim() || null,
      image3: image3?.trim() || null,
      image3_alt: image3_alt?.trim() || null,
      image3_caption: image3_caption?.trim() || null,
      video: video?.trim() || null,
      video_caption: video_caption?.trim() || null,
    };

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      clearBlogCache();
      return normalizePost(data);
    } catch (insertErr) {
      // If error is column does not exist on blog_posts (e.g. before running SQL migration),
      // bundle extra fields safely into content[0]._seo and content[0]._media and retry.
      if (insertErr.message && (insertErr.message.includes('column') || insertErr.code === '42703')) {
        const seoBundle = {
          primary_focus_keyword: payload.primary_focus_keyword,
          secondary_keywords: payload.secondary_keywords,
          related_keywords: payload.related_keywords,
          seo_title: payload.seo_title,
          meta_description: payload.meta_description,
          canonical_url: payload.canonical_url,
          robots_directive: payload.robots_directive,
          og_title: payload.og_title,
          og_description: payload.og_description,
          og_image: payload.og_image,
          twitter_title: payload.twitter_title,
          twitter_description: payload.twitter_description,
          twitter_image: payload.twitter_image,
        };

        const mediaBundle = {
          image1: payload.image1, image1_alt: payload.image1_alt, image1_caption: payload.image1_caption,
          image2: payload.image2, image2_alt: payload.image2_alt, image2_caption: payload.image2_caption,
          image3: payload.image3, image3_alt: payload.image3_alt, image3_caption: payload.image3_caption,
          video: payload.video, video_caption: payload.video_caption,
          featured_image_alt: payload.featured_image_alt, featured_image_caption: payload.featured_image_caption,
        };

        if (Array.isArray(payload.content) && payload.content.length > 0) {
          payload.content[0]._seo = seoBundle;
          payload.content[0]._media = mediaBundle;
        }

        // Clean top-level non-core columns
        const newCols = [
          'primary_focus_keyword', 'secondary_keywords', 'related_keywords',
          'seo_title', 'meta_description', 'canonical_url', 'robots_directive',
          'og_title', 'og_description', 'og_image',
          'twitter_title', 'twitter_description', 'twitter_image',
          'featured_image_alt', 'featured_image_caption',
          'image1', 'image1_alt', 'image1_caption',
          'image2', 'image2_alt', 'image2_caption',
          'image3', 'image3_alt', 'image3_caption',
          'video', 'video_caption'
        ];
        newCols.forEach(c => delete payload[c]);

        const { data, error } = await supabase
          .from('blog_posts')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        clearBlogCache();
        return normalizePost(data);
      }
      throw insertErr;
    }
  },

  /** Update an existing post by id with full SEO and media metadata support */
  async updatePost(id, postData) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    const {
      title, slug, excerpt, content, featured_image,
      image1, image2, image3, video,
      featured_image_alt, featured_image_caption,
      image1_alt, image1_caption,
      image2_alt, image2_caption,
      image3_alt, image3_caption,
      video_caption,
      category_id, category, subcategory, author, status, published_at,
      primary_focus_keyword, secondary_keywords, related_keywords,
      seo_title, meta_description, canonical_url, robots_directive,
      og_title, og_description, og_image,
      twitter_title, twitter_description, twitter_image
    } = postData;

    const validCategoryId = category_id !== undefined ? sanitizeCategoryId(category_id, category) : undefined;

    let cleanContent = Array.isArray(content) ? JSON.parse(JSON.stringify(content)) : (content || []);
    if (!Array.isArray(cleanContent) || cleanContent.length === 0) {
      cleanContent = [{ h2: '', body: '' }];
    }

    const payload = {
      title: title?.trim(),
      slug: slug?.trim() || slugify(title),
      excerpt: excerpt?.trim() || null,
      content: cleanContent,
      featured_image: featured_image?.trim() || null,
      category: category?.trim() || null,
      subcategory: subcategory !== undefined ? (subcategory?.trim() || null) : undefined,
      author: author?.trim() || 'Admin',
      status: status || 'draft',
      published_at: (status === 'published' || status === 'scheduled')
        ? (published_at || new Date().toISOString())
        : null,
      updated_at: new Date().toISOString(),
      primary_focus_keyword: primary_focus_keyword?.trim() || null,
      secondary_keywords: Array.isArray(secondary_keywords) ? secondary_keywords : [],
      related_keywords: Array.isArray(related_keywords) ? related_keywords : [],
      seo_title: seo_title?.trim() || null,
      meta_description: meta_description?.trim() || null,
      canonical_url: canonical_url?.trim() || null,
      robots_directive: robots_directive?.trim() || 'index, follow',
      og_title: og_title?.trim() || null,
      og_description: og_description?.trim() || null,
      og_image: og_image?.trim() || null,
      twitter_title: twitter_title?.trim() || null,
      twitter_description: twitter_description?.trim() || null,
      twitter_image: twitter_image?.trim() || null,
      featured_image_alt: featured_image_alt?.trim() || null,
      featured_image_caption: featured_image_caption?.trim() || null,
      image1: image1?.trim() || null,
      image1_alt: image1_alt?.trim() || null,
      image1_caption: image1_caption?.trim() || null,
      image2: image2?.trim() || null,
      image2_alt: image2_alt?.trim() || null,
      image2_caption: image2_caption?.trim() || null,
      image3: image3?.trim() || null,
      image3_alt: image3_alt?.trim() || null,
      image3_caption: image3_caption?.trim() || null,
      video: video?.trim() || null,
      video_caption: video_caption?.trim() || null,
    };

    if (validCategoryId !== undefined) {
      payload.category_id = validCategoryId;
    }

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      clearBlogCache();
      return normalizePost(data);
    } catch (updateErr) {
      if (updateErr.message && (updateErr.message.includes('column') || updateErr.code === '42703')) {
        const seoBundle = {
          primary_focus_keyword: payload.primary_focus_keyword,
          secondary_keywords: payload.secondary_keywords,
          related_keywords: payload.related_keywords,
          seo_title: payload.seo_title,
          meta_description: payload.meta_description,
          canonical_url: payload.canonical_url,
          robots_directive: payload.robots_directive,
          og_title: payload.og_title,
          og_description: payload.og_description,
          og_image: payload.og_image,
          twitter_title: payload.twitter_title,
          twitter_description: payload.twitter_description,
          twitter_image: payload.twitter_image,
        };

        const mediaBundle = {
          image1: payload.image1, image1_alt: payload.image1_alt, image1_caption: payload.image1_caption,
          image2: payload.image2, image2_alt: payload.image2_alt, image2_caption: payload.image2_caption,
          image3: payload.image3, image3_alt: payload.image3_alt, image3_caption: payload.image3_caption,
          video: payload.video, video_caption: payload.video_caption,
          featured_image_alt: payload.featured_image_alt, featured_image_caption: payload.featured_image_caption,
        };

        if (Array.isArray(payload.content) && payload.content.length > 0) {
          payload.content[0]._seo = seoBundle;
          payload.content[0]._media = mediaBundle;
        }

        const newCols = [
          'primary_focus_keyword', 'secondary_keywords', 'related_keywords',
          'seo_title', 'meta_description', 'canonical_url', 'robots_directive',
          'og_title', 'og_description', 'og_image',
          'twitter_title', 'twitter_description', 'twitter_image',
          'featured_image_alt', 'featured_image_caption',
          'image1', 'image1_alt', 'image1_caption',
          'image2', 'image2_alt', 'image2_caption',
          'image3', 'image3_alt', 'image3_caption',
          'video', 'video_caption'
        ];
        newCols.forEach(c => delete payload[c]);

        const { data, error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        clearBlogCache();
        return normalizePost(data);
      }
      throw updateErr;
    }
  },

  /** Duplicate an existing post into a new draft */
  async duplicatePost(id) {
    const { data: original, error } = await this.getPostById(id);
    if (error || !original) throw error || new Error('Original post not found');

    const timestamp = Date.now().toString().slice(-4);
    const newSlug = `${original.slug}-copy-${timestamp}`;
    const newTitle = `${original.title} (Copy)`;

    const duplicatePayload = {
      ...original,
      title: newTitle,
      slug: newSlug,
      status: 'draft',
      published_at: null,
    };
    delete duplicatePayload.id;
    delete duplicatePayload.created_at;
    delete duplicatePayload.updated_at;

    return await this.createPost(duplicatePayload);
  },

  /** Delete a post by id */
  async deletePost(id) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    clearBlogCache();
    return true;
  },

  /** Toggle a post between draft and published */
  async togglePublish(id, currentStatus) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    const newStatus = currentStatus === 'published' ? 'draft' : 'published';

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    clearBlogCache();
    return normalizePost(data);
  },

  /** Fetch dashboard overview stats */
  async getBlogStats() {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) {
      return { total: 0, published: 0, draft: 0, scheduled: 0 };
    }

    try {
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, status, published_at');

      if (error) throw error;
      const total = posts?.length || 0;
      let published = 0;
      let draft = 0;
      let scheduled = 0;

      const now = new Date();
      (posts || []).forEach(p => {
        if (p.status === 'published') {
          published++;
        } else if (p.status === 'scheduled') {
          if (p.published_at && new Date(p.published_at) > now) {
            scheduled++;
          } else {
            published++;
          }
        } else {
          draft++;
        }
      });

      return { total, published, draft, scheduled };
    } catch (err) {
      console.warn('Error fetching blog stats:', err.message);
      return { total: 0, published: 0, draft: 0, scheduled: 0 };
    }
  },

  /** Utility: generate slug from title */
  slugify,
};

/**
 * Normalizes post object so that SEO and media fields are always populated,
 * whether stored in top-level columns or inside fallback metadata in content[0].
 */
function normalizePost(data) {
  if (!data || typeof data !== 'object') return data;
  const sections = Array.isArray(data.content) ? data.content : [];
  const firstSec = (sections[0] && typeof sections[0] === 'object') ? sections[0] : {};
  const seo = firstSec._seo || {};
  const media = firstSec._media || data.media || {};

  return {
    ...data,
    primary_focus_keyword: data.primary_focus_keyword ?? seo.primary_focus_keyword ?? '',
    secondary_keywords: Array.isArray(data.secondary_keywords)
      ? data.secondary_keywords
      : (Array.isArray(seo.secondary_keywords) ? seo.secondary_keywords : []),
    related_keywords: Array.isArray(data.related_keywords)
      ? data.related_keywords
      : (Array.isArray(seo.related_keywords) ? seo.related_keywords : []),
    seo_title: data.seo_title ?? seo.seo_title ?? '',
    meta_description: data.meta_description ?? seo.meta_description ?? '',
    canonical_url: data.canonical_url ?? seo.canonical_url ?? '',
    robots_directive: data.robots_directive ?? seo.robots_directive ?? 'index, follow',
    og_title: data.og_title ?? seo.og_title ?? '',
    og_description: data.og_description ?? seo.og_description ?? '',
    og_image: data.og_image ?? seo.og_image ?? '',
    twitter_title: data.twitter_title ?? seo.twitter_title ?? '',
    twitter_description: data.twitter_description ?? seo.twitter_description ?? '',
    twitter_image: data.twitter_image ?? seo.twitter_image ?? '',
    featured_image_alt: data.featured_image_alt ?? media.featured_image_alt ?? '',
    featured_image_caption: data.featured_image_caption ?? media.featured_image_caption ?? '',
    image1: data.image1 ?? data.image_1 ?? media.image1 ?? '',
    image1_alt: data.image1_alt ?? media.image1_alt ?? '',
    image1_caption: data.image1_caption ?? media.image1_caption ?? '',
    image2: data.image2 ?? data.image_2 ?? media.image2 ?? '',
    image2_alt: data.image2_alt ?? media.image2_alt ?? '',
    image2_caption: data.image2_caption ?? media.image2_caption ?? '',
    image3: data.image3 ?? data.image_3 ?? media.image3 ?? '',
    image3_alt: data.image3_alt ?? media.image3_alt ?? '',
    image3_caption: data.image3_caption ?? media.image3_caption ?? '',
    video: data.video ?? media.video ?? '',
    video_caption: data.video_caption ?? media.video_caption ?? '',
  };
}

export default blogService;