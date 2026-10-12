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

    return { data: cats, error };
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
      return { data, error };
    }

    // Fallback: check FALLBACK_CATEGORIES
    const fb = FALLBACK_CATEGORIES.find(c => c.slug === slug || slugify(c.name) === slug);
    if (fb) {
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
    return true;
  },

  // ── Public Blog Posts ─────────────────────────────────────────────────────

  /** Fetch all published posts, optionally filtered strictly by category ID or slug, and optional subcategory */
  async getPublishedPosts(categoryFilter = null, subcategoryFilter = null) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) return { data: null, error: null };

    let query = supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image, category, category_id, subcategory, author, published_at, content')
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
    return { data, error };
  },

  /** Fetch a single published post by slug */
  async getPostBySlug(slug) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) return { data: null, error: null };

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    return { data, error };
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
    return { data: data || [], error };
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

    return { data, error };
  },

  /** Create a new post */
  async createPost({ title, slug, excerpt, content, featured_image, image1, image2, image3, video, category_id, category, subcategory, author, status, published_at }) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    const finalSlug = slug?.trim() || slugify(title);
    const validCategoryId = sanitizeCategoryId(category_id, category);

    // Build payload. Any extra inline media (image1..3, video) are also safely bundled
    // inside the jsonb content array metadata if desired, while also attempting top-level
    // columns if they exist.
    const payload = {
      title: title?.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() || null,
      content: content || null,
      featured_image: featured_image?.trim() || null,
      category_id: validCategoryId,
      category: category?.trim() || null,
      subcategory: subcategory?.trim() || null,
      author: author?.trim() || 'Admin',
      status: status || 'draft',
      published_at: status === 'published' ? (published_at || new Date().toISOString()) : null,
    };

    // If explicit media columns or media jsonb are used:
    if (image1) payload.image1 = image1.trim();
    if (image2) payload.image2 = image2.trim();
    if (image3) payload.image3 = image3.trim();
    if (video)  payload.video = video.trim();

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (insertErr) {
      // If error is column does not exist on blog_posts, strip top-level media or subcategory columns
      // and re-save embedding the media/subcategory into the content metadata
      if (insertErr.message && (insertErr.message.includes('column') || insertErr.code === '42703')) {
        delete payload.image1;
        delete payload.image2;
        delete payload.image3;
        delete payload.video;
        if (insertErr.message.includes('subcategory')) {
          delete payload.subcategory;
        }
        // attach media and subcategory metadata to first section or meta
        if (Array.isArray(payload.content) && payload.content.length > 0) {
          payload.content[0]._media = { image1, image2, image3, video };
          if (subcategory) payload.content[0]._subcategory = subcategory;
        }
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      throw insertErr;
    }
  },

  /** Update an existing post by id */
  async updatePost(id, { title, slug, excerpt, content, featured_image, image1, image2, image3, video, category_id, category, subcategory, author, status, published_at }) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    const validCategoryId = category_id !== undefined ? sanitizeCategoryId(category_id, category) : undefined;

    const payload = {
      title: title?.trim(),
      slug: slug?.trim() || slugify(title),
      excerpt: excerpt?.trim() || null,
      content: content || null,
      featured_image: featured_image?.trim() || null,
      category: category?.trim() || null,
      subcategory: subcategory !== undefined ? (subcategory?.trim() || null) : undefined,
      author: author?.trim() || 'Admin',
      status: status || 'draft',
      published_at: status === 'published' ? (published_at || new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    };
    if (validCategoryId !== undefined) {
      payload.category_id = validCategoryId;
    }

    if (image1 !== undefined) payload.image1 = image1?.trim() || null;
    if (image2 !== undefined) payload.image2 = image2?.trim() || null;
    if (image3 !== undefined) payload.image3 = image3?.trim() || null;
    if (video !== undefined)  payload.video = video?.trim() || null;

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (updateErr) {
      if (updateErr.message && (updateErr.message.includes('column') || updateErr.code === '42703')) {
        delete payload.image1;
        delete payload.image2;
        delete payload.image3;
        delete payload.video;
        if (updateErr.message.includes('subcategory')) {
          delete payload.subcategory;
        }
        if (Array.isArray(payload.content) && payload.content.length > 0) {
          payload.content[0]._media = { image1, image2, image3, video };
          if (subcategory) payload.content[0]._subcategory = subcategory;
        }
        const { data, error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      throw updateErr;
    }
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
    return data;
  },

  /** Utility: generate slug from title */
  slugify,
};

export default blogService;