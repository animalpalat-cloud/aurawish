import React, { useMemo } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { MUSIC_TRACKS } from '../../data/musicTracksData';

export const MusicToggle = ({ trackId = 'classic-happy-birthday', customAudioUrl = null, customAudioName = null }) => {
  const { isPlayingMusic, toggleMusic } = useSound();

  const isCustom = trackId === 'custom-device' || (typeof trackId === 'string' && (trackId.startsWith('http://') || trackId.startsWith('https://') || trackId.startsWith('blob:')));

  const effectiveTrackId = customAudioUrl || trackId;

  const trackName = useMemo(() => {
    if (customAudioName) return customAudioName;
    if (isCustom) return 'Personal Device Music';
    const t = MUSIC_TRACKS?.find(m => m.id === trackId);
    return t ? t.title : 'Celebration Soundtrack';
  }, [trackId, customAudioName, isCustom]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => toggleMusic(trackId)}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-xl border transition-all text-xs font-semibold cursor-pointer ${
          isPlayingMusic
            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/30 scale-105 ring-2 ring-amber-400/40'
            : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-500'
        }`}
        title={isPlayingMusic ? "Pause celebration music" : `Play: ${trackName}`}
      >
        {isPlayingMusic ? (
          <>
            <Volume2 className="w-4 h-4 animate-bounce shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">{trackName}</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono">Playing</span>
          </>
        ) : (
          <>
            <Music className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-[180px]">Play Music</span>
          </>
        )}
      </button>
    </div>
  );
};
