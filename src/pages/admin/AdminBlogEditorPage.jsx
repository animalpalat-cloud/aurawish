import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Save, ArrowLeft, Plus, Trash2, AlertCircle,
  Loader2, Eye, EyeOff, GripVertical, ImageIcon, CheckCircle2,
  Upload, X, ExternalLink, FolderTree
} from 'lucide-react';
import { AdminShell } from '../../components/admin/AdminShell';
import { blogService } from '../../services/blogService';
import { storageService } from '../../services/storageService';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Blog Editor — /admin/blog/new  and  /admin/blog/:id/edit
// Create or edit a blog post with a visual section builder and category selector.
// ─────────────────────────────────────────────────────────────────────────────

const BLANK_SECTION = () => ({ h2: '', body: '' });
const BLANK_FORM = {
  title: '', slug: '', excerpt: '', featured_image: '',
  category_id: '', category: '', subcategory: '', author: 'Admin', status: 'draft',
  published_at: '', sections: [BLANK_SECTION()],
};

function toInputDate(iso) {
  if (!iso) return '';
  return iso.slice(0, 16);
}

function toISO(inputDate) {
  if (!inputDate) return '';
  return new Date(inputDate).toISOString();
}

export const AdminBlogEditorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // undefined for new post
  const isEditing = Boolean(id);

  const [form, setForm] = useState(BLANK_FORM);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Image upload state
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState('');

  // Fetch categories using the lightweight query (no post-count subquery)
  useEffect(() => {
    setCategoryError('');
    blogService.getCategoriesSimple()
      .then(({ data, error: err }) => {
        if (err) throw err;
        setCategories(data || []);
      })
      .catch((err) => {
        console.error('Failed to load categories:', err);
        setCategoryError('Could not load categories. Check your Supabase connection.');
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  // Load existing post when editing
  useEffect(() => {
    if (!isEditing) return;
    setLoading(true);
    blogService.getPostById(id).then(({ data, error: err }) => {
      if (err || !data) {
        setError(err?.message || 'Post not found.');
      } else {
        setForm({
          title:          data.title || '',
          slug:           data.slug || '',
          excerpt:        data.excerpt || '',
          featured_image: data.featured_image || '',
          category_id:    data.category_id || '',
          category:       data.category || '',
          subcategory:    data.subcategory || '',
          author:         data.author || 'Admin',
          status:         data.status || 'draft',
          published_at:   toInputDate(data.published_at),
          sections:       Array.isArray(data.content) && data.content.length > 0
                            ? data.content
                            : [BLANK_SECTION()],
        });
        setSlugManual(true); // don't auto-overwrite existing slug
      }
      setLoading(false);
    });
  }, [id, isEditing]);

  // Auto-generate slug from title (only when not manually edited)
  useEffect(() => {
    if (!slugManual && form.title) {
      setForm(prev => ({ ...prev, slug: blogService.slugify(form.title) }));
    }
  }, [form.title, slugManual]);

  const setField = useCallback((key, value) =>
    setForm(prev => ({ ...prev, [key]: value })), []);

  // Category change handler — always resolves to a UUID category_id
  // Resets subcategory whenever the main category changes.
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value; // always a UUID from <option value={cat.id}>
    if (!selectedId) {
      setForm(prev => ({ ...prev, category_id: '', category: '', subcategory: '' }));
      return;
    }
    const cat = categories.find(c => c.id === selectedId);
    if (cat) {
      // Store both the UUID (for the FK) and the name (for the legacy text column).
      // Reset subcategory so user must re-pick for the new category.
      setForm(prev => ({ ...prev, category_id: cat.id, category: cat.name, subcategory: '' }));
    }
    // If cat is not found (shouldn't happen), ignore the selection
  };

  // ── Section helpers ─────────────────────────────────────────────────────
  const addSection = () =>
    setForm(prev => ({ ...prev, sections: [...prev.sections, BLANK_SECTION()] }));

  const removeSection = (idx) =>
    setForm(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== idx) }));

  const updateSection = (idx, key, value) =>
    setForm(prev => {
      const sections = [...prev.sections];
      sections[idx] = { ...sections[idx], [key]: value };
      return { ...prev, sections };
    });

  const moveSection = (idx, dir) => {
    setForm(prev => {
      const sections = [...prev.sections];
      const target = idx + dir;
      if (target < 0 || target >= sections.length) return prev;
      [sections[idx], sections[target]] = [sections[target], sections[idx]];
      return { ...prev, sections };
    });
  };

  // ── Image upload handler ───────────────────────────────────────────────
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');
    setUploadingImage(true);
    setUploadProgress(10);

    try {
      const result = await storageService.uploadBlogImage(file, (progress) => {
        setUploadProgress(progress);
      });

      if (result?.downloadUrl) {
        setField('featured_image', result.downloadUrl);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setImageError(err.message || 'Failed to upload image. Please check Supabase Storage bucket settings.');
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setField('featured_image', '');
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSave = async (targetStatus) => {
    setError('');
    setSuccess('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.slug.trim())  { setError('Slug is required.'); return; }
    if (!form.category_id && !form.category) {
      setError('Category is required. Please select a primary category for this post.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title:          form.title.trim(),
        slug:           form.slug.trim(),
        excerpt:        form.excerpt.trim(),
        featured_image: form.featured_image.trim(),
        category_id:    form.category_id || null,
        category:       form.category || null,
        subcategory:    form.subcategory || null,
        author:         form.author.trim() || 'Admin',
        status:         targetStatus,
        published_at:   targetStatus === 'published'
                          ? (form.published_at ? toISO(form.published_at) : new Date().toISOString())
                          : null,
        content:        form.sections.filter(s => s.h2 || s.body),
      };

      if (isEditing) {
        await blogService.updatePost(id, payload);
        setSuccess('Post updated successfully!');
        setField('status', targetStatus);
      } else {
        const created = await blogService.createPost(payload);
        setSuccess('Post created! Redirecting…');
        setTimeout(() => navigate(`/admin/blog/${created.id}/edit`, { replace: true }), 1000);
      }
    } catch (e) {
      setError(e.message || 'Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  const pageTitle = isEditing ? 'Edit Post' : 'New Post';

  return (
    <AdminShell title={pageTitle}>
      {/* ── Top bar ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/blog" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white">{pageTitle}</h2>
            {isEditing && <p className="text-[11px] text-slate-500 mt-0.5">ID: {id}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      {/* ── Alerts ─────────────────────────────────────── */}
      {error && (
        <div className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}
      {success && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <div>{success}</div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading post…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ── Main fields ──────────────────────────────── */}
          <div className="xl:col-span-2 space-y-5">
            {/* Title */}
            <div className="bg-[#11141e] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Post Details</h3>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Title <span className="text-rose-400">*</span>
                </label>
                <input
                  id="post-title"
                  type="text"
                  value={form.title}
                  onChange={e => setField('title', e.target.value)}
                  placeholder="Enter post title…"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Slug <span className="text-rose-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="post-slug"
                    type="text"
                    value={form.slug}
                    onChange={e => { setSlugManual(true); setField('slug', e.target.value); }}
                    placeholder="auto-generated-from-title"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => { setSlugManual(false); setField('slug', blogService.slugify(form.title)); }}
                    className="px-3 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex-shrink-0"
                  >
                    Reset
                  </button>
                </div>
                <p className="text-[10px] text-slate-600 mt-1">/birthday-ideas/{form.slug || '…'}</p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Excerpt</label>
                <textarea
                  id="post-excerpt"
                  value={form.excerpt}
                  onChange={e => setField('excerpt', e.target.value)}
                  placeholder="Brief description shown in blog cards…"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y"
                />
              </div>
            </div>

            {/* ── Content sections ─────────────────────────── */}
            <div className="bg-[#11141e] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Content Sections ({form.sections.length})
                </h3>
                <button
                  type="button"
                  onClick={addSection}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 text-indigo-400 text-xs font-medium hover:bg-indigo-500/10 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Section
                </button>
              </div>

              <div className="space-y-4">
                {form.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex flex-col gap-0.5">
                        <button type="button" onClick={() => moveSection(idx, -1)} disabled={idx === 0}
                          className="text-slate-600 hover:text-slate-300 disabled:opacity-30 transition-colors leading-none text-lg">▴</button>
                        <button type="button" onClick={() => moveSection(idx, 1)} disabled={idx === form.sections.length - 1}
                          className="text-slate-600 hover:text-slate-300 disabled:opacity-30 transition-colors leading-none text-lg">▾</button>
                      </div>
                      <span className="text-xs font-bold text-slate-600 select-none w-6">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1" />
                      {form.sections.length > 1 && (
                        <button type="button" onClick={() => removeSection(idx)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Section Heading (h2)
                      </label>
                      <input
                        type="text"
                        value={section.h2}
                        onChange={e => updateSection(idx, 'h2', e.target.value)}
                        placeholder="Section heading…"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Body Text
                      </label>
                      <textarea
                        value={section.body}
                        onChange={e => updateSection(idx, 'body', e.target.value)}
                        placeholder="Section body text…"
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addSection}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-500 text-xs font-medium hover:border-indigo-500/40 hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                Add Another Section
              </button>
            </div>
          </div>

          {/* ── Sidebar meta ─────────────────────────────── */}
          <div className="space-y-5">
            {/* Status */}
            <div className="bg-[#11141e] border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Publishing</h3>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                <div className="flex gap-2">
                  {['draft', 'published'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setField('status', s)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all capitalize ${
                        form.status === s
                          ? s === 'published'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  value={form.published_at}
                  onChange={e => setField('published_at', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition-all"
                />
                <p className="text-[10px] text-slate-600 mt-1">Leave blank to use now when publishing.</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button onClick={() => handleSave('published')} disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                  Save & Publish
                </button>
                <button onClick={() => handleSave('draft')} disabled={saving}
                  className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <EyeOff className="w-4 h-4" />}
                  Save as Draft
                </button>
              </div>
            </div>

            {/* Category / Author */}
            <div className="bg-[#11141e] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Meta</h3>
                <Link
                  to="/admin/blog/categories"
                  target="_blank"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-medium"
                >
                  <FolderTree className="w-3 h-3" />
                  <span>Manage</span>
                </Link>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Primary Category <span className="text-rose-400">*</span>
                </label>

                {/* Error state */}
                {categoryError && (
                  <div className="mb-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {categoryError}
                  </div>
                )}

                {/* Loading state */}
                {loadingCategories ? (
                  <div className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-500 text-sm flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    Loading categories…
                  </div>
                ) : (
                  <select
                    id="post-category"
                    value={form.category_id}
                    onChange={handleCategoryChange}
                    disabled={loadingCategories || categories.length === 0}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select category…</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Empty categories warning */}
                {!loadingCategories && !categoryError && categories.length === 0 && (
                  <p className="mt-1.5 text-[11px] text-amber-400">
                    No categories found.{' '}
                    <a href="/admin/blog/categories" target="_blank" className="underline hover:text-amber-300">
                      Create one first.
                    </a>
                  </p>
                )}

                {/* Selected category helper details */}
                {(() => {
                  const selectedCat = categories.find(c => c.id === form.category_id);
                  if (!selectedCat) return null;
                  return (
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-left">
                      {selectedCat.description && (
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {selectedCat.description}
                        </p>
                      )}
                      {Array.isArray(selectedCat.subtopics) && selectedCat.subtopics.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {selectedCat.subtopics.slice(0, 5).map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-indigo-500/10 text-[10px] text-indigo-300 font-medium border border-indigo-500/20">
                              {tag}
                            </span>
                          ))}
                          {selectedCat.subtopics.length > 5 && (
                            <span className="text-[10px] text-slate-500 self-center">
                              +{selectedCat.subtopics.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Subcategory — shown only when a category with subtopics is selected */}
              {(() => {
                const selectedCat = categories.find(c => c.id === form.category_id);
                const subtopics = selectedCat?.subtopics || [];
                if (!selectedCat || subtopics.length === 0) return null;
                return (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Subcategory / Topic
                    </label>
                    <select
                      id="post-subcategory"
                      value={form.subcategory}
                      onChange={e => setField('subcategory', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="">Select subcategory… (optional)</option>
                      {subtopics.map((topic, idx) => (
                        <option key={idx} value={topic}>{topic}</option>
                      ))}
                    </select>
                    {form.subcategory && (
                      <p className="text-[10px] text-indigo-400 mt-1">
                        📌 {form.subcategory}
                      </p>
                    )}
                  </div>
                );
              })()}

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Author</label>
                <input
                  id="post-author"
                  type="text"
                  value={form.author}
                  onChange={e => setField('author', e.target.value)}
                  placeholder="Admin"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Featured image */}
            <div className="bg-[#11141e] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Featured Image</h3>
                {form.featured_image && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageFileChange}
              />

              {/* Upload error */}
              {imageError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">{imageError}</div>
                  <button type="button" onClick={() => setImageError('')} className="text-rose-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Image Preview or Dropzone */}
              {form.featured_image ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group">
                    <img
                      src={form.featured_image}
                      alt="Featured preview"
                      className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        setImageError('Image failed to load from URL.');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 justify-between">
                      <a
                        href={form.featured_image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-200 hover:text-white flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Full Size
                      </a>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="text-xs text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-all shadow-lg"
                      >
                        <Upload className="w-3 h-3" />
                        Replace Image
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                          <span>Uploading ({uploadProgress}%)</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Upload From Device</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                    uploadingImage ? 'pointer-events-none opacity-60' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    {uploadingImage ? (
                      <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-indigo-400" />
                    )}
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-white">
                      {uploadingImage ? `Uploading to Supabase (${uploadProgress}%)…` : 'Click to select an image from your device'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      JPG, PNG, WebP or GIF (Max 10MB)
                    </p>
                  </div>
                  {!uploadingImage && (
                    <button
                      type="button"
                      className="mt-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Browse File
                    </button>
                  )}
                </div>
              )}

              {/* Direct URL input fallback */}
              <div className="pt-2 border-t border-slate-800/80">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Or Paste Image URL
                </label>
                <input
                  id="post-featured-image"
                  type="url"
                  value={form.featured_image}
                  onChange={e => {
                    setImageError('');
                    setField('featured_image', e.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminBlogEditorPage;