import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PenLine, Plus, Trash2, Eye, EyeOff, Edit2,
  Loader2, AlertCircle, FileText, RefreshCw, ExternalLink, FolderTree
} from 'lucide-react';
import { AdminShell } from '../../components/admin/AdminShell';
import { blogService } from '../../services/blogService';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Blog Page — /admin/blog
// Lists all blog posts with status, publish toggle, edit, and delete.
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_BADGE = {
  published: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  draft:     'bg-amber-500/15 text-amber-300 border-amber-500/25',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export const AdminBlogPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // post to delete

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await blogService.getAllPostsAdmin();
      if (err) throw err;
      setPosts(data || []);
    } catch (e) {
      setError(e.message || 'Failed to load posts. Make sure the blog_posts table exists in Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleTogglePublish = async (post) => {
    setTogglingId(post.id);
    try {
      const updated = await blogService.togglePublish(post.id, post.status);
      setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch (e) {
      setError(e.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await blogService.deletePost(confirmDelete.id);
      setPosts(prev => prev.filter(p => p.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminShell title="Blog Management">
      {/* ── Header row ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Blog Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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
        </Link>
      </div>

      {/* ── Error ──────────────────────────────────────── */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* ── Loading ────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading posts…</span>
        </div>
      ) : posts.length === 0 ? (
        /* ── Empty state ──────────────────────────────── */
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
      ) : (
        /* ── Posts table ───────────────────────────────── */
        <div className="rounded-2xl border border-slate-800 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40">
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Title</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Published</th>
                  <th className="text-right px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {posts.map(post => (
                  <tr key={post.id} className="bg-[#11141e] hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                          <PenLine className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate max-w-xs">{post.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {post.category === 'Puppy Training' ? `/puppy-training/${post.slug}` : `/birthday-ideas/${post.slug}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-300">{post.category || '—'}</span>
                        {post.subcategory && (
                          <span className="text-[10px] text-indigo-400 truncate max-w-[140px]">{post.subcategory}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${STATUS_BADGE[post.status] || STATUS_BADGE.draft}`}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-slate-500">{formatDate(post.published_at)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Publish toggle */}
                        <button
                          onClick={() => handleTogglePublish(post)}
                          disabled={togglingId === post.id}
                          title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                          className={`p-2 rounded-lg border transition-all disabled:opacity-50 ${
                            post.status === 'published'
                              ? 'text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/10'
                              : 'text-slate-500 border-slate-700 hover:bg-slate-800 hover:text-slate-300'
                          }`}
                        >
                          {togglingId === post.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : post.status === 'published'
                              ? <Eye className="w-3.5 h-3.5" />
                              : <EyeOff className="w-3.5 h-3.5" />
                          }
                        </button>

                        {/* View live (if published) */}
                        {post.status === 'published' && (
                          <a
                            href={post.category === 'Puppy Training' ? `/puppy-training/${post.slug}` : `/birthday-ideas/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View live"
                            className="p-2 rounded-lg border border-slate-700 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Edit */}
                        <Link
                          to={`/admin/blog/${post.id}/edit`}
                          title="Edit"
                          className="p-2 rounded-lg border border-slate-700 text-slate-500 hover:text-indigo-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setConfirmDelete(post)}
                          title="Delete"
                          className="p-2 rounded-lg border border-slate-700 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all"
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
            {posts.map(post => (
              <div key={post.id} className="p-4 bg-[#11141e] space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm leading-snug">{post.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{post.category || 'Uncategorized'} · {formatDate(post.published_at)}</p>
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold ${STATUS_BADGE[post.status] || STATUS_BADGE.draft}`}>
                    {post.status === 'published' ? 'Live' : 'Draft'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleTogglePublish(post)} disabled={togglingId === post.id}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${post.status === 'published' ? 'text-emerald-400 border-emerald-500/25 bg-emerald-500/10' : 'text-slate-400 border-slate-700'}`}>
                    {togglingId === post.id ? 'Updating…' : post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link to={`/admin/blog/${post.id}/edit`} className="flex-1 py-1.5 rounded-lg border border-indigo-500/30 text-indigo-400 text-xs font-medium text-center transition-all hover:bg-indigo-500/10">
                    Edit
                  </Link>
                  <button onClick={() => setConfirmDelete(post)} className="flex-1 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 text-xs font-medium transition-all hover:bg-rose-500/10">
                    Delete
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
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
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