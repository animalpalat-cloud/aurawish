import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const TermsPage = () => {
  return (
    <div className="py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Terms & Conditions - AuraWish"
        description="Review the terms and conditions governing the use of AuraWish's digital greeting card services and website."
        canonicalUrl="/terms"
      />

      <Breadcrumbs items={[{ label: 'Terms & Conditions', href: '/terms' }]} />

      <div className="my-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-2">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-400">Last updated: September 2026</p>
      </div>

      <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800 pt-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using AuraWish, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Acceptable Use Policy</h2>
          <p>
            AuraWish is designed to spread celebration, kindness, and joy. You agree not to use the platform to generate cards containing:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm">
            <li>Harassing, defamatory, threatening, or abusive content.</li>
            <li>Sexually explicit material or imagery.</li>
            <li>Copyright-infringing or unauthorized photography.</li>
            <li>Fraudulent promotions or malicious links.</li>
          </ul>
          <p>
            We reserve the right to remove any cards reported for violating these standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Intellectual Property</h2>
          <p>
            The software, visual styling, templates, card engine, and brand assets of AuraWish are the intellectual property of AuraWish. Users retain ownership of their personal written messages and uploaded family photographs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Availability & Warranty</h2>
          <p>
            AuraWish provides its digital greeting tools on an "as-is" and "as-available" basis. While we strive for 100% uptime and reliable link delivery, we do not warrant that service will be uninterrupted or error-free.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
