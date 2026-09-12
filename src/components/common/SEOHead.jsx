import React, { useEffect } from 'react';

export const SEOHead = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://birthdaywishly.com/og-cover.jpg',
  schemaJson,
  noIndex = false
}) => {
  // Single source of truth for the production domain.
  // All canonical URLs and og:url values are built from this constant.
  const SITE_URL = 'https://birthdaywishly.com';

  useEffect(() => {
    // 1. Title Tag
    const formattedTitle = title.includes('Birthday Wishes') ? title : `${title} | Birthday Wishes`;
    document.title = formattedTitle;

    // Helper to upsert meta tag
    const setMeta = (attr, key, content) => {
      if (!content) return;
      let elem = document.querySelector(`meta[${attr}="${key}"]`);
      if (!elem) {
        elem = document.createElement('meta');
        elem.setAttribute(attr, key);
        document.head.appendChild(elem);
      }
      elem.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMeta('name', 'description', description);
    if (noIndex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      setMeta('name', 'robots', 'index, follow');
    }

    // 3. Open Graph Tags
    setMeta('property', 'og:title', formattedTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    if (ogImage) setMeta('property', 'og:image', ogImage);

    // Canonical is always the clean path on the production domain —
    // no query parameters, no fragments, consistent trailing-slash handling.
    const cleanPath = canonicalUrl
      ? canonicalUrl.split('?')[0].split('#')[0]   // strip ?query and #hash
      : window.location.pathname;                   // current path as fallback
    const fullCanonical = `${SITE_URL}${cleanPath}`;

    setMeta('property', 'og:url', fullCanonical);
    setMeta('property', 'og:site_name', 'Birthday Wishes');

    // 4. Twitter Cards
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', formattedTitle);
    setMeta('name', 'twitter:description', description);
    if (ogImage) setMeta('name', 'twitter:image', ogImage);

    // 5. Canonical Link — exactly one per page, always pointing to the clean URL
    let canonicalElem = document.querySelector('link[rel="canonical"]');
    if (!canonicalElem) {
      canonicalElem = document.createElement('link');
      canonicalElem.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElem);
    }
    canonicalElem.setAttribute('href', fullCanonical);

    // 6. Schema.org JSON-LD Script
    let schemaScript = document.getElementById('aura-schema-ld');
    if (schemaJson) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'aura-schema-ld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schemaJson);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, canonicalUrl, ogType, ogImage, schemaJson, noIndex, SITE_URL]);

  return null;
};

export default SEOHead;
