import { useState, useEffect, useCallback } from 'react';
import { soundService } from '../services/soundService';

export const useSound = () => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    return () => {
      // Clean up music on unmount if needed
      // soundService.stopMusic();
    };
  }, []);

  const playFx = useCallback((type) => {
    soundService.playFx(type);
  }, []);

  const playMusic = useCallback((trackId) => {
    soundService.playMusic(trackId);
    setIsPlayingMusic(true);
    setCurrentTrack(trackId);
  }, []);

  const stopMusic = useCallback(() => {
    soundService.stopMusic();
    setIsPlayingMusic(false);
  }, []);

  const toggleMusic = useCallback((trackId) => {
    const isPlaying = soundService.toggleMusic(trackId);
    setIsPlayingMusic(isPlaying);
    setCurrentTrack(isPlaying ? trackId : null);
    return isPlaying;
  }, []);

  return {
    isPlayingMusic,
    currentTrack,
    playFx,
    playMusic,
    stopMusic,
    toggleMusic,
  };
};
