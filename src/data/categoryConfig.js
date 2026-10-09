// Category structure & SEO definitions
// Shared between Admin panel, Blog, SEO Routing, and Sitemap

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
