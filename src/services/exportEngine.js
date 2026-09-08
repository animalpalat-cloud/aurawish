/**
 * Core Export Engine for AuraWish Birthday Cards
 * 
 * PNG Export: Uses html2canvas to capture the actual DOM card element,
 *            ensuring the exported image matches the Live Preview exactly.
 * 
 * Video Export: Uses canvas captureStream + MediaRecorder with
 *              procedural birthday audio synthesis for MP4/WebM.
 */

import html2canvas from 'html2canvas';
import { MUSIC_TRACKS } from '../data/musicTracksData';
import { getFontFamily, loadFont, isUrduFont, containsUrduText, ALL_FONTS } from '../data/fontsData';
import { getLanguage, detectScriptAndDirection } from '../data/languagesData';

export class CardExportEngine {
  constructor() {
    this.isAborted = false;
  }

  abort() {
    this.isAborted = true;
  }

  /**
   * Sanitizes names for safe file downloading across operating systems
   */
  static sanitizeFilename(title, ext = 'png') {
    const cleaned = (title || 'AuraWish-Birthday-Card')
      .replace(/[\/\\:*?"<>|]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
    return `${cleaned || 'AuraWish-Birthday-Card'}.${ext}`;
  }

  /**
   * Safe image loader with CORS handling
   */
  static loadSafeImage(src) {
    if (!src) return Promise.resolve(null);
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  /**
   * Helper to draw high-definition rounded rectangles
   */
  static roundRect(ctx, x, y, width, height, radius = 16) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Export High-Resolution PNG Image using html2canvas
   * Captures the actual DOM card element so it matches the Live Preview exactly.
   */
  async exportPNG(cardData, template, options = {}) {
    const scale = options.scale || 2; // 2x for high-res

    // 1. Ensure the specific font is loaded via our dynamic loader
    const currentLang = getLanguage(cardData.language || 'en');
    const selectedFont = cardData.font || template?.fontFamily || currentLang.defaultFont || 'Playfair Display';
    await loadFont(selectedFont);

    // 2. Ensure all fonts are ready and verified in the browser document
    if (document.fonts) {
      try {
        if (document.fonts.ready) {
          await document.fonts.ready;
        }
        // Explicitly load the font sizes used in rendering
        const fontFam = selectedFont;
        await Promise.all([
          document.fonts.load(`400 32px "${fontFam}"`),
          document.fonts.load(`700 48px "${fontFam}"`),
        ]);
      } catch (e) {
        console.warn('Font preload check during export:', e);
      }
    }
    // Extra wait for layout and Nastaliq shaping to stabilize
    await new Promise(r => setTimeout(r, 400));

    // Find the card element in the DOM using the data attribute or selector
    let cardElement = document.querySelector('[data-card-export="true"]');
    if (!cardElement) {
      cardElement = document.querySelector('.card-export-target') || document.querySelector('[data-card-wrapper]');
    }

    if (cardElement) {
      // Temporarily remove any CSS transform scaling on the card and its ancestors
      // so html2canvas captures at full resolution
      const elementsToReset = [];
      let el = cardElement;
      while (el && el !== document.body) {
        const computedStyle = window.getComputedStyle(el);
        const transform = computedStyle.transform;
        if (transform && transform !== 'none') {
          elementsToReset.push({ element: el, originalTransform: el.style.transform });
          el.style.transform = 'none';
        }
        el = el.parentElement;
      }

      try {
        const canvas = await html2canvas(cardElement, {
          scale: scale,
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          logging: false,
          // Ensure full width/height capture
          width: cardElement.scrollWidth,
          height: cardElement.scrollHeight,
          windowWidth: cardElement.scrollWidth,
          windowHeight: cardElement.scrollHeight,
          // Remove clipping
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
        });

        return new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }
            const url = URL.createObjectURL(blob);
            const filename = CardExportEngine.sanitizeFilename(
              `Happy-Birthday-${cardData.recipientName || 'Card'}`,
              'png'
            );
            resolve({ blob, url, filename });
          }, 'image/png', 1.0);
        });
      } finally {
        // Restore original transforms
        elementsToReset.forEach(({ element, originalTransform }) => {
          element.style.transform = originalTransform;
        });
      }
    }

    // High-fidelity Direct Canvas Rendering Fallback
    // (Used when downloading from screens where DOM card isn't currently mounted, e.g. unboxed state or success screen)
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 1080;
    fallbackCanvas.height = 1080;
    const ctx = fallbackCanvas.getContext('2d');
    const photoImg = await CardExportEngine.loadSafeImage(cardData.photoUrl);

    CardExportEngine.renderFrame(ctx, cardData, template, 0, photoImg, 1080, 1080);

    return new Promise((resolve, reject) => {
      fallbackCanvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas image creation failed'));
          return;
        }
        const url = URL.createObjectURL(blob);
        const filename = CardExportEngine.sanitizeFilename(
          `Happy-Birthday-${cardData.recipientName || 'Card'}`,
          'png'
        );
        resolve({ blob, url, filename });
      }, 'image/png', 1.0);
    });
  }

  /**
   * Renders a single frame of the card onto a 2D canvas (for video export)
   * This uses the user's selected font from cardData
   */
  static renderFrame(ctx, cardData, template, time, photoImg, width, height) {
    const userFont = cardData.font || 'Playfair Display';

    // 1. Background Gradient / Canvas Base
    const grad = ctx.createRadialGradient(
      width / 2, height * 0.35, 80,
      width / 2, height * 0.5, width * 0.8
    );
    const themeColor = cardData.themeColor || template?.accentColor || '#E5C07B';
    const bgDark = '#090b10';

    grad.addColorStop(0, '#151926');
    grad.addColorStop(0.6, '#0d0f17');
    grad.addColorStop(1, bgDark);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Ambient Aura glow
    const auraAlpha = 0.18 + Math.sin(time * 2) * 0.05;
    ctx.save();
    ctx.fillStyle = themeColor;
    ctx.globalAlpha = auraAlpha;
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.4, width * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Outer Luxury Border / Framing
    ctx.save();
    ctx.strokeStyle = themeColor;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 4;
    CardExportEngine.roundRect(ctx, 40, 40, width - 80, height - 80, 36);
    ctx.stroke();

    // Thin inner filigree line
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 1.5;
    CardExportEngine.roundRect(ctx, 56, 56, width - 112, height - 112, 28);
    ctx.stroke();

    // Corner diamond accents
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = themeColor;
    const corners = [
      [56, 56],
      [width - 56, 56],
      [56, height - 56],
      [width - 56, height - 56]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-6, -6, 12, 12);
      ctx.restore();
    });
    ctx.restore();

    // 3. Floating Celebration Particles
    ctx.save();
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      const pSeed = (i * 997) % 1000;
      const speed = 0.4 + (i % 5) * 0.2;
      const px = ((pSeed * 1.3 + Math.sin(time * speed + i) * 60) % width + width) % width;
      const py = ((pSeed * 2.1 - time * speed * 120) % height + height) % height;
      const size = 3 + (i % 4) * 2.5;

      const pType = i % 3;
      if (pType === 0) {
        const alpha = 0.3 + Math.abs(Math.sin(time * 3 + i)) * 0.6;
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      } else if (pType === 1) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(time * 3 + i);
        ctx.fillStyle = i % 2 === 0 ? '#f43f5e' : (i % 4 === 0 ? '#06b6d4' : '#fbbf24');
        ctx.globalAlpha = 0.7;
        ctx.fillRect(-size * 1.2, -size * 0.5, size * 2.4, size);
        ctx.restore();
      } else {
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(px, py, size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // 4. Subtitle / Eyebrow Header
    const subtitle = cardData.subtitle || 'Special Birthday Edition';
    const isSubUrdu = containsUrduText(subtitle);
    ctx.save();
    ctx.font = isSubUrdu 
      ? `700 24px "${userFont}", "Noto Nastaliq Urdu", "Noto Naskh Arabic", sans-serif`
      : `700 24px "${userFont}", "Plus Jakarta Sans", Inter, sans-serif`;
    ctx.fillStyle = themeColor;
    ctx.textAlign = 'center';
    ctx.globalAlpha = Math.min(1, Math.max(0, time * 1.5));
    ctx.fillText(isSubUrdu ? subtitle : subtitle.toUpperCase(), width / 2, 130);
    ctx.restore();

    // 5. Main "HAPPY BIRTHDAY" Title with Metallic Shimmer
    const titleText = cardData.title || 'HAPPY BIRTHDAY';
    const isTitleUrdu = containsUrduText(titleText);
    ctx.save();
    ctx.font = isTitleUrdu
      ? `700 56px "${userFont}", "Noto Nastaliq Urdu", "Noto Naskh Arabic", serif`
      : `900 68px "${userFont}", "Playfair Display", Cinzel, Georgia, serif`;
    ctx.textAlign = 'center';

    const shimmerOffset = (time * 350) % (width * 1.5) - width * 0.25;
    const titleGrad = ctx.createLinearGradient(shimmerOffset, 0, shimmerOffset + 300, 0);
    titleGrad.addColorStop(0, '#ffffff');
    titleGrad.addColorStop(0.5, themeColor);
    titleGrad.addColorStop(1, '#ffffff');

    ctx.fillStyle = titleGrad;
    ctx.shadowColor = themeColor;
    ctx.shadowBlur = 18;
    ctx.fillText(isTitleUrdu ? titleText : titleText.toUpperCase(), width / 2, 220);
    ctx.restore();

    // 6. Recipient Name
    const recipient = cardData.recipientName || 'Someone Special';
    const isRecUrdu = containsUrduText(recipient);
    ctx.save();
    ctx.font = isRecUrdu
      ? `700 44px "${userFont}", "Noto Nastaliq Urdu", "Noto Naskh Arabic", serif`
      : `italic 700 48px "${userFont}", "Great Vibes", "Playfair Display", Georgia, cursive`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 12;
    ctx.fillText(recipient, width / 2, 295);

    // Subtle underline flourish
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, 315);
    ctx.lineTo(width / 2 + 140, 315);
    ctx.stroke();

    // Center dot on flourish
    ctx.fillStyle = themeColor;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(width / 2, 315, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Center Photo or Graphic Medallion
    const photoY = 560;
    const photoRadius = 190;

    if (photoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, photoY, photoRadius + 10, 0, Math.PI * 2);
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 5;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 24;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, photoY, photoRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const imgAspect = photoImg.width / photoImg.height;
      let drawW = photoRadius * 2;
      let drawH = photoRadius * 2;
      if (imgAspect > 1) {
        drawW = drawH * imgAspect;
      } else {
        drawH = drawW / imgAspect;
      }

      const scale = 1 + Math.sin(time * 0.8) * 0.02;
      ctx.drawImage(
        photoImg,
        width / 2 - (drawW * scale) / 2,
        photoY - (drawH * scale) / 2,
        drawW * scale,
        drawH * scale
      );
      ctx.restore();
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, photoY, photoRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#161922';
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 4;
      ctx.fill();
      ctx.stroke();

      ctx.font = '96px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎂', width / 2, photoY);
      ctx.restore();
    }

    // 8. Birthday Message Paragraph (With complete multilingual script & RTL support)
    const message = cardData.message || 'Wishing you endless joy, love, laughter, and happiness on this wonderful milestone birthday!';
    const currentLang = getLanguage(cardData.language || 'en');
    const scriptInfo = detectScriptAndDirection(message, cardData.language);
    const isMsgRtl = (cardData.direction === 'rtl') || (currentLang.direction === 'rtl') || scriptInfo.isRtl;

    ctx.save();
    ctx.font = `400 28px ${getFontFamily(userFont)}`;
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    if (isMsgRtl) {
      ctx.direction = 'rtl';
    }

    const maxTextWidth = width - 200;
    const words = message.split(' ');
    let line = '';
    let lineY = 810;
    const lineHeight = isMsgRtl ? 50 : 42;

    for (let n = 0; n < words.length; n++) {
      const testLine = line ? line + ' ' + words[n] : words[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && n > 0) {
        ctx.fillText(line, width / 2, lineY);
        line = words[n];
        lineY += lineHeight;
        if (lineY > 960) {
          line += '...';
          break;
        }
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, width / 2, lineY);
    }
    ctx.restore();

    // 9. Sender Sign-off Badge at Footer
    const sender = cardData.senderName ? (isMsgRtl ? `${cardData.senderName}` : `With love from ${cardData.senderName}`) : (currentLang.sampleSender || 'With all our love & warmest wishes');
    const isSenderRtl = isMsgRtl || detectScriptAndDirection(sender, cardData.language).isRtl;
    ctx.save();
    ctx.font = `600 24px ${getFontFamily(userFont)}`;
    ctx.fillStyle = themeColor;
    ctx.textAlign = 'center';
    if (isSenderRtl) {
      ctx.direction = 'rtl';
    }
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 8;
    ctx.fillText(`✨ ${sender} ✨`, width / 2, 1020);
    ctx.restore();
  }


  /**
   * Export Animated MP4/WebM Video with Synchronized Music
   */
  async exportVideo(cardData, template, onProgress = () => {}) {
    this.isAborted = false;
    const width = 1080;
    const height = 1080;
    const fps = 30;
    const durationSeconds = 6;
    const totalFrames = fps * durationSeconds;

    onProgress(5, 'Preparing studio fonts & artwork...');
    const currentLang = getLanguage(cardData.language || 'en');
    const selectedFont = cardData.font || template?.fontFamily || currentLang.defaultFont || 'Playfair Display';
    await loadFont(selectedFont);

    if (document.fonts) {
      try {
        if (document.fonts.ready) {
          await document.fonts.ready;
        }
        await Promise.all([
          document.fonts.load(`400 30px "${selectedFont}"`),
          document.fonts.load(`700 56px "${selectedFont}"`)
        ]);
      } catch (e) {
        console.warn('Font load check in exportVideo:', e);
      }
    }

    if (this.isAborted) throw new Error('Export cancelled');

    const photoImg = await CardExportEngine.loadSafeImage(cardData.photoUrl);

    // Setup Canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Setup Web Audio Context for video sound sync
    let audioContext = null;
    let audioDestination = null;
    let audioStream = null;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        audioDestination = audioContext.createMediaStreamDestination();
        audioStream = audioDestination.stream;
      }
    } catch (e) {
      console.warn('Web Audio capture not supported, continuing with silent canvas capture:', e);
    }

    // Connect Canvas MediaStream
    const canvasStream = canvas.captureStream ? canvas.captureStream(fps) : null;
    if (!canvasStream) {
      throw new Error('Browser does not support canvas video capture (captureStream).');
    }

    // Combine video tracks + audio tracks
    const combinedTracks = [...canvasStream.getVideoTracks()];
    if (audioStream && audioStream.getAudioTracks().length > 0) {
      combinedTracks.push(audioStream.getAudioTracks()[0]);
    }

    const combinedStream = new MediaStream(combinedTracks);

    // Determine Supported MIME Type
    const mimeTypes = [
      'video/mp4;codecs=avc1',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];
    let selectedMime = '';
    for (const m of mimeTypes) {
      if (MediaRecorder.isTypeSupported(m)) {
        selectedMime = m;
        break;
      }
    }

    if (!selectedMime) {
      throw new Error('MediaRecorder video encoding is not supported on this browser.');
    }

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: selectedMime,
      videoBitsPerSecond: 5000000
    });

    const recordedChunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    recorder.start();

    // Route audio into AudioDestination: if custom device audio (trimmed or full), play that clip; otherwise synthesize procedural melody
    if (audioContext && audioDestination) {
      try {
        const customSource = cardData.customAudio?.file || cardData.customAudio?.blobUrl || cardData.customAudioUrl || (
          typeof cardData.musicTrack === 'string' && (cardData.musicTrack.startsWith('blob:') || cardData.musicTrack.startsWith('http'))
            ? cardData.musicTrack
            : null
        );

        if (customSource) {
          const playedCustom = await this.playCustomAudioToDestination(
            audioContext,
            audioDestination,
            customSource,
            cardData.customAudio?.trimRange || cardData.trimRange || null,
            durationSeconds
          );
          if (!playedCustom) {
            this.synthesizeAudioToDestination(audioContext, audioDestination, durationSeconds);
          }
        } else {
          this.synthesizeAudioToDestination(audioContext, audioDestination, durationSeconds);
        }
      } catch (err) {
        console.warn('Audio output to destination error, falling back to synthesis:', err);
        try {
          this.synthesizeAudioToDestination(audioContext, audioDestination, durationSeconds);
        } catch (synthErr) {
          console.warn('Synthesis fallback error:', synthErr);
        }
      }
    }

    onProgress(15, 'Rendering animated frames...');

    // Frame-by-frame deterministic rendering
    for (let frame = 0; frame < totalFrames; frame++) {
      if (this.isAborted) {
        recorder.stop();
        if (audioContext) audioContext.close();
        throw new Error('Export cancelled by user.');
      }

      const time = frame / fps;
      CardExportEngine.renderFrame(ctx, cardData, template, time, photoImg, width, height);

      const progressPercent = Math.round(15 + (frame / totalFrames) * 70);
      onProgress(progressPercent, `Rendering frame ${frame + 1} of ${totalFrames}...`);

      await new Promise((r) => setTimeout(r, 1000 / fps));
    }

    onProgress(88, 'Finalizing video encoding & audio synchronization...');

    return new Promise((resolve, reject) => {
      recorder.onstop = () => {
        try {
          if (audioContext) audioContext.close().catch(() => {});
          const isMp4 = selectedMime.includes('mp4');
          const ext = isMp4 ? 'mp4' : 'webm';
          const blob = new Blob(recordedChunks, { type: selectedMime });
          const url = URL.createObjectURL(blob);
          const filename = CardExportEngine.sanitizeFilename(
            `Happy-Birthday-${cardData.recipientName || 'Card'}`,
            ext
          );
          onProgress(100, 'Your birthday card video is ready!');
          resolve({ blob, url, filename, isMp4 });
        } catch (err) {
          reject(err);
        }
      };

      recorder.onerror = (e) => {
        if (audioContext) audioContext.close().catch(() => {});
        reject(e.error || new Error('Video recording failed.'));
      };

      recorder.stop();
    });
  }

  /**
   * Decodes custom/trimmed audio and plays the exact trimmed segment into the video MediaStreamDestination
   */
  async playCustomAudioToDestination(audioCtx, dest, source, trimRange, maxDuration) {
    try {
      let arrayBuffer;
      if (source instanceof Blob || source instanceof File) {
        arrayBuffer = await source.arrayBuffer();
      } else if (typeof source === 'string') {
        const res = await fetch(source);
        if (!res.ok) return false;
        arrayBuffer = await res.arrayBuffer();
      } else {
        return false;
      }

      const decodedBuffer = await new Promise((resolve, reject) => {
        audioCtx.decodeAudioData(arrayBuffer.slice(0), resolve, reject);
      });

      if (!decodedBuffer) return false;

      // Determine offset and playback duration
      const offset = trimRange?.start ? Math.max(0, trimRange.start) : 0;
      const end = trimRange?.end ? Math.min(trimRange.end, decodedBuffer.duration) : decodedBuffer.duration;
      const clipDuration = Math.max(0.5, end - offset);
      const playDuration = Math.min(maxDuration, clipDuration);

      const sourceNode = audioCtx.createBufferSource();
      sourceNode.buffer = decodedBuffer;

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime);
      // Gentle fade out at the end of the video
      gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime + maxDuration - 0.5);
      gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + maxDuration);

      sourceNode.connect(gainNode);
      gainNode.connect(dest);

      // Play starting from offset for playDuration
      sourceNode.start(audioCtx.currentTime, offset, playDuration);
      return true;
    } catch (err) {
      console.warn('playCustomAudioToDestination failed:', err);
      return false;
    }
  }

  /**
   * Generates synchronized procedural birthday melody directly into the MediaStreamDestination
   */
  synthesizeAudioToDestination(audioCtx, dest, duration) {
    const HAPPY_BDAY_NOTES = [
      261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
      261.63, 261.63, 293.66, 261.63, 392.00, 349.23,
      261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66,
      466.16, 466.16, 440.00, 349.23, 392.00, 349.23
    ];

    const CHORDS = [
      [261.63, 329.63, 392.00], // C
      [196.00, 246.94, 293.66], // G
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 349.23], // F
    ];

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    masterGain.connect(dest);

    const stepDuration = 0.35;
    const totalSteps = Math.floor(duration / stepDuration);

    for (let step = 0; step < totalSteps; step++) {
      const stepTime = audioCtx.currentTime + step * stepDuration;

      if (step % 4 === 0) {
        const chord = CHORDS[Math.floor((step / 4) % CHORDS.length)];
        chord.forEach((freq) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, stepTime);
          gain.gain.setValueAtTime(0.06, stepTime);
          gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 1.3);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(stepTime);
          osc.stop(stepTime + 1.4);
        });
      }

      const note = HAPPY_BDAY_NOTES[step % HAPPY_BDAY_NOTES.length];
      const melOsc = audioCtx.createOscillator();
      const melGain = audioCtx.createGain();
      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(note, stepTime);
      melGain.gain.setValueAtTime(0.16, stepTime);
      melGain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.5);
      melOsc.connect(melGain);
      melGain.connect(masterGain);
      melOsc.start(stepTime);
      melOsc.stop(stepTime + 0.55);
    }
  }
}

export const cardExportEngine = new CardExportEngine();
