// Category structure & SEO definitions
// Shared between Admin panel, Blog, SEO Routing, and Sitemap
import {
  Sparkles, BookOpen, PenLine, Wand2, Gift, Laptop,
  Headphones, Music, Trophy, Heart, FolderTree, Activity
} from 'lucide-react';

export const PUPPY_TRAINING_CATEGORY = {
  id: 'ce965e41-cd7b-45cc-8aa2-43d4ee22d5b0',
  name: 'Puppy Training',
  slug: 'puppy-training',
  route: '/puppy-training',
  description: 'Complete guides, schedules, breed-specific tips, and problem-solving solutions for training puppies.',
  subtopics: [
    'Breed Training Guides',
    'Behavior & Problem Solving',
    'Schedules & Potty/Crate Training'
  ],
  subcategories: [
    {
      name: 'Breed Training Guides',
      slug: 'breed-guides',
      route: '/puppy-training/breed-guides',
      description: 'Breed-specific puppy training guides covering Belgian Malinois, French Bulldog, Shih Tzu, Beagle, Dachshund, and more.',
      topics: ['Belgian Malinois', 'French Bulldog', 'Shih Tzu', 'Beagle', 'Dachshund']
    },
    {
      name: 'Behavior & Problem Solving',
      slug: 'behavior-solutions',
      route: '/puppy-training/behavior-solutions',
      description: 'Effective solutions for puppy biting, excited peeing, whining, barking, and early signs of aggression.',
      topics: ['Puppy Biting & Nipping', 'Excited Peeing & Submissive Urination', 'Whining & Crying', 'Aggression & Resource Guarding']
    },
    {
      name: 'Schedules & Potty/Crate Training',
      slug: 'crate-potty-schedules',
      route: '/puppy-training/crate-potty-schedules',
      description: 'Daily routines, 4-month schedules, crate training routines, potty training steps, and essential basic tricks.',
      topics: ['4-Month Puppy Schedules', 'Crate Routines & Sleep Schedules', 'Potty Training Step-by-Step', 'Basic Tricks & Commands']
    }
  ]
};

// Map subcategory slug to subcategory object
export const PUPPY_TRAINING_SUBCATS_BY_SLUG = {
  'breed-guides': PUPPY_TRAINING_CATEGORY.subcategories[0],
  'behavior-solutions': PUPPY_TRAINING_CATEGORY.subcategories[1],
  'crate-potty-schedules': PUPPY_TRAINING_CATEGORY.subcategories[2],
};

// Map subcategory name to subcategory slug
export const SUBCAT_NAME_TO_SLUG = {
  'Breed Training Guides': 'breed-guides',
  'Behavior & Problem Solving': 'behavior-solutions',
  'Schedules & Potty/Crate Training': 'crate-potty-schedules',
};

// Map subcategory slug to display name
export const SUBCAT_SLUG_TO_NAME = {
  'breed-guides': 'Breed Training Guides',
  'behavior-solutions': 'Behavior & Problem Solving',
  'crate-potty-schedules': 'Schedules & Potty/Crate Training',
};

// ── Known Standard Categories for fallback & instant rendering ─────────────
export const FALLBACK_CATEGORIES = [
  {
    id: 'd0b498cd-43d7-4f47-ae01-5969ff85bd84',
    name: 'Trending Sports & Hobbies',
    slug: 'trending-sports-hobbies',
    description: 'Emerging sports, modern hobbies, recreational activities, equipment guides, and hobby trends gaining popularity in the US and Europe.',
    subtopics: [
      'Pickleball',
      'Indoor Gardening',
      'Emerging Sports',
      'Outdoor Recreation',
      'Creative Hobbies',
      'Fitness & Active Hobbies',
      'Hobby Equipment & Reviews'
    ],
  },
  {
    id: 'b60f4add-71d7-4c8e-9e36-5722cd6cc00a',
    name: 'Specialized Pet Care',
    slug: 'specialized-pet-care',
    description: 'Detailed care information for specific dog breeds, cat breeds, exotic pets, nutrition, training, grooming, and breed-specific health guidance.',
    subtopics: [
      'Specific Dog Breeds',
      'Specific Cat Breeds',
      'Exotic Pets',
      'Specialized Pet Nutrition',
      'Breed-Specific Training',
      'Breed-Specific Health',
      'Grooming & Care',
      'Pet Products & Equipment'
    ],
  },
  {
    id: '40e387f3-124f-4003-966d-4adc4f2c1d1b',
    name: 'Audio Birthday Card',
    slug: 'audio-birthday-card',
    description: 'Tips, ideas, and guides for creating, personalising, and sharing audio birthday cards with music, voice messages, and custom soundtracks.',
    subtopics: [
      'Birthday Card Music Ideas',
      'Custom Audio Messages',
      'Voice Message Cards',
      'Music Choices for Cards',
      'Digital Card Sending Tips',
      'Personalised Audio Gifts',
      'Audio Card Platforms'
    ],
  },
  {
    id: '9b02307e-fceb-49b8-aa79-02c856b2bf54',
    name: 'Audio Greeting Card',
    slug: 'audio-greeting-card',
    description: 'Everything about audio greeting cards — how to create them, what music to choose, and how to make them memorable for any celebration.',
    subtopics: [
      'Greeting Card Music',
      'Occasion-Based Audio Cards',
      'Custom Voice Greetings',
      'Music for Every Occasion',
      'Digital Greeting Tips',
      'Animated Audio Cards',
      'Shareable Audio Greetings'
    ],
  },
  PUPPY_TRAINING_CATEGORY,
  {
    id: 'writing-guides-id',
    name: 'Writing Guides',
    slug: 'writing-guides',
    description: 'Step-by-step frameworks and heartfelt formulas for crafting meaningful, emotional birthday messages.',
    subtopics: ['Message Frameworks', 'Emotional Wishes', 'Card Etiquette', 'Writing Tips'],
  },
  {
    id: 'creative-ideas-id',
    name: 'Creative Ideas',
    slug: 'creative-ideas',
    description: 'Inspirational celebration concepts, bespoke digital card ideas, and creative milestones.',
    subtopics: ['Digital Personalization', 'Soundtrack Choices', 'Visual Styling'],
  },
  {
    id: 'surprises-id',
    name: 'Surprises',
    slug: 'surprises',
    description: 'Long-distance celebration surprises, midnight digital unboxings, and unforgettable moments.',
    subtopics: ['Long-Distance Celebrations', 'Virtual Parties', 'Surprise Unboxings'],
  },
  {
    id: 'tutorials-id',
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'Practical walkthroughs for creating, personalizing, and sending cinematic digital cards.',
    subtopics: ['Card Creation', 'Audio Integration', 'Sharing Tips'],
  },
];

// ── Visual Presets for Category Blocks & Headers ───────────────────────────
export const CATEGORY_VISUALS = {
  'Trending Sports & Hobbies': {
    icon: Trophy,
    gradient: 'linear-gradient(135deg, rgba(234,88,12,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(249,115,22,0.25)',
    pill: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
    arrowColor: 'text-orange-400 group-hover:text-orange-300',
    accentColor: '#f97316',
  },
  'Specialized Pet Care': {
    icon: Heart,
    gradient: 'linear-gradient(135deg, rgba(13,148,136,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(20,184,166,0.25)',
    pill: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
    arrowColor: 'text-teal-400 group-hover:text-teal-300',
    accentColor: '#14b8a6',
  },
  'Audio Birthday Card': {
    icon: Headphones,
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(129,140,248,0.25)',
    pill: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
    arrowColor: 'text-indigo-400 group-hover:text-indigo-300',
    accentColor: '#818cf8',
  },
  'Audio Greeting Card': {
    icon: Music,
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(192,132,252,0.25)',
    pill: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    arrowColor: 'text-purple-400 group-hover:text-purple-300',
    accentColor: '#c084fc',
  },
  'Puppy Training': {
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(52,211,153,0.25)',
    pill: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    arrowColor: 'text-emerald-400 group-hover:text-emerald-300',
    accentColor: '#34d399',
  },
  'Writing Guides': {
    icon: PenLine,
    gradient: 'linear-gradient(135deg, rgba(109,40,217,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(217,70,239,0.22)',
    pill: 'bg-brand-500/15 border-brand-500/30 text-brand-300',
    arrowColor: 'text-brand-400 group-hover:text-brand-300',
    accentColor: '#d946ef',
  },
  'Creative Ideas': {
    icon: Wand2,
    gradient: 'linear-gradient(135deg, rgba(180,83,9,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(245,158,11,0.22)',
    pill: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    arrowColor: 'text-amber-400 group-hover:text-amber-300',
    accentColor: '#f59e0b',
  },
  'Surprises': {
    icon: Gift,
    gradient: 'linear-gradient(135deg, rgba(159,18,57,0.55) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(244,63,94,0.22)',
    pill: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    arrowColor: 'text-rose-400 group-hover:text-rose-300',
    accentColor: '#f43f5e',
  },
  'Tutorials': {
    icon: Laptop,
    gradient: 'linear-gradient(135deg, rgba(8,70,100,0.65) 0%, rgba(17,20,30,0.95) 100%)',
    glow: 'rgba(6,182,212,0.22)',
    pill: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    arrowColor: 'text-cyan-400 group-hover:text-cyan-300',
    accentColor: '#06b6d4',
  },
};

export const DEFAULT_CATEGORY_VISUAL = {
  icon: BookOpen,
  gradient: 'linear-gradient(135deg, rgba(51,65,85,0.55) 0%, rgba(17,20,30,0.95) 100%)',
  glow: 'rgba(100,116,139,0.2)',
  pill: 'bg-slate-500/15 border-slate-500/30 text-slate-300',
  arrowColor: 'text-slate-400 group-hover:text-slate-300',
  accentColor: '#94a3b8',
};

/**
 * Get category visual configuration with sensible keyword-based fallbacks
 */
export function getCategoryVisual(categoryNameOrSlug) {
  if (!categoryNameOrSlug) return DEFAULT_CATEGORY_VISUAL;
  
  // Direct name match
  if (CATEGORY_VISUALS[categoryNameOrSlug]) {
    return CATEGORY_VISUALS[categoryNameOrSlug];
  }

  const normalized = categoryNameOrSlug.toLowerCase().trim();

  // Keyword-based fallback matching
  if (normalized.includes('sport') || normalized.includes('hobbi') || normalized.includes('pickleball')) {
    return CATEGORY_VISUALS['Trending Sports & Hobbies'];
  }
  if (normalized.includes('pet') || normalized.includes('dog') || normalized.includes('cat') || normalized.includes('breed')) {
    return CATEGORY_VISUALS['Specialized Pet Care'];
  }
  if (normalized.includes('audio birthday') || normalized.includes('voice birthday')) {
    return CATEGORY_VISUALS['Audio Birthday Card'];
  }
  if (normalized.includes('audio') || normalized.includes('music') || normalized.includes('sound')) {
    return CATEGORY_VISUALS['Audio Greeting Card'];
  }
  if (normalized.includes('puppy') || normalized.includes('training')) {
    return CATEGORY_VISUALS['Puppy Training'];
  }
  if (normalized.includes('writing') || normalized.includes('message') || normalized.includes('wishes')) {
    return CATEGORY_VISUALS['Writing Guides'];
  }
  if (normalized.includes('creative') || normalized.includes('idea')) {
    return CATEGORY_VISUALS['Creative Ideas'];
  }
  if (normalized.includes('surprise')) {
    return CATEGORY_VISUALS['Surprises'];
  }
  if (normalized.includes('tutorial') || normalized.includes('guide') || normalized.includes('how-to')) {
    return CATEGORY_VISUALS['Tutorials'];
  }

  // Try matching by slug
  for (const [key, visual] of Object.entries(CATEGORY_VISUALS)) {
    if (slugifyCategory(key) === normalized) {
      return visual;
    }
  }

  return DEFAULT_CATEGORY_VISUAL;
}

/**
 * Standard slugify function
 */
export function slugifyCategory(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
