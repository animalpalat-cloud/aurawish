/**
 * Birthday Wishes — Printable Card PDF Generation & Direct Print Service
 *
 * Generates high-resolution, print-ready PDF files (300 DPI equivalent)
 * with precise paper dimensions (US Letter & A4), correct panel orientations,
 * fold/cut guides, and direct browser printing capabilities.
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { loadFont, getFontFamily } from '../data/fontsData';

// Standard paper dimensions in inches and mm
export const PAPER_SIZES = {
  letter: {
    id: 'letter',
    name: 'US Letter',
    unit: 'in',
    widthInches: 8.5,
    heightInches: 11.0,
    widthMm: 215.9,
    heightMm: 279.4,
    description: 'Standard in USA & Canada (8.5 × 11 in)',
  },
  a4: {
    id: 'a4',
    name: 'A4 Paper',
    unit: 'mm',
    widthInches: 8.2677,
    heightInches: 11.6929,
    widthMm: 210.0,
    heightMm: 297.0,
    description: 'Standard International (210 × 297 mm)',
  },
};

export const PRINT_LAYOUTS = {
  'half-fold-side': {
    id: 'half-fold-side',
    name: 'Foldable Side-Fold (Booklet)',
    description: 'Folds vertically like a traditional greeting card book. Front on right, back on left.',
    orientation: 'landscape',
    defaultPaper: 'letter',
    foldedSizeLabel: '5.5" × 8.5" (US Letter) / A5 (A4)',
  },
  'half-fold-top': {
    id: 'half-fold-top',
    name: 'Foldable Top-Fold (Tent Card)',
    description: 'Folds horizontally along the top edge so it stands up like a desk tent.',
    orientation: 'portrait',
    defaultPaper: 'letter',
    foldedSizeLabel: '8.5" × 5.5" (US Letter) / 210 × 148 mm (A4)',
  },
  'flat-5x7': {
    id: 'flat-5x7',
    name: 'Flat 5" × 7" Postcard (with Trim Marks)',
    description: 'Classic 5x7 inch single-sided card with precision corner cut guides. Fits standard A7 envelopes.',
    orientation: 'portrait',
    defaultPaper: 'letter',
    foldedSizeLabel: '5.0" × 7.0" trimmed',
  },
  'full-page': {
    id: 'full-page',
    name: 'Full Page Keepsake Poster',
    description: 'Large single-sided full-page celebratory display with safe 0.5" printing margins.',
    orientation: 'portrait',
    defaultPaper: 'letter',
    foldedSizeLabel: '8.5" × 11" / A4 full sheet',
  },
};

export class PrintablePdfService {
  /**
   * Sanitize filename for clean downloading across OS/browsers
   */
  static sanitizeFilename(recipientName, templateName, ext = 'pdf') {
    const recPart = (recipientName || 'Someone-Special').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 30);
    const tplPart = (templateName || 'Birthday-Card').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 30);
    const clean = `happy-birthday-${recPart}-${tplPart}-printable-card`
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
    return `${clean}.${ext}`;
  }

  /**
   * Wait for all active document web fonts to finish loading
   */
  static async waitForFonts(maxWaitMs = 3000) {
    if (typeof document === 'undefined' || !document.fonts) return;
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, maxWaitMs))
      ]);
    } catch {
      // Continue even if font loading race fails
    }
  }

  /**
   * Helper to build the high-resolution clone sanitizer for both PDF export and Direct Printing
   */
  static getCloneSanitizer(font) {
    return (clonedDoc) => {
      try {
        // 1. Force solid, opaque gold styling on .text-gold-foil
        const goldTexts = clonedDoc.querySelectorAll('.text-gold-foil, [class*="text-gold-foil"]');
        goldTexts.forEach((el) => {
          el.style.webkitTextFillColor = '#F59E0B';
          el.style.color = '#F59E0B';
          el.style.background = 'none';
          el.style.webkitBackgroundClip = 'initial';
          el.style.position = 'relative';
          el.style.zIndex = '20';
          el.style.textShadow = '0 1px 3px rgba(0,0,0,0.5)';
        });

        // 2. Suppress any other gradient-text transparent fills
        const gradientTexts = clonedDoc.querySelectorAll('.text-gradient-primary, .text-gradient-cyan, .text-gradient-rose');
        gradientTexts.forEach((el) => {
          el.style.webkitBackgroundClip = 'initial';
          el.style.background = 'none';
          el.style.position = 'relative';
          el.style.zIndex = '20';
          if (el.classList.contains('text-gradient-primary')) {
            el.style.webkitTextFillColor = '#F0ABFC';
            el.style.color = '#F0ABFC';
          } else if (el.classList.contains('text-gradient-cyan')) {
            el.style.webkitTextFillColor = '#22D3EE';
            el.style.color = '#22D3EE';
          } else if (el.classList.contains('text-gradient-rose')) {
            el.style.webkitTextFillColor = '#FB7185';
            el.style.color = '#FB7185';
          }
        });

        // 3. Ensure all text and headings have top-tier stacking z-index
        const textElements = clonedDoc.querySelectorAll('h1, h2, h3, p, span, .card-content-safe-area');
        textElements.forEach((el) => {
          el.style.position = 'relative';
          el.style.zIndex = '20';
        });

        // 4. Ensure background layers remain strictly underneath
        const bgLayers = clonedDoc.querySelectorAll('.card-bg-layer');
        bgLayers.forEach((el) => {
          el.style.position = 'absolute';
          el.style.zIndex = '1';
          el.style.pointerEvents = 'none';
        });

        // 5. Ensure border frames sit between background and text
        const borderFrames = clonedDoc.querySelectorAll('.card-border-frame');
        borderFrames.forEach((el) => {
          el.style.position = 'absolute';
          el.style.zIndex = '10';
          el.style.pointerEvents = 'none';
        });

        // 6. Strip overflow:hidden / line-clamp from ALL text elements inside the card
        const printableCard = clonedDoc.querySelector('[data-printable-card]') || clonedDoc.body;
        if (printableCard) {
          const allEls = printableCard.querySelectorAll('*');
          allEls.forEach((el) => {
            if (el.tagName === 'IMG') return;
            if (el.classList.contains('rounded-xl') && el.querySelector('img')) return;
            if (el.style.overflow === 'hidden') el.style.overflow = 'visible';
            if (el.style.overflowY === 'hidden') el.style.overflowY = 'visible';
            if (el.style.overflowX === 'hidden') el.style.overflowX = 'visible';
          });

          const textEls = printableCard.querySelectorAll('p, span, h1, h2, h3, div');
          textEls.forEach((el) => {
            if (el.tagName === 'IMG') return;
            if (el.querySelector('img') && (el.classList.contains('rounded-xl') || el.classList.contains('rounded-2xl'))) return;
            el.style.overflow = 'visible';
            el.style.overflowY = 'visible';
            el.style.overflowX = 'visible';
            el.style.textOverflow = 'clip';
            el.style.whiteSpace = 'normal';
            el.style.webkitLineClamp = 'unset';
            if (el.style.display === '-webkit-box') {
              el.style.display = 'block';
            }
          });

          // 7. Fix recipient pill table centering
          const recipientPills = printableCard.querySelectorAll('.recipient-pill-container, [data-recipient-pill="true"]');
          recipientPills.forEach((pill) => {
            pill.style.display = 'inline-block';
            pill.style.lineHeight = 'normal';
            const tableRow = pill.firstElementChild;
            if (tableRow) {
              tableRow.style.display = 'table';
              tableRow.style.width = '100%';
              Array.from(tableRow.children).forEach((cell) => {
                cell.style.display = 'table-cell';
                cell.style.verticalAlign = 'middle';
                cell.style.position = 'relative';
                cell.style.overflow = 'visible';
              });
            }
          });

          // 8. Ensure selected font stack is applied
          if (font) {
            const fullFontStack = getFontFamily(font);
            printableCard.style.fontFamily = fullFontStack;
            printableCard.style.setProperty('--card-font', fullFontStack);
            const cardTexts = printableCard.querySelectorAll('h1, h2, h3, h4, p, span, .card-text');
            cardTexts.forEach((el) => {
              el.style.fontFamily = fullFontStack;
            });
          }
        }
      } catch (e) {
        console.warn('onclone sanitizer non-critical warning:', e);
      }
    };
  }

  /**
   * Generate and download a high-resolution PDF from printable sheet DOM elements
   *
   * @param {Object} options
   * @param {HTMLElement} options.page1Element - Required DOM element for Page 1 (Front/Back)
   * @param {HTMLElement} options.page2Element - Optional DOM element for Page 2 (Inside Message)
   * @param {'letter'|'a4'} options.paperSize - 'letter' or 'a4'
   * @param {'portrait'|'landscape'} options.orientation - 'portrait' or 'landscape'
   * @param {string} options.recipientName - For filename
   * @param {string} options.templateName - For filename
   * @param {function} options.onProgress - Callback with { percent, status }
   * @returns {Promise<string>} Downloaded filename
   */
  static async generateAndDownloadPdf({
    page1Element,
    page2Element = null,
    paperSize = 'letter',
    orientation = 'landscape',
    recipientName = '',
    templateName = '',
    font = '',
    onProgress = () => {},
  }) {
    if (!page1Element) {
      throw new Error('Printable card element is required for PDF generation.');
    }

    try {
      onProgress({ percent: 10, status: 'Preparing high-resolution card layout…' });
      
      // Ensure specific font is loaded before capturing
      if (font) {
        await loadFont(font);
      }
      await this.waitForFonts(2500);

      const paperConfig = PAPER_SIZES[paperSize] || PAPER_SIZES.letter;
      const isLandscape = orientation === 'landscape';

      // Width and Height in inches for jsPDF
      const pageWidthIn = isLandscape ? paperConfig.heightInches : paperConfig.widthInches;
      const pageHeightIn = isLandscape ? paperConfig.widthInches : paperConfig.heightInches;

      onProgress({ percent: 25, status: 'Rendering print-quality graphics (300 DPI)…' });

      // Capture Page 1 at 2.4x scale for photographic crispness while keeping PDF file size fast and lightweight
      const canvas1 = await html2canvas(page1Element, {
        scale: 2.4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 10000,
        onclone: this.getCloneSanitizer(font),
      });

      onProgress({ percent: 60, status: 'Compiling print-ready PDF document…' });

      // Initialize jsPDF with exact dimensions in inches
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'in',
        format: [pageWidthIn, pageHeightIn],
        compress: true,
      });

      // Add Page 1
      const imgData1 = canvas1.toDataURL('image/jpeg', 0.94);
      pdf.addImage(imgData1, 'JPEG', 0, 0, pageWidthIn, pageHeightIn, undefined, 'FAST');

      // Add Page 2 if present (e.g. inside message for foldable card)
      if (page2Element) {
        onProgress({ percent: 75, status: 'Rendering inside card message…' });
        const canvas2 = await html2canvas(page2Element, {
          scale: 2.4,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          imageTimeout: 10000,
          onclone: this.getCloneSanitizer(font),
        });

        pdf.addPage([pageWidthIn, pageHeightIn], isLandscape ? 'landscape' : 'portrait');
        const imgData2 = canvas2.toDataURL('image/jpeg', 0.94);
        pdf.addImage(imgData2, 'JPEG', 0, 0, pageWidthIn, pageHeightIn, undefined, 'FAST');
      }

      onProgress({ percent: 90, status: 'Finalizing PDF download…' });

      const filename = this.sanitizeFilename(recipientName, templateName, 'pdf');
      pdf.save(filename);

      onProgress({ percent: 100, status: 'Ready!' });
      return filename;
    } catch (err) {
      console.error('Printable PDF generation failed:', err);
      throw new Error(err.message || 'Failed to generate printable PDF. Please try again or use direct printing.');
    }
  }

  /**
   * Direct Browser Printing
   * Uses high-resolution canvas capture rendered into an isolated print document.
   * This guarantees 100% fidelity with the live preview and downloaded PDF,
   * avoiding browser stylesheet stripping, font-rendering mismatches, and blank pages.
   */
  static async triggerDirectPrint({
    page1Element,
    page2Element = null,
    paperSize = 'letter',
    orientation = 'landscape',
    font = '',
  }) {
    if (typeof window === 'undefined') return;

    if (!page1Element) {
      console.warn('triggerDirectPrint: page1Element is missing');
      return;
    }

    try {
      // 1. Ensure font is fully loaded
      if (font) {
        await loadFont(font);
      }
      await this.waitForFonts(2000);

      const paperConfig = PAPER_SIZES[paperSize] || PAPER_SIZES.letter;
      const isLandscape = orientation === 'landscape';
      const isA4 = paperSize === 'a4';
      const pageOrientation = isLandscape ? 'landscape' : 'portrait';
      const pageSizeRule = `${isA4 ? 'A4' : 'letter'} ${pageOrientation}`;

      // 2. Render Page 1 to high-resolution photographic canvas (matching PDF quality)
      const canvas1 = await html2canvas(page1Element, {
        scale: 2.4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 10000,
        onclone: this.getCloneSanitizer(font),
      });

      const imgUrl1 = canvas1.toDataURL('image/jpeg', 0.96);

      // 3. Render Page 2 if present
      let imgUrl2 = null;
      if (page2Element) {
        const canvas2 = await html2canvas(page2Element, {
          scale: 2.4,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          imageTimeout: 10000,
          onclone: this.getCloneSanitizer(font),
        });
        imgUrl2 = canvas2.toDataURL('image/jpeg', 0.96);
      }

      // 4. Remove any pre-existing print iframe
      const oldIframe = document.getElementById('printable-card-direct-print-iframe');
      if (oldIframe) {
        oldIframe.remove();
      }

      // 5. Create isolated print iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'printable-card-direct-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!iframeDoc) {
        throw new Error('Could not access print frame document');
      }

      // 6. Build standalone HTML with exact @page rules and crisp image pages
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Print Birthday Card</title>
            <style>
              @page {
                size: ${pageSizeRule};
                margin: 0;
              }
              *, *::before, *::after {
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                width: 100% !important;
                height: 100% !important;
                overflow: hidden !important;
              }
              .print-sheet-page {
                width: 100vw;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                padding: 0;
                page-break-inside: avoid;
                break-inside: avoid;
              }
              .print-sheet-page:not(:last-child) {
                page-break-after: always;
                break-after: page;
              }
              .print-sheet-page img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
              }
            </style>
          </head>
          <body>
            <div class="print-sheet-page">
              <img src="${imgUrl1}" alt="Printable Birthday Card Page 1" />
            </div>
            ${imgUrl2 ? `
              <div class="print-sheet-page">
                <img src="${imgUrl2}" alt="Printable Birthday Card Page 2" />
              </div>
            ` : ''}
          </body>
        </html>
      `);
      iframeDoc.close();

      // 7. Trigger native browser print once images in the iframe are fully decoded
      const triggerNativePrint = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (e) {
            console.error('Error invoking print dialog on iframe:', e);
          }
        }, 250);
      };

      const images = iframeDoc.querySelectorAll('img');
      let loadedCount = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        triggerNativePrint();
      } else {
        images.forEach((img) => {
          if (img.complete) {
            loadedCount++;
            if (loadedCount >= totalImages) triggerNativePrint();
          } else {
            img.onload = () => {
              loadedCount++;
              if (loadedCount >= totalImages) triggerNativePrint();
            };
            img.onerror = () => {
              loadedCount++;
              if (loadedCount >= totalImages) triggerNativePrint();
            };
          }
        });
      }
    } catch (err) {
      console.error('Direct print failed, falling back to window.print():', err);
      window.print();
    }
  }
}
