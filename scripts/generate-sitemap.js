// Script to regenerate sitemap.xml dynamically with all static, category, and Supabase blog URLs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.birthdaywishly.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xwpnxzfnlxhghmefvhpv.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_DhA4Zmv2wco650SwKFwR4A_z5tqlxsG';

const STATIC_ROUTES = [
  // Core Hubs
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/blog', priority: '0.9', changefreq: 'daily' },
  { path: '/birthday-wishes', priority: '0.9', changefreq: 'daily' },
  { path: '/templates', priority: '0.9', changefreq: 'daily' },
  { path: '/birthday-card-templates', priority: '0.9', changefreq: 'weekly' },
  { path: '/birthday-card-maker', priority: '0.9', changefreq: 'weekly' },
  { path: '/birthday-ideas', priority: '0.9', changefreq: 'daily' },

  // Feature Pages
  { path: '/digital-birthday-cards',    priority: '0.8', changefreq: 'weekly' },
  { path: '/animated-birthday-cards',   priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-cards-with-photos', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-cards-with-music', priority: '0.8', changefreq: 'weekly' },
  { path: '/shareable-birthday-cards',  priority: '0.8', changefreq: 'weekly' },
  { path: '/audio-birthday-card',       priority: '0.8', changefreq: 'weekly' },
  { path: '/audio-greeting-card',       priority: '0.8', changefreq: 'weekly' },
  { path: '/photo-birthday-card',       priority: '0.8', changefreq: 'weekly' },
  { path: '/surprise-birthday-card',    priority: '0.8', changefreq: 'weekly' },

  // Relationship Pages
  { path: '/birthday-wishes-for-mom', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-dad', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-sister', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-brother', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-best-friend', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-wife', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-husband', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-girlfriend', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-boyfriend', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-daughter', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-son', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-family', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-wishes-for-colleagues', priority: '0.8', changefreq: 'weekly' },

  // Style Pages
  { path: '/funny-birthday-wishes', priority: '0.8', changefreq: 'weekly' },
  { path: '/romantic-birthday-wishes', priority: '0.8', changefreq: 'weekly' },
  { path: '/heartfelt-birthday-wishes', priority: '0.8', changefreq: 'weekly' },
  { path: '/emotional-birthday-wishes', priority: '0.8', changefreq: 'weekly' },
  { path: '/short-birthday-wishes', priority: '0.8', changefreq: 'weekly' },
  { path: '/sweet-birthday-wishes', priority: '0.8', changefreq: 'weekly' },
  { path: '/inspirational-birthday-wishes', priority: '0.8', changefreq: 'weekly' },
  { path: '/beautiful-birthday-wishes', priority: '0.8', changefreq: 'weekly' },

  // Puppy Training
  { path: '/puppy-training', priority: '0.9', changefreq: 'daily' },
  { path: '/puppy-training/breed-guides', priority: '0.8', changefreq: 'weekly' },
  { path: '/puppy-training/behavior-solutions', priority: '0.8', changefreq: 'weekly' },
  { path: '/puppy-training/crate-potty-schedules', priority: '0.8', changefreq: 'weekly' },

  // Hardcoded Blog Articles (Fallbacks)
  { path: '/birthday-ideas/how-to-write-a-birthday-message', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-ideas/what-to-write-in-a-birthday-card', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-ideas/personalized-birthday-card-ideas', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-ideas/birthday-surprise-ideas', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-ideas/how-to-make-a-digital-birthday-card', priority: '0.8', changefreq: 'weekly' },

  // Legal / Trust
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', priority: '0.5', changefreq: 'monthly' },
  { path: '/cookie-policy', priority: '0.5', changefreq: 'monthly' },
  { path: '/disclaimer', priority: '0.5', changefreq: 'monthly' },
];

const FALLBACK_CATEGORY_SLUGS = [
  'trending-sports-hobbies',
  'specialized-pet-care',
  'audio-birthday-card',
  'audio-greeting-card',
  'puppy-training',
  'writing-guides',
  'creative-ideas',
  'surprises',
  'tutorials',
];

async function fetchDynamicCategories() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_categories?select=id,name,slug,updated_at,created_at`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (res.ok) {
      const cats = await res.json();
      return cats || [];
    }
  } catch (e) {
    console.warn('Could not fetch dynamic categories from Supabase (using fallback categories):', e.message);
  }
  return [];
}

async function fetchDynamicBlogPosts() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=slug,category,category_id,updated_at,published_at&status=eq.published`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (res.ok) {
      const posts = await res.json();
      return posts || [];
    }
  } catch (e) {
    console.warn('Could not fetch dynamic posts from Supabase (using static routes):', e.message);
  }
  return [];
}

async function generate() {
  const today = new Date().toISOString().split('T')[0];
  const [dynamicCategories, dynamicPosts] = await Promise.all([
    fetchDynamicCategories(),
    fetchDynamicBlogPosts(),
  ]);

  const urlMap = new Map();

  // 1. Static base routes
  for (const route of STATIC_ROUTES) {
    urlMap.set(route.path, {
      loc: `${BASE_URL}${route.path}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  // 2. Dynamic Category Landing Pages (/category/[slug])
  const categorySlugs = new Set(FALLBACK_CATEGORY_SLUGS);
  for (const cat of dynamicCategories) {
    if (cat.slug) {
      categorySlugs.add(cat.slug);
      const catDate = (cat.updated_at || cat.created_at || today).slice(0, 10);
      urlMap.set(`/category/${cat.slug}`, {
        loc: `${BASE_URL}/category/${cat.slug}`,
        lastmod: catDate,
        changefreq: 'weekly',
        priority: '0.85',
      });
    }
  }

  // Ensure all standard fallback category routes are included
  for (const slug of categorySlugs) {
    if (!urlMap.has(`/category/${slug}`)) {
      urlMap.set(`/category/${slug}`, {
        loc: `${BASE_URL}/category/${slug}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.85',
      });
    }
  }

  // 3. Dynamic Blog Articles
  for (const post of dynamicPosts) {
    if (post.slug) {
      const isPuppy = post.category === 'Puppy Training' || 
                      post.category === 'puppy-training' ||
                      post.category_id === 'ce965e41-cd7b-45cc-8aa2-43d4ee22d5b0';
      const postPath = isPuppy ? `/puppy-training/${post.slug}` : `/birthday-ideas/${post.slug}`;
      const postDate = (post.updated_at || post.published_at || today).slice(0, 10);
      urlMap.set(postPath, {
        loc: `${BASE_URL}${postPath}`,
        lastmod: postDate,
        changefreq: 'weekly',
        priority: '0.8',
      });
    }
  }

  const xmlUrls = Array.from(urlMap.values()).map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>
`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf-8');
  console.log(`✅ Generated sitemap.xml with ${urlMap.size} URLs (including dynamic categories) at ${outputPath}`);
}

generate();
