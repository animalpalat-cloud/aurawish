import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, BookOpen, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { BIRTHDAY_IDEAS } from '../data/birthdayIdeasData';

export const BirthdayIdeasHubPage = () => {
  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Birthday Ideas - Message Inspiration, Surprises & Guides | Birthday Wishes"
        description="Explore curated editorial guides on how to write meaningful birthday cards, creative surprise ideas, digital card tips, and etiquette."
        canonicalUrl="/birthday-ideas"
      />

      <Breadcrumbs items={[{ label: 'Birthday Ideas', href: '/birthday-ideas' }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto my-8 sm:my-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Celebration Editorial & Guides</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
          Birthday Message <span className="text-gold-foil">Inspiration</span> & Ideas
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Practical advice, step-by-step writing frameworks, and creative long-distance celebration ideas to help you craft heartfelt moments.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BIRTHDAY_IDEAS.map((article) => (
          <Link
            key={article.slug}
            to={`/birthday-ideas/${article.slug}`}
            className="group rounded-3xl bg-[#11141e] border border-slate-800 hover:border-brand-500/40 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 font-medium">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {article.readTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                {article.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-brand-400 group-hover:text-brand-300">
              <span>Read complete guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Pre-footer card maker banner */}
      <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-900/30 via-[#121622] to-amber-900/20 border border-brand-500/20 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Turn These Ideas Into a Live Digital Card
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Ready to put your words into action? Pick any luxury template, customize font and music, and share an unboxing moment.
        </p>
        <Link to="/templates">
          <Button variant="gold" size="lg" icon={Sparkles}>
            Explore Card Templates
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BirthdayIdeasHubPage;
