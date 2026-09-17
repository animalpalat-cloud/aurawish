import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Play,
  Square,
  Volume2,
  Check,
  Search,
  Sparkles,
  Heart,
  Users,
  Flame,
  Zap,
  Sliders,
  Bell,
  PartyPopper,
  Filter,
  Upload,
  Music2,
  Trash2,
  RefreshCw,
  AlertCircle,
  FileAudio,
  Scissors,
  RotateCcw
} from 'lucide-react';
import {
  MUSIC_TRACKS,
  SOUND_EFFECTS,
  MUSIC_CATEGORIES,
  soundService
} from '../../services/soundService';
import { validateAudioFile, MAX_DEVICE_MUSIC_SIZE } from '../../services/storageService';
import { MusicCutterModal } from './MusicCutterModal';

const MusicSelectorComponent = ({ cardData, updateField }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRelationship, setSelectedRelationship] = useState('all');
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [playingFxId, setPlayingFxId] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [activeTab, setActiveTab] = useState(() => {
    return cardData.musicTrack === 'custom-device' || cardData.customAudio ? 'device' : 'music';
  }); // 'music' | 'device' | 'sfx'
  const [visibleCount, setVisibleCount] = useState(16);
  const [deviceAudioError, setDeviceAudioError] = useState('');
  const [isPlayingDeviceAudio, setIsPlayingDeviceAudio] = useState(false);
  const [isCutterOpen, setIsCutterOpen] = useState(false);
  const fileInputRef = useRef(null);

  const RELATIONSHIPS = [
    { id: 'all', label: 'All Recipient Styles' },
    { id: 'mom', label: 'Mom' },
    { id: 'dad', label: 'Dad' },
    { id: 'best-friend', label: 'Best Friend' },
    { id: 'sister', label: 'Sister' },
    { id: 'brother', label: 'Brother' },
    { id: 'partner', label: 'Partner / Spouse' },
    { id: 'kids', label: 'Kids & Toddlers' },
    { id: 'teen', label: 'Teenager' },
    { id: 'boss', label: 'Mentor / Professional' }
  ];

  // Clean up object URLs on unmount or replacement
  useEffect(() => {
    return () => {
      // If we are destroying the editor, we don't necessarily revoke if still used, but we handle it
    };
  }, []);

  const handleTogglePreview = useCallback((trackId, e) => {
    if (e) e.stopPropagation();
    setIsPlayingDeviceAudio(false);
    if (playingTrackId === trackId) {
      soundService.stopMusic();
      setPlayingTrackId(null);
    } else {
      soundService.playMusic(trackId);
      setPlayingTrackId(trackId);
    }
  }, [playingTrackId]);

  const handleSelectTrack = useCallback((trackId) => {
    setIsPlayingDeviceAudio(false);
    updateField('musicTrack', trackId);
    updateField('musicSource', 'library');
  }, [updateField]);

  const handlePlayFx = useCallback((fxId) => {
    setPlayingFxId(fxId);
    soundService.playFx(fxId);
    setTimeout(() => setPlayingFxId(null), 800);
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundService.setVolume(newVol);
  }, []);

  // Device Music Handlers
  const handleDeviceFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDeviceAudioError('');

    try {
      validateAudioFile(file);

      // Revoke previous blob if existed
      if (cardData.customAudio?.blobUrl && cardData.customAudio.blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(cardData.customAudio.blobUrl);
      }

      const objectUrl = URL.createObjectURL(file);

      // Measure duration with Audio element
      const tempAudio = new Audio();
      tempAudio.src = objectUrl;
      tempAudio.onloadedmetadata = () => {
        const secs = Math.round(tempAudio.duration);
        const mins = Math.floor(secs / 60);
        const remSecs = secs % 60;
        const durationStr = `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;

        const customAudioData = {
          file,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          duration: durationStr,
          type: file.type || 'audio/mpeg',
          blobUrl: objectUrl,
        };

        updateField('customAudio', customAudioData);
        updateField('musicTrack', 'custom-device');
        updateField('musicSource', 'device');
      };

      tempAudio.onerror = () => {
        // Still set data if duration probe failed
        const customAudioData = {
          file,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          duration: 'Custom',
          type: file.type || 'audio/mpeg',
          blobUrl: objectUrl,
        };
        updateField('customAudio', customAudioData);
        updateField('musicTrack', 'custom-device');
        updateField('musicSource', 'device');
      };

    } catch (err) {
      setDeviceAudioError(err.message || 'This audio format isn’t supported. Please choose another audio file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleToggleDevicePlayback = () => {
    const audioUrl = cardData.customAudio?.blobUrl || cardData.customAudioUrl || (cardData.musicTrack.startsWith('http') ? cardData.musicTrack : null);
    if (!audioUrl) return;

    setPlayingTrackId(null);
    if (isPlayingDeviceAudio) {
      soundService.stopMusic();
      setIsPlayingDeviceAudio(false);
    } else {
      soundService.playCustomAudio(audioUrl, 'custom-device');
      setIsPlayingDeviceAudio(true);
    }
  };

  const handleRemoveDeviceMusic = () => {
    soundService.stopMusic();
    setIsPlayingDeviceAudio(false);
    setIsCutterOpen(false);

    if (cardData.customAudio?.blobUrl && cardData.customAudio.blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(cardData.customAudio.blobUrl);
    }
    if (cardData.customAudio?.originalSource?.blobUrl && cardData.customAudio.originalSource.blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(cardData.customAudio.originalSource.blobUrl);
    }

    updateField('customAudio', null);
    updateField('customAudioUrl', null);
    updateField('customAudioName', null);
    updateField('musicTrack', 'classic-happy-birthday');
    updateField('musicSource', 'library');
    setDeviceAudioError('');
  };

  const handleApplyTrim = (updatedCustomAudio) => {
    soundService.stopMusic();
    setIsPlayingDeviceAudio(false);
    updateField('customAudio', updatedCustomAudio);
    updateField('musicTrack', 'custom-device');
    updateField('musicSource', 'device');
  };

  const handleResetTrim = () => {
    soundService.stopMusic();
    setIsPlayingDeviceAudio(false);

    if (!cardData.customAudio?.originalSource) return;

    // Revoke trimmed blob URL if separate
    if (cardData.customAudio.blobUrl && cardData.customAudio.blobUrl !== cardData.customAudio.originalSource.blobUrl) {
      if (cardData.customAudio.blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(cardData.customAudio.blobUrl);
      }
    }

    const restored = {
      ...cardData.customAudio,
      file: cardData.customAudio.originalSource.file,
      name: cardData.customAudio.originalSource.name,
      duration: cardData.customAudio.originalSource.duration,
      size: cardData.customAudio.originalSource.size,
      blobUrl: cardData.customAudio.originalSource.blobUrl,
      isTrimmed: false,
      trimRange: null,
      originalSource: cardData.customAudio.originalSource
    };

    updateField('customAudio', restored);
  };

  const filteredTracks = useMemo(() => {
    return MUSIC_TRACKS.filter((track) => {
      if (selectedCategory !== 'all' && track.category !== selectedCategory) return false;
      if (selectedRelationship !== 'all') {
        if (!track.relationshipTags || !track.relationshipTags.includes(selectedRelationship)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = track.title?.toLowerCase().includes(q);
        const inDesc = track.description?.toLowerCase().includes(q);
        const inMood = track.mood?.toLowerCase().includes(q);
        const inCategory = track.category?.toLowerCase().includes(q);
        const inInstruments = track.instruments?.some(i => i.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inMood && !inCategory && !inInstruments) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedRelationship]);

  const visibleTracks = useMemo(() => filteredTracks.slice(0, visibleCount), [filteredTracks, visibleCount]);
  const selectedTrackObj = useMemo(() => MUSIC_TRACKS.find(t => t.id === cardData.musicTrack) || null, [cardData.musicTrack]);
  const isDeviceMusicActive = cardData.musicTrack === 'custom-device' || (cardData.musicSource === 'device' && cardData.customAudio);
  const hasDeviceAudio = !!(cardData.customAudio?.blobUrl || cardData.customAudioUrl);

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.webm"
        onChange={handleDeviceFileSelect}
        className="hidden"
        id="device-audio-file-input"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Music className="w-4 h-4 text-brand-400" />
            Celebration Music Studio ({MUSIC_TRACKS.length} Tracks)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Curated soundtracks, device audio upload & celebratory sound effects
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('music')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'music' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Music Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('device')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'device' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            Device Music
            {isDeviceMusicActive && <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sfx')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'sfx' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sound FX ({SOUND_EFFECTS.length})
          </button>
        </div>
      </div>

      {activeTab === 'device' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <p className="font-semibold text-slate-300 mb-1 flex items-center gap-2">
              <FileAudio className="w-4 h-4 text-brand-400" />
              Use Your Own Music
            </p>
            Select an audio file from your device — MP3, WAV, OGG, M4A or AAC, up to{' '}
            <span className="text-white font-semibold">
              {MAX_DEVICE_MUSIC_SIZE ? `${MAX_DEVICE_MUSIC_SIZE / (1024 * 1024)}MB` : '25MB'}
            </span>
            .
          </div>
          {deviceAudioError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{deviceAudioError}</span>
            </div>
          )}
          {hasDeviceAudio && cardData.customAudio ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-500/10 via-purple-500/5 to-transparent border border-brand-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                    <Music2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">{cardData.customAudio.name}</p>
                      {cardData.customAudio.isTrimmed && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                          Trimmed Clip
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {cardData.customAudio.size} · {cardData.customAudio.duration}
                      {cardData.customAudio.isTrimmed && cardData.customAudio.trimRange && (
                        <span className="text-amber-400/90 ml-1.5 font-mono">
                          ({cardData.customAudio.trimRange.startFormatted} → {cardData.customAudio.trimRange.endFormatted})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                  {/* Play / Stop */}
                  <button
                    type="button"
                    onClick={handleToggleDevicePlayback}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isPlayingDeviceAudio ? 'bg-amber-400 text-slate-950 scale-105 shadow-md shadow-amber-400/30' : 'bg-slate-800 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                    title={isPlayingDeviceAudio ? 'Stop playback' : 'Play audio'}
                  >
                    {isPlayingDeviceAudio ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  {/* Cut Music / Edit Cut */}
                  <button
                    type="button"
                    onClick={() => setIsCutterOpen(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={cardData.customAudio.isTrimmed ? 'Edit trimmed section' : 'Cut / trim audio clip'}
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>{cardData.customAudio.isTrimmed ? 'Edit Cut' : 'Cut Music'}</span>
                  </button>

                  {/* Reset Cut (if trimmed) */}
                  {cardData.customAudio.isTrimmed && (
                    <button
                      type="button"
                      onClick={handleResetTrim}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Reset to full original audio"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}

                  {/* Replace */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                    title="Replace with another audio file"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={handleRemoveDeviceMusic}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                    title="Remove audio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isDeviceMusicActive && (
                <div className="mt-3 flex items-center gap-2 text-[11px] text-green-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  This is the active card soundtrack
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-700 hover:border-brand-500/60 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all cursor-pointer group bg-slate-900/40 hover:bg-brand-500/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-800 group-hover:bg-brand-500/20 border border-slate-700 group-hover:border-brand-500/40 flex items-center justify-center text-slate-400 group-hover:text-brand-400 transition-all">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">Select Audio from Device</p>
                <p className="text-xs text-slate-400 mt-1">MP3, WAV, OGG, M4A, AAC · Max {MAX_DEVICE_MUSIC_SIZE ? `${MAX_DEVICE_MUSIC_SIZE / (1024 * 1024)}MB` : '25MB'}</p>
              </div>
            </button>
          )}
        </div>
      )}

      {activeTab === 'sfx' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Preview interactive audio reactions that play when the recipient blows candles, pops confetti, or unboxes the envelope:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SOUND_EFFECTS.map((fx) => (
              <button
                key={fx.id}
                type="button"
                onClick={() => handlePlayFx(fx.id)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  playingFxId === fx.id ? 'border-amber-400 bg-amber-400/10 scale-105 shadow-lg shadow-amber-400/20' : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">FX</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white truncate">{fx.name}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">{fx.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'music' && (
        <div className="space-y-5">
          {selectedTrackObj && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-500/15 via-purple-500/10 to-transparent border border-brand-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded-full">Card Soundtrack</span>
                    <span className="text-xs text-slate-400 font-medium">{selectedTrackObj.duration}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate mt-0.5">{selectedTrackObj.title}</h4>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePreview(selectedTrackObj.id)}
                className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {playingTrackId === selectedTrackObj.id ? <><Square className="w-3.5 h-3.5 fill-current" /> Pause</> : <><Play className="w-3.5 h-3.5 fill-current ml-0.5" /> Preview</>}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(16); }}
                placeholder="Search birthday songs, instruments, moods..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white">✕</button>}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
              <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange} className="w-full accent-brand-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none" />
              <span className="text-[11px] text-slate-400 font-mono w-7 text-right">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {MUSIC_CATEGORIES.map((cat) => (
              <button key={cat.id} type="button" onClick={() => { setSelectedCategory(cat.id); setVisibleCount(16); }} className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat.id ? 'bg-brand-500 text-white' : 'bg-slate-900/60 border border-slate-800 text-slate-400'}`}>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider shrink-0">For:</span>
            {RELATIONSHIPS.map((rel) => (
              <button key={rel.id} type="button" onClick={() => { setSelectedRelationship(rel.id); setVisibleCount(16); }} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${selectedRelationship === rel.id ? 'bg-amber-400/20 text-amber-300' : 'text-slate-400'}`}>
                {rel.label}
              </button>
            ))}
          </div>

          {visibleTracks.length > 0 ? (
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {visibleTracks.map((track) => {
                const isSelected = cardData.musicTrack === track.id;
                const isPlaying = playingTrackId === track.id;
                return (
                  <div key={track.id} onClick={() => handleSelectTrack(track.id)} className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer ${isSelected ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800 bg-slate-900/60'}`}>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button type="button" onClick={(e) => handleTogglePreview(track.id, e)} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isPlaying ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                        {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{track.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{track.description}</p>
                      </div>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleSelectTrack(track.id); }} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${isSelected ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                );
              })}
              {visibleCount < filteredTracks.length && (
                <div className="text-center pt-3">
                  <button type="button" onClick={() => setVisibleCount(prev => Math.min(prev + 16, filteredTracks.length))} className="text-xs text-brand-400 font-semibold py-2 px-4 rounded-xl bg-slate-900 border border-slate-800">
                    Load More ({filteredTracks.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/40 rounded-2xl">
              <p className="text-xs font-semibold text-white">No tracks match your search</p>
              <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedRelationship('all'); }} className="mt-3 text-xs text-brand-400">Reset Filters</button>
            </div>
          )}
        </div>
      )}

      {/* Music Cutter Modal */}
      {isCutterOpen && cardData.customAudio && (
        <MusicCutterModal
          isOpen={isCutterOpen}
          onClose={() => setIsCutterOpen(false)}
          customAudio={cardData.customAudio}
          onApplyTrim={handleApplyTrim}
        />
      )}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders when parent re-renders
export const MusicSelector = React.memo(MusicSelectorComponent, (prevProps, nextProps) => {
  // Only re-render if cardData music fields or updateField changed
  return (
    prevProps.cardData.musicTrack === nextProps.cardData.musicTrack &&
    prevProps.cardData.musicSource === nextProps.cardData.musicSource &&
    prevProps.cardData.customAudio === nextProps.cardData.customAudio &&
    prevProps.updateField === nextProps.updateField
  );
});
