import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from 'lucide-react';
import { getBlogImageUrl } from '../../pages/BirthdayArticlePage';

/**
 * Helper to parse various video URLs (YouTube, Vimeo, direct MP4/WebM, or embed code)
 * Returns { type: 'youtube' | 'vimeo' | 'video' | 'iframe', src: string } or null
 */
export function parseVideoSource(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return null;
  const input = rawInput.trim();
  if (!input) return null;

  // Check if input is an <iframe> HTML snippet
  if (input.includes('<iframe') && input.includes('src=')) {
    const srcMatch = input.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return { type: 'iframe', src: srcMatch[1] };
    }
  }

  // YouTube match: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = input.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      id: ytMatch[1],
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`
    };
  }

  // Vimeo match: vimeo.com/ID or player.vimeo.com/video/ID
  const vimeoMatch = input.match(/(?:https?:\/\/)?(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      id: vimeoMatch[1],
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`
    };
  }

  // Direct video file (or Supabase public storage path)
  const resolvedUrl = getBlogImageUrl(input);
  return {
    type: 'video',
    src: resolvedUrl
  };
}

/**
 * Responsive Inline Video Player Component
 */
export const BlogInlineVideo = ({ video, caption, className = '' }) => {
  const parsed = parseVideoSource(typeof video === 'object' ? (video.url || video.src) : video);
  const displayCaption = typeof video === 'object' ? (video.caption || caption) : caption;

  if (!parsed || !parsed.src) return null;

  return (
    <figure className={`my-6 w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1017] shadow-xl ${className}`}>
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        {parsed.type === 'youtube' || parsed.type === 'vimeo' || parsed.type === 'iframe' ? (
          <iframe
            src={parsed.src}
            title={displayCaption || 'Embedded Video'}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <video
            src={parsed.src}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain max-h-[540px] bg-black"
          >
            Your browser does not support HTML5 video playback.
          </video>
        )}
      </div>

      {displayCaption && (
        <figcaption className="px-4 py-2.5 text-center text-xs text-slate-400 border-t border-slate-800/80 bg-slate-900/60 font-sans italic">
          {displayCaption}
        </figcaption>
      )}
    </figure>
  );
};

/**
 * Responsive Inline Image Component with lightbox zoom & caption
 */
export const BlogInlineImage = ({ image, caption, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const rawUrl = typeof image === 'object' ? (image.url || image.src) : image;
  const displayCaption = typeof image === 'object' ? (image.caption || caption) : caption;
  const displayAlt = typeof image === 'object' ? (image.alt || alt || displayCaption) : (alt || displayCaption);

  const resolvedUrl = getBlogImageUrl(rawUrl);

  if (!resolvedUrl || hasError) return null;

  return (
    <>
      <figure className={`my-6 w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1017] shadow-xl group ${className}`}>
        <div className="relative overflow-hidden bg-slate-900 flex items-center justify-center">
          <img
            src={resolvedUrl}
            alt={displayAlt || 'Blog post illustration'}
            className="w-full h-auto max-h-[550px] object-cover transition-transform duration-300 group-hover:scale-[1.01] cursor-zoom-in"
            loading="lazy"
            onClick={() => setIsZoomed(true)}
            onError={() => setHasError(true)}
          />
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            title="View full image"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {displayCaption && (
          <figcaption className="px-4 py-2.5 text-center text-xs text-slate-400 border-t border-slate-800/80 bg-slate-900/60 font-sans italic">
            {displayCaption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={resolvedUrl}
              alt={displayAlt || 'Full preview'}
              className="max-w-full max-h-[82vh] rounded-xl object-contain shadow-2xl"
            />
            {displayCaption && (
              <p className="mt-3 text-sm text-slate-300 text-center font-medium max-w-xl">
                {displayCaption}
              </p>
            )}
            <span className="mt-2 text-xs text-slate-500">Click anywhere to close</span>
          </div>
        </div>
      )}
    </>
  );
};
