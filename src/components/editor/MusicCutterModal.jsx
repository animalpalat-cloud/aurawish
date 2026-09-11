import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors,
  Play,
  Square,
  RotateCcw,
  Clock,
  Sparkles,
  X,
  AlertCircle,
  Volume2,
  Check
} from 'lucide-react';
import { audioCutterService } from '../../services/audioCutterService';

export const MusicCutterModal = ({
  isOpen,
  onClose,
  customAudio,
  onApplyTrim
}) => {
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [waveformPeaks, setWaveformPeaks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Trim times in seconds
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // String representations for inputs
  const [startInput, setStartInput] = useState('00:00');
  const [endInput, setEndInput] = useState('00:00');
  const [inputError, setInputError] = useState('');

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [previewMode, setPreviewMode] = useState('selection'); // 'selection' | 'full'

  // Canvas & Interaction refs
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const animFrameRef = useRef(null);
  const draggingRef = useRef(null); // 'start' | 'end' | 'scrub' | null

  // Stop playback cleanly
  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = startTime;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(startTime);
  }, [startTime]);

  // Decode audio and extract waveform when modal opens
  useEffect(() => {
    if (!isOpen || !customAudio) return;

    let isMounted = true;
    setIsLoading(true);
    setErrorMsg('');
    setInputError('');

    const source = customAudio.file || customAudio.blobUrl || customAudio.publicUrl;

    // Use requestIdleCallback to defer non-critical work if available
    const decodeAsync = async () => {
      try {
        const decoded = await audioCutterService.decodeAudio(source);
        
        if (!isMounted) return;
        
        setAudioBuffer(decoded);
        const dur = decoded.duration;
        setTotalDuration(dur);

        // Waveform peaks - reduced to 100 samples for better mobile performance
        const peaks = audioCutterService.extractWaveformData(decoded, 100);
        setWaveformPeaks(peaks);

        // Set initial start/end: check if previously trimmed
        const prevStart = customAudio.trimRange?.start ?? 0;
        const prevEnd = customAudio.trimRange?.end ?? Math.min(dur, Math.max(prevStart + 5, 30));
        const initStart = Math.max(0, Math.min(prevStart, dur - 1));
        const initEnd = Math.max(initStart + 1, Math.min(prevEnd, dur));

        setStartTime(initStart);
        setEndTime(initEnd);
        setCurrentTime(initStart);
        setStartInput(audioCutterService.formatTime(initStart));
        setEndInput(audioCutterService.formatTime(initEnd));

        // Create preview Audio element
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio();
        audio.src = customAudio.blobUrl || (customAudio.file ? URL.createObjectURL(customAudio.file) : customAudio.publicUrl);
        audio.preload = 'auto';
        audioRef.current = audio;

        setIsLoading(false);
      } catch (err) {
        if (!isMounted) return;
        console.error('Cutter decode failed:', err);
        setErrorMsg(err.message || 'Could not load audio for trimming.');
        setIsLoading(false);
      }
    };

    decodeAsync();

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isOpen, customAudio]);

  // Handle Play / Pause with boundary enforcement
  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      const startAt = previewMode === 'selection' ? startTime : 0;
      const stopAt = previewMode === 'selection' ? endTime : totalDuration;

      // If current position is at or past stopAt, rewind to startAt
      if (audio.currentTime < startAt || audio.currentTime >= stopAt - 0.1) {
        audio.currentTime = startAt;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);

            // Track time in animation loop
            const updateLoop = () => {
              if (!audioRef.current) return;
              const pos = audioRef.current.currentTime;
              setCurrentTime(pos);

              if (previewMode === 'selection' && pos >= endTime) {
                audioRef.current.pause();
                audioRef.current.currentTime = startTime;
                setCurrentTime(startTime);
                setIsPlaying(false);
                return;
              }

              if (pos >= totalDuration) {
                audioRef.current.pause();
                audioRef.current.currentTime = previewMode === 'selection' ? startTime : 0;
                setCurrentTime(previewMode === 'selection' ? startTime : 0);
                setIsPlaying(false);
                return;
              }

              animFrameRef.current = requestAnimationFrame(updateLoop);
            };

            animFrameRef.current = requestAnimationFrame(updateLoop);
          })
          .catch((err) => {
            console.warn('Playback error or blocked by browser:', err);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleReplaySelection = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    audio.currentTime = startTime;
    setCurrentTime(startTime);
    setIsPlaying(false);
    setTimeout(() => {
      handleTogglePlay();
    }, 50);
  };

  // Convert mouse/touch X coordinate on the waveform to seconds
  const getTimeFromClientX = useCallback((clientX) => {
    if (!canvasRef.current || totalDuration <= 0) return 0;
    const rect = canvasRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * totalDuration;
  }, [totalDuration]);

  // Waveform canvas rendering - optimized to reduce repaints
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformPeaks.length === 0 || totalDuration <= 0) return;

    // Use requestAnimationFrame to batch visual updates
    const render = () => {
      const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = waveformPeaks.length;
      const barWidth = width / barCount;
      const gap = 1.5;
      const usableBarW = Math.max(1, barWidth - gap);

      const startX = (startTime / totalDuration) * width;
      const endX = (endTime / totalDuration) * width;
      const playX = (currentTime / totalDuration) * width;

      // Draw background unselected bars
      waveformPeaks.forEach((peak, i) => {
        const x = i * barWidth;
        const barHeight = Math.max(4, peak * (height * 0.85));
        const y = (height - barHeight) / 2;

        const inSelection = x + usableBarW >= startX && x <= endX;

        if (inSelection) {
          // Golden vibrant gradient for selected range
          const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
          grad.addColorStop(0, '#F59E0B'); // Amber 500
          grad.addColorStop(1, '#D97706'); // Amber 600
          ctx.fillStyle = grad;
        } else {
          // Muted dark slate for unselected region
          ctx.fillStyle = 'rgba(71, 85, 105, 0.45)';
        }

        // Rounded bar
        const radius = usableBarW > 2 ? 1.5 : 0.5;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, usableBarW, barHeight, radius);
        } else {
          ctx.rect(x, y, usableBarW, barHeight);
        }
        ctx.fill();
      });

      // Draw selected region overlay tint
      ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.fillRect(startX, 0, endX - startX, height);

      // Draw Playhead line if in range
      if (currentTime >= 0 && currentTime <= totalDuration) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playX, 0);
        ctx.lineTo(playX, height);
        ctx.stroke();

        // Playhead top diamond
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(playX, 6, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [waveformPeaks, startTime, endTime, currentTime, totalDuration]);

  // Pointer / Touch Handlers for Dragging Handles
  const handlePointerDown = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = type;
    stopPlayback();

    const handlePointerMove = (moveEvt) => {
      if (!draggingRef.current) return;
      const clientX = moveEvt.touches ? moveEvt.touches[0].clientX : moveEvt.clientX;
      const sec = getTimeFromClientX(clientX);

      if (draggingRef.current === 'start') {
        const newStart = Math.max(0, Math.min(sec, endTime - 0.5));
        setStartTime(newStart);
        setStartInput(audioCutterService.formatTime(newStart));
        setCurrentTime(newStart);
      } else if (draggingRef.current === 'end') {
        const newEnd = Math.max(startTime + 0.5, Math.min(sec, totalDuration));
        setEndTime(newEnd);
        setEndInput(audioCutterService.formatTime(newEnd));
      } else if (draggingRef.current === 'scrub') {
        const scrubTime = Math.max(startTime, Math.min(sec, endTime));
        setCurrentTime(scrubTime);
        if (audioRef.current) audioRef.current.currentTime = scrubTime;
      }
    };

    const handlePointerUp = () => {
      draggingRef.current = null;
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
  };

  // Waveform direct click / scrub
  const handleCanvasClick = (e) => {
    if (draggingRef.current) return;
    const clientX = e.clientX;
    const sec = getTimeFromClientX(clientX);

    // If clicked near start or end, move closest handle
    const distToStart = Math.abs(sec - startTime);
    const distToEnd = Math.abs(sec - endTime);

    if (distToStart < 2) {
      const newStart = Math.max(0, Math.min(sec, endTime - 0.5));
      setStartTime(newStart);
      setStartInput(audioCutterService.formatTime(newStart));
      setCurrentTime(newStart);
    } else if (distToEnd < 2) {
      const newEnd = Math.max(startTime + 0.5, Math.min(sec, totalDuration));
      setEndTime(newEnd);
      setEndInput(audioCutterService.formatTime(newEnd));
    } else {
      // Jump playhead
      const bounded = Math.max(startTime, Math.min(sec, endTime));
      setCurrentTime(bounded);
      if (audioRef.current) audioRef.current.currentTime = bounded;
    }
  };

  // Manual Time Input Validation & Apply
  const handleStartInputChange = (val) => {
    setStartInput(val);
    setInputError('');
    const parsed = audioCutterService.parseTimeString(val);
    if (parsed === null) {
      setInputError('Start time must be in MM:SS or seconds format (e.g. 00:15)');
      return;
    }
    if (parsed < 0 || parsed >= endTime) {
      setInputError('Start time must be before End time');
      return;
    }
    setStartTime(parsed);
    setCurrentTime(parsed);
  };

  const handleEndInputChange = (val) => {
    setEndInput(val);
    setInputError('');
    const parsed = audioCutterService.parseTimeString(val);
    if (parsed === null) {
      setInputError('End time must be in MM:SS or seconds format (e.g. 00:45)');
      return;
    }
    if (parsed <= startTime) {
      setInputError('End time must be after Start time');
      return;
    }
    if (parsed > totalDuration) {
      setInputError(`End time cannot exceed song duration (${audioCutterService.formatTime(totalDuration)})`);
      return;
    }
    setEndTime(parsed);
  };

  // Confirm & Slices Audio
  const handleApplyTrim = async () => {
    if (!audioBuffer) return;
    stopPlayback();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Slice the AudioBuffer to the exact selection
      const slicedBuffer = audioCutterService.sliceAudioBuffer(audioBuffer, startTime, endTime);

      // 2. Encode to high-quality 16-bit PCM WAV Blob
      const wavBlob = audioCutterService.audioBufferToWavBlob(slicedBuffer);

      // 3. Create active object URL
      const trimmedBlobUrl = URL.createObjectURL(wavBlob);

      const durationSecs = Math.round(endTime - startTime);
      const mins = Math.floor(durationSecs / 60);
      const remSecs = durationSecs % 60;
      const durationFormatted = `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;

      const originalName = customAudio.name || 'Audio Track';
      const cleanBaseName = originalName.replace(/\.[^/.]+$/, '');
      const trimmedName = `${cleanBaseName} (Clip ${audioCutterService.formatTime(startTime)}-${audioCutterService.formatTime(endTime)}).wav`;

      // 4. Create new File object for storage upload compatibility
      const trimmedFile = new File([wavBlob], trimmedName, { type: 'audio/wav' });

      const updatedAudioData = {
        ...customAudio,
        file: trimmedFile,
        name: trimmedName,
        size: `${(wavBlob.size / (1024 * 1024)).toFixed(1)} MB`,
        duration: durationFormatted,
        blobUrl: trimmedBlobUrl,
        isTrimmed: true,
        trimRange: {
          start: startTime,
          end: endTime,
          duration: durationSecs,
          startFormatted: audioCutterService.formatTime(startTime),
          endFormatted: audioCutterService.formatTime(endTime)
        },
        // Retain original reference for Re-edit & Reset Cut
        originalSource: customAudio.originalSource || {
          file: customAudio.file,
          blobUrl: customAudio.blobUrl,
          name: customAudio.name,
          duration: customAudio.duration,
          size: customAudio.size,
        }
      };

      onApplyTrim(updatedAudioData);
      onClose();
    } catch (err) {
      console.error('Apply trim error:', err);
      setErrorMsg(err.message || 'Failed to slice audio clip. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const clipDuration = Math.max(0, endTime - startTime);
  const startPercent = totalDuration > 0 ? (startTime / totalDuration) * 100 : 0;
  const endPercent = totalDuration > 0 ? (endTime / totalDuration) * 100 : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl bg-[#0f121a] border border-brand-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Cut Your Music
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/25">
                  STUDIO TRIMMER
                </span>
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[280px] sm:max-w-md">
                {customAudio?.name || 'Selected Audio File'} · {audioCutterService.formatTime(totalDuration)} total
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopPlayback();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-4 space-y-5 overflow-y-auto flex-1 pr-1">
          {isLoading ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-3 border-amber-400 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-300">Decoding audio & generating studio waveform...</p>
            </div>
          ) : errorMsg ? (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Audio Processing Error</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Instructions banner */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Drag the golden handles or enter start/end times to select the exact section.</span>
                <span className="font-mono text-amber-300 font-semibold shrink-0 ml-2">
                  Length: {audioCutterService.formatTime(clipDuration)}
                </span>
              </div>

              {/* Waveform Visualization Canvas & Draggable Region */}
              <div
                ref={containerRef}
                className="relative bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 select-none touch-none"
              >
                {/* Canvas */}
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={100}
                  onClick={handleCanvasClick}
                  className="w-full h-24 sm:h-28 rounded-xl cursor-pointer block"
                />

                {/* Left Dim Overlay */}
                <div
                  className="absolute top-4 bottom-4 left-4 bg-black/60 pointer-events-none rounded-l-xl"
                  style={{ width: `calc(${startPercent}% - 4px)` }}
                />

                {/* Right Dim Overlay */}
                <div
                  className="absolute top-4 bottom-4 right-4 bg-black/60 pointer-events-none rounded-r-xl"
                  style={{ width: `calc(${100 - endPercent}% - 4px)` }}
                />

                {/* Draggable Start Handle */}
                <div
                  onMouseDown={(e) => handlePointerDown('start', e)}
                  onTouchStart={(e) => handlePointerDown('start', e)}
                  className="absolute top-2 bottom-2 w-7 -translate-x-1/2 flex flex-col items-center justify-between cursor-ew-resize z-20 group"
                  style={{ left: `calc(1rem + (100% - 2rem) * (${startPercent} / 100))` }}
                  title="Drag to adjust Start time"
                >
                  <div className="w-4 h-5 rounded-md bg-amber-400 shadow-lg shadow-amber-400/50 flex items-center justify-center text-[9px] font-bold text-slate-950 group-hover:scale-110 transition-transform">
                    ◀
                  </div>
                  <div className="w-1 flex-1 bg-amber-400 rounded-full my-0.5" />
                  <div className="w-4 h-5 rounded-md bg-amber-400 shadow-lg shadow-amber-400/50 flex items-center justify-center text-[9px] font-bold text-slate-950 group-hover:scale-110 transition-transform">
                    ◀
                  </div>
                </div>

                {/* Draggable End Handle */}
                <div
                  onMouseDown={(e) => handlePointerDown('end', e)}
                  onTouchStart={(e) => handlePointerDown('end', e)}
                  className="absolute top-2 bottom-2 w-7 -translate-x-1/2 flex flex-col items-center justify-between cursor-ew-resize z-20 group"
                  style={{ left: `calc(1rem + (100% - 2rem) * (${endPercent} / 100))` }}
                  title="Drag to adjust End time"
                >
                  <div className="w-4 h-5 rounded-md bg-amber-400 shadow-lg shadow-amber-400/50 flex items-center justify-center text-[9px] font-bold text-slate-950 group-hover:scale-110 transition-transform">
                    ▶
                  </div>
                  <div className="w-1 flex-1 bg-amber-400 rounded-full my-0.5" />
                  <div className="w-4 h-5 rounded-md bg-amber-400 shadow-lg shadow-amber-400/50 flex items-center justify-center text-[9px] font-bold text-slate-950 group-hover:scale-110 transition-transform">
                    ▶
                  </div>
                </div>
              </div>

              {/* Timeline Time Indicator Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>00:00</span>
                <span>Current: {audioCutterService.formatTime(currentTime)}</span>
                <span>{audioCutterService.formatTime(totalDuration)}</span>
              </div>

              {/* Precise Start / End Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
                {/* Start Time Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={startInput}
                    onChange={(e) => handleStartInputChange(e.target.value)}
                    placeholder="00:00"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white text-center focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 text-center">Format: MM:SS</p>
                </div>

                {/* End Time Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    End Time
                  </label>
                  <input
                    type="text"
                    value={endInput}
                    onChange={(e) => handleEndInputChange(e.target.value)}
                    placeholder="00:45"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white text-center focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 text-center">Format: MM:SS</p>
                </div>

                {/* Selected Clip Duration Display */}
                <div className="flex flex-col justify-center items-center p-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
                  <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Clip Length</span>
                  <span className="text-base font-bold font-mono text-white mt-0.5">
                    {audioCutterService.formatTime(clipDuration)}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {Math.round(clipDuration)} seconds
                  </span>
                </div>
              </div>

              {inputError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 px-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {inputError}
                </p>
              )}

              {/* Preview Player Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Play/Pause Button */}
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-400 text-slate-950 scale-105 shadow-md shadow-amber-400/30'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        Pause Preview
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        Preview Selection
                      </>
                    )}
                  </button>

                  {/* Replay Selection */}
                  <button
                    type="button"
                    onClick={handleReplaySelection}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Replay from start of selection"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Auto-stop notice */}
                <p className="text-[11px] text-slate-400 text-center sm:text-right">
                  Preview plays from <span className="text-white font-mono">{audioCutterService.formatTime(startTime)}</span> and stops at <span className="text-white font-mono">{audioCutterService.formatTime(endTime)}</span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              stopPlayback();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyTrim}
            disabled={isLoading || !!errorMsg || clipDuration <= 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Use This Clip
          </button>
        </div>
      </motion.div>
    </div>
  );
};
