// Script to regenerate sitemap.xml dynamically with all static and Supabase blog URLs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://birthdaywishly.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xwpnxzfnlxhghmefvhpv.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_DhA4Zmv2wco650SwKFwR4A_z5tqlxsG';

const STATIC_ROUTES = [
  // Core Hubs
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/birthday-wishes', priority: '0.9', changefreq: 'daily' },
  { path: '/templates', priority: '0.9', changefreq: 'daily' },
  { path: '/birthday-card-templates', priority: '0.9', changefreq: 'weekly' },
  { path: '/birthday-card-maker', priority: '0.9', changefreq: 'weekly' },
  { path: '/birthday-ideas', priority: '0.9', changefreq: 'daily' },

  // Feature Pages
  { path: '/digital-birthday-cards', priority: '0.8', changefreq: 'weekly' },
  { path: '/animated-birthday-cards', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-cards-with-photos', priority: '0.8', changefreq: 'weekly' },
  { path: '/birthday-cards-with-music', priority: '0.8', changefreq: 'weekly' },
  { path: '/shareable-birthday-cards', priority: '0.8', changefreq: 'weekly' },

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

async function fetchDynamicBlogPosts() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at,published_at&status=eq.published`, {
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
  const dynamicPosts = await fetchDynamicBlogPosts();

  const urlMap = new Map();

  for (const route of STATIC_ROUTES) {
    urlMap.set(route.path, {
      loc: `${BASE_URL}${route.path}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  for (const post of dynamicPosts) {
    if (post.slug) {
      const postPath = `/birthday-ideas/${post.slug}`;
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
  console.log(`✅ Generated sitemap.xml with ${urlMap.size} URLs at ${outputPath}`);
}

generate();
