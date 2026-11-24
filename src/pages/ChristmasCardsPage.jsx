import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TreePine,
  Gift,
  Music,
  Camera,
  Share2,
  Heart,
  Star,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Eye,
  Sliders,
  Maximize2,
  Printer,
  FileDown,
  Smile,
  Flame,
  Award,
  Layers,
  Sparkle
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { CHRISTMAS_TEMPLATES } from '../data/christmasTemplatesData';
import { cn } from '../utils/cn';

const SUBCATEGORIES = [
  { id: 'all', name: 'All 100 Designs', count: 100, icon: Sparkles },
  { id: 'luxury', name: 'Luxury & Gold', count: 10, icon: Award },
  { id: 'floral', name: 'Botanical & Poinsettia', count: 10, icon: TreePine },
  { id: 'balloons', name: 'Festive & Celebration', count: 10, icon: Gift },
  { id: 'traditional', name: 'Traditional & Cozy', count: 10, icon: Flame },
  { id: 'winter', name: 'Snow & Wonderland', count: 10, icon: Sparkle },
  { id: 'cute', name: 'Cute & Family', count: 10, icon: Smile },
  { id: 'minimalist', name: 'Modern Minimalist', count: 10, icon: Layers },
  { id: 'spiritual', name: 'Religious & Spiritual', count: 10, icon: Star },
  { id: 'artistic', name: 'Creative 3D & Magic', count: 10, icon: Sparkles },
  { id: 'personalized', name: 'Photo & Keepsake', count: 10, icon: Camera },
];

const WISHES_DATA = [
  {
    category: 'Heartfelt & Family',
    wishes: [
      'Wishing you a joyous Christmas filled with laughter, warmth, and the cherished presence of those who matter most.',
      'May your holidays be wrapped in love, illuminated by joy, and blessed with memories to treasure all year long.',
      'From our family to yours, we send warmest Christmas wishes, good health, and peace for the New Year.'
    ]
  },
  {
    category: 'Religious & Spiritual',
    wishes: [
      'May the miraculous peace of that first holy night rest upon your home and fill your heart with divine light.',
      'Rejoice in the glorious gift of love, hope, and salvation this Christmas season. Grace and peace to you always.',
      'May the eternal light of Bethlehem guide your path and bless your household with peace and goodwill.'
    ]
  },
  {
    category: 'Short & Modern',
    wishes: [
      'Merry Christmas! May your holiday sparkle with joy, laughter, and cheer.',
      'Wishing you cozy winter nights, festive celebrations, and a bright and happy New Year ahead!',
      'Peace, love, and sweet holiday cookies! Wishing you the merry season you truly deserve.'
    ]
  },
  {
    category: 'Business & Professional',
    wishes: [
      'Warmest thoughts and best wishes for a wonderful Christmas and a thriving, prosperous New Year!',
      'Thank you for your valued partnership this year. Wishing you and your team peace and joy this holiday season.',
      'Season’s greetings from all of us! May your holiday break be restful and your upcoming year full of success.'
    ]
  }
];

const FAQS = [
  {
    q: 'Are these Christmas greeting cards really 100% free to personalize and send?',
    a: 'Yes, absolutely! Every single Christmas card design in our 100-template festive collection is 100% free. You can customize the recipient’s name, holiday message, typography, background music, festive animation effects (snow, sparkles, confetti), and upload your own family photos without any hidden costs, watermark fees, or subscription paywalls.'
  },
  {
    q: 'Can I add custom holiday music and animated falling snow to my Christmas card?',
    a: 'Yes! Our digital card maker features interactive 3D unboxing, realistic holiday envelope-opening animations, falling snowflakes or glittering gold dust effects, and high-quality background audio tracks including ambient piano, acoustic guitar, and cinematic holiday strings that play smoothly on both desktop and mobile devices.'
  },
  {
    q: 'How do I share the finished Christmas card with my family and friends?',
    a: 'Once customized, click "Save & Share" to generate your private interactive link. You can send it directly via WhatsApp, SMS text, Email, Facebook, Instagram, or iMessage. Recipients can tap to unbox the envelope, watch the snowfall effect, listen to the festive soundtrack, and read your personalized letter on any phone or browser.'
  },
  {
    q: 'Can I write Christmas messages in Urdu Nastaliq, Arabic, Hindi, or Spanish?',
    a: 'Yes! BirthdayWishly provides full multi-lingual typography support. You can type in Urdu (with authentic Noto Nastaliq Urdu formatting), Arabic, Hindi, Spanish, French, or English, and adjust font sizes, alignment, and styling in real-time in the live card editor.'
  },
  {
    q: 'Can I print these Christmas cards or download them as high-resolution PDFs?',
    a: 'Yes! In addition to sharing an interactive digital card link, you can export a print-ready, high-resolution 300 DPI PDF file or print directly from your browser, making it effortless to produce physical holiday greeting cards at home or at a local print shop.'
  },
  {
    q: 'Do recipients need to install an app or create an account to view their Christmas card?',
    a: 'Never! Your recipient simply taps your shared link and the interactive holiday card loads instantly in any modern web browser without downloading any apps or logging in.'
  },
  {
    q: 'What types of Christmas card designs are included in this collection?',
    a: 'Our curated collection spans 10 unique aesthetic styles: Luxury Foil & Obsidian Gold, Botanical & Poinsettia Wreaths, Festive Balloons & Baubles, Traditional Hearth & Victorian Carol, Winter Wonderland & Ice Glaciers, Cute Family & Animal Pals, Modern Minimalist Typographic, Sacred Religious Nativity, Creative 3D Holographic, and Multi-Photo Keepsake layouts.'
  }
];

export const ChristmasCardsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return CHRISTMAS_TEMPLATES;
    return CHRISTMAS_TEMPLATES.filter(t => t.subcategory === activeCategory);
  }, [activeCategory]);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQS.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <SEOHead
        title="Free Christmas Cards Online – Create & Send Personalized Cards | BirthdayWishly"
        description="Create and send breathtaking Christmas cards online for free! Choose from 100+ luxury holiday designs, add photos, music, falling snow effects, and customize with your own holiday wishes."
        canonical="https://birthdaywishly.com/christmas-cards"
        schema={faqSchema}
      />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Templates', href: '/templates' },
            { label: 'Christmas Cards', href: '/christmas-cards' }
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-red-500/10">
        {/* Ambient festive background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium mb-6 backdrop-blur-md">
            <TreePine className="w-4 h-4 text-emerald-400" />
            <span>Premium 2026 Festive Collection – 100 Distinct Designs</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Beautiful Christmas Cards –{' '}
            <span className="bg-gradient-to-r from-red-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
              Create, Personalize & Send Online
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed">
            Delight your loved ones this holiday season with interactive 3D digital greeting cards.
            Customize with heartfelt messages, falling snow, festive holiday music, and family photos — 
            100% free with instant WhatsApp, SMS, and email sharing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#gallery"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white font-semibold shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <TreePine className="w-5 h-5 text-emerald-300" />
              <span>Explore Christmas Cards</span>
            </a>
            <Link
              to="/create/christmas-royal-gold-emerald"
              className="px-8 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 font-semibold hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Create Your Card Now</span>
            </Link>
          </div>

          {/* Quick value props pill bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3">
              <Gift className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">100% Free</div>
                <div className="text-xs text-slate-400">No subscriptions or watermarks</div>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3">
              <Music className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">Festive Music</div>
                <div className="text-xs text-slate-400">Piano, strings & guitar tunes</div>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3">
              <Camera className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">Photo Support</div>
                <div className="text-xs text-slate-400">Upload favorite memories</div>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3">
              <Share2 className="w-6 h-6 text-sky-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">Instant Sharing</div>
                <div className="text-xs text-slate-400">WhatsApp, SMS & 300 DPI PDF</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section id="gallery" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Choose from 100 Curated Christmas Card Designs
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Browse through 10 distinct holiday aesthetic themes. Click any card to customize its text, font, music, and photos.
          </p>
        </div>

        {/* Sub-category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
          {SUBCATEGORIES.map(sub => {
            const Icon = sub.icon;
            const isActive = activeCategory === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveCategory(sub.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0",
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-600/20"
                    : "bg-slate-900/70 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-amber-200" : "text-slate-400")} />
                <span>{sub.name}</span>
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full", isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400")}>
                  {sub.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.map(template => (
            <div
              key={template.templateId}
              className="group relative rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-red-500/40 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-red-950/30 flex flex-col justify-between"
            >
              {/* Card Thumbnail / Preview */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 shadow-inner">
                <div className={cn("absolute inset-0 bg-gradient-to-br", template.previewGradient)} />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Visual Card Mockup Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between items-center text-center">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-amber-300 uppercase">
                      {template.badge}
                    </span>
                    <TreePine className="w-4 h-4 text-emerald-400/80" />
                  </div>

                  <div className="my-auto">
                    <div
                      className="text-lg font-bold tracking-wide leading-tight text-white mb-1 drop-shadow-md"
                      style={{ fontFamily: template.fontFamily }}
                    >
                      {template.defaultData.title}
                    </div>
                    <div className="text-[11px] text-amber-200/90 font-serif tracking-widest uppercase">
                      {template.defaultData.recipientName}
                    </div>
                  </div>

                  <div className="w-full text-[10px] text-slate-300/80 italic line-clamp-2 px-1">
                    "{template.defaultData.message}"
                  </div>
                </div>

                {/* Hover overlay with action buttons */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-4">
                  <Link
                    to={`/create/${template.templateId}`}
                    className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs tracking-wide shadow-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Customize Card</span>
                  </Link>
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="w-full py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-medium text-xs tracking-wide flex items-center justify-center gap-1.5 transition-colors border border-slate-600/50"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Preview</span>
                  </button>
                </div>
              </div>

              {/* Template Info */}
              <div>
                <h3 className="font-semibold text-slate-100 text-sm mb-1 truncate group-hover:text-amber-300 transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {template.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Music className="w-3 h-3" /> Audio
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Sparkles className="w-3 h-3" /> {template.defaultEffect}
                  </span>
                  <Link
                    to={`/create/${template.templateId}`}
                    className="text-red-400 hover:text-red-300 font-medium flex items-center gap-0.5"
                  >
                    Open <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              How to Create Your Free Christmas Card in 4 Simple Steps
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              No design skills required. Create a personalized holiday greeting in less than 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 font-bold flex items-center justify-center mb-4 text-lg border border-red-500/20">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Select a Design</h3>
              <p className="text-sm text-slate-400">
                Pick from 100 curated festive styles, from opulent gold foils and snowy scenes to cute cartoons.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 font-bold flex items-center justify-center mb-4 text-lg border border-amber-500/20">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Personalize Text & Photo</h3>
              <p className="text-sm text-slate-400">
                Type your personal wishes, choose elegant fonts (including Urdu Nastaliq), and add family snapshots.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center mb-4 text-lg border border-emerald-500/20">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Pick Music & Effects</h3>
              <p className="text-sm text-slate-400">
                Add falling snowflakes, twinkling stars, or confetti, coupled with cozy acoustic or piano soundtracks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative">
              <div className="w-10 h-10 rounded-xl bg-sky-600/20 text-sky-400 font-bold flex items-center justify-center mb-4 text-lg border border-sky-500/20">
                4
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Send or Print</h3>
              <p className="text-sm text-slate-400">
                Share an interactive unboxing link via WhatsApp and email, or download a 300 DPI high-res PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Christmas Wishes & Message Inspiration Section */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Christmas Wishes & Message Inspiration
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Not sure what to write? Copy any of these curated holiday greetings directly into your card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WISHES_DATA.map((group, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-semibold text-amber-300 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                {group.category}
              </h3>
              <ul className="space-y-3">
                {group.wishes.map((w, wIdx) => (
                  <li key={wIdx} className="text-sm text-slate-300 leading-relaxed pl-4 border-l-2 border-red-500/30">
                    "{w}"
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="py-16 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Frequently Asked Questions About Christmas Cards
            </h2>
            <p className="text-slate-400">
              Everything you need to know about creating, personalizing, and sharing our free holiday greeting cards.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="font-semibold text-slate-100 text-sm sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0",
                        isOpen && "transform rotate-180 text-amber-400"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-emerald-950/60 border border-red-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Spread Holiday Cheer?
          </h2>
          <p className="text-slate-300 max-w-lg mx-auto mb-8 text-sm sm:text-base">
            Create an unforgettable Christmas card experience in minutes. Free forever, no app required.
          </p>
          <a
            href="#gallery"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold shadow-lg shadow-red-600/30 hover:scale-105 transition-transform"
          >
            <TreePine className="w-5 h-5" />
            <span>Choose Your Christmas Card</span>
          </a>
        </div>
      </section>

      {/* Quick Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl overflow-hidden">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white mb-2">{previewTemplate.name}</h3>
            <p className="text-xs text-slate-400 mb-4">{previewTemplate.description}</p>

            <div className={cn("aspect-[4/5] rounded-xl relative p-6 flex flex-col justify-between text-center mb-6 shadow-inner", previewTemplate.previewGradient)}>
              <div className="text-xs uppercase tracking-widest text-amber-200">
                {previewTemplate.defaultData.subtitle}
              </div>
              <div>
                <h4
                  className="text-2xl font-bold text-white drop-shadow-md mb-2"
                  style={{ fontFamily: previewTemplate.fontFamily }}
                >
                  {previewTemplate.defaultData.title}
                </h4>
                <div className="text-sm text-amber-100 font-serif">
                  {previewTemplate.defaultData.recipientName}
                </div>
              </div>
              <div className="text-xs text-slate-200/90 italic">
                "{previewTemplate.defaultData.message}"
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/create/${previewTemplate.templateId}`}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-center text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                <span>Customize This Design</span>
              </Link>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChristmasCardsPage;
