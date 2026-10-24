import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const normalizeHref = (href) => {
  if (!href) return '';
  if (href === '/') return '/';
  const clean = href.startsWith('/') ? href : `/${href}`;
  return clean.endsWith('/') ? clean : `${clean}/`;
};

export const Breadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://birthdaywishly.com/"
      },
      ...items.map((item, index) => {
        const cleanHref = normalizeHref(item.href);
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": item.label,
          "item": cleanHref ? `https://birthdaywishly.com${cleanHref}` : undefined
        };
      })
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="py-4 text-xs">
        <ol className="flex items-center flex-wrap gap-1.5 text-slate-400">
          <li className="flex items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </li>

          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const cleanHref = normalizeHref(item.href);
            return (
              <li key={idx} className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                {isLast || !cleanHref ? (
                  <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={cleanHref}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
