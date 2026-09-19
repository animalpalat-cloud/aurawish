import { supabase, isSupabaseConfigured, SUPABASE_URL } from '../supabase/client';

const BUCKET_NAME = 'card-images';
const AUDIO_BUCKET_NAME = 'birthday-audio';
const BLOG_BUCKET_NAME = 'blog-images';

export const MAX_DEVICE_MUSIC_SIZE = 25 * 1024 * 1024; // 25 MB

/**
 * Validates audio file format and size
 */
export const validateAudioFile = (file) => {
  if (!file) {
    throw new Error('No audio file provided');
  }

  const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.webm'];
  const fileName = file.name ? file.name.toLowerCase() : '';
  const hasValidExt = allowedExtensions.some(ext => fileName.endsWith(ext));
  const isAudioMime = file.type ? (file.type.startsWith('audio/') || file.type.includes('ogg') || file.type.includes('mp4')) : false;

  if (!hasValidExt && !isAudioMime) {
    throw new Error('This audio format isn’t supported. Please choose an MP3, WAV, OGG, or M4A audio file.');
  }

  if (file.size > MAX_DEVICE_MUSIC_SIZE) {
    throw new Error('Your music file is too large (max 25MB). Please choose a smaller audio file.');
  }

  return true;
};

/**
 * Validates file format and size
 */
export const validateImageFile = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    throw new Error('Invalid file format. Please upload a JPG, PNG, or WebP image.');
  }

  const maxSizeBytes = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSizeBytes) {
    throw new Error('File size exceeds the 10MB limit. Please select a smaller photo.');
  }

  return true;
};

/**
 * Optimizes an image client-side to a Blob before uploading.
 */
export const optimizeImageToBlob = (file, maxWidth = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    try {
      validateImageFile(file);
    } catch (err) {
      return reject(err);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP or fallback to JPEG
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              canvas.toBlob(
                (fallbackBlob) => {
                  if (fallbackBlob) resolve(fallbackBlob);
                  else reject(new Error('Failed to create image blob'));
                },
                'image/jpeg',
                quality
              );
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Storage Service connecting to Supabase Storage
 */
export const storageService = {
  validateImageFile,
  optimizeImageToBlob,

  createLocalPreviewUrl: (file) => {
    return URL.createObjectURL(file);
  },

  /**
   * Uploads card photo to Supabase Storage bucket 'card-images'
   * Path: card-images/{cardId}/{unique-file-name}.webp
   */
  uploadCardPhoto: async (file, cardId = 'temp', onProgress = null) => {
    // 1. Validation
    validateImageFile(file);

    // 2. Client-side optimization
    const optimizedBlob = await optimizeImageToBlob(file, 1200, 0.85);

    if (typeof onProgress === 'function') onProgress(30);

    if (!supabase || !isSupabaseConfigured) {
      // Graceful fallback to data URL if Supabase is offline
      console.warn('Supabase not configured, falling back to local object URL');
      if (typeof onProgress === 'function') onProgress(100);
      return {
        downloadUrl: URL.createObjectURL(optimizedBlob),
        storagePath: `local_${Date.now()}`
      };
    }

    try {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const fileName = `${timestamp}_${randomStr}.webp`;
      const cleanCardId = String(cardId).replace(/[^a-zA-Z0-9_-]/g, '_');
      const storagePath = `${cleanCardId}/${fileName}`;

      if (typeof onProgress === 'function') onProgress(50);

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, optimizedBlob, {
          contentType: 'image/webp',
          upsert: true
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw new Error(error.message || 'Failed to upload photo to Supabase Storage');
      }

      if (typeof onProgress === 'function') onProgress(85);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

      const downloadUrl = publicUrlData?.publicUrl || `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;

      if (typeof onProgress === 'function') onProgress(100);

      return {
        downloadUrl,
        storagePath
      };
    } catch (err) {
      console.error('Upload card photo error:', err);
      throw new Error(err.message || 'Image upload is temporarily unavailable. Please try again.');
    }
  },

  /**
   * Uploads custom device audio to Supabase Storage bucket 'birthday-audio'
   * Path: birthday-audio/custom-audio/{cardId}/{unique-file-name}
   */
  uploadCardAudio: async (file, cardId = 'temp', onProgress = null) => {
    validateAudioFile(file);

    if (typeof onProgress === 'function') onProgress(20);

    if (!supabase || !isSupabaseConfigured) {
      console.warn('Supabase not configured, falling back to local object URL for audio');
      if (typeof onProgress === 'function') onProgress(100);
      return {
        downloadUrl: URL.createObjectURL(file),
        storagePath: `local_audio_${Date.now()}`
      };
    }

    try {
      const timestamp = Date.now();
      const sanitizedName = (file.name || 'custom-audio.mp3').replace(/[^a-zA-Z0-9._-]/g, '_');
      const cleanCardId = String(cardId).replace(/[^a-zA-Z0-9_-]/g, '_');
      const storagePath = `custom-audio/${cleanCardId}/${timestamp}_${sanitizedName}`;

      if (typeof onProgress === 'function') onProgress(50);

      const { data, error } = await supabase.storage
        .from(AUDIO_BUCKET_NAME)
        .upload(storagePath, file, {
          contentType: file.type || 'audio/mpeg',
          upsert: true
        });

      if (error) {
        console.error('Supabase audio storage upload error:', error);
        throw new Error(error.message || 'Failed to upload audio to storage');
      }

      if (typeof onProgress === 'function') onProgress(85);

      const { data: publicUrlData } = supabase.storage
        .from(AUDIO_BUCKET_NAME)
        .getPublicUrl(storagePath);

      const downloadUrl = publicUrlData?.publicUrl || `${SUPABASE_URL}/storage/v1/object/public/${AUDIO_BUCKET_NAME}/${storagePath}`;

      if (typeof onProgress === 'function') onProgress(100);

      return {
        downloadUrl,
        storagePath
      };
    } catch (err) {
      console.error('Upload card audio error:', err);
      throw new Error(err.message || 'Audio upload is temporarily unavailable. Please try again.');
    }
  },

  /**
   * Uploads admin blog featured image to Supabase Storage bucket 'blog-images'
   * Path: posts/{timestamp}_{unique}_{sanitizedFileName}
   */
  uploadBlogImage: async (file, onProgress = null) => {
    validateImageFile(file);

    if (typeof onProgress === 'function') onProgress(15);

    if (!supabase || !isSupabaseConfigured) {
      console.warn('Supabase not configured, falling back to local object URL for preview');
      if (typeof onProgress === 'function') onProgress(100);
      return {
        downloadUrl: URL.createObjectURL(file),
        storagePath: `local_blog_${Date.now()}`
      };
    }

    try {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const sanitizedName = (file.name || 'blog-image.jpg')
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, '_');
      const storagePath = `posts/${timestamp}_${randomStr}_${sanitizedName}`;

      if (typeof onProgress === 'function') onProgress(45);

      const { data, error } = await supabase.storage
        .from(BLOG_BUCKET_NAME)
        .upload(storagePath, file, {
          contentType: file.type || 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.error('Supabase blog storage upload error:', error);
        throw new Error(error.message || 'Failed to upload blog image to Supabase Storage');
      }

      if (typeof onProgress === 'function') onProgress(80);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BLOG_BUCKET_NAME)
        .getPublicUrl(storagePath);

      const downloadUrl = publicUrlData?.publicUrl || `${SUPABASE_URL}/storage/v1/object/public/${BLOG_BUCKET_NAME}/${storagePath}`;

      if (typeof onProgress === 'function') onProgress(100);

      return {
        downloadUrl,
        storagePath
      };
    } catch (err) {
      console.error('Upload blog image error:', err);
      throw new Error(err.message || 'Image upload is temporarily unavailable. Please try again.');
    }
  },

  deleteCardPhoto: async (storagePathOrUrl) => {
    if (!storagePathOrUrl || !supabase || !isSupabaseConfigured) return false;

    try {
      let relativePath = storagePathOrUrl;
      if (storagePathOrUrl.startsWith('http://') || storagePathOrUrl.startsWith('https://')) {
        const marker = `/object/public/${BUCKET_NAME}/`;
        const idx = storagePathOrUrl.indexOf(marker);
        if (idx !== -1) {
          relativePath = storagePathOrUrl.substring(idx + marker.length);
        } else {
          return false;
        }
      }

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([relativePath]);

      if (error) {
        console.warn('Supabase storage deletion error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Delete card photo failed gracefully:', e.message);
      return false;
    }
  },

  deleteBlogImage: async (storagePathOrUrl) => {
    if (!storagePathOrUrl || !supabase || !isSupabaseConfigured) return false;

    try {
      let relativePath = storagePathOrUrl;
      if (storagePathOrUrl.startsWith('http://') || storagePathOrUrl.startsWith('https://')) {
        const marker = `/object/public/${BLOG_BUCKET_NAME}/`;
        const idx = storagePathOrUrl.indexOf(marker);
        if (idx !== -1) {
          relativePath = storagePathOrUrl.substring(idx + marker.length);
        } else {
          return false;
        }
      }

      const { error } = await supabase.storage
        .from(BLOG_BUCKET_NAME)
        .remove([relativePath]);

      if (error) {
        console.warn('Supabase blog storage deletion error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Delete blog image failed gracefully:', e.message);
      return false;
    }
  },

  // Fallback preset avatar images
  PRESET_PHOTOS: [
    { label: 'Elegant Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80' },
    { label: 'Warm Smile', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80' },
    { label: 'Celebration Joy', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80' },
    { label: 'Friends Candid', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80' },
    { label: 'Cozy Moments', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80' },
  ]
};
