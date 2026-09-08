import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedTemplates } from '../components/home/FeaturedTemplates';
import { BirthdayWishesDiscovery } from '../components/home/BirthdayWishesDiscovery';
import { HowItWorks } from '../components/home/HowItWorks';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { FAQSection } from '../components/home/FAQSection';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Sparkles, ArrowRight, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage = () => {
  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Section (H1: Create Beautiful Birthday Wishes & Digital Birthday Cards) */}
      <HeroSection />

      {/* 2. Featured Birthday Card Templates Showcase */}
      <FeaturedTemplates />

      {/* 3. Birthday Wishes by Relationship & Style (Intent-Satisfying Content & Internal Linking) */}
      <BirthdayWishesDiscovery />

      {/* 4. How It Works (3-step visual guide) */}
      <HowItWorks />

      {/* 5. Features Showcase: Personalization, Audio, Effects & Formats */}
      <FeaturesSection />

      {/* 6. Comprehensive FAQ Section (Structured Data Aligned) */}
      <FAQSection />

      {/* 8. Call to Action Pre-Footer Banner */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#090b10] via-[#151128] to-[#090b10] border-t border-white/[0.06]">
        <div className="absolute inset-0 bg-radial-gradient from-brand-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
              <span>Make Someone Smile Today</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
              Ready to Craft an <span className="text-gold-foil">Unforgettable</span> Birthday Moment?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              No apps to download. No account required to start. Select a luxury design, personalize your heartfelt message, and share instant joy in seconds.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/templates">
                <Button
                  variant="gold"
                  size="xl"
                  icon={Sparkles}
                  iconPosition="right"
                  className="w-full sm:w-auto shadow-2xl"
                >
                  Create Free Birthday Card Now
                </Button>
              </Link>
              
              <Link to="/dashboard">
                <Button
                  variant="secondary"
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  View My Saved Cards
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;