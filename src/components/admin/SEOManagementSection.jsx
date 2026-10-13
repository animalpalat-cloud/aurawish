import React, { useState } from 'react';
import {
  Search, Globe, Share2, Twitter, Tag, X, Plus,
  Check, HelpCircle, Monitor, Smartphone, Sparkles,
  Link2, Image as ImageIcon, ExternalLink, RefreshCw
} from 'lucide-react';

export const SEOManagementSection = ({
  form,
  setField,
  featuredImage = '',
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState('google'); // 'google' | 'social'
  const [serpDevice, setSerpDevice] = useState('desktop'); // 'desktop' | 'mobile'

  // Chip input state for secondary keywords
  const [secondaryInput, setSecondaryInput] = useState('');
  // Chip input state for related keywords
  const [relatedInput, setRelatedInput] = useState('');

  // Add Secondary Keyword
  const handleAddSecondary = (e) => {
    e?.preventDefault();
    const tag = secondaryInput.trim();
    if (!tag) return;
    const current = Array.isArray(form.secondary_keywords) ? form.secondary_keywords : [];
    if (!current.includes(tag)) {
      setField('secondary_keywords', [...current, tag]);
    }
    setSecondaryInput('');
  };

  const handleRemoveSecondary = (tagToRemove) => {
    const current = Array.isArray(form.secondary_keywords) ? form.secondary_keywords : [];
    setField('secondary_keywords', current.filter(t => t !== tagToRemove));
  };

  // Add Related Keyword
  const handleAddRelated = (e) => {
    e?.preventDefault();
    const tag = relatedInput.trim();
    if (!tag) return;
    const current = Array.isArray(form.related_keywords) ? form.related_keywords : [];
    if (!current.includes(tag)) {
      setField('related_keywords', [...current, tag]);
    }
    setRelatedInput('');
  };

  const handleRemoveRelated = (tagToRemove) => {
    const current = Array.isArray(form.related_keywords) ? form.related_keywords : [];
    setField('related_keywords', current.filter(t => t !== tagToRemove));
  };

  // Preview computations
  const previewTitle = form.seo_title || form.title || 'Untitled Blog Post';
  const previewDesc = form.meta_description || form.excerpt || 'Enter a meta description to see how your article will be summarized for search engine readers.';
  const previewSlug = form.slug || 'untitled-post';
  const displayOgImage = form.og_image || form.featured_image || featuredImage;

  // Auto-fill canonical URL
  const handleAutoCanonical = () => {
    if (form.slug) {
      const isPuppy = form.category === 'Puppy Training' || form.category === 'puppy-training';
      const path = isPuppy ? `/puppy-training/${form.slug}` : `/birthday-ideas/${form.slug}`;
      setField('canonical_url', `https://www.birthdaywishly.com${path}`);
    }
  };

  // Use featured image for OG image
  const handleUseFeaturedForOg = () => {
    if (featuredImage) {
      setField('og_image', featuredImage);
    } else if (form.featured_image) {
      setField('og_image', form.featured_image);
    }
  };

  const titleCharCount = (form.seo_title || '').length;
  const descCharCount = (form.meta_description || '').length;

  return (
    <div className="bg-[#11141e] border border-slate-800 rounded-2xl p-6 space-y-7">
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Professional SEO &amp; Metadata Configuration</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Target keywords, search snippets, canonical URLs, and Open Graph previews
            </p>
          </div>
        </div>
      </div>

      {/* ── 1. TARGET KEYWORDS ──────────────────────────────────── */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" />
          <span>Keyword Optimization</span>
        </h4>

        {/* Primary Focus Keyword */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Primary Focus Keyword</span>
            <span className="text-[10px] text-slate-500 font-normal">Single focus keyword or keyphrase</span>
          </label>
          <input
            id="primary-focus-keyword"
            type="text"
            value={form.primary_focus_keyword || ''}
            onChange={e => setField('primary_focus_keyword', e.target.value)}
            placeholder="e.g. golden birthday wishes, puppy biting solutions…"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            The central topic search engines will use to evaluate topical relevance and search intent.
          </p>
        </div>

        {/* Secondary Keywords (Chips) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Secondary Keywords ({Array.isArray(form.secondary_keywords) ? form.secondary_keywords.length : 0})</span>
            <span className="text-[10px] text-slate-500 font-normal">Press Enter or click Add to append</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={secondaryInput}
              onChange={e => setSecondaryInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  handleAddSecondary();
                }
              }}
              placeholder="e.g. golden birthday ideas, 21st golden birthday…"
              className="flex-1 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="button"
              onClick={handleAddSecondary}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {Array.isArray(form.secondary_keywords) && form.secondary_keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
              {form.secondary_keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSecondary(kw)}
                    className="text-indigo-400 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Keywords (Chips) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Additional Related Keywords ({Array.isArray(form.related_keywords) ? form.related_keywords.length : 0})</span>
            <span className="text-[10px] text-slate-500 font-normal">Related search queries &amp; LSI terms</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={relatedInput}
              onChange={e => setRelatedInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  handleAddRelated();
                }
              }}
              placeholder="e.g. birthday card messages, celebration milestones…"
              className="flex-1 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="button"
              onClick={handleAddRelated}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {Array.isArray(form.related_keywords) && form.related_keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
              {form.related_keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRelated(kw)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 2. SEARCH ENGINE SNIPPET FIELDS ─────────────────────── */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" />
          <span>Google Search Snippet</span>
        </h4>

        {/* SEO Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              SEO Title Tag
            </label>
            <span className={`text-[10px] font-mono ${
              titleCharCount > 65 ? 'text-amber-400 font-bold' : titleCharCount >= 40 ? 'text-emerald-400' : 'text-slate-500'
            }`}>
              {titleCharCount} / 60 characters
            </span>
          </div>
          <input
            id="seo-title"
            type="text"
            value={form.seo_title || ''}
            onChange={e => setField('seo_title', e.target.value)}
            placeholder={form.title ? `${form.title} | Birthday Wishes` : 'Custom search title…'}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            If left blank, the post title will automatically be used in HTML title tags.
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Search Meta Description
            </label>
            <span className={`text-[10px] font-mono ${
              descCharCount > 165 ? 'text-amber-400 font-bold' : descCharCount >= 120 ? 'text-emerald-400' : 'text-slate-500'
            }`}>
              {descCharCount} / 160 characters
            </span>
          </div>
          <textarea
            id="meta-description"
            rows={3}
            value={form.meta_description || ''}
            onChange={e => setField('meta_description', e.target.value)}
            placeholder={form.excerpt || 'Write a compelling summary to appear in search snippets…'}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Aim for 140–160 characters to optimize click-through rates from search results.
          </p>
        </div>

        {/* Canonical URL & Robots Directive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Canonical URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Canonical URL
              </label>
              <button
                type="button"
                onClick={handleAutoCanonical}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Auto-Fill</span>
              </button>
            </div>
            <input
              id="canonical-url"
              type="text"
              value={form.canonical_url || ''}
              onChange={e => setField('canonical_url', e.target.value)}
              placeholder="https://www.birthdaywishly.com/birthday-ideas/…"
              className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
            />
          </div>

          {/* Robots Directive */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Robots Directive
            </label>
            <select
              id="robots-directive"
              value={form.robots_directive || 'index, follow'}
              onChange={e => setField('robots_directive', e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="index, follow">index, follow (Standard — Recommended)</option>
              <option value="noindex, follow">noindex, follow (Hide from search, follow links)</option>
              <option value="index, nofollow">index, nofollow (Index post, ignore outgoing links)</option>
              <option value="noindex, nofollow">noindex, nofollow (Private — Completely hide)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. SERP & SOCIAL PREVIEWS ───────────────────────────── */}
      <div className="pt-4 border-t border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActivePreviewTab('google')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePreviewTab === 'google'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Google SERP Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('social')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePreviewTab === 'social'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Social &amp; Open Graph</span>
            </button>
          </div>

          {activePreviewTab === 'google' && (
            <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setSerpDevice('desktop')}
                className={`p-1 rounded ${serpDevice === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                title="Desktop Preview"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSerpDevice('mobile')}
                className={`p-1 rounded ${serpDevice === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                title="Mobile Preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Google SERP Preview Box */}
        {activePreviewTab === 'google' && (
          <div className={`p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 ${
            serpDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-bold">
                BW
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate">
                https://www.birthdaywishly.com › birthday-ideas › {previewSlug}
              </div>
            </div>
            <h5 className="text-[16px] text-[#8ab4f8] hover:underline cursor-pointer leading-snug font-medium line-clamp-2">
              {previewTitle}
            </h5>
            <p className="text-[12px] text-slate-300 leading-relaxed line-clamp-3">
              {previewDesc}
            </p>
          </div>
        )}

        {/* Social Share Preview Box */}
        {activePreviewTab === 'social' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-3">
            <div className="h-44 rounded-lg bg-slate-900 border border-slate-800/80 overflow-hidden flex items-center justify-center relative">
              {displayOgImage ? (
                <img
                  src={displayOgImage}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-slate-600 space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto opacity-50" />
                  <p className="text-xs">No Open Graph or Featured Image assigned</p>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                BIRTHDAYWISHLY.COM
              </p>
              <h5 className="text-sm font-bold text-white line-clamp-1">
                {form.og_title || previewTitle}
              </h5>
              <p className="text-xs text-slate-400 line-clamp-2">
                {form.og_description || previewDesc}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. OPEN GRAPH & TWITTER CARD DETAILED FIELDS ─────────── */}
      <div className="pt-4 border-t border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>Open Graph &amp; Social Metadata</span>
          </h4>
          <button
            type="button"
            onClick={handleUseFeaturedForOg}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
          >
            <ImageIcon className="w-3 h-3" />
            <span>Use Featured Image for OG Image</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Open Graph Title
            </label>
            <input
              type="text"
              value={form.og_title || ''}
              onChange={e => setField('og_title', e.target.value)}
              placeholder="Leave blank to use SEO Title"
              className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Open Graph Image URL
            </label>
            <input
              type="text"
              value={form.og_image || ''}
              onChange={e => setField('og_image', e.target.value)}
              placeholder="https://… or click Use Featured Image above"
              className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Open Graph Description
          </label>
          <textarea
            rows={2}
            value={form.og_description || ''}
            onChange={e => setField('og_description', e.target.value)}
            placeholder="Leave blank to use Meta Description"
            className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
          />
        </div>

        {/* Optional Twitter / X Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Twitter className="w-3 h-3 text-sky-400" />
              <span>Twitter / X Card Title</span>
            </label>
            <input
              type="text"
              value={form.twitter_title || ''}
              onChange={e => setField('twitter_title', e.target.value)}
              placeholder="Leave blank to use OG Title"
              className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Twitter className="w-3 h-3 text-sky-400" />
              <span>Twitter / X Card Description</span>
            </label>
            <input
              type="text"
              value={form.twitter_description || ''}
              onChange={e => setField('twitter_description', e.target.value)}
              placeholder="Leave blank to use OG Description"
              className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOManagementSection;
