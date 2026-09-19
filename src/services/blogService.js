// ─────────────────────────────────────────────────────────────────────────────
// Blog Service
// Supabase CRUD for the blog_posts table.
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

export const blogService = {
  // ── Public ────────────────────────────────────────────────────────────────

  /** Fetch all published posts ordered by published_at desc */
  async getPublishedPosts() {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) return { data: null, error: null };

    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image, category, author, published_at, content')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

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

  // ── Admin ─────────────────────────────────────────────────────────────────

  /** Fetch ALL posts (any status) for admin table */
  async getAllPostsAdmin() {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) return { data: [], error: null };

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

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
  async createPost({ title, slug, excerpt, content, featured_image, category, author, status, published_at }) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    const finalSlug = slug?.trim() || slugify(title);

    const payload = {
      title: title?.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() || null,
      content: content || null,
      featured_image: featured_image?.trim() || null,
      category: category?.trim() || null,
      author: author?.trim() || 'Admin',
      status: status || 'draft',
      published_at: status === 'published' ? (published_at || new Date().toISOString()) : null,
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Update an existing post by id */
  async updatePost(id, { title, slug, excerpt, content, featured_image, category, author, status, published_at }) {
    const { supabase, isSupabaseConfigured } = await getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) throw new Error('Supabase is not configured');

    const payload = {
      title: title?.trim(),
      slug: slug?.trim() || slugify(title),
      excerpt: excerpt?.trim() || null,
      content: content || null,
      featured_image: featured_image?.trim() || null,
      category: category?.trim() || null,
      author: author?.trim() || 'Admin',
      status: status || 'draft',
      published_at: status === 'published' ? (published_at || new Date().toISOString()) : null,
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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