// Script to generate the comprehensive, professional 250+ Birthday Card Templates
// covering all 38 categories with unique visual identities and layouts.

import fs from 'fs';
import path from 'path';

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
  { id: 'floral', name: 'Floral', icon: 'Flower2' },
  { id: 'photo', name: 'Photo', icon: 'Camera' },
  { id: 'memories', name: 'Memories', icon: 'ImageIcon' },
  { id: 'colorful', name: 'Colorful', icon: 'Palette' },
  { id: 'animated', name: 'Animated', icon: 'Wand2' },
  { id: 'celebration', name: 'Celebration', icon: 'Gift' },
  { id: 'classy', name: 'Classy', icon: 'Feather' },
  { id: 'glamorous', name: 'Glamorous', icon: 'Sparkles' },
  { id: 'vintage', name: 'Vintage', icon: 'Compass' },
  { id: 'editorial', name: 'Editorial', icon: 'Layout' },
  { id: 'artistic', name: 'Artistic', icon: 'Palette' },
  { id: 'emotional', name: 'Emotional', icon: 'Heart' },
  { id: 'corporate', name: 'Corporate', icon: 'Award' },
  { id: 'black-and-gold', name: 'Black & Gold', icon: 'Crown' },
  { id: 'pastel', name: 'Pastel', icon: 'Palette' },
  { id: 'neon', name: 'Neon', icon: 'Zap' },
  { id: '3d', name: '3D', icon: 'Layers' },
  { id: 'cinematic', name: 'Cinematic', icon: 'Film' },
  { id: 'festive', name: 'Festive', icon: 'PartyPopper' },
];

console.log('Categories count:', CATEGORIES.length);
