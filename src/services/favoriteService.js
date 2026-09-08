import { supabase, isSupabaseConfigured } from '../supabase/client';

export const favoriteService = {
  getFavorites: async (userId = null) => {
    // 1. If Supabase is connected and user is logged in
    if (supabase && isSupabaseConfigured && userId) {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('template_id')
          .eq('user_id', userId);

        if (!error && data) {
          return data.map(item => item.template_id);
        }
      } catch (e) {
        console.warn('Error querying Supabase favorites:', e.message);
      }
    }

    // 2. LocalStorage fallback
    try {
      const raw = localStorage.getItem('aurawish_favorites');
      return raw ? JSON.parse(raw) : ['velvet-luxury'];
    } catch (e) {
      return ['velvet-luxury'];
    }
  },

  toggleFavorite: async (templateId, userId = null) => {
    let localFavs = [];
    try {
      const raw = localStorage.getItem('aurawish_favorites');
      localFavs = raw ? JSON.parse(raw) : [];
    } catch (e) {}

    const isFav = localFavs.includes(templateId);
    let updatedFavs = isFav
      ? localFavs.filter(id => id !== templateId)
      : [...localFavs, templateId];

    try {
      localStorage.setItem('aurawish_favorites', JSON.stringify(updatedFavs));
    } catch (e) {}

    // Synchronize to Supabase if authenticated
    if (supabase && isSupabaseConfigured && userId) {
      try {
        if (isFav) {
          await supabase
            .from('favorites')
            .delete()
            .match({ user_id: userId, template_id: templateId });
        } else {
          await supabase
            .from('favorites')
            .insert({ user_id: userId, template_id: templateId });
        }
      } catch (err) {
        console.warn('Could not sync favorite to Supabase:', err.message);
      }
    }

    return updatedFavs;
  }
};
