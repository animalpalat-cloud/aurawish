import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CookiePolicyPage = () => {
  return (
    <div className="py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Cookie Policy - Birthday Wishes"
        description="Learn how Birthday Wishes uses essential cookies and browser storage to power digital card customization and studio sessions."
        canonicalUrl="/cookie-policy"
      />

      <Breadcrumbs items={[{ label: 'Cookie Policy', href: '/cookie-policy' }]} />

      <div className="my-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-2">
          Cookie Policy
        </h1>
        <p className="text-xs text-slate-400">Last updated: September 2026</p>
      </div>

      <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800 pt-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">What Are Cookies & Local Storage?</h2>
          <p>
            Cookies and browser local storage are small text files stored on your computer or mobile device when you visit web pages. They enable web applications to remember your preferences and session state.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">How Birthday Wishes Uses Storage</h2>
          <p>
            Birthday Wishes prioritizes a seamless creator experience. We use storage for:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400 text-sm">
            <li>
              <strong className="text-slate-200">Essential Studio Functionality:</strong> Remembering your chosen card template, draft text inputs, custom fonts, and audio track selections so your progress is not lost when navigating.
            </li>
            <li>
              <strong className="text-slate-200">Authentication & Accounts:</strong> Maintaining secure login tokens when you sign in via Google OAuth or email.
            </li>
            <li>
              <strong className="text-slate-200">Performance & Caching:</strong> Caching web fonts and template configurations to ensure swift rendering without latency.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Managing Cookies</h2>
          <p>
            You can configure your browser to reject cookies or clear local storage at any time. Note that clearing local storage may erase unsaved in-progress card drafts.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
