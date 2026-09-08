import React, { useEffect } from 'react';

export const SEOHead = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://aurawish.com/og-cover.jpg',
  schemaJson,
  noIndex = false
}) => {
  useEffect(() => {
    // 1. Title Tag
    const formattedTitle = title.includes('AuraWish') ? title : `${title} | AuraWish`;
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
    const fullCanonical = canonicalUrl ? `https://aurawish.com${canonicalUrl}` : window.location.href;
    setMeta('property', 'og:url', fullCanonical);
    setMeta('property', 'og:site_name', 'AuraWish');

    // 4. Twitter Cards
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', formattedTitle);
    setMeta('name', 'twitter:description', description);
    if (ogImage) setMeta('name', 'twitter:image', ogImage);

    // 5. Canonical Link
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
  }, [title, description, canonicalUrl, ogType, ogImage, schemaJson, noIndex]);

  return null;
};

export default SEOHead;
