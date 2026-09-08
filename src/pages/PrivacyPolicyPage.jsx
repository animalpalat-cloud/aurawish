import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const PrivacyPolicyPage = () => {
  return (
    <div className="py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Privacy Policy - AuraWish"
        description="Review AuraWish's privacy policy, including how we handle card information, photos, session data, and user accounts."
        canonicalUrl="/privacy-policy"
      />

      <Breadcrumbs items={[{ label: 'Privacy Policy', href: '/privacy-policy' }]} />

      <div className="my-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">Last updated: September 2026</p>
      </div>

      <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800 pt-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
          <p>
            AuraWish respects your privacy. When you create digital greeting cards, we collect only the necessary information to render and deliver your card:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm">
            <li>Card content: recipient name, sender name, custom birthday messages, age, and template preferences.</li>
            <li>Optional user uploads: portrait photographs uploaded for card personalization.</li>
            <li>Account information: name, email, and authentication tokens if you register or sign in via Google OAuth or email.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. How Your Data Is Stored & Used</h2>
          <p>
            Card data is stored securely using cloud database infrastructure (Supabase) to enable live link sharing and recipient unboxing.
          </p>
          <p>
            Uploaded photos are stored in dedicated cloud buckets exclusively for the purpose of displaying them in the cards you choose to share. We never sell, rent, or monetize personal photos or private card messages.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Public Share Links & Privacy</h2>
          <p>
            When you generate a shareable card link, anyone with that unique alphanumeric link can view the card and its unboxing animation. Do not include sensitive personal identifiers (such as government IDs, bank details, or passwords) in your greeting card messages.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Cookies & Local Storage</h2>
          <p>
            AuraWish uses browser local storage and essential session cookies to remember your drafted cards, theme customizations, and active login sessions. These do not track you across unrelated third-party websites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Data Deletion Requests</h2>
          <p>
            If you wish to remove a previously generated card or account profile, you may delete it directly from your dashboard or contact our team for assistance.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
