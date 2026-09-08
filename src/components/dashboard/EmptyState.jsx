import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PlusCircle } from 'lucide-react';
import { Button } from '../common/Button';

export const EmptyState = ({
  title = "No cards created yet",
  description = "Start by picking a luxury template and personalize it for someone special today.",
  ctaText = "Create Your First Card",
  ctaLink = "/templates"
}) => {
  return (
    <div className="text-center py-16 px-4 bg-[#11141e]/50 border border-slate-800 rounded-3xl max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4 text-brand-400">
        <Sparkles className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">{description}</p>
      <Link to={ctaLink}>
        <Button variant="primary" size="md" icon={PlusCircle}>
          {ctaText}
        </Button>
      </Link>
    </div>
  );
};
