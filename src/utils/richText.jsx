/**
 * richText.jsx
 *
 * Utility for rendering plain-text blog content with automatic internal linking
 * and inline media embedding (images & video) support.
 */

import React from 'react';
import DOMPurify from 'dompurify';
import { BlogInlineImage, BlogInlineVideo } from '../components/blog/BlogInlineMedia';

/**
 * Ordered list of phrase -> path mappings.
 */
const INTERNAL_LINK_RULES = [
  // audio greeting cards
  { phrase: 'audio greeting cards', to: '/audio-greeting-card' },
  { phrase: 'audio greeting card',  to: '/audio-greeting-card' },
  // audio / voice birthday cards
  { phrase: 'audio birthday card',  to: '/audio-birthday-card' },
  { phrase: 'voice birthday card',  to: '/audio-birthday-card' },
];

/**
 * Build a single RegExp that matches all target phrases (case-insensitive).
 */
function buildPattern() {
  const escaped = INTERNAL_LINK_RULES.map(({ phrase }) =>
    phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  return new RegExp(`(${escaped.join('|')})`, 'gi');
}

const LINK_PATTERN = buildPattern();

/**
 * applyInternalLinks
 *
 * Splits `text` on key phrases and returns a mixed array of strings and
 * React elements (the linked phrases).
 */
export function applyInternalLinks(text, LinkCmp) {
  if (!text || typeof text !== 'string') return [text];

  LINK_PATTERN.lastIndex = 0;

  const parts = text.split(LINK_PATTERN);

  return parts.map((part, i) => {
    if (!part) return null;

    const rule = INTERNAL_LINK_RULES.find(
      ({ phrase }) => phrase.toLowerCase() === part.toLowerCase()
    );

    if (rule) {
      return (
        <LinkCmp
          key={i}
          to={rule.to}
          className="text-brand-400 hover:text-brand-300 underline decoration-brand-500/40 underline-offset-2 transition-colors font-medium"
        >
          {part}
        </LinkCmp>
      );
    }

    return part;
  });
}

/**
 * applyBoldMarkdown
 *
 * Splits `text` on **...** markers and returns an array of strings /
 * <strong> elements. Composes with applyInternalLinks so both features work
 * simultaneously on the same line.
 *
 * @param {string} text
 * @param {React.ElementType} LinkCmp
 * @returns {Array}
 */
export function applyBoldMarkdown(text, LinkCmp) {
  if (!text || typeof text !== 'string') return [text];

  const BOLD_PATTERN = /(\*\*[^*]+\*\*)/g;
  const parts = text.split(BOLD_PATTERN);

  return parts.flatMap((part, i) => {
    if (!part) return [];
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const inner = part.slice(2, -2);
      return [
        <strong key={`b-${i}`} className="font-bold text-white">
          {applyInternalLinks(inner, LinkCmp)}
        </strong>
      ];
    }
    return applyInternalLinks(part, LinkCmp);
  });
}

/**
 * isMarkdownTableBlock
 *
 * Returns true when every non-empty line in a block starts and ends with `|`,
 * which is the CommonMark convention for pipe tables.
 */
function isMarkdownTableBlock(block) {
  const lines = block.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return false;
  return lines.every(l => l.trim().startsWith('|') && l.trim().endsWith('|'));
}

/**
 * renderMarkdownTable
 *
 * Converts a pipe-table string into a responsive, styled HTML table element.
 * The first row becomes `<th>` header cells; the second row (separator) is
 * skipped; subsequent rows become `<td>` data cells.
 */
function renderMarkdownTable(block, key) {
  const rawLines = block.trim().split('\n').filter(l => l.trim());

  // Parse a pipe row into an array of cell strings
  const parseCells = (line) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(c => c.trim());

  const headerCells = parseCells(rawLines[0]);
  // rawLines[1] is the separator row (--- | --- …) — skip it
  const bodyRows = rawLines.slice(2).map(parseCells);

  return (
    <div key={key} className="overflow-x-auto my-5 rounded-xl border border-slate-700/60 bg-slate-900/60">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-700/60">
            {headerCells.map((cell, ci) => (
              <th
                key={ci}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-800/60 whitespace-nowrap"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/20 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-sm text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Regex for matching media tags inside text:
 * [[image-1]], [[image-2]], [[image-3]], [[video]]
 * or markdown images: ![caption](url)
 * or explicit tags like [[image:url|caption]] or [[video:url|caption]]
 */
const MEDIA_TAG_PATTERN = /(\[\[image-(?:1|2|3)\]\]|\[\[video\]\]|\[\[(?:image|img|video):[^\]]+\]\]|!\[[^\]]*\]\([^)]+\))/gi;

/**
 * renderSectionBodyWithMedia
 *
 * Parses a section's body text (which may be Rich HTML from Quill/Word/Docs,
 * or Markdown/Plain-Text), preserves and renders inline media tokens
 * (`[[image-1]]`, `[[video]]`, etc.), formatted tables, headings, and lists.
 *
 * @param {string} body - The raw HTML or text of the section
 * @param {Object} mediaAssets - { image1, image2, image3, video, ... }
 * @param {React.ElementType} LinkCmp - The Link component
 */
export function renderSectionBodyWithMedia(body, mediaAssets = {}, LinkCmp) {
  if (!body || typeof body !== 'string') return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(body);

  if (isHtml) {
    return renderHtmlSectionWithMedia(body, mediaAssets, LinkCmp);
  }

  // Fallback for plain-text / markdown sections
  // Split into paragraphs by double newlines or single newlines
  const blocks = body.split(/\n{2,}/);

  return blocks.map((block, blockIdx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // ── Markdown table block ────────────────────────────────────────────────
    if (isMarkdownTableBlock(trimmed)) {
      return renderMarkdownTable(trimmed, `table-${blockIdx}`);
    }

    // Check if the entire block is a media tag or markdown media
    const isSingleTag = trimmed.match(/^(\[\[image-(?:1|2|3)\]\]|\[\[video\]\]|\[\[(?:image|img|video):[^\]]+\]\]|!\[[^\]]*\]\([^)]+\))$/i);

    if (isSingleTag) {
      const renderedMedia = renderMediaToken(trimmed, mediaAssets);
      if (renderedMedia) {
        return <React.Fragment key={`block-${blockIdx}`}>{renderedMedia}</React.Fragment>;
      }
    }

    // Block contains text and potentially inline media tags
    const segments = trimmed.split(MEDIA_TAG_PATTERN);

    const blockContent = segments.map((seg, segIdx) => {
      if (!seg) return null;

      // If segment is a media tag
      if (seg.match(MEDIA_TAG_PATTERN)) {
        const mediaEl = renderMediaToken(seg, mediaAssets);
        if (mediaEl) return <React.Fragment key={`media-${segIdx}`}>{mediaEl}</React.Fragment>;
      }

      // If segment is plain text (handle internal links, bold, and single linebreaks)
      const lines = seg.split('\n');
      return (
        <React.Fragment key={`text-${segIdx}`}>
          {lines.map((line, lIdx) => (
            <React.Fragment key={`line-${lIdx}`}>
              {lIdx > 0 && <br />}
              {applyBoldMarkdown(line, LinkCmp)}
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    });

    return (
      <p key={`p-${blockIdx}`} className="text-sm sm:text-base text-slate-300 leading-relaxed my-3">
        {blockContent}
      </p>
    );
  });
}

/**
 * renderHtmlSectionWithMedia
 * 
 * Safely sanitizes HTML from the rich text editor (Quill / Word / Docs) using DOMPurify,
 * splits on media placeholder tags ([[image-1]], [[video]], etc.),
 * and produces rich styled content with responsive tables and media elements.
 */
function renderHtmlSectionWithMedia(htmlString, mediaAssets = {}, LinkCmp) {
  // Sanitize HTML with DOMPurify while keeping tables, formatting tags, and links
  const sanitized = DOMPurify.sanitize(htmlString, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'span', 'div', 'img', 'hr'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt', 'title', 'style']
  });

  // Split on media tags like [[image-1]], [[video]], etc.
  const parts = sanitized.split(MEDIA_TAG_PATTERN);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.match(MEDIA_TAG_PATTERN)) {
      const mediaEl = renderMediaToken(part, mediaAssets);
      if (mediaEl) {
        return <React.Fragment key={`media-html-${index}`}>{mediaEl}</React.Fragment>;
      }
    }

    return (
      <div
        key={`html-${index}`}
        className="rich-text-content text-slate-300 leading-relaxed space-y-3"
        dangerouslySetInnerHTML={{ __html: part }}
      />
    );
  });
}

function renderMediaToken(token, mediaAssets = {}) {
  const norm = token.trim();

  // 1. Placeholder tokens: [[image-1]], [[image-2]], [[image-3]], [[video]]
  const imgNumMatch = norm.match(/^\[\[image-([1-3])\]\]$/i);
  if (imgNumMatch) {
    const num = imgNumMatch[1];
    const asset = mediaAssets[`image${num}`] || mediaAssets[`image_${num}`];
    if (asset) {
      const url = typeof asset === 'string' ? asset : asset.url;
      const caption = typeof asset === 'object' ? (asset.caption || '') : '';
      if (url) return <BlogInlineImage image={url} caption={caption} alt={`Article Image ${num}`} />;
    }
    return null;
  }

  if (norm.toLowerCase() === '[[video]]') {
    const asset = mediaAssets.video;
    if (asset) {
      const url = typeof asset === 'string' ? asset : (asset.url || asset.src);
      const caption = typeof asset === 'object' ? (asset.caption || '') : '';
      if (url) return <BlogInlineVideo video={url} caption={caption} />;
    }
    return null;
  }

  // 2. Custom tag: [[image:url|caption]] or [[img:url|caption]]
  const customImgMatch = norm.match(/^\[\[(?:image|img):([^|\]]+)(?:\|([^\]]*))?\]\]$/i);
  if (customImgMatch) {
    const url = customImgMatch[1].trim();
    const caption = customImgMatch[2] ? customImgMatch[2].trim() : '';
    return <BlogInlineImage image={url} caption={caption} alt={caption || 'Blog illustration'} />;
  }

  // 3. Custom tag: [[video:url|caption]]
  const customVidMatch = norm.match(/^\[\[video:([^|\]]+)(?:\|([^\]]*))?\]\]$/i);
  if (customVidMatch) {
    const url = customVidMatch[1].trim();
    const caption = customVidMatch[2] ? customVidMatch[2].trim() : '';
    return <BlogInlineVideo video={url} caption={caption} />;
  }

  // 4. Markdown image syntax: ![caption](url)
  const mdImgMatch = norm.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (mdImgMatch) {
    const caption = mdImgMatch[1].trim();
    const url = mdImgMatch[2].trim();
    return <BlogInlineImage image={url} caption={caption} alt={caption || 'Blog illustration'} />;
  }

  return null;
}
