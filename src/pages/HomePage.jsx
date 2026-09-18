import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedTemplates } from '../components/home/FeaturedTemplates';
import { BirthdayWishesDiscovery } from '../components/home/BirthdayWishesDiscovery';
import { HowItWorks } from '../components/home/HowItWorks';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { FAQSection } from '../components/home/FAQSection';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Sparkles, PartyPopper } from 'lucide-react';

// PERFORMANCE: HomePage now renders without Motion (129 KB saved from critical path)
// Motion can be lazy-loaded later for below-fold animations if desired

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      <SEOHead
        title="Birthday Wishes & Digital Birthday Cards | Birthday Wishes"
        description="Create beautiful birthday wishes and personalized digital birthday cards. Choose stylish templates, customize heartfelt messages and photos, and share instantly via a link."
        canonicalUrl="/"
      />

      {/* 1. Hero — above-fold, NOT deferred */}
      <HeroSection />

      {/* Featured cards: NO parent content-visibility.
          Parent cv was unlocking ~3100px of cards in one paint (contain-intrinsic-size
          was 600px). Each card uses its own content-visibility instead. */}
      <FeaturedTemplates />
      <div className="cv-section cv-section-tall"><BirthdayWishesDiscovery /></div>
      <div className="cv-section"><HowItWorks /></div>
      <div className="cv-section cv-section-md"><FeaturesSection /></div>
      <div className="cv-section cv-section-md"><FAQSection /></div>

      {/* CTA Banner - CSS animations instead of Motion */}
      <section className="cv-section py-12 sm:py-16 relative overflow-hidden bg-gradient-to-b from-[#090b10] via-[#151128] to-[#090b10] border-t border-white/[0.06]">
        <div className="absolute inset-0 bg-radial-gradient from-brand-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
              <span>Make Someone Smile Today</span>
            </div>

            <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight break-words-safe">
              Ready to Craft an <span className="text-gold-foil">Unforgettable</span> Birthday Moment?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              No apps to download. No account required to start. Select a luxury design, personalize your heartfelt message, and share instant joy in seconds.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="gold"
                size="xl"
                icon={Sparkles}
                iconPosition="right"
                className="w-full sm:w-auto shadow-2xl"
                onClick={() => navigate('/templates')}
              >
                Create Free Birthday Card Now
              </Button>

              <Button
                variant="secondary"
                size="xl"
                className="w-full sm:w-auto"
                onClick={() => navigate('/dashboard')}
              >
                View My Saved Cards
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;