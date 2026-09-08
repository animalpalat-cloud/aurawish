import { SAMPLE_CARDS } from '../data/sampleCards';
import { supabase, isSupabaseConfigured } from '../supabase/client';

const STORAGE_KEY = 'aurawish_saved_cards';
const FAVORITES_KEY = 'aurawish_favorite_cards';

// Helper to generate a unique short alphanumeric share ID
export const generateShareId = (prefix = '') => {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}_${result}` : result;
};

// Map DB row to application Card format
const mapDbToCard = (row) => {
  if (!row) return null;
  const theme = row.theme_config || {};
  const animation = row.animation_config || {};
  const music = row.music_config || {};

  return {
    id: row.id,
    shareId: row.share_id,
    userId: row.user_id,
    templateId: row.template_id || theme.templateId || 'velvet-luxury',
    recipientName: row.recipient_name || '',
    senderName: row.sender_name || '',
    message: row.message || '',
    age: row.age || '',
    photoUrl: row.photo_url || '',
    title: theme.title || 'Happy Birthday!',
    subtitle: theme.subtitle || '',
    effect: animation.effect || 'sparkles',
    font: theme.font || 'Playfair Display',
    language: theme.language || 'en',
    direction: theme.direction || 'ltr',
    themeColor: theme.themeColor || '#E5C07B',
    musicTrack: music.audioUrl || music.track || 'lofi-birthday',
    customAudioUrl: music.audioUrl || null,
    customAudioName: music.name || null,
    musicSource: music.source || (music.audioUrl ? 'device' : 'library'),
    isTrimmed: !!music.isTrimmed,
    trimRange: music.trim || null,
    isDraft: row.status === 'draft',
    status: row.status,
    views: row.views || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

class CardService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_CARDS));
      }
      const existingFavs = localStorage.getItem(FAVORITES_KEY);
      if (!existingFavs) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(['card_demo_1']));
      }
    } catch (e) {
      console.warn("Storage initialization warning:", e);
    }
  }

  // Get local cards synchronously
  getLocalCards() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [...SAMPLE_CARDS];
    } catch (e) {
      return [...SAMPLE_CARDS];
    }
  }

  // Save to local storage cache
  saveToLocalStorage(cards) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  /**
   * Synchronous getCards for instant UI rendering
   */
  getCards() {
    return this.getLocalCards();
  }

  /**
   * Fetch all cards from Supabase with local fallback
   */
  async fetchCards() {
    if (!supabase || !isSupabaseConfigured) {
      return this.getLocalCards();
    }

    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return this.getLocalCards();
      }

      const remoteCards = data.map(mapDbToCard);
      // Merge with local cards
      const localCards = this.getLocalCards();
      const mergedMap = new Map();
      remoteCards.forEach(c => mergedMap.set(c.id, c));
      localCards.forEach(c => {
        if (!mergedMap.has(c.id)) mergedMap.set(c.id, c);
      });

      const allMerged = Array.from(mergedMap.values());
      this.saveToLocalStorage(allMerged);
      return allMerged;
    } catch (e) {
      console.warn('Fetch cards error:', e.message);
      return this.getLocalCards();
    }
  }

  /**
   * Get card by ID (checks local and remote)
   */
  getCardById(id) {
    const cards = this.getLocalCards();
    return cards.find(c => c.id === id) || null;
  }

  /**
   * Get card by share ID (with live Supabase query)
   */
  async getCardByShareId(shareId) {
    // 1. Try Supabase first for real-time live cards
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .or(`share_id.eq.${shareId},id.eq.${shareId}`)
          .maybeSingle();

        if (!error && data) {
          // Increment views
          const updatedViews = (data.views || 0) + 1;
          supabase
            .from('cards')
            .update({ views: updatedViews })
            .eq('id', data.id)
            .then();

          const card = mapDbToCard({ ...data, views: updatedViews });
          // Cache locally
          const localList = this.getLocalCards();
          const idx = localList.findIndex(c => c.id === card.id);
          if (idx >= 0) localList[idx] = card;
          else localList.unshift(card);
          this.saveToLocalStorage(localList);

          return card;
        }
      } catch (e) {
        console.warn('Supabase getCardByShareId error:', e.message);
      }
    }

    // 2. Local fallback
    const cards = this.getLocalCards();
    const localCard = cards.find(c => c.shareId === shareId || c.id === shareId);
    if (localCard) {
      localCard.views = (localCard.views || 0) + 1;
      this.updateCard(localCard.id, { views: localCard.views });
      return localCard;
    }
    return null;
  }

  /**
   * Save / Create card (Stores to Supabase and LocalStorage)
   */
  async saveCard(cardData) {
    const shareId = cardData.shareId || generateShareId(
      cardData.recipientName
        ? cardData.recipientName.slice(0, 4).toLowerCase().replace(/[^a-z]/g, '')
        : 'bday'
    );

    const isDraft = cardData.isDraft ?? false;
    const status = isDraft ? 'draft' : 'published';

    // If custom audio file exists and hasn't been uploaded to persistent storage yet
    let persistentAudioUrl = cardData.customAudio?.publicUrl || (
      typeof cardData.musicTrack === 'string' && (cardData.musicTrack.startsWith('http://') || cardData.musicTrack.startsWith('https://'))
        ? cardData.musicTrack
        : null
    );

    if (cardData.customAudio?.file && !persistentAudioUrl) {
      try {
        const audioUploadResult = await storageService.uploadCardAudio(
          cardData.customAudio.file,
          shareId
        );
        if (audioUploadResult?.downloadUrl) {
          persistentAudioUrl = audioUploadResult.downloadUrl;
        }
      } catch (audioErr) {
        console.warn('Audio storage upload warning, proceeding with local fallback:', audioErr);
      }
    }

    const cardPayload = {
      id: cardData.id && !String(cardData.id).startsWith('card_') ? cardData.id : undefined,
      share_id: shareId,
      recipient_name: cardData.recipientName || 'Someone Special',
      sender_name: cardData.senderName || '',
      message: cardData.message || 'Wishing you the happiest birthday!',
      age: String(cardData.age || ''),
      photo_url: cardData.photoUrl || '',
      status: status,
      theme_config: {
        title: cardData.title || 'Happy Birthday!',
        subtitle: cardData.subtitle || '',
        font: cardData.font || 'Playfair Display',
        language: cardData.language || 'en',
        direction: cardData.direction || 'ltr',
        themeColor: cardData.themeColor || '#E5C07B',
        templateId: cardData.templateId
      },
      animation_config: {
        effect: cardData.effect || 'sparkles'
      },
      music_config: {
        track: cardData.musicTrack || 'lofi-birthday',
        audioUrl: persistentAudioUrl || cardData.customAudio?.blobUrl || null,
        name: cardData.customAudio?.name || null,
        source: cardData.musicSource || (cardData.musicTrack === 'custom-device' ? 'device' : 'library'),
        isTrimmed: !!cardData.customAudio?.isTrimmed,
        trim: cardData.customAudio?.trimRange || null
      },
      views: cardData.views || 0,
    };

    let savedCard = null;

    // 1. Try Supabase Insert / Upsert
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('cards')
          .upsert([cardPayload], { onConflict: 'share_id' })
          .select()
          .single();

        if (!error && data) {
          savedCard = mapDbToCard(data);

          // Save card asset tracking if photo exists
          if (savedCard.photoUrl) {
            supabase
              .from('card_assets')
              .insert({
                card_id: savedCard.id,
                storage_path: cardData.storagePath || savedCard.photoUrl,
                public_url: savedCard.photoUrl,
                asset_type: 'image'
              })
              .then();
          }

          // Save card asset tracking if custom audio exists
          if (persistentAudioUrl) {
            supabase
              .from('card_assets')
              .insert({
                card_id: savedCard.id,
                storage_path: persistentAudioUrl,
                public_url: persistentAudioUrl,
                asset_type: 'audio'
              })
              .then();
          }
        } else {
          console.warn('Supabase save error, falling back to local cache:', error?.message);
        }
      } catch (err) {
        console.warn('Supabase card upsert exception:', err.message);
      }
    }

    // 2. Fallback to LocalStorage structure
    if (!savedCard) {
      savedCard = {
        id: cardData.id || `card_${Date.now()}`,
        shareId: shareId,
        templateId: cardData.templateId,
        recipientName: cardData.recipientName || 'Someone Special',
        age: cardData.age || '',
        title: cardData.title || 'Happy Birthday!',
        subtitle: cardData.subtitle || '',
        message: cardData.message || 'Wishing you the happiest birthday!',
        senderName: cardData.senderName || '',
        photoUrl: cardData.photoUrl || '',
        effect: cardData.effect || 'sparkles',
        font: cardData.font || 'Playfair Display',
        themeColor: cardData.themeColor || '#E5C07B',
        musicTrack: cardData.musicTrack || 'lofi-birthday',
        customAudioUrl: persistentAudioUrl || cardData.customAudio?.blobUrl || null,
        customAudioName: cardData.customAudio?.name || null,
        isDraft: isDraft,
        status: status,
        createdAt: cardData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: cardData.views || 0,
      };
    }

    // Update local cache
    const cards = this.getLocalCards();
    const existingIdx = cards.findIndex(c => c.id === savedCard.id || c.shareId === savedCard.shareId);
    if (existingIdx >= 0) {
      cards[existingIdx] = { ...cards[existingIdx], ...savedCard };
    } else {
      cards.unshift(savedCard);
    }
    this.saveToLocalStorage(cards);

    return savedCard;
  }

  /**
   * Update card
   */
  async updateCard(id, updates) {
    const cards = this.getLocalCards();
    const idx = cards.findIndex(c => c.id === id);
    if (idx >= 0) {
      cards[idx] = { ...cards[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveToLocalStorage(cards);
    }

    if (supabase && isSupabaseConfigured && id && !String(id).startsWith('card_')) {
      try {
        const patch = {};
        if (updates.recipientName !== undefined) patch.recipient_name = updates.recipientName;
        if (updates.senderName !== undefined) patch.sender_name = updates.senderName;
        if (updates.message !== undefined) patch.message = updates.message;
        if (updates.photoUrl !== undefined) patch.photo_url = updates.photoUrl;
        if (updates.views !== undefined) patch.views = updates.views;
        if (updates.isDraft !== undefined) patch.status = updates.isDraft ? 'draft' : 'published';

        await supabase
          .from('cards')
          .update(patch)
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase updateCard error:', e.message);
      }
    }

    return idx >= 0 ? cards[idx] : null;
  }

  /**
   * Delete card
   */
  async deleteCard(id) {
    let cards = this.getLocalCards();
    cards = cards.filter(c => c.id !== id);
    this.saveToLocalStorage(cards);

    if (supabase && isSupabaseConfigured && id && !String(id).startsWith('card_')) {
      try {
        await supabase
          .from('cards')
          .delete()
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteCard error:', e.message);
      }
    }

    return true;
  }

  /**
   * Duplicate card
   */
  async duplicateCard(id) {
    const original = this.getCardById(id);
    if (!original) return null;
    const duplicated = {
      ...original,
      id: undefined,
      shareId: generateShareId('copy'),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };
    return await this.saveCard(duplicated);
  }

  getFavorites() {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  toggleFavorite(id) {
    let favs = this.getFavorites();
    if (favs.includes(id)) {
      favs = favs.filter(item => item !== id);
    } else {
      favs.push(id);
    }
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    } catch (e) {}
    return favs;
  }
}

export const cardService = new CardService();
