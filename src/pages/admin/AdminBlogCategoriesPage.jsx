import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree, Plus, Trash2, Edit2, Loader2,
  AlertCircle, CheckCircle2, RefreshCw, X, Tag, FileText, ChevronRight
} from 'lucide-react';
import { AdminShell } from '../../components/admin/AdminShell';
import { blogService } from '../../services/blogService';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Blog Categories Page — /admin/blog/categories
// Manage blog categories, descriptions, subtopics/tags, and post associations.
// ─────────────────────────────────────────────────────────────────────────────

const BLANK_CATEGORY_FORM = {
  name: '',
  slug: '',
  description: '',
  subtopics: [],
};

export const AdminBlogCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null = new, object = edit
  const [formData, setFormData] = useState(BLANK_CATEGORY_FORM);
  const [subtopicInput, setSubtopicInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete Confirmation Modal
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await blogService.getCategories();
      if (err) throw err;
      setCategories(data || []);
    } catch (e) {
      setError(e.message || 'Failed to load categories. Please ensure the blog_categories table exists in Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData(BLANK_CATEGORY_FORM);
    setSubtopicInput('');
    setModalError('');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      subtopics: Array.isArray(cat.subtopics) ? [...cat.subtopics] : [],
    });
    setSubtopicInput('');
    setModalError('');
    setModalOpen(true);
  };

  // Add Subtopic / Tag
  const handleAddSubtopic = (e) => {
    e?.preventDefault();
    const tag = subtopicInput.trim();
    if (!tag) return;
    if (formData.subtopics.includes(tag)) {
      setModalError(`"${tag}" is already added.`);
      return;
    }
    setFormData(prev => ({ ...prev, subtopics: [...prev.subtopics, tag] }));
    setSubtopicInput('');
    setModalError('');
  };

  // Remove Subtopic / Tag
  const handleRemoveSubtopic = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      subtopics: prev.subtopics.filter(t => t !== tagToRemove),
    }));
  };

  // Save (Create or Update)
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!formData.name.trim()) {
      setModalError('Category name is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await blogService.updateCategory(editingCategory.id, formData);
        setSuccess(`Category "${formData.name}" updated successfully!`);
      } else {
        await blogService.createCategory(formData);
        setSuccess(`Category "${formData.name}" created successfully!`);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setModalError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Category
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await blogService.deleteCategory(confirmDelete.id);
      setSuccess(`Category "${confirmDelete.name}" deleted successfully.`);
      setConfirmDelete(null);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
      setConfirmDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminShell title="Blog Category Management">
      {/* ── Top Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Blog Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize blog posts into structured categories with subtopics and tags
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCategories}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>
      </div>

      {/* ── Navigation Tabs ─────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6">
        <Link
          to="/admin/blog"
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white border-b-2 border-transparent transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>Posts</span>
        </Link>
        <Link
          to="/admin/blog/categories"
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-indigo-400 border-b-2 border-indigo-500 transition-all"
        >
          <FolderTree className="w-4 h-4" />
          <span>Categories</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-[11px] text-indigo-300 font-bold ml-1">
            {categories.length}
          </span>
        </Link>
      </div>

      {/* ── Alerts ─────────────────────────────────────────── */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError('')} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <div className="flex-1">{success}</div>
          <button onClick={() => setSuccess('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Categories List / Loading / Empty ───────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span className="text-sm">Loading categories…</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto">
            <FolderTree className="w-7 h-7 text-slate-600" />
          </div>
          <div>
            <p className="text-white font-semibold">No blog categories found</p>
            <p className="text-sm text-slate-500 mt-1">Create your first blog category to start organizing articles.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-[#11141e] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between transition-all space-y-5"
            >
              {/* Category Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white truncate">{cat.name}</h3>
                      <p className="text-[11px] text-slate-500 font-mono">/category/{cat.slug}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    cat.post_count > 0
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {cat.post_count} {cat.post_count === 1 ? 'post' : 'posts'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                  {cat.description || <span className="text-slate-600 italic">No description provided.</span>}
                </p>

                {/* Subtopics / Tags */}
                {Array.isArray(cat.subtopics) && cat.subtopics.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <Tag className="w-3 h-3" />
                      <span>Subtopics &amp; Tags ({cat.subtopics.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {cat.subtopics.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <Link
                  to={`/birthday-ideas?category=${encodeURIComponent(cat.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-medium"
                >
                  <span>View on Blog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1 text-xs font-medium"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setConfirmDelete(cat)}
                    className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/30 transition-all flex items-center gap-1 text-xs font-medium"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT CATEGORY MODAL ────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#11141e] border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <FolderTree className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {editingCategory ? 'Edit Blog Category' : 'Create Blog Category'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 overflow-y-auto flex-1">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <div>{modalError}</div>
                </div>
              )}

              {/* Category Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Category Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name,
                      slug: !editingCategory ? blogService.slugify(name) : prev.slug,
                    }));
                  }}
                  placeholder="e.g. Trending Sports & Hobbies"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Slug (URL Identifier) <span className="text-rose-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: blogService.slugify(e.target.value) }))}
                    placeholder="trending-sports-hobbies"
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, slug: blogService.slugify(prev.name) }))}
                    className="px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of what this category covers..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all resize-y placeholder:text-slate-600"
                />
              </div>

              {/* Subtopics / Tags */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Subtopics / Tags (Optional)
                </label>
                <div className="flex gap-2 mb-2.5">
                  <input
                    type="text"
                    value={subtopicInput}
                    onChange={(e) => setSubtopicInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtopic();
                      }
                    }}
                    placeholder="e.g. Pickleball, Grooming & Care"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtopic}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
                  >
                    Add Tag
                  </button>
                </div>

                {formData.subtopics.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 max-h-36 overflow-y-auto">
                    {formData.subtopics.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-300 font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtopic(tag)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">No subtopics added yet.</p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ───────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#11141e] border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Delete Category?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            {confirmDelete.post_count > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                <p className="text-xs text-amber-300 font-medium">
                  ⚠️ Cannot Delete Category
                </p>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  There are currently <strong className="text-amber-100">{confirmDelete.post_count} blog post(s)</strong> assigned to &ldquo;{confirmDelete.name}&rdquo;. Please reassign or delete those posts before deleting this category.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-300 bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                Are you sure you want to permanently delete the category <strong className="text-white">&ldquo;{confirmDelete.name}&rdquo;</strong>?
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                {confirmDelete.post_count > 0 ? 'Close' : 'Cancel'}
              </button>
              {confirmDelete.post_count === 0 && (
                <button
                  onClick={handleDeleteConfirm}
                  disabled={!!deletingId}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {deletingId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete Category
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminBlogCategoriesPage;
