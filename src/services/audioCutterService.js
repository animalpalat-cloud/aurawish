/**
 * Audio Cutter Service
 * Provides in-browser client-side audio decoding, waveform extraction,
 * AudioBuffer slicing, 16-bit PCM WAV encoding, and time conversion.
 * Zero external dependencies. Uses native Web Audio API.
 */

class AudioCutterService {
  constructor() {
    this.audioCtx = null;
    this.decodedCache = new Map(); // Cache decoded AudioBuffers by file signature
    this.maxCacheSize = 3; // Keep last 3 decoded files in memory
  }

  getAudioContext() {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        throw new Error('Web Audio API is not supported in this browser.');
      }
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Decodes an audio File, Blob, or URL into an AudioBuffer.
   * Now with intelligent caching to avoid re-decoding the same file.
   */
  async decodeAudio(source) {
    let arrayBuffer;
    let cacheKey = null;

    if (source instanceof Blob || source instanceof File) {
      // Generate cache key from file size + name + type for quick lookup
      cacheKey = `${source.size}_${source.name || ''}_${source.type}`;
      
      // Check cache first
      if (this.decodedCache.has(cacheKey)) {
        const cached = this.decodedCache.get(cacheKey);
        // Move to end (LRU)
        this.decodedCache.delete(cacheKey);
        this.decodedCache.set(cacheKey, cached);
        return cached;
      }
      
      arrayBuffer = await source.arrayBuffer();
    } else if (typeof source === 'string') {
      cacheKey = source; // Use URL as cache key
      
      if (this.decodedCache.has(cacheKey)) {
        const cached = this.decodedCache.get(cacheKey);
        this.decodedCache.delete(cacheKey);
        this.decodedCache.set(cacheKey, cached);
        return cached;
      }
      
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to load audio from source (${response.status})`);
      }
      arrayBuffer = await response.arrayBuffer();
    } else if (source instanceof ArrayBuffer) {
      arrayBuffer = source;
      // No caching for raw ArrayBuffers without identity
    } else {
      throw new Error('Unsupported audio source type provided for decoding.');
    }

    const ctx = this.getAudioContext();

    // Standard Promise-based decodeAudioData with callback fallback for older Safari
    const decodedBuffer = await new Promise((resolve, reject) => {
      ctx.decodeAudioData(
        arrayBuffer.slice(0),
        (decodedBuffer) => resolve(decodedBuffer),
        (err) => {
          console.error('Audio decoding error:', err);
          reject(new Error('Could not decode this audio file. Please verify it is a valid, uncorrupted audio format.'));
        }
      );
    });

    // Cache the decoded buffer if we have a key
    if (cacheKey) {
      this.decodedCache.set(cacheKey, decodedBuffer);
      
      // Enforce cache size limit (LRU - oldest entries removed first)
      if (this.decodedCache.size > this.maxCacheSize) {
        const firstKey = this.decodedCache.keys().next().value;
        this.decodedCache.delete(firstKey);
      }
    }

    return decodedBuffer;
  }

  /**
   * Extracts downsampled normalized waveform peak data for canvas rendering.
   * Returns an array of numbers between 0.05 and 1.0.
   * Optimized with larger step size for better performance on mobile.
   */
  extractWaveformData(audioBuffer, samplesCount = 100) {
    if (!audioBuffer) return [];

    const numChannels = audioBuffer.numberOfChannels;
    const totalLength = audioBuffer.length;
    const blockSize = Math.floor(totalLength / samplesCount);
    const peaks = [];

    // Use primary channel (or mix first 2)
    const channel0 = audioBuffer.getChannelData(0);
    const channel1 = numChannels > 1 ? audioBuffer.getChannelData(1) : null;

    // Adaptive step size for performance - larger blocks = faster processing
    const stepSize = Math.max(8, Math.floor(blockSize / 32));

    for (let i = 0; i < samplesCount; i++) {
      const start = i * blockSize;
      const end = Math.min(start + blockSize, totalLength);
      let maxVal = 0;

      for (let j = start; j < end; j += stepSize) {
        const val0 = Math.abs(channel0[j]);
        if (val0 > maxVal) maxVal = val0;
        if (channel1) {
          const val1 = Math.abs(channel1[j]);
          if (val1 > maxVal) maxVal = val1;
        }
      }

      // Keep minimum height so silent bars are still nicely visible
      peaks.push(Math.max(0.08, Math.min(1.0, maxVal)));
    }

    return peaks;
  }

  /**
   * Slices an AudioBuffer from startTime to endTime (in seconds).
   * Returns a new AudioBuffer.
   */
  sliceAudioBuffer(audioBuffer, startTime, endTime) {
    if (!audioBuffer) throw new Error('No audio buffer provided.');

    const sampleRate = audioBuffer.sampleRate;
    const numChannels = audioBuffer.numberOfChannels;
    const duration = audioBuffer.duration;

    const safeStart = Math.max(0, Math.min(startTime, duration));
    const safeEnd = Math.max(safeStart + 0.1, Math.min(endTime, duration));

    const startSample = Math.floor(safeStart * sampleRate);
    const endSample = Math.min(Math.floor(safeEnd * sampleRate), audioBuffer.length);
    const frameCount = endSample - startSample;

    if (frameCount <= 0) {
      throw new Error('Invalid audio slice range.');
    }

    const ctx = this.getAudioContext();
    const slicedBuffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const sourceData = audioBuffer.getChannelData(channel);
      const targetData = slicedBuffer.getChannelData(channel);

      // Fast copy subarray
      const sub = sourceData.subarray(startSample, endSample);
      targetData.set(sub);
    }

    return slicedBuffer;
  }

  /**
   * Encodes an AudioBuffer into an uncompressed standard 16-bit PCM WAV Blob.
   * Pristine quality, zero distortion, supported everywhere natively.
   */
  audioBufferToWavBlob(audioBuffer) {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const numSamples = audioBuffer.length;
    const blockAlign = numChannels * (bitDepth / 8);
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // Helper write string
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // RIFF identifier
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');

    // fmt sub-chunk
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
    view.setUint16(20, format, true); // AudioFormat (1 = PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, byteRate, true); // ByteRate
    view.setUint16(32, blockAlign, true); // BlockAlign
    view.setUint16(34, bitDepth, true); // BitsPerSample

    // data sub-chunk
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Write interleaved 16-bit PCM samples
    let offset = 44;
    const channels = [];
    for (let c = 0; c < numChannels; c++) {
      channels.push(audioBuffer.getChannelData(c));
    }

    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        let sample = channels[c][i];
        // Clamp to [-1, 1]
        sample = Math.max(-1, Math.min(1, sample));
        // Convert to 16-bit signed integer
        const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, int16, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  /**
   * Formats seconds to "MM:SS" or "HH:MM:SS"
   */
  formatTime(totalSeconds = 0, forceHours = false) {
    if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
    const roundSecs = Math.floor(totalSeconds);
    const hours = Math.floor(roundSecs / 3600);
    const mins = Math.floor((roundSecs % 3600) / 60);
    const secs = roundSecs % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (hours > 0 || forceHours) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  }

  /**
   * Parses time string (HH:MM:SS, MM:SS, or seconds) into decimal seconds.
   * Returns null if invalid.
   */
  parseTimeString(str) {
    if (typeof str !== 'string') return null;
    const cleaned = str.trim();
    if (!cleaned) return null;

    // Direct decimal number
    if (/^\d+(\.\d+)?$/.test(cleaned)) {
      return parseFloat(cleaned);
    }

    // MM:SS or HH:MM:SS
    const parts = cleaned.split(':').map((p) => p.trim());
    if (parts.some((p) => isNaN(Number(p)) || p === '')) {
      return null;
    }

    if (parts.length === 2) {
      const [m, s] = parts.map(Number);
      if (m < 0 || s < 0 || s >= 60) return null;
      return m * 60 + s;
    }

    if (parts.length === 3) {
      const [h, m, s] = parts.map(Number);
      if (h < 0 || m < 0 || m >= 60 || s < 0 || s >= 60) return null;
      return h * 3600 + m * 60 + s;
    }

    return null;
  }
}

export const audioCutterService = new AudioCutterService();
