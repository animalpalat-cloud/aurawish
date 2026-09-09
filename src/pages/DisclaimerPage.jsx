import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const DisclaimerPage = () => {
  return (
    <div className="py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Disclaimer - Birthday Wishes"
        description="Legal and informational disclaimer regarding Birthday Wishes digital greeting cards, user content, audio, and web links."
        canonicalUrl="/disclaimer"
      />

      <Breadcrumbs items={[{ label: 'Disclaimer', href: '/disclaimer' }]} />

      <div className="my-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-2">
          Disclaimer
        </h1>
        <p className="text-xs text-slate-400">Last updated: September 2026</p>
      </div>

      <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800 pt-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">General Information</h2>
          <p>
            The content, greeting card ideas, birthday messages, and editorial guides published on Birthday Wishes are intended for personal entertainment and celebration purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">User-Generated Content</h2>
          <p>
            Birthday Wishes allows creators to compose personal text messages and upload photographs to generate shareable digital cards. Birthday Wishes does not endorse, verify, or assume liability for opinions, claims, or media uploaded by individual users.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Third-Party Platforms & Sharing</h2>
          <p>
            When sharing card links across external messaging apps (such as WhatsApp, Telegram, or Facebook Messenger), the presentation of link previews may vary based on third-party platform specifications.
          </p>
        </section>
      </div>
    </div>
  );
};

export default DisclaimerPage;
