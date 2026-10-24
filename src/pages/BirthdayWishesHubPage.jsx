import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Users, Compass, ArrowRight, Search, PartyPopper } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { WishCard } from '../components/common/WishCard';
import { Button } from '../components/common/Button';
import { RELATIONSHIP_CATEGORIES, STYLE_CATEGORIES } from '../data/birthdayWishesData';

export const BirthdayWishesHubPage = () => {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredRelationships = RELATIONSHIP_CATEGORIES.filter(c =>
    c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.intro.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredStyles = STYLE_CATEGORIES.filter(c =>
    c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.intro.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const featuredWishes = [
    "May your day be filled with warm tea, genuine laughter, and all the quiet happiness you so richly deserve.",
    "Happy birthday to the one person who knows all my quirks and still chooses to be seen with me in public!",
    "No matter how old I grow, your arms will always be my safest place. Happy birthday to the best mother in the world.",
    "A true friend remembers your birthday but conveniently forgets your exact age. Have a blast!",
    "In a world full of noise, your love is my quiet sanctuary. Happy birthday, my dearest love.",
    "Cheers to another fabulous trip around the sun! Wishing you health, happiness, and big wins."
  ];

  return (
    <div className="pt-6 pb-12 sm:pt-8 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Birthday Wishes - Heartfelt, Funny & Romantic Messages | Birthday Wishes"
        description="Discover genuinely heartfelt, funny, romantic, and sweet birthday wishes for mom, dad, best friends, and partners. Turn any message into a digital birthday card."
        canonicalUrl="/birthday-wishes/"
      />

      <Breadcrumbs items={[{ label: 'Birthday Wishes', href: '/birthday-wishes/' }]} />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto my-8 sm:my-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <PartyPopper className="w-3.5 h-3.5 text-brand-400" />
          <span>Curated Birthday Wishes & Greetings</span>
        </div>

        <h1 className="text-2xl xs:text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight break-words-safe">
          Find the Perfect <span className="text-gold-foil">Birthday Wish</span> for Anyone
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Stuck on what to say? Browse hundreds of touchingly original birthday messages organized by relationship and emotional tone. Put any wish directly into an interactive digital greeting card in one click.
        </p>

        {/* Quick Search */}
        <div className="pt-4 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by relationship or tone (e.g. Mom, Funny, Best Friend)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#11141e] border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Relationship Categories Grid */}
      <div className="my-14 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-400" />
              <span>Wishes by Relationship</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Tailored emotional messages for family members, partners, and friends.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRelationships.map((cat) => (
            <Link
              key={cat.slug}
              to={`/${cat.slug}/`}
              className="group p-5 rounded-2xl bg-[#11141e] border border-slate-800 hover:border-brand-500/50 transition-all duration-200 hover:-translate-y-0.5 shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors mb-1.5 flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.intro}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>{cat.wishes.length} hand-crafted messages</span>
                <span className="text-amber-400/80 font-medium">Explore &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Style & Tone Categories Grid */}
      <div className="my-14 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Wishes by Style & Mood</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Whether you want laugh-out-loud humor or deeply romantic poetry.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStyles.map((cat) => (
            <Link
              key={cat.slug}
              to={`/${cat.slug}/`}
              className="group p-5 rounded-2xl bg-[#11141e] border border-slate-800 hover:border-amber-500/50 transition-all duration-200 hover:-translate-y-0.5 shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.intro}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-slate-400 capitalize">{cat.navLabel}</span>
                <span className="text-amber-400/80 font-medium">Read wishes &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Quotes Showcase */}
      <div className="my-16 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Trending Birthday Wishes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Click "Put in Card" to instantly load any message into our luxury card editor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredWishes.map((wish, idx) => (
            <WishCard key={idx} wish={wish} templateId="velvet-luxury" />
          ))}
        </div>
      </div>

      {/* Pre-footer Call to Action */}
      <div className="p-6 sm:p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-brand-900/40 via-[#131726] to-amber-900/30 border border-brand-500/20 text-center space-y-5">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white break-words-safe">
          Create an Interactive Digital Card With Your Words
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Take your favorite birthday wish and bring it to life with animated confetti, ambient background music, and customized typography.
        </p>
        <Link to="/templates/">
          <Button variant="gold" size="lg" icon={Sparkles}>
            Choose a Luxury Card Template
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BirthdayWishesHubPage;
