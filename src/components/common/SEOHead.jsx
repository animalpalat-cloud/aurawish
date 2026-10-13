import React, { useEffect } from 'react';

export const SEOHead = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://www.birthdaywishly.com/og-cover.jpg',
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  twitterImage,
  schemaJson,
  noIndex = false,
  robotsDirective,
}) => {
  // Single source of truth for the production domain.
  // All canonical URLs and og:url values are built from this constant.
  const SITE_URL = 'https://www.birthdaywishly.com';

  useEffect(() => {
    // 1. Title Tag
    const formattedTitle = title?.includes('Birthday Wishes') ? title : `${title || 'Birthday Wishes'} | Birthday Wishes`;
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
    
    // Robots directive handling
    if (robotsDirective) {
      setMeta('name', 'robots', robotsDirective);
    } else if (noIndex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      setMeta('name', 'robots', 'index, follow');
    }

    // 3. Open Graph Tags
    const finalOgTitle = ogTitle || formattedTitle;
    const finalOgDesc = ogDescription || description;
    const finalOgImage = ogImage || 'https://www.birthdaywishly.com/og-cover.jpg';

    setMeta('property', 'og:title', finalOgTitle);
    setMeta('property', 'og:description', finalOgDesc);
    setMeta('property', 'og:type', ogType);
    if (finalOgImage) setMeta('property', 'og:image', finalOgImage);

    // Canonical is always the clean path on the production domain —
    // no query parameters, no fragments, consistent trailing-slash handling.
    let fullCanonical;
    if (canonicalUrl?.startsWith('http://') || canonicalUrl?.startsWith('https://')) {
      // Normalize any non-www or http domain to the single preferred HTTPS www domain
      try {
        const parsed = new URL(canonicalUrl);
        fullCanonical = `${SITE_URL}${parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/$/, '')}`;
      } catch (e) {
        fullCanonical = canonicalUrl.replace(/^https?:\/\/(?:www\.)?birthdaywishly\.com/, SITE_URL);
      }
    } else {
      const cleanPath = canonicalUrl
        ? canonicalUrl.split('?')[0].split('#')[0]   // strip ?query and #hash
        : window.location.pathname;                   // current path as fallback
      const normalizedPath = cleanPath === '/' ? '/' : (cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`).replace(/\/$/, '');
      fullCanonical = `${SITE_URL}${normalizedPath}`;
    }

    setMeta('property', 'og:url', fullCanonical);
    setMeta('property', 'og:site_name', 'Birthday Wishes');

    // 4. Twitter Cards
    const finalTwTitle = twitterTitle || finalOgTitle;
    const finalTwDesc = twitterDescription || finalOgDesc;
    const finalTwImage = twitterImage || finalOgImage;

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', finalTwTitle);
    setMeta('name', 'twitter:description', finalTwDesc);
    if (finalTwImage) setMeta('name', 'twitter:image', finalTwImage);

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
  }, [
    title, description, canonicalUrl, ogType, ogImage, ogTitle, ogDescription,
    twitterTitle, twitterDescription, twitterImage, schemaJson, noIndex, robotsDirective, SITE_URL
  ]);

  return null;
};

export default SEOHead;
