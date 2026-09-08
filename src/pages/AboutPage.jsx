import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Award, Users, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';

export const AboutPage = () => {
  return (
    <div className="py-10 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="About AuraWish - Beautiful Birthday Wishes & Digital Cards"
        description="Learn about AuraWish's mission to transform birthdays into cinematic celebration moments through handcrafted digital cards, heartfelt wishes, and music."
        canonicalUrl="/about"
      />

      <Breadcrumbs items={[{ label: 'About Us', href: '/about' }]} />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto my-8 sm:my-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Our Vision & Craftsmanship</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight mb-6">
          Making Everyday Birthdays Feel <span className="text-gold-foil">Unforgettable</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          AuraWish was built on a simple premise: physical greeting cards often get lost, while generic text messages lack emotional weight. We set out to build an interactive digital celebration studio that combines tactile elegance with modern web technology.
        </p>
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="p-6 rounded-2xl bg-[#11141e] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Genuine Emotional Connection</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every template, typeface, and musical melody is selected to evoke nostalgia, appreciation, and joy between real friends and family.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#11141e] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Bespoke Design Aesthetics</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            We avoid cookie-cutter designs. From velvet luxury foil textures to cyber-neon energy, our cards feel like premium artisanal keepsakes.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#11141e] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Accessible to Everyone</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Recipients don't need an app or account to open their card. A simple tap in any browser opens their interactive birthday surprise.
          </p>
        </div>
      </div>

      {/* Editorial Content Section */}
      <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed my-12 border-t border-slate-800 pt-10">
        <h2 className="text-2xl font-display font-bold text-white">Why Digital Greetings Matter</h2>
        <p>
          In a world where families and friends often live in different cities, countries, and time zones, physical mail can be slow or unreliable. AuraWish bridges miles in seconds without sacrificing the ceremony of opening a personal greeting card.
        </p>
        <p>
          We also believe in global linguistic celebration. AuraWish provides full support for over 25 languages, featuring genuine Urdu Nastaliq and Arabic Naskh typography with proper right-to-left layout direction. Everyone deserves to be celebrated in their mother tongue.
        </p>
      </div>

      {/* CTA Section */}
      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-brand-900/30 via-[#151128] to-amber-900/20 border border-brand-500/20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Experience AuraWish Studio</h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Explore our hand-crafted card templates or find the perfect birthday wish for someone special today.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link to="/templates">
            <Button variant="gold" size="lg" icon={Sparkles}>
              Explore Card Templates
            </Button>
          </Link>
          <Link to="/birthday-wishes">
            <Button variant="secondary" size="lg">
              Browse Birthday Wishes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
