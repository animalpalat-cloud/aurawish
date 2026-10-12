import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PenLine, Plus, Trash2, Eye, EyeOff, Edit2,
  Loader2, AlertCircle, FileText, RefreshCw, ExternalLink, FolderTree,
  Search, Copy, Clock, Filter, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { AdminShell } from '../../components/admin/AdminShell';
import { blogService } from '../../services/blogService';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Blog Page — /admin/blog
// Professional post management: search, filters, sorting, duplicate, and live actions.
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_BADGE = {
  published: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  draft:     'bg-amber-500/15 text-amber-300 border-amber-500/25',
  scheduled: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const AdminBlogPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Search, filter & sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated_desc');

  // Action states
  const [togglingId, setTogglingId] = useState(null);
  const [duplicatingId, setDuplicatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [postsRes, catsRes] = await Promise.all([
        blogService.getAllPostsAdmin(),
        blogService.getCategoriesSimple()
      ]);
      
      if (postsRes.error) throw postsRes.error;
      setPosts(postsRes.data || []);
      setCategories(catsRes.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load posts. Make sure the blog_posts table exists in Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchPosts(); 
  }, [fetchPosts]);

  // Flash success message
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleTogglePublish = async (post) => {
    setTogglingId(post.id);
    try {
      const updated = await blogService.togglePublish(post.id, post.status);
      setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
      showSuccess(`Post status changed to ${updated.status}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDuplicate = async (post) => {
    setDuplicatingId(post.id);
    try {
      const newPost = await blogService.duplicatePost(post.id);
      setPosts(prev => [newPost, ...prev]);
      showSuccess(`Duplicated "${post.title}" as draft`);
    } catch (e) {
      setError(e.message || 'Failed to duplicate post');
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await blogService.deletePost(confirmDelete.id);
      setPosts(prev => prev.filter(p => p.id !== confirmDelete.id));
      setConfirmDelete(null);
      showSuccess('Post deleted successfully');
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered and sorted posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Search filter (title, slug, excerpt)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = post.title?.toLowerCase().includes(q);
        const matchesSlug = post.slug?.toLowerCase().includes(q);
        const matchesCategory = post.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSlug && !matchesCategory) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && post.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all') {
        const matchesCat = post.category === categoryFilter || post.category_id === categoryFilter;
        if (!matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'title_asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title_desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'published_desc':
          return new Date(b.published_at || 0) - new Date(a.published_at || 0);
        case 'created_desc':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case 'updated_asc':
          return new Date(a.updated_at || a.created_at || 0) - new Date(b.updated_at || b.created_at || 0);
        case 'updated_desc':
        default:
          return new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0);
      }
    });
  }, [posts, searchQuery, statusFilter, categoryFilter, sortBy]);

  return (
    <AdminShell title="Blog Management">
      {/* ── Header row ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span>Blog Management</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, optimize with SEO, organize, and publish articles across your categories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>
      </div>

      {/* ── Navigation Tabs ─────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6">
        <Link
          to="/admin/blog"
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-indigo-400 border-b-2 border-indigo-500 transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>Posts</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-[11px] text-indigo-300 font-bold ml-1">
            {posts.length}
          </span>
        </Link>
        <Link
          to="/admin/blog/categories"
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white border-b-2 border-transparent transition-all"
        >
          <FolderTree className="w-4 h-4" />
          <span>Categories</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-400 font-bold ml-1">
            {categories.length}
          </span>
        </Link>
      </div>

      {/* ── Notification Feedback ─────────────────────── */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 text-emerald-300 text-sm">
          <div>{successMsg}</div>
        </div>
      )}

      {/* ── Filters & Search Toolbar ───────────────────────── */}
      <div className="mb-6 p-4 rounded-2xl bg-[#11141e] border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, slug, or category…"
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900 text-white">All Statuses</option>
              <option value="published" className="bg-slate-900 text-emerald-400">Published</option>
              <option value="draft" className="bg-slate-900 text-amber-400">Draft</option>
              <option value="scheduled" className="bg-slate-900 text-blue-400">Scheduled</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1 max-w-[130px] truncate"
            >
              <option value="all" className="bg-slate-900 text-white">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id || cat.slug} value={cat.name} className="bg-slate-900 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1"
            >
              <option value="updated_desc" className="bg-slate-900 text-white">Recently Updated</option>
              <option value="published_desc" className="bg-slate-900 text-white">Publish Date</option>
              <option value="created_desc" className="bg-slate-900 text-white">Date Created</option>
              <option value="title_asc" className="bg-slate-900 text-white">Title (A-Z)</option>
              <option value="title_desc" className="bg-slate-900 text-white">Title (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Loading ────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading posts…</span>
        </div>
      ) : posts.length === 0 ? (
        /* ── Empty state (no posts in DB) ───────────────── */
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7 text-slate-600" />
          </div>
          <div>
            <p className="text-white font-semibold">No blog posts yet</p>
            <p className="text-sm text-slate-500 mt-1">Create your first post to get started.</p>
          </div>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Create First Post
          </Link>
        </div>
      ) : filteredPosts.length === 0 ? (
        /* ── No matches for current filter/search ────────── */
        <div className="rounded-2xl border border-dashed border-slate-800 p-10 text-center space-y-3 bg-[#11141e]/50">
          <p className="text-white font-semibold text-sm">No posts match your filters</p>
          <p className="text-xs text-slate-500">
            Try adjusting your search query, status, or category selection.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* ── Posts table ───────────────────────────────── */
        <div className="rounded-2xl border border-slate-800 overflow-hidden shadow-xl bg-[#11141e]">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Post</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Last Updated</th>
                  <th className="text-right px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-800/25 transition-colors">
                    {/* Title & Slug */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          {post.featured_image ? (
                            <img src={post.featured_image} alt="" className="w-full h-full object-cover rounded-xl" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          ) : (
                            <PenLine className="w-4 h-4 text-indigo-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/admin/blog/${post.id}/edit`}
                            className="font-medium text-white hover:text-indigo-400 transition-colors truncate block max-w-sm"
                          >
                            {post.title}
                          </Link>
                          <p className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5 font-mono">
                            /{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-300 font-medium">{post.category || '—'}</span>
                        {post.subcategory && (
                          <span className="text-[10px] text-indigo-400 truncate max-w-[140px]">{post.subcategory}</span>
                        )}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold capitalize ${STATUS_BADGE[post.status] || STATUS_BADGE.draft}`}>
                        {post.status === 'scheduled' && <Clock className="w-3 h-3" />}
                        {post.status || 'draft'}
                      </span>
                    </td>

                    {/* Updated At */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-300">{formatDateTime(post.updated_at || post.created_at)}</span>
                        {post.published_at && (
                          <span className="text-[10px] text-slate-500">Pub: {formatDate(post.published_at)}</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(post)}
                          disabled={duplicatingId === post.id}
                          title="Duplicate post"
                          className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
                        >
                          {duplicatingId === post.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Publish toggle */}
                        <button
                          onClick={() => handleTogglePublish(post)}
                          disabled={togglingId === post.id}
                          title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                          className={`p-2 rounded-lg border transition-all disabled:opacity-50 ${
                            post.status === 'published'
                              ? 'text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/10'
                              : 'text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-300'
                          }`}
                        >
                          {togglingId === post.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : post.status === 'published' ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* View live (if published) */}
                        {post.status === 'published' && (
                          <a
                            href={post.category === 'Puppy Training' ? `/puppy-training/${post.slug}` : `/birthday-ideas/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View live page"
                            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Edit */}
                        <Link
                          to={`/admin/blog/${post.id}/edit`}
                          title="Edit post"
                          className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setConfirmDelete(post)}
                          title="Delete post"
                          className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden divide-y divide-slate-800/60">
            {filteredPosts.map(post => (
              <div key={post.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm leading-snug">{post.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {post.category || 'Uncategorized'} · {formatDate(post.updated_at || post.created_at)}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold capitalize ${STATUS_BADGE[post.status] || STATUS_BADGE.draft}`}>
                    {post.status === 'scheduled' && <Clock className="w-2.5 h-2.5" />}
                    {post.status || 'draft'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    disabled={togglingId === post.id}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      post.status === 'published' ? 'text-emerald-400 border-emerald-500/25 bg-emerald-500/10' : 'text-slate-400 border-slate-700'
                    }`}
                  >
                    {togglingId === post.id ? 'Updating…' : post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDuplicate(post)}
                    disabled={duplicatingId === post.id}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs font-medium"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    to={`/admin/blog/${post.id}/edit`}
                    className="flex-1 py-1.5 rounded-lg border border-indigo-500/30 text-indigo-400 text-xs font-medium text-center transition-all hover:bg-indigo-500/10"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(post)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ───────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#11141e] border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Delete Post?</p>
                <p className="text-xs text-slate-500 mt-0.5">This cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-800 truncate">
              {confirmDelete.title}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={!!deletingId}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all disabled:opacity-60"
              >
                {deletingId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminBlogPage;