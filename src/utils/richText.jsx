/**
 * richText.jsx
 *
 * Utility for rendering plain-text blog content with automatic internal linking.
 *
 * Usage:
 *   import { applyInternalLinks } from '../utils/richText';
 *   // In a component:
 *   <p>{applyInternalLinks(text, LinkComponent)}</p>
 *
 * `LinkComponent` is passed in so this util stays framework-agnostic in tests,
 * but in practice you always pass the `Link` component from react-router-dom.
 */

import React from 'react';

/**
 * Ordered list of phrase -> path mappings.
 * Longer / more specific phrases come first so they match before shorter ones
 * that might be substrings (e.g. "audio greeting cards" before "audio greeting card").
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
 * Using a capturing group so split() keeps the matched text in the results.
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
 * React elements (the linked phrases). The caller renders this array
 * directly inside a block-level element, e.g.:
 *
 *   <p>{applyInternalLinks(text, Link)}</p>
 *
 * @param {string}            text    - Raw plain-text content from the CMS.
 * @param {React.ElementType} LinkCmp - The Link component (react-router-dom).
 * @returns {Array<string|React.ReactElement>}
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
