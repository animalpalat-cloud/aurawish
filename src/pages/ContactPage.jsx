import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, HelpCircle } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';

export const ContactPage = () => {
  const { addToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      addToast('Thank you! Your message has been received.', 'success');
    }, 600);
  };

  return (
    <div className="py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Contact Birthday Wishes - Support & Inquiries"
        description="Have questions about Birthday Wishes card maker, template suggestions, or feedback? Get in touch with our team."
        canonicalUrl="/contact"
      />

      <Breadcrumbs items={[{ label: 'Contact Us', href: '/contact' }]} />

      <div className="text-center max-w-2xl mx-auto my-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-3">
          Get in Touch With Us
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Have a question about our digital birthday cards, custom font support, or ideas for new templates? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-10">
        {/* Support details */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#11141e] border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white">How We Can Help</h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Card maker technical guidance & live preview tips</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Template suggestions and custom design requests</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Urdu & multilingual typography assistance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Partnerships & creator collaborations</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-slate-300 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-brand-300 font-semibold">
              <HelpCircle className="w-4 h-4" />
              <span>Looking for Quick Answers?</span>
            </div>
            <p>
              Check out our FAQs on the homepage for common questions about photo upload, audio tracks, and share links.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#11141e] border border-slate-800 shadow-xl">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Received!</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out. We will review your inquiry and get back to you as soon as possible.
                </p>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Template Suggestion">Template / Style Suggestion</option>
                    <option value="Technical Issue">Card Maker or Download Issue</option>
                    <option value="Language Support">Urdu or Multi-Language Support</option>
                    <option value="Feedback">Feature Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={Send}
                  className="w-full shadow-lg shadow-brand-500/20"
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
