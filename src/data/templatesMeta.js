// Lightweight template metadata for initial page load
// Contains only the essential data needed for template cards (no full config/defaultData)
// Full template data is loaded lazily when needed

export const TEMPLATE_META = [
  {
    templateId: 'velvet-obsidian-gold',
    name: 'Velvet Obsidian Gold',
    category: 'luxury',
    badge: 'Premium',
    description: 'Opulent dark design with golden accents',
    previewGradient: 'from-[#0a0a0c] via-[#16181f] to-[#0a0a0c]',
    accentColor: '#E5C07B',
  },
  {
    templateId: 'rose-gold-glamour',
    name: 'Rose Gold Glamour',
    category: 'elegant',
    badge: 'Featured',
    description: 'Sophisticated rose gold with marble textures',
    previewGradient: 'from-[#2d1520] via-[#3d1f2f] to-[#2d1520]',
    accentColor: '#E0A899',
  },
  {
    templateId: 'midnight-purple-jewel',
    name: 'Midnight Purple Jewel',
    category: 'luxury',
    badge: 'Popular',
    description: 'Deep purple with amethyst glow',
    previewGradient: 'from-[#13091d] via-[#1e0f2e] to-[#13091d]',
    accentColor: '#C084FC',
  },
  {
    templateId: 'emerald-forest-glow',
    name: 'Emerald Forest Glow',
    category: 'elegant',
    badge: 'Trending',
    description: 'Rich emerald with nature-inspired elegance',
    previewGradient: 'from-[#0a1410] via-[#0f1e18] to-[#0a1410]',
    accentColor: '#6EE7B7',
  },
  {
    templateId: 'coral-sunset-dream',
    name: 'Coral Sunset Dream',
    category: 'modern',
    badge: 'New',
    description: 'Warm coral gradient with soft pastels',
    previewGradient: 'from-[#2d1a1a] via-[#3d2424] to-[#2d1a1a]',
    accentColor: '#FDA4AF',
  },
  {
    templateId: 'arctic-ice-blue',
    name: 'Arctic Ice Blue',
    category: 'minimal',
    badge: 'Clean',
    description: 'Crisp ice blue with minimal elegance',
    previewGradient: 'from-[#0c1821] via-[#162838] to-[#0c1821]',
    accentColor: '#7DD3FC',
  },
];

// For the featured section, we only need the first 6
export const getFeaturedTemplateMeta = () => TEMPLATE_META.slice(0, 6);

// Full template data loader - dynamically imports the full data only when needed
export const loadFullTemplateData = async () => {
  const module = await import('./templatesData.js');
  return module.TEMPLATES;
};

// Load a single template by ID (lazy)
export const loadTemplateById = async (templateId) => {
  const templates = await loadFullTemplateData();
  return templates.find(t => t.templateId === templateId) || templates[0];
};

// Categories are lightweight, can be included here
export const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'Sparkles' },
  { id: 'elegant', name: 'Elegant', icon: 'Feather' },
  { id: 'luxury', name: 'Luxury', icon: 'Crown' },
  { id: 'minimal', name: 'Minimal', icon: 'Layout' },
  { id: 'modern', name: 'Modern', icon: 'Layout' },
  { id: 'premium', name: 'Premium', icon: 'Crown' },
  { id: 'cute', name: 'Cute', icon: 'HeartHandshake' },
  { id: 'funny', name: 'Funny', icon: 'Laugh' },
  { id: 'romantic', name: 'Romantic', icon: 'Heart' },
  { id: 'love', name: 'Love', icon: 'Heart' },
  { id: 'best-friend', name: 'Best Friend', icon: 'Smile' },
  { id: 'family', name: 'Family', icon: 'Users' },
  { id: 'mom', name: 'Mom', icon: 'Heart' },
  { id: 'dad', name: 'Dad', icon: 'Crown' },
  { id: 'sister', name: 'Sister', icon: 'Smile' },
  { id: 'brother', name: 'Brother', icon: 'Zap' },
  { id: 'kids', name: 'Kids', icon: 'Baby' },
  { id: 'teen', name: 'Teen', icon: 'Flame' },
  { id: 'party', name: 'Party', icon: 'PartyPopper' },
  { id: 'floral', name: 'Floral', icon: 'Flower' },
  { id: 'vintage', name: 'Vintage', icon: 'Camera' },
  { id: 'artistic', name: 'Artistic', icon: 'Palette' },
  { id: 'tech', name: 'Tech', icon: 'Cpu' },
  { id: 'sports', name: 'Sports', icon: 'Trophy' },
  { id: 'music', name: 'Music', icon: 'Music' },
  { id: 'travel', name: 'Travel', icon: 'Plane' },
  { id: 'food', name: 'Food', icon: 'UtensilsCrossed' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2' },
  { id: 'nature', name: 'Nature', icon: 'TreePine' },
  { id: 'cosmic', name: 'Cosmic', icon: 'Sparkles' },
  { id: 'pastel', name: 'Pastel', icon: 'CloudSun' },
  { id: 'bold', name: 'Bold', icon: 'Zap' },
  { id: 'professional', name: 'Professional', icon: 'Briefcase' },
  { id: 'milestone', name: 'Milestone', icon: 'Star' },
  { id: 'religious', name: 'Religious', icon: 'Church' },
  { id: 'cultural', name: 'Cultural', icon: 'Globe' },
  { id: 'seasonal', name: 'Seasonal', icon: 'CalendarDays' },
  { id: 'pride', name: 'Pride', icon: 'Heart' },
];
