// AuraWish Product Feature Deep-Dive Landing Pages Data
// Honest, factual breakdowns of real platform capabilities.

export const PRODUCT_FEATURE_PAGES = [
  {
    slug: 'birthday-card-maker',
    title: 'Online Birthday Card Maker',
    h1: 'Create Custom Digital Birthday Cards Online',
    intro: 'AuraWish is an online digital greeting studio where anyone can craft luxury birthday cards with customized messages, photos, celebratory music, and animated effects—no graphic design skills required.',
    seoTitle: 'Free Online Birthday Card Maker - Custom Cards with Music | AuraWish',
    seoDescription: 'Design bespoke digital birthday cards online. Personalize text, choose celebration music, add photos, and share interactive cards instantly.',
    features: [
      {
        title: 'Curated Luxury Aesthetics',
        desc: 'Choose from 250+ professionally designed templates ranging from velvet foil to botanical and cyberpunk.'
      },
      {
        title: 'Custom Celebrator Photography',
        desc: 'Upload portrait photos of the birthday celebrator seamlessly embedded with rounded corners and metallic borders.'
      },
      {
        title: 'Celebration Audio Tracks',
        desc: 'Select from lofi birthday melodies, acoustic guitar, gentle orchestral tunes, and cinematic celebration soundscapes.'
      },
      {
        title: 'Multi-Language & Urdu Support',
        desc: 'Type wishes in 25+ global languages including authentic Urdu Nastaliq and Arabic Naskh fonts with proper RTL rendering.'
      },
      {
        title: 'Multiple Export & Sharing Options',
        desc: 'Send an interactive link for live envelope unboxing, or export as a crisp PNG image or MP4 video.'
      }
    ]
  },
  {
    slug: 'digital-birthday-cards',
    title: 'Digital Birthday Cards',
    h1: 'Interactive Digital Birthday Cards for Modern Celebrations',
    intro: 'Say goodbye to boring static e-cards. AuraWish digital cards deliver an interactive 3D unboxing experience right inside the recipient’s mobile or desktop browser.',
    seoTitle: 'Interactive Digital Birthday Cards - 3D Envelope Unboxing | AuraWish',
    seoDescription: 'Send extraordinary digital birthday cards. Recipients tap to unbox an animated envelope accompanied by celebration music and effects.',
    features: [
      {
        title: 'Zero Apps Required',
        desc: 'Recipients simply tap the link on iPhone, Android, tablet, or desktop to experience the full unboxing.'
      },
      {
        title: 'Live Unboxing Reactions',
        desc: 'The card opens like a luxury physical greeting card, accompanied by celebration effects and personalized audio.'
      }
    ]
  },
  {
    slug: 'animated-birthday-cards',
    title: 'Animated Birthday Cards',
    h1: 'Animated Birthday Cards with Real-Time Effects',
    intro: 'Add festive flair to your wishes with animated sparkles, fluttering confetti, floating hearts, and fireworks.',
    seoTitle: 'Animated Birthday Cards with Music & Effects | AuraWish',
    seoDescription: 'Create animated birthday cards with confetti, sparkling lights, and background music. Delight friends and family with motion.',
    features: [
      {
        title: 'Interactive Particle Canvases',
        desc: 'Smooth, lightweight confetti and sparkle animations that run at 60 FPS without draining battery.'
      }
    ]
  },
  {
    slug: 'birthday-cards-with-photos',
    title: 'Birthday Cards with Photos',
    h1: 'Personalized Birthday Cards Featuring Your Favorite Photos',
    intro: 'A picture is worth a thousand words. Upload a treasured photo of the celebrator and frame it inside our luxury design templates.',
    seoTitle: 'Personalized Birthday Cards with Photos - Photo Cards | AuraWish',
    seoDescription: 'Upload photos to create customized birthday cards. Add portraits, memories, and personal wishes with music in seconds.',
    features: [
      {
        title: 'High-Resolution Rendering',
        desc: 'Photos look sharp on Retina screens and maintain clarity in exported PNG images.'
      }
    ]
  },
  {
    slug: 'birthday-cards-with-music',
    title: 'Birthday Cards with Music',
    h1: 'Digital Birthday Cards with Celebration Music & Audio',
    intro: 'Music creates an emotional atmosphere. Add curated background songs and sound effects that trigger when your recipient unboxes the card.',
    seoTitle: 'Birthday Cards with Music - Audio Digital Greeting Cards | AuraWish',
    seoDescription: 'Send interactive birthday cards with background music. Choose from lofi, acoustic, and festive celebration soundtracks.',
    features: [
      {
        title: 'Curated Sound Library',
        desc: 'Select from relaxing lofi birthday vibes, lively jazz, uplifting acoustic melodies, and cheerful melodies.'
      }
    ]
  },
  {
    slug: 'shareable-birthday-cards',
    title: 'Shareable Birthday Cards',
    h1: 'Instant Shareable Birthday Card Links for WhatsApp & Socials',
    intro: 'No postal delays. Generate a clean, private share link and send it via WhatsApp, SMS, Messenger, or email in one click.',
    seoTitle: 'Shareable Birthday Cards - One-Click Share Links | AuraWish',
    seoDescription: 'Create shareable birthday cards and send instant celebration links via WhatsApp, SMS, or email. Works on all devices.',
    features: [
      {
        title: 'One-Click Copy & Share',
        desc: 'Copy your unique share URL or scan a QR code to view the live card instantly on any phone.'
      }
    ]
  }
];

export const getFeaturePageBySlug = (slug) => {
  return PRODUCT_FEATURE_PAGES.find(p => p.slug === slug) || null;
};
