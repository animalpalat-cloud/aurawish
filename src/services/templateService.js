import { TEMPLATES, CATEGORIES } from '../data/templatesData';
import { supabase, isSupabaseConfigured } from '../supabase/client';

// Transform Supabase DB template row to Frontend Template format
const transformDbTemplate = (row) => {
  if (!row) return null;
  const config = row.config || {};
  return {
    templateId: row.slug,
    dbId: row.id,
    name: row.name,
    category: row.category,
    badge: config.badge || (row.is_featured ? 'Featured' : ''),
    description: row.description || '',
    previewGradient: config.previewGradient || 'from-[#0a0a0c] via-[#16181f] to-[#0a0a0c]',
    accentColor: config.accentColor || '#E5C07B',
    fontFamily: config.fontFamily || 'Cinzel',
    layoutStyle: config.layoutStyle || 'luxury-bordered',
    envelopeStyle: config.envelopeStyle || 'obsidian-gold',
    photoSupport: config.photoSupport ?? true,
    musicSupport: config.musicSupport ?? true,
    defaultMusic: config.defaultMusic || 'cinematic-strings',
    defaultEffect: config.defaultEffect || 'sparkles',
    defaultData: config.defaultData || {
      recipientName: 'Someone Special',
      age: '',
      title: 'Happy Birthday',
      subtitle: 'Celebrating You Today',
      message: 'Wishing you all the joy, laughter, and blessings in the world!',
      senderName: 'With Love',
      photoUrl: row.thumbnail_url || '',
      effect: config.defaultEffect || 'sparkles',
      font: config.fontFamily || 'Cinzel',
      themeColor: config.accentColor || '#E5C07B',
    }
  };
};

export const templateService = {
  /**
   * Synchronous template list for instant UI rendering (with fallback to local seed templates)
   */
  getAllTemplates: () => {
    try {
      return Array.isArray(TEMPLATES) ? [...TEMPLATES] : [];
    } catch (e) {
      console.error("Error retrieving local templates:", e);
      return [];
    }
  },

  /**
   * Asynchronous fetch from Supabase templates table
   */
  fetchTemplatesFromSupabase: async () => {
    if (!supabase || !isSupabaseConfigured) {
      return templateService.getAllTemplates();
    }

    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Supabase templates empty or unseeded, using built-in templates:', error?.message);
        return templateService.getAllTemplates();
      }

      return data.map(transformDbTemplate);
    } catch (err) {
      console.warn('Error querying Supabase templates:', err.message);
      return templateService.getAllTemplates();
    }
  },

  getTemplateById: (templateId) => {
    try {
      if (!Array.isArray(TEMPLATES) || TEMPLATES.length === 0) return null;
      return TEMPLATES.find(t => t.templateId === templateId) || TEMPLATES[0];
    } catch (e) {
      console.error("Error retrieving template by ID:", e);
      return TEMPLATES?.[0] || null;
    }
  },

  getCategories: () => {
    try {
      return Array.isArray(CATEGORIES) ? [...CATEGORIES] : [];
    } catch (e) {
      return [];
    }
  },

  searchTemplates: (query = '', category = 'all', sortBy = 'popular', templateList = null) => {
    return templateService.filterTemplates({ query, category, sortBy, templateList });
  },

  filterTemplates: (params = {}) => {
    try {
      let category = 'all';
      let query = '';
      let sortBy = 'popular';
      let list = Array.isArray(params.templateList) && params.templateList.length > 0 
        ? [...params.templateList] 
        : (Array.isArray(TEMPLATES) ? [...TEMPLATES] : []);

      if (typeof params === 'string') {
        query = params;
      } else if (typeof params === 'object' && params !== null) {
        category = params.category || 'all';
        query = params.query || '';
        sortBy = params.sortBy || 'popular';
      }

      // Filter by Category
      if (category && category !== 'all') {
        list = list.filter(t => t?.category === category);
      }

      // Search Query
      if (query && typeof query === 'string' && query.trim() !== '') {
        const q = query.toLowerCase().trim();
        list = list.filter(t => 
          (t?.name && t.name.toLowerCase().includes(q)) || 
          (t?.description && t.description.toLowerCase().includes(q)) ||
          (t?.category && t.category.toLowerCase().includes(q)) ||
          (t?.badge && t.badge.toLowerCase().includes(q))
        );
      }

      // Sort
      if (sortBy === 'name') {
        list.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
      } else if (sortBy === 'category') {
        list.sort((a, b) => (a?.category || '').localeCompare(b?.category || ''));
      }

      return list;
    } catch (e) {
      console.error("Error filtering templates:", e);
      return Array.isArray(TEMPLATES) ? [...TEMPLATES] : [];
    }
  }
};
