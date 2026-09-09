import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

export const FAQS = [
  {
    q: 'What is Birthday Wishes?',
    a: 'Birthday Wishes is a digital birthday card and greeting platform that lets you create, personalize, and share interactive birthday cards online. Instead of sending a static image or a plain text message, Birthday Wishes delivers an interactive celebration with custom photos, ambient music, particle animations, and a 3D digital envelope unboxing experience.'
  },
  {
    q: 'How do I create a birthday card online with Birthday Wishes?',
    a: 'Creating a birthday card takes less than two minutes: choose an artist-designed template from our catalog, customize the recipient name, age, and personal birthday message, upload a favorite photo, and select background music. You can preview changes live in real-time before generating your card.'
  },
  {
    q: 'Can I personalize the message and typography on the card?',
    a: 'Yes, every card is completely customizable. You can write your own birthday message or pick from our curated collection of emotional, funny, romantic, and milestone greetings. You can also select from over 150 typography styles including classic serif, modern sans, luxury display, and authentic Urdu Nastaliq fonts.'
  },
  {
    q: 'Can I add a photo, music, and celebration animations?',
    a: 'Yes. You can upload a photo of the celebrator, which will be framed elegantly according to your chosen template design. You can also pair your card with celebration soundtracks (such as Lofi Birthday Chill or Acoustic Joy) and choose ambient particle effects like floating gold sparkles, confetti bursts, or starlight auras.'
  },
  {
    q: 'How do I share the birthday card with the recipient?',
    a: 'Once you finalize your design, Birthday Wishes generates a unique, private shareable link (e.g. birthdaywishes.com/card/abc123). You can send this link directly via WhatsApp, SMS, iMessage, Email, or social media. When the recipient opens the link, they experience a 3D envelope unboxing with background music and your personalized card.'
  },
  {
    q: 'Can I download the birthday card as an image or video?',
    a: 'Yes. In addition to online link sharing, you can download your birthday card as an ultra-sharp 1080×1080 PNG image for print and messaging, or export an animated MP4 video with synchronized celebration music.'
  },
  {
    q: 'Does Birthday Wishes support multiple languages such as Urdu, Arabic, Hindi, or Spanish?',
    a: 'Yes. Birthday Wishes features a real multi-language rendering engine supporting 25 major world languages, complete with native scripts (Arabic, Perso-Arabic, Devanagari, CJK, Cyrillic, Greek, Latin) and automatic RTL/LTR text direction. You can select your language and pair it with authentic script-compatible fonts without broken characters.'
  },
  {
    q: 'Do recipients need to install an app or register an account to view their card?',
    a: 'No app download or account registration is needed. The shared birthday card link opens smoothly in any standard mobile or desktop web browser on iPhone, Android, tablet, Mac, or PC.'
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-20 bg-[#07080c] border-t border-white/[0.06] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Everything you need to know about creating, customizing, and sharing digital birthday cards on Birthday Wishes.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0e111a] border border-slate-800/80 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/40">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
