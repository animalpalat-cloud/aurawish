import React, { useMemo } from 'react';
import {
  CheckCircle2, AlertTriangle, Info, HelpCircle,
  TrendingUp, Sparkles, FileText, Search, Link2, Image, Hash
} from 'lucide-react';

/**
 * Strips HTML tags and returns clean plain text
 */
function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Calculates word count from plain text
 */
function getWordCount(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

export const SEOAnalyzerPanel = ({
  title = '',
  slug = '',
  sections = [],
  excerpt = '',
  primaryKeyword = '',
  secondaryKeywords = [],
  relatedKeywords = [],
  seoTitle = '',
  metaDescription = '',
  canonicalUrl = '',
  featuredImage = '',
  featuredImageAlt = '',
  existingPosts = [],
  currentPostId = null,
}) => {
  // Compute text statistics
  const analysis = useMemo(() => {
    // 1. Gather all article text
    const sectionTexts = sections.map(s => stripHtml(s.body || ''));
    const allBodyText = sectionTexts.join(' ');
    const fullArticleText = `${title} ${excerpt} ${allBodyText}`.toLowerCase();
    const wordCount = getWordCount(allBodyText) + getWordCount(excerpt);

    // Headings
    const h2Count = sections.filter(s => s.h2 && s.h2.trim().length > 0).length;
    const allHeadingsText = sections.map(s => s.h2 || '').join(' ').toLowerCase();

    // Primary keyword processing
    const kw = (primaryKeyword || '').trim().toLowerCase();
    const hasKw = kw.length > 0;

    // Checks container
    const passed = [];
    const warnings = [];
    const suggestions = [];

    // ── 1. PRIMARY KEYWORD CHECKS ──────────────────────────────────────────
    if (!hasKw) {
      warnings.push({
        id: 'no_keyword',
        category: 'Keyword',
        title: 'Primary Focus Keyword missing',
        detail: 'Specify a primary focus keyword to analyze keyword density and on-page optimization.',
      });
    } else {
      // In SEO Title
      const seoTitleClean = (seoTitle || title || '').toLowerCase();
      if (seoTitleClean.includes(kw)) {
        passed.push({
          id: 'kw_in_seo_title',
          category: 'Keyword',
          title: 'Primary keyword found in SEO title',
          detail: `Your focus keyword "${primaryKeyword}" is included in the SEO title tag.`,
        });
      } else {
        warnings.push({
          id: 'kw_in_seo_title_missing',
          category: 'Keyword',
          title: 'Primary keyword missing in SEO title',
          detail: `Try placing "${primaryKeyword}" near the beginning of your SEO title.`,
        });
      }

      // In Post Title (H1)
      if (title.toLowerCase().includes(kw)) {
        passed.push({
          id: 'kw_in_title',
          category: 'Keyword',
          title: 'Primary keyword found in post title',
          detail: 'Your post title includes the primary focus keyword.',
        });
      } else {
        warnings.push({
          id: 'kw_in_title_missing',
          category: 'Keyword',
          title: 'Primary keyword missing in post title',
          detail: 'Consider revising your post title to incorporate your primary keyword naturally.',
        });
      }

      // In Slug
      const kwSlug = kw.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const cleanSlug = (slug || '').toLowerCase();
      if (cleanSlug.includes(kwSlug) || cleanSlug.replace(/-/g, ' ').includes(kw)) {
        passed.push({
          id: 'kw_in_slug',
          category: 'Keyword',
          title: 'Primary keyword in URL slug',
          detail: `The URL slug contains your keyword terms.`,
        });
      } else {
        warnings.push({
          id: 'kw_in_slug_missing',
          category: 'Keyword',
          title: 'Primary keyword missing in slug',
          detail: `Include "${kwSlug}" in the post URL slug for cleaner search indexing.`,
        });
      }

      // In Introduction (Excerpt or first section)
      const introText = `${excerpt} ${sectionTexts[0] || ''}`.toLowerCase();
      if (introText.includes(kw)) {
        passed.push({
          id: 'kw_in_intro',
          category: 'Keyword',
          title: 'Primary keyword in introduction',
          detail: 'The primary keyword appears early in the opening paragraphs.',
        });
      } else {
        suggestions.push({
          id: 'kw_in_intro_missing',
          category: 'Keyword',
          title: 'Add primary keyword to opening paragraph',
          detail: 'Readers and crawlers benefit when the focus keyword is introduced in the first 100 words.',
        });
      }

      // In Headings (H2 / H3)
      if (allHeadingsText.includes(kw)) {
        passed.push({
          id: 'kw_in_headings',
          category: 'Keyword',
          title: 'Primary keyword in headings',
          detail: 'At least one section heading (H2/H3) features your primary focus keyword.',
        });
      } else {
        suggestions.push({
          id: 'kw_in_headings_missing',
          category: 'Keyword',
          title: 'Use keyword in a section heading',
          detail: 'Include your keyword in at least one subheading to establish clear topical hierarchy.',
        });
      }

      // Keyword Density in Main Body
      const kwRegex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
      const kwMatches = allBodyText.match(kwRegex) || [];
      const count = kwMatches.length;

      if (count >= 2) {
        passed.push({
          id: 'kw_density',
          category: 'Keyword',
          title: `Primary keyword density (${count} appearances)`,
          detail: `Keyword appears naturally ${count} times across ${wordCount} words.`,
        });
      } else if (count === 1) {
        suggestions.push({
          id: 'kw_density_low',
          category: 'Keyword',
          title: 'Primary keyword appears only once in body',
          detail: 'Try to reinforce your topic by using the keyword or close variants 2-4 times naturally.',
        });
      } else {
        warnings.push({
          id: 'kw_not_in_body',
          category: 'Keyword',
          title: 'Primary keyword not found in body text',
          detail: 'Ensure the primary keyword is mentioned in the main body content.',
        });
      }

      // In Meta Description
      if (metaDescription && metaDescription.toLowerCase().includes(kw)) {
        passed.push({
          id: 'kw_in_meta_desc',
          category: 'Keyword',
          title: 'Primary keyword in meta description',
          detail: 'Your search meta description contains the primary focus keyword.',
        });
      } else if (metaDescription) {
        suggestions.push({
          id: 'kw_in_meta_desc_missing',
          category: 'Keyword',
          title: 'Consider adding keyword to meta description',
          detail: 'Search engines frequently bold matching keyword queries in search snippets.',
        });
      }

      // In Image Alt Text
      if (featuredImageAlt && featuredImageAlt.toLowerCase().includes(kw)) {
        passed.push({
          id: 'kw_in_img_alt',
          category: 'Media',
          title: 'Primary keyword in featured image alt text',
          detail: 'Image accessibility text includes your primary keyword.',
        });
      }
    }

    // ── 2. SECONDARY KEYWORDS CHECK ────────────────────────────────────────
    if (Array.isArray(secondaryKeywords) && secondaryKeywords.length > 0) {
      const foundSec = secondaryKeywords.filter(sk =>
        sk && fullArticleText.includes(sk.toLowerCase().trim())
      );
      if (foundSec.length > 0) {
        passed.push({
          id: 'secondary_kw_used',
          category: 'Keyword',
          title: `Secondary keywords used (${foundSec.length}/${secondaryKeywords.length})`,
          detail: `Article incorporates: "${foundSec.join('", "')}".`,
        });
      } else {
        suggestions.push({
          id: 'secondary_kw_none',
          category: 'Keyword',
          title: 'Secondary keywords not yet used in content',
          detail: `You defined ${secondaryKeywords.length} secondary keywords. Try weaving some into your headings or body.`,
        });
      }
    }

    // ── 3. CONTENT STRUCTURE & LENGTH CHECKS ───────────────────────────────
    // Word Count
    if (wordCount >= 600) {
      passed.push({
        id: 'word_count_good',
        category: 'Content',
        title: `Comprehensive article length (${wordCount} words)`,
        detail: 'Word count meets standard guidelines for in-depth editorial content.',
      });
    } else if (wordCount >= 300) {
      passed.push({
        id: 'word_count_ok',
        category: 'Content',
        title: `Adequate word count (${wordCount} words)`,
        detail: 'Content length is sufficient for a quick guide or announcement.',
      });
    } else {
      warnings.push({
        id: 'word_count_low',
        category: 'Content',
        title: `Low word count (${wordCount} words)`,
        detail: 'Articles with at least 300-600 words tend to provide more value to readers and rank more stably.',
      });
    }

    // Headings Structure
    if (h2Count >= 2) {
      passed.push({
        id: 'headings_structure',
        category: 'Content',
        title: `Well-structured content (${h2Count} sections)`,
        detail: 'Article is organized with multiple headings for easy skimming.',
      });
    } else if (h2Count === 1) {
      suggestions.push({
        id: 'headings_few',
        category: 'Content',
        title: 'Only 1 heading defined',
        detail: 'Breaking content into 2 or more sub-sections improves readability and user retention.',
      });
    } else {
      warnings.push({
        id: 'headings_none',
        category: 'Content',
        title: 'No section headings defined',
        detail: 'Add section headings (H2) to structure your article cleanly.',
      });
    }

    // ── 4. METADATA CHECKS (SEO Title, Meta Description, Slug, Canonical) ──
    const titleLen = (seoTitle || title || '').trim().length;
    if (titleLen >= 30 && titleLen <= 65) {
      passed.push({
        id: 'seo_title_length',
        category: 'Snippet',
        title: `Optimal SEO title length (${titleLen} chars)`,
        detail: 'Title fits well within desktop and mobile Google SERP display widths.',
      });
    } else if (titleLen > 65) {
      suggestions.push({
        id: 'seo_title_long',
        category: 'Snippet',
        title: `SEO title might be truncated (${titleLen} chars)`,
        detail: 'Titles over 60-65 characters may be truncated with ellipses in search results.',
      });
    } else if (titleLen > 0) {
      suggestions.push({
        id: 'seo_title_short',
        category: 'Snippet',
        title: `Short SEO title (${titleLen} chars)`,
        detail: 'Consider making your title more descriptive (recommended 45-60 characters).',
      });
    } else {
      warnings.push({
        id: 'seo_title_empty',
        category: 'Snippet',
        title: 'SEO title is empty',
        detail: 'Provide a title to specify how your post appears in search engines and browser tabs.',
      });
    }

    // Meta Description length
    const descLen = (metaDescription || '').trim().length;
    if (descLen >= 120 && descLen <= 165) {
      passed.push({
        id: 'meta_desc_good',
        category: 'Snippet',
        title: `Optimal meta description length (${descLen} chars)`,
        detail: 'Description will display cleanly without premature truncation.',
      });
    } else if (descLen > 165) {
      suggestions.push({
        id: 'meta_desc_long',
        category: 'Snippet',
        title: `Meta description is long (${descLen} chars)`,
        detail: 'Descriptions over 160 characters might be cut short in mobile search results.',
      });
    } else if (descLen > 0) {
      suggestions.push({
        id: 'meta_desc_short',
        category: 'Snippet',
        title: `Short meta description (${descLen} chars)`,
        detail: 'Expand to 120-160 characters to provide a compelling summary that encourages clicks.',
      });
    } else {
      warnings.push({
        id: 'meta_desc_missing',
        category: 'Snippet',
        title: 'Meta description is missing',
        detail: 'Write a concise meta description to prevent search engines from generating random excerpts.',
      });
    }

    // Slug check
    if (!slug || !slug.trim()) {
      warnings.push({
        id: 'slug_missing',
        category: 'URL',
        title: 'URL slug is required',
        detail: 'A clean, lowercase hyphenated slug is required to publish.',
      });
    } else if (/[A-Z\s_]/.test(slug)) {
      warnings.push({
        id: 'slug_format',
        category: 'URL',
        title: 'Slug contains uppercase characters or spaces',
        detail: 'Use lowercase letters, numbers, and hyphens only for optimal SEO compatibility.',
      });
    } else {
      passed.push({
        id: 'slug_ok',
        category: 'URL',
        title: 'Clean URL slug format',
        detail: `Valid URL path: /birthday-ideas/${slug}`,
      });
    }

    // Canonical URL
    if (canonicalUrl && canonicalUrl.startsWith('http')) {
      passed.push({
        id: 'canonical_ok',
        category: 'URL',
        title: 'Explicit canonical URL configured',
        detail: `Canonical tag set to ${canonicalUrl}`,
      });
    } else {
      suggestions.push({
        id: 'canonical_auto',
        category: 'URL',
        title: 'Default canonical URL will be used',
        detail: 'A canonical tag matching the published article path will be automatically assigned.',
      });
    }

    // Duplicate title or description check against other posts
    if (Array.isArray(existingPosts) && existingPosts.length > 0) {
      const activeTitle = (seoTitle || title || '').trim().toLowerCase();
      const duplicateTitle = existingPosts.find(p =>
        p.id !== currentPostId &&
        ((p.seo_title && p.seo_title.toLowerCase().trim() === activeTitle) ||
         (p.title && p.title.toLowerCase().trim() === activeTitle))
      );
      if (duplicateTitle && activeTitle.length > 5) {
        warnings.push({
          id: 'dup_title',
          category: 'Duplicate',
          title: 'Duplicate post title detected',
          detail: `Another post "${duplicateTitle.title}" already uses this exact title. Unique titles avoid internal keyword cannibalization.`,
        });
      }

      if (metaDescription && metaDescription.trim().length > 10) {
        const activeDesc = metaDescription.trim().toLowerCase();
        const duplicateDesc = existingPosts.find(p =>
          p.id !== currentPostId &&
          p.meta_description &&
          p.meta_description.toLowerCase().trim() === activeDesc
        );
        if (duplicateDesc) {
          warnings.push({
            id: 'dup_desc',
            category: 'Duplicate',
            title: 'Duplicate meta description detected',
            detail: `Another post "${duplicateDesc.title}" already uses this meta description.`,
          });
        }
      }
    }

    // ── 5. MEDIA & INTERNAL LINK CHECKS ────────────────────────────────────
    if (featuredImage) {
      passed.push({
        id: 'featured_image_present',
        category: 'Media',
        title: 'Featured image attached',
        detail: 'Post includes a high-resolution featured image for article hero and social cards.',
      });

      if (featuredImageAlt && featuredImageAlt.trim().length > 0) {
        passed.push({
          id: 'featured_image_alt_present',
          category: 'Media',
          title: 'Featured image alt text provided',
          detail: `Alt text: "${featuredImageAlt}". Supports screen readers and image SEO.`,
        });
      } else {
        warnings.push({
          id: 'featured_image_alt_missing',
          category: 'Media',
          title: 'Missing featured image alt text',
          detail: 'Add descriptive alt text to the featured image for accessibility and Google Image ranking.',
        });
      }
    } else {
      warnings.push({
        id: 'featured_image_missing',
        category: 'Media',
        title: 'No featured image attached',
        detail: 'Articles with featured images receive significantly higher click-through rates on search and social media.',
      });
    }

    // Internal links or media tokens check
    const hasMediaTokens = /\[\[(image-[1-3]|video)\]\]/i.test(allBodyText);
    const hasLinks = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>/i.test(allBodyText) ||
                    /\[([^\]]+)\]\(([^)]+)\)/.test(allBodyText) ||
                    allBodyText.includes('http://') ||
                    allBodyText.includes('https://') ||
                    allBodyText.includes('/templates') ||
                    allBodyText.includes('/birthday-wishes');

    if (hasMediaTokens || hasLinks) {
      passed.push({
        id: 'internal_links_present',
        category: 'Content',
        title: 'Media tokens or links present',
        detail: 'Article contains embedded media tokens or references to enrich reader experience.',
      });
    } else {
      suggestions.push({
        id: 'internal_links_missing',
        category: 'Content',
        title: 'Consider linking to related templates or pages',
        detail: 'Add internal links to card templates or related wish guides to guide user journeys.',
      });
    }

    // Overall Score Calculation (out of 100)
    const totalChecks = passed.length + warnings.length + suggestions.length;
    const score = totalChecks > 0
      ? Math.round(((passed.length * 1.0 + suggestions.length * 0.4) / totalChecks) * 100)
      : 50;

    let healthColor = 'emerald';
    let healthLabel = 'Good SEO Health';
    if (warnings.length >= 3 || score < 60) {
      healthColor = 'amber';
      healthLabel = 'Needs Attention';
    }
    if (warnings.length >= 5 || score < 40) {
      healthColor = 'rose';
      healthLabel = 'Poor Optimization';
    }
    if (warnings.length === 0 && score >= 80) {
      healthColor = 'emerald';
      healthLabel = 'Excellent SEO Health';
    }

    return {
      wordCount,
      h2Count,
      score,
      healthColor,
      healthLabel,
      passed,
      warnings,
      suggestions,
    };
  }, [
    title, slug, sections, excerpt, primaryKeyword, secondaryKeywords,
    relatedKeywords, seoTitle, metaDescription, canonicalUrl, featuredImage,
    featuredImageAlt, existingPosts, currentPostId
  ]);

  return (
    <div className="bg-[#11141e] border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* ── HEADER & SCORE BAR ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Real-Time SEO &amp; Content Analysis</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                Live Audit
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates keyword placement, structural readability, and search snippet metadata
            </p>
          </div>
        </div>

        {/* Score pill */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400">SEO Health</p>
            <p className={`text-xs font-bold ${
              analysis.healthColor === 'emerald' ? 'text-emerald-400' :
              analysis.healthColor === 'amber' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {analysis.healthLabel}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-extrabold border ${
            analysis.healthColor === 'emerald'
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
              : analysis.healthColor === 'amber'
              ? 'bg-amber-500/10 border-amber-500/25 text-amber-300'
              : 'bg-rose-500/10 border-rose-500/25 text-rose-300'
          }`}>
            {analysis.score}
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
          <p className="text-[11px] text-slate-500 font-medium">Word Count</p>
          <p className="text-lg font-bold text-white mt-0.5">{analysis.wordCount}</p>
          <p className="text-[10px] text-slate-500">
            {analysis.wordCount >= 600 ? '✓ In-depth' : analysis.wordCount >= 300 ? '✓ Standard' : 'Needs expansion'}
          </p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
          <p className="text-[11px] text-slate-500 font-medium">Headings (H2)</p>
          <p className="text-lg font-bold text-white mt-0.5">{analysis.h2Count}</p>
          <p className="text-[10px] text-slate-500">
            {analysis.h2Count >= 2 ? '✓ Structured' : 'Add sections'}
          </p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
          <p className="text-[11px] text-slate-500 font-medium">Passed Checks</p>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">{analysis.passed.length}</p>
          <p className="text-[10px] text-slate-500">
            {analysis.warnings.length} warnings
          </p>
        </div>
      </div>

      {/* ── WARNINGS / NEEDS ATTENTION ─────────────────────────────── */}
      {analysis.warnings.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs Attention ({analysis.warnings.length})</span>
          </div>
          <div className="space-y-2">
            {analysis.warnings.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-amber-300">{item.title}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/10 text-amber-400 font-mono">
                    {item.category}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PASSED CHECKS ─────────────────────────────────────────── */}
      {analysis.passed.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Passed Checks ({analysis.passed.length})</span>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {analysis.passed.map(item => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-200 text-xs">{item.title}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-400 font-mono">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTIONABLE SUGGESTIONS ────────────────────────────────── */}
      {analysis.suggestions.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Info className="w-3.5 h-3.5" />
            <span>Suggestions &amp; Editorial Opportunities ({analysis.suggestions.length})</span>
          </div>
          <div className="space-y-1.5">
            {analysis.suggestions.map(item => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-xs flex items-start gap-2.5"
              >
                <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-300 text-xs">{item.title}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOAnalyzerPanel;
