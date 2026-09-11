/**
 * Birthday Wishes — Card Export Engine
 *
 * PNG Export: Uses html2canvas to capture the actual DOM card element at its
 *             natural (unscaled) size so the result matches Live Preview exactly.
 *             Falls back to direct canvas rendering when the DOM card is not
 *             available (e.g. success screen after sharing).
 *
 * Video Export: Uses canvas captureStream + MediaRecorder.  renderFrame() is
 *               fully proportional — every coordinate and font size scales with
 *               the canvas dimensions so a 720×720 mobile canvas renders the
 *               same complete composition as a 1080×1080 desktop canvas.
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

  // ─────────────────────────────────────────────────────────────────────────
  // Utilities
  // ─────────────────────────────────────────────────────────────────────────

  static sanitizeFilename(title, ext = 'png') {
    const cleaned = (title || 'Birthday-Wishes-Card')
      .replace(/[\/\\:*?"<>|]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
    return `${cleaned || 'Birthday-Wishes-Card'}.${ext}`;
  }

  static loadSafeImage(src) {
    if (!src) return Promise.resolve(null);
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload  = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  static roundRect(ctx, x, y, w, h, r = 16) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /**
   * Robustly wait for a font to be ready in the browser.
   * 
   * On mobile networks Google Fonts can take 1–3 s to download.
   * The previous 200 ms race meant text was often rendered with the
   * browser fallback font — so the card text appeared in a wrong generic
   * font (or, for Urdu Nastaliq, was completely illegible / zero-height).
   *
   * Strategy: load the font, then verify it is usable via document.fonts.check().
   * Retry with exponential back-off up to maxWaitMs.
   */
  static async waitForFont(fontId, maxWaitMs = 3000) {
    if (typeof window === 'undefined') return;
    await loadFont(fontId);

    if (!document.fonts) return; // Old browser — proceed anyway

    const familyName = getFontFamily(fontId);
    // Extract just the primary family name from the CSS font-family stack
    const primaryFamily = familyName
      .split(',')[0]
      .replace(/['"]/g, '')
      .trim();

    const testSizes = ['400 32px', '700 32px'];
    const deadline = Date.now() + maxWaitMs;

    while (Date.now() < deadline) {
      // Check if both normal and bold are ready
      const allReady = testSizes.every(style =>
        document.fonts.check(`${style} "${primaryFamily}"`)
      );
      if (allReady) return;
      // Wait 80 ms then retry
      await new Promise(r => setTimeout(r, 80));
    }

    // Last attempt — wait for document.fonts.ready with a hard cap
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise(r => setTimeout(r, 500)),
      ]);
    } catch (_) {}
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PNG Export
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Export High-Resolution PNG.
   *
   * PRIMARY PATH — html2canvas on the live DOM card element.
   *   This captures the real React template exactly as rendered, including all
   *   CSS gradients, custom fonts, photos, decorations and layout variants.
   *
   *   Key mobile fix: the card in LivePreviewPane is wrapped in a transform:scale()
   *   container.  We must capture the card at its *natural* (unscaled) pixel
   *   dimensions.  We do this by:
   *     1. Detaching the card element from the scaled wrapper temporarily.
   *     2. Appending it at position:fixed / visibility:hidden so its full CSS
   *        size is available to html2canvas.
   *     3. Capturing it, then reattaching.
   *
   * FALLBACK PATH — direct canvas renderFrame().
   *   Used when the DOM card is not mounted (e.g. post-save success screen).
   */
  async exportPNG(cardData, template, options = {}) {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    // 2× on desktop, 1.5× on mobile (keeps file size manageable while staying sharp)
    const scale = options.scale || (isMobile ? 1.5 : 2);

    // 1. Ensure the selected font is fully loaded and verified before capture
    const currentLang = getLanguage(cardData.language || 'en');
    const selectedFont = cardData.font || template?.fontFamily || currentLang.defaultFont || 'Playfair Display';
    await CardExportEngine.waitForFont(selectedFont);

    // 2. Locate the rendered card element in the DOM
    let cardElement =
      document.querySelector('[data-card-export="true"]') ||
      document.querySelector('.card-export-target') ||
      document.querySelector('[data-card-wrapper]');

    if (cardElement) {
      // ── DOM capture path ────────────────────────────────────────────────
      //
      // MOBILE FIX: The card sits inside a transform:scale() wrapper in
      // LivePreviewPane.  If we call html2canvas on the scaled element:
      //   • scrollWidth/scrollHeight reflect the *CSS* dimensions (natural size)
      //   • but all ancestors have a scale() transform which confuses html2canvas
      //     on mobile, making it render at the tiny scaled viewport size instead
      //     of the natural card size.
      //
      // Solution: clone the card, render the clone in a fixed off-screen
      // container at its natural dimensions (no transforms), capture that,
      // then remove it.  The clone is invisible to the user.

      const naturalW = cardElement.scrollWidth  || cardElement.offsetWidth  || 640;
      const naturalH = cardElement.scrollHeight || cardElement.offsetHeight || 640;

      // Create an off-screen fixed container so the clone has no ancestor
      // transforms and renders at 100% natural size.
      const offscreen = document.createElement('div');
      offscreen.style.cssText = [
        'position:fixed',
        'top:0',
        'left:0',
        `width:${naturalW}px`,
        `height:${naturalH}px`,
        'overflow:visible',
        'opacity:0',           // invisible to user
        'pointer-events:none', // cannot be clicked
        'z-index:-9999',       // behind everything
        'transform:none',      // NO ancestor transform
        'will-change:auto',
      ].join(';');
      document.body.appendChild(offscreen);

      // Deep-clone the card so fonts, colours and inline styles are preserved
      const clone = cardElement.cloneNode(true);
      clone.style.cssText = [
        `width:${naturalW}px`,
        'transform:none',
        'position:static',
        'max-width:none',
      ].join(';');
      offscreen.appendChild(clone);

      try {
        const canvas = await html2canvas(clone, {
          scale,
          useCORS:         true,
          allowTaint:      false,
          backgroundColor: null,
          logging:         false,
          width:           naturalW,
          height:          naturalH,
          windowWidth:     naturalW,
          windowHeight:    naturalH,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          // Ignore elements that should not be in the export
          ignoreElements: (el) =>
            el.tagName === 'AUDIO' ||
            el.tagName === 'VIDEO' ||
            el.getAttribute('aria-hidden') === 'true',
        });

        return await CardExportEngine._blobFromCanvas(canvas, cardData);
      } finally {
        // Always clean up the off-screen clone
        document.body.removeChild(offscreen);
      }
    }

    // ── Fallback: direct canvas render ───────────────────────────────────
    // The DOM card is not currently mounted.  Render the complete composition
    // directly onto a canvas using renderFrame().
    const fbSize = isMobile ? 720 : 1080;
    const fbCanvas = document.createElement('canvas');
    fbCanvas.width  = fbSize;
    fbCanvas.height = fbSize;
    const fbCtx = fbCanvas.getContext('2d');
    const photoImg = await CardExportEngine.loadSafeImage(cardData.photoUrl);
    CardExportEngine.renderFrame(fbCtx, cardData, template, 0, photoImg, fbSize, fbSize);
    return await CardExportEngine._blobFromCanvas(fbCanvas, cardData);
  }

  static _blobFromCanvas(canvas, cardData) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob() returned null. Please try again.'));
          return;
        }
        const url      = URL.createObjectURL(blob);
        const filename = CardExportEngine.sanitizeFilename(
          `Happy-Birthday-${cardData.recipientName || 'Card'}`,
          'png',
        );
        resolve({ blob, url, filename });
      }, 'image/png', 1.0);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Canvas Frame Renderer  (PNG fallback + every MP4 frame)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * renderFrame — draws the complete birthday card composition onto `ctx`.
   *
   * MOBILE FIX (root cause of missing text in video):
   *   The previous version hardcoded coordinates and font sizes for a 1080×1080
   *   canvas.  When the mobile export used a 720×720 canvas, all text, borders
   *   and decorations were placed at 1080-scale positions — most of them were
   *   outside the canvas bounds and therefore invisible.
   *
   * Fix: every coordinate, font size, line width and radius is now expressed as
   * a fraction of `width`/`height`.  The visual layout is identical at any
   * square canvas size.
   *
   * Layout proportions (based on original 1080px design, normalised to [0,1]):
   *   Subtitle Y:       130/1080 ≈ 0.120
   *   Title Y:          220/1080 ≈ 0.204
   *   Recipient Y:      295/1080 ≈ 0.273
   *   Flourish Y:       315/1080 ≈ 0.292
   *   Photo centre Y:   560/1080 ≈ 0.519
   *   Photo radius:     190/1080 ≈ 0.176
   *   Message start Y:  810/1080 ≈ 0.750
   *   Message max Y:    960/1080 ≈ 0.889
   *   Sender Y:        1020/1080 ≈ 0.944
   */
  static renderFrame(ctx, cardData, template, time, photoImg, width, height) {
    const userFont   = cardData.font || 'Playfair Display';
    const themeColor = cardData.themeColor || template?.accentColor || '#E5C07B';

    // ── Scale helpers ──────────────────────────────────────────────────────
    // All px values that were designed for 1080 are multiplied by `s`.
    const s  = width / 1080;  // linear scale factor
    const px = (v) => Math.round(v * s); // convert design-px → canvas-px

    // ── 1. Background ──────────────────────────────────────────────────────
    const grad = ctx.createRadialGradient(
      width / 2, height * 0.35, px(80),
      width / 2, height * 0.5,  width * 0.8,
    );
    grad.addColorStop(0,   '#151926');
    grad.addColorStop(0.6, '#0d0f17');
    grad.addColorStop(1,   '#090b10');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Ambient aura glow
    ctx.save();
    ctx.fillStyle   = themeColor;
    ctx.globalAlpha = 0.18 + Math.sin(time * 2) * 0.05;
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.4, width * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ── 2. Luxury border frame ─────────────────────────────────────────────
    ctx.save();
    ctx.strokeStyle = themeColor;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth   = px(4);
    CardExportEngine.roundRect(ctx, px(40), px(40), width - px(80), height - px(80), px(36));
    ctx.stroke();

    ctx.globalAlpha = 0.25;
    ctx.lineWidth   = px(1.5);
    CardExportEngine.roundRect(ctx, px(56), px(56), width - px(112), height - px(112), px(28));
    ctx.stroke();

    // Corner diamond accents
    ctx.globalAlpha = 0.8;
    ctx.fillStyle   = themeColor;
    [[px(56), px(56)], [width - px(56), px(56)], [px(56), height - px(56)], [width - px(56), height - px(56)]].forEach(([cx, cy]) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-px(6), -px(6), px(12), px(12));
      ctx.restore();
    });
    ctx.restore();

    // ── 3. Celebration particles ───────────────────────────────────────────
    ctx.save();
    for (let i = 0; i < 45; i++) {
      const pSeed = (i * 997) % 1000;
      const speed = 0.4 + (i % 5) * 0.2;
      const ppx   = ((pSeed * 1.3 + Math.sin(time * speed + i) * px(60)) % width  + width)  % width;
      const ppy   = ((pSeed * 2.1 - time * speed * px(120))              % height + height) % height;
      const size  = px(3 + (i % 4) * 2.5);
      const pType = i % 3;
      if (pType === 0) {
        ctx.fillStyle   = themeColor;
        ctx.globalAlpha = 0.3 + Math.abs(Math.sin(time * 3 + i)) * 0.6;
        ctx.beginPath();
        ctx.arc(ppx, ppy, size, 0, Math.PI * 2);
        ctx.fill();
      } else if (pType === 1) {
        ctx.save();
        ctx.translate(ppx, ppy);
        ctx.rotate(time * 3 + i);
        ctx.fillStyle   = i % 2 === 0 ? '#f43f5e' : (i % 4 === 0 ? '#06b6d4' : '#fbbf24');
        ctx.globalAlpha = 0.7;
        ctx.fillRect(-size * 1.2, -size * 0.5, size * 2.4, size);
        ctx.restore();
      } else {
        ctx.fillStyle   = themeColor;
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(ppx, ppy, size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // ── 4. Subtitle / eyebrow ──────────────────────────────────────────────
    const subtitle   = cardData.subtitle || 'Special Birthday Edition';
    const isSubUrdu  = containsUrduText(subtitle);
    ctx.save();
    ctx.font         = isSubUrdu
      ? `700 ${px(24)}px "${userFont}", "Noto Nastaliq Urdu", "Noto Naskh Arabic", sans-serif`
      : `700 ${px(24)}px "${userFont}", "Plus Jakarta Sans", Inter, sans-serif`;
    ctx.fillStyle    = themeColor;
    ctx.textAlign    = 'center';
    ctx.globalAlpha  = Math.min(1, Math.max(0, time * 1.5));
    ctx.fillText(isSubUrdu ? subtitle : subtitle.toUpperCase(), width / 2, px(130));
    ctx.restore();

    // ── 5. Main title with shimmer ─────────────────────────────────────────
    const titleText   = cardData.title || 'HAPPY BIRTHDAY';
    const isTitleUrdu = containsUrduText(titleText);
    ctx.save();
    ctx.font      = isTitleUrdu
      ? `700 ${px(56)}px "${userFont}", "Noto Nastaliq Urdu", "Noto Naskh Arabic", serif`
      : `900 ${px(68)}px "${userFont}", "Playfair Display", Cinzel, Georgia, serif`;
    ctx.textAlign = 'center';

    const shimmerOffset = (time * px(350)) % (width * 1.5) - width * 0.25;
    const titleGrad = ctx.createLinearGradient(shimmerOffset, 0, shimmerOffset + px(300), 0);
    titleGrad.addColorStop(0,   '#ffffff');
    titleGrad.addColorStop(0.5, themeColor);
    titleGrad.addColorStop(1,   '#ffffff');
    ctx.fillStyle   = titleGrad;
    ctx.shadowColor = themeColor;
    ctx.shadowBlur  = px(18);
    ctx.fillText(isTitleUrdu ? titleText : titleText.toUpperCase(), width / 2, px(220));
    ctx.restore();

    // ── 6. Recipient name ──────────────────────────────────────────────────
    const recipient  = cardData.recipientName || 'Someone Special';
    const isRecUrdu  = containsUrduText(recipient);
    ctx.save();
    ctx.font         = isRecUrdu
      ? `700 ${px(44)}px "${userFont}", "Noto Nastaliq Urdu", "Noto Naskh Arabic", serif`
      : `italic 700 ${px(48)}px "${userFont}", "Great Vibes", "Playfair Display", Georgia, cursive`;
    ctx.fillStyle    = '#ffffff';
    ctx.textAlign    = 'center';
    ctx.shadowColor  = '#000000';
    ctx.shadowBlur   = px(12);
    ctx.fillText(recipient, width / 2, px(295));

    // Underline flourish
    ctx.strokeStyle = themeColor;
    ctx.lineWidth   = px(2);
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(width / 2 - px(140), px(315));
    ctx.lineTo(width / 2 + px(140), px(315));
    ctx.stroke();

    ctx.fillStyle   = themeColor;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(width / 2, px(315), px(5), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ── 7. Photo medallion ─────────────────────────────────────────────────
    const photoY      = px(560);
    const photoRadius = px(190);

    if (photoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, photoY, photoRadius + px(10), 0, Math.PI * 2);
      ctx.strokeStyle = themeColor;
      ctx.lineWidth   = px(5);
      ctx.shadowColor = themeColor;
      ctx.shadowBlur  = px(24);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, photoY, photoRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const imgAspect = photoImg.width / photoImg.height;
      let drawW = photoRadius * 2;
      let drawH = photoRadius * 2;
      if (imgAspect > 1) { drawW = drawH * imgAspect; }
      else               { drawH = drawW / imgAspect; }

      const scaleAnim = 1 + Math.sin(time * 0.8) * 0.02;
      ctx.drawImage(
        photoImg,
        width / 2 - (drawW * scaleAnim) / 2,
        photoY    - (drawH * scaleAnim) / 2,
        drawW * scaleAnim,
        drawH * scaleAnim,
      );
      ctx.restore();
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, photoY, photoRadius, 0, Math.PI * 2);
      ctx.fillStyle   = '#161922';
      ctx.strokeStyle = themeColor;
      ctx.lineWidth   = px(4);
      ctx.fill();
      ctx.stroke();

      ctx.font          = `${px(96)}px sans-serif`;
      ctx.textAlign     = 'center';
      ctx.textBaseline  = 'middle';
      ctx.fillText('🎂', width / 2, photoY);
      ctx.restore();
    }

    // ── 8. Birthday message ────────────────────────────────────────────────
    const message      = cardData.message || 'Wishing you endless joy, love, laughter, and happiness on this wonderful milestone birthday!';
    const currentLang  = getLanguage(cardData.language || 'en');
    const scriptInfo   = detectScriptAndDirection(message, cardData.language);
    const isMsgRtl     = (cardData.direction === 'rtl') || (currentLang.direction === 'rtl') || scriptInfo.isRtl;

    ctx.save();
    ctx.font      = `400 ${px(28)}px ${getFontFamily(userFont)}`;
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    if (isMsgRtl) ctx.direction = 'rtl';

    const maxTextWidth = width - px(200);
    const words        = message.split(' ');
    let   line         = '';
    let   lineY        = px(810);
    const lineHeight   = isMsgRtl ? px(50) : px(42);

    for (let n = 0; n < words.length; n++) {
      const testLine = line ? `${line} ${words[n]}` : words[n];
      if (ctx.measureText(testLine).width > maxTextWidth && n > 0) {
        ctx.fillText(line, width / 2, lineY);
        line   = words[n];
        lineY += lineHeight;
        if (lineY > px(960)) { line += '…'; break; }
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, width / 2, lineY);
    ctx.restore();

    // ── 9. Sender sign-off ─────────────────────────────────────────────────
    const sender      = cardData.senderName
      ? (isMsgRtl ? cardData.senderName : `With love from ${cardData.senderName}`)
      : (currentLang.sampleSender || 'With all our love & warmest wishes');
    const isSenderRtl = isMsgRtl || detectScriptAndDirection(sender, cardData.language).isRtl;

    ctx.save();
    ctx.font      = `600 ${px(24)}px ${getFontFamily(userFont)}`;
    ctx.fillStyle = themeColor;
    ctx.textAlign = 'center';
    if (isSenderRtl) ctx.direction = 'rtl';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur  = px(8);
    ctx.fillText(`✨ ${sender} ✨`, width / 2, px(1020));
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Video (MP4 / WebM) Export
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * exportVideo — capability-aware, mobile-safe animated card export.
   *
   * Mobile fixes applied:
   *   1. 720×720 canvas on mobile (fits hardware encoder limits).
   *   2. All renderFrame() coordinates now scale with canvas size — text is
   *      fully visible on both 720 and 1080 canvases.
   *   3. waitForFont() replaces the 200 ms race — font is verified before
   *      the first frame is drawn.
   *   4. Frame loop yields every 8 frames (setTimeout 0) but does NOT sleep
   *      for 33 ms per frame — prevents JS thread starvation on mobile.
   *   5. Wall-clock wait after rendering ensures MediaRecorder captures the
   *      full duration before stop() is called.
   *   6. iOS guard skips createMediaStreamDestination (unsupported on iOS).
   *   7. MIME priority list is mobile-first (webm/vp8 before mp4).
   *   8. 30 s internal timeout + 90 s outer UI guard.
   */
  async exportVideo(cardData, template, onProgress = () => {}) {
    this.isAborted = false;

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isIOS    = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const width    = isMobile ? 720 : 1080;
    const height   = isMobile ? 720 : 1080;
    const fps      = isMobile ? 24 : 30;
    const duration = 6; // seconds
    const totalFrames = fps * duration;
    const videoBitrate = isMobile ? 2_000_000 : 5_000_000;

    // ── Font loading ─── MUST complete before frame 0 ─────────────────────
    onProgress(5, 'Preparing artwork & fonts…');
    const currentLang  = getLanguage(cardData.language || 'en');
    const selectedFont = cardData.font || template?.fontFamily || currentLang.defaultFont || 'Playfair Display';

    // waitForFont() retries until document.fonts.check() confirms readiness,
    // up to 3 s.  This replaces the fragile 200 ms Promise.race.
    await CardExportEngine.waitForFont(selectedFont);

    if (this.isAborted) throw new Error('Export cancelled');

    const photoImg = await CardExportEngine.loadSafeImage(cardData.photoUrl);

    // ── Canvas ─────────────────────────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.width  = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (typeof canvas.captureStream !== 'function') {
      throw new Error('Video export is not supported on this browser. Please download as PNG.');
    }

    // ── Audio (capability-aware) ───────────────────────────────────────────
    let audioContext     = null;
    let audioDestination = null;
    let audioStream      = null;
    let audioSupported   = false;

    if (!isIOS) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioContext     = new AudioCtx();
          audioDestination = audioContext.createMediaStreamDestination();
          if (audioDestination.stream.getAudioTracks().length > 0) {
            audioStream    = audioDestination.stream;
            audioSupported = true;
          }
        }
      } catch (e) {
        console.warn('Web Audio MediaStream not available:', e);
      }
    }

    // ── MIME selection ─────────────────────────────────────────────────────
    const mimes = isMobile
      ? ['video/webm;codecs=vp8,opus', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4;codecs=avc1', 'video/mp4']
      : ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];

    const selectedMime = mimes.find(m => MediaRecorder.isTypeSupported(m)) || '';
    if (!selectedMime) {
      throw new Error('Video recording is not supported on this browser. Please download as PNG.');
    }

    // ── MediaRecorder ──────────────────────────────────────────────────────
    const canvasStream = canvas.captureStream(fps);
    const tracks = [...canvasStream.getVideoTracks()];
    if (audioSupported && audioStream) tracks.push(audioStream.getAudioTracks()[0]);
    const combinedStream = new MediaStream(tracks);

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: selectedMime,
      videoBitsPerSecond: videoBitrate,
    });

    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    recorder.start(1000); // timeslice: flush every second

    // ── Audio routing ──────────────────────────────────────────────────────
    if (audioSupported && audioContext && audioDestination) {
      try {
        const customSource =
          cardData.customAudio?.file ||
          cardData.customAudio?.blobUrl ||
          cardData.customAudioUrl ||
          (typeof cardData.musicTrack === 'string' &&
           (cardData.musicTrack.startsWith('blob:') || cardData.musicTrack.startsWith('http'))
            ? cardData.musicTrack : null);

        if (customSource) {
          const ok = await this.playCustomAudioToDestination(
            audioContext, audioDestination, customSource,
            cardData.customAudio?.trimRange || cardData.trimRange || null,
            duration,
          );
          if (!ok) this.synthesizeAudioToDestination(audioContext, audioDestination, duration);
        } else {
          this.synthesizeAudioToDestination(audioContext, audioDestination, duration);
        }
      } catch (err) {
        console.warn('Audio routing failed, using synthesis fallback:', err);
        try { this.synthesizeAudioToDestination(audioContext, audioDestination, duration); } catch (_) {}
      }
    }

    // ── Frame loop ─────────────────────────────────────────────────────────
    onProgress(15, 'Rendering animated frames…');
    const renderStart = performance.now();

    for (let frame = 0; frame < totalFrames; frame++) {
      if (this.isAborted) {
        recorder.stop();
        if (audioContext) audioContext.close().catch(() => {});
        throw new Error('Export cancelled by user.');
      }

      const time = frame / fps;
      CardExportEngine.renderFrame(ctx, cardData, template, time, photoImg, width, height);

      onProgress(
        Math.round(15 + (frame / totalFrames) * 65),
        `Rendering frame ${frame + 1} of ${totalFrames}…`,
      );

      // Yield to browser every 8 frames — keeps UI responsive without
      // the 33 ms/frame sleep that was starving the mobile encoder.
      if (frame % 8 === 0) await new Promise(r => setTimeout(r, 0));
    }

    // ── Wait for real-time duration to elapse before stopping ──────────────
    onProgress(82, 'Waiting for encoder to flush…');
    const elapsed   = performance.now() - renderStart;
    const remaining = Math.max(0, duration * 1000 - elapsed);
    if (remaining > 0) await new Promise(r => setTimeout(r, remaining + 200));

    onProgress(90, 'Finalising video…');

    // ── Collect and return result ──────────────────────────────────────────
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        try { recorder.stop(); } catch (_) {}
        if (audioContext) audioContext.close().catch(() => {});
        reject(new Error('Video export timed out. Please try PNG export instead.'));
      }, 30_000);

      recorder.onstop = () => {
        clearTimeout(timeoutId);
        try {
          if (audioContext) audioContext.close().catch(() => {});

          if (chunks.length === 0) {
            reject(new Error('No video data captured. Please try PNG export instead.'));
            return;
          }

          const isMp4     = selectedMime.includes('mp4');
          const ext       = isMp4 ? 'mp4' : 'webm';
          const blob      = new Blob(chunks, { type: selectedMime });
          const url       = URL.createObjectURL(blob);
          const filename  = CardExportEngine.sanitizeFilename(
            `Happy-Birthday-${cardData.recipientName || 'Card'}`, ext,
          );
          onProgress(100, 'Your birthday card video is ready!');
          resolve({ blob, url, filename, isMp4 });
        } catch (err) {
          reject(err);
        }
      };

      recorder.onerror = (e) => {
        clearTimeout(timeoutId);
        if (audioContext) audioContext.close().catch(() => {});
        reject(e.error || new Error('Video recording failed.'));
      };

      recorder.stop();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Audio helpers
  // ─────────────────────────────────────────────────────────────────────────

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

      const offset      = trimRange?.start ? Math.max(0, trimRange.start) : 0;
      const end         = trimRange?.end   ? Math.min(trimRange.end, decodedBuffer.duration) : decodedBuffer.duration;
      const clipDuration = Math.max(0.5, end - offset);
      const playDuration = Math.min(maxDuration, clipDuration);

      const sourceNode = audioCtx.createBufferSource();
      sourceNode.buffer = decodedBuffer;

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime + maxDuration - 0.5);
      gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + maxDuration);

      sourceNode.connect(gainNode);
      gainNode.connect(dest);
      sourceNode.start(audioCtx.currentTime, offset, playDuration);
      return true;
    } catch (err) {
      console.warn('playCustomAudioToDestination failed:', err);
      return false;
    }
  }

  synthesizeAudioToDestination(audioCtx, dest, duration) {
    const NOTES  = [261.63,261.63,293.66,261.63,349.23,329.63,261.63,261.63,293.66,261.63,392.00,349.23,261.63,261.63,523.25,440.00,349.23,329.63,293.66,466.16,466.16,440.00,349.23,392.00,349.23];
    const CHORDS = [[261.63,329.63,392.00],[196.00,246.94,293.66],[220.00,261.63,329.63],[174.61,220.00,349.23]];

    const master = audioCtx.createGain();
    master.gain.setValueAtTime(0.35, audioCtx.currentTime);
    master.connect(dest);

    const step     = 0.35;
    const steps    = Math.floor(duration / step);

    for (let i = 0; i < steps; i++) {
      const t = audioCtx.currentTime + i * step;

      if (i % 4 === 0) {
        CHORDS[Math.floor((i / 4) % CHORDS.length)].forEach(freq => {
          const osc = audioCtx.createOscillator();
          const g   = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          g.gain.setValueAtTime(0.06, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
          osc.connect(g); g.connect(master);
          osc.start(t); osc.stop(t + 1.4);
        });
      }

      const mel  = audioCtx.createOscillator();
      const melG = audioCtx.createGain();
      mel.type = 'sine';
      mel.frequency.setValueAtTime(NOTES[i % NOTES.length], t);
      melG.gain.setValueAtTime(0.16, t);
      melG.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      mel.connect(melG); melG.connect(master);
      mel.start(t); mel.stop(t + 0.55);
    }
  }
}

export const cardExportEngine = new CardExportEngine();
