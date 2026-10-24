import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, Home } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <SEOHead
        title="404 Page Not Found | Birthday Wishes"
        description="The page you are looking for could not be found."
        canonicalUrl="/404"
        noIndex={true}
      />
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-6">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white mb-3">
        404
      </h1>
      <h2 className="text-xl font-semibold text-slate-200 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mb-8">
        The card or page you are looking for might have been moved or doesn't exist.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="secondary" size="md" icon={Home}>
            Back to Home
          </Button>
        </Link>
        <Link to="/templates/">
          <Button variant="primary" size="md" icon={Compass}>
            Explore Templates
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
