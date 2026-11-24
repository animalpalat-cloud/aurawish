import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Printer,
  FileDown,
  Layers,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Scissors,
  BookOpen,
  Calendar,
  Heart,
  Palette,
  Sliders,
  Maximize2
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { TEMPLATES } from '../data/templatesData';
import { templateService } from '../services/templateService';
import { PrintableCardSheet } from '../components/printable/PrintableCardSheet';
import { RealisticFoldedCardPreview } from '../components/printable/RealisticFoldedCardPreview';
import { PrintableCardCustomizer } from '../components/printable/PrintableCardCustomizer';
import { PrintableCardGallery } from '../components/printable/PrintableCardGallery';
import { PrintablePdfService } from '../services/printablePdfService';
import { useToast } from '../components/common/Toast';
import { cn } from '../utils/cn';

const FAQ_ITEMS = [
  {
    q: 'Are these printable birthday cards completely free to customize and download?',
    a: 'Yes, 100% free! Every printable birthday card on BirthdayWishly can be personalized with your recipient’s name, age, customized wishes, and personal photos. You can immediately download the high-resolution 300 DPI PDF or print it directly from your browser with zero paywalls, subscriptions, or watermarked fees.'
  },
  {
    q: 'What paper size should I choose: US Letter or A4?',
    a: 'Choose US Letter (8.5 × 11 inches) if you live in the United States, Canada, or Mexico. Choose A4 (210 × 297 mm) if you live in the United Kingdom, Europe, Australia, New Zealand, or Asia. Our printable PDF generator automatically calculates the exact margin, fold lines, and proportions for your selected paper standard.'
  },
  {
    q: 'How do foldable free printable birthday cards work?',
    a: 'Our side-fold booklet cards are printed on a single landscape sheet of paper. The front cover prints on the right half, and the back cover prints on the left half. Simply fold the sheet in half along the vertical center dashed guide line. When folded, you get a classic greeting card that opens like a book, with plenty of room inside for your handwritten message or our optional printed inside letter spread.'
  },
  {
    q: 'What type of paper is best for printing birthday cards at home?',
    a: 'For best results, use medium-to-heavy cardstock paper (65 lb to 110 lb cardstock, or 180 gsm to 250 gsm). Matte cardstock delivers a smooth, luxurious texture that prevents fingerprint smudges, while glossy photo cardstock makes vivid colors and photos pop. Standard 20 lb copy paper can also be used for quick last-minute cards.'
  },
  {
    q: 'What printer settings ensure the highest quality card print?',
    a: 'In your printer dialog, select "High Quality" or "Photo Quality" printing. Crucially, set the Page Scaling to "100%" or "Actual Size" (do not select "Fit to Page" or "Shrink to Fit"), so your folding lines and 5x7" cut margins remain dimensionally precise.'
  },
  {
    q: 'Can I add a real photograph to my printable birthday card?',
    a: 'Yes! Our customizer allows you to upload any portrait, selfie, or family photograph from your phone, tablet, or computer. The photo is rendered cleanly inside the card layout and embedded directly into your printable PDF.'
  },
  {
    q: 'What envelope size fits a 5" × 7" flat birthday card?',
    a: 'Our flat 5" × 7" cards are designed to slide perfectly into standard A7 invitation envelopes (5.25" × 7.25"). For half-fold cards made from US Letter paper (5.5" × 8.5" folded), use a standard A9 envelope (5.75" × 8.75").'
  },
  {
    q: 'Can I print birthday cards directly without downloading a PDF?',
    a: 'Yes! Along with the "Download Free PDF" option, we provide a "Print Directly" button. It instantly formats the card layout, hides website menus and navigation, and brings up your browser’s native print dialog for immediate printing.'
  }
];

export const PrintableBirthdayCardsPage = () => {
  const { addToast } = useToast();

  // Selected template state (defaults to velvet obsidian gold or first popular template)
  const [selectedTemplateId, setSelectedTemplateId] = useState(() => {
    return TEMPLATES[0]?.templateId || 'velvet-obsidian-gold';
  });

  const template = templateService.getTemplateByIdSync(selectedTemplateId) || TEMPLATES[0];

  // Card customization state
  const [cardData, setCardData] = useState(() => ({
    recipientName: template.defaultData?.recipientName || 'Someone Special',
    age: template.defaultData?.age || '',
    title: template.defaultData?.title || 'Happy Birthday',
    subtitle: template.defaultData?.subtitle || 'Special Celebration Edition',
    message: template.defaultData?.message || 'Wishing you a magnificent birthday filled with joy, laughter, and unforgettable moments.',
    insideMessage: 'Wishing you a magnificent birthday filled with joy, laughter, and unforgettable moments.\nMay this upcoming year bring you endless happiness, good health, and wonderful achievements.',
    senderName: template.defaultData?.senderName || 'With love, David',
    photoUrl: template.defaultData?.photoUrl || '',
    font: template.fontFamily || 'Playfair Display',
    themeColor: template.accentColor || '#E5C07B',
  }));

  // Update card data field
  const updateField = useCallback((field, value) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // When user selects a different template from the gallery
  const handleSelectTemplate = useCallback((newTemplateId) => {
    setSelectedTemplateId(newTemplateId);
    const newTpl = templateService.getTemplateByIdSync(newTemplateId);
    if (newTpl) {
      setCardData((prev) => ({
        ...prev,
        title: newTpl.defaultData?.title || prev.title,
        subtitle: newTpl.defaultData?.subtitle || prev.subtitle,
        font: newTpl.fontFamily || prev.font,
        themeColor: newTpl.accentColor || prev.themeColor,
      }));
      addToast(`Selected template: ${newTpl.name}`, 'info');
      // Scroll smoothly to the customization studio
      document.getElementById('printable-studio')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [addToast]);

  // Reset to current template defaults
  const handleResetDefaults = useCallback(() => {
    setCardData({
      recipientName: template.defaultData?.recipientName || 'Someone Special',
      age: template.defaultData?.age || '',
      title: template.defaultData?.title || 'Happy Birthday',
      subtitle: template.defaultData?.subtitle || 'Special Celebration Edition',
      message: template.defaultData?.message || 'Wishing you a magnificent birthday filled with joy, laughter, and unforgettable moments.',
      insideMessage: 'Wishing you a magnificent birthday filled with joy, laughter, and unforgettable moments.\nMay this upcoming year bring you endless happiness, good health, and wonderful achievements.',
      senderName: template.defaultData?.senderName || 'With love, David',
      photoUrl: template.defaultData?.photoUrl || '',
      font: template.fontFamily || 'Playfair Display',
      themeColor: template.accentColor || '#E5C07B',
    });
    addToast('Card reset to template defaults', 'info');
  }, [template, addToast]);

  // Printable layout settings
  const [paperSize, setPaperSize] = useState('letter'); // 'letter' | 'a4'
  const [layoutFormat, setLayoutFormat] = useState('half-fold-side'); // 'half-fold-side' | 'half-fold-top' | 'flat-5x7' | 'full-page'
  const [showGuides, setShowGuides] = useState(true);
  const [includeInsidePage, setIncludeInsidePage] = useState(false);
  const [previewMode, setPreviewMode] = useState('sheet'); // 'sheet' | 'folded'
  const [sheetPreviewPage, setSheetPreviewPage] = useState(1); // 1 = Outside, 2 = Inside Spread

  // PDF Generation progress state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ percent: 0, status: '' });

  // DOM refs for capture targets
  const printSheetRef = useRef(null);
  const insideSheetRef = useRef(null);

  // Generate and download PDF
  const handleDownloadPdf = async () => {
    if (!printSheetRef.current) return;
    setIsGeneratingPdf(true);
    setDownloadProgress({ percent: 5, status: 'Initializing PDF export…' });

    try {
      const filename = await PrintablePdfService.generateAndDownloadPdf({
        page1Element: printSheetRef.current,
        page2Element: includeInsidePage ? insideSheetRef.current : null,
        paperSize,
        orientation: layoutFormat === 'half-fold-side' ? 'landscape' : 'portrait',
        recipientName: cardData.recipientName,
        templateName: template.name,
        font: cardData.font,
        onProgress: setDownloadProgress,
      });

      addToast(`Downloaded ${filename} successfully!`, 'success');
    } catch (err) {
      addToast(err.message || 'Could not generate PDF. Please try direct printing.', 'error');
    } finally {
      setIsGeneratingPdf(false);
      setDownloadProgress({ percent: 0, status: '' });
    }
  };

  // Direct Browser Printing
  const handleDirectPrint = async () => {
    if (!printSheetRef.current) return;
    try {
      await PrintablePdfService.triggerDirectPrint({
        page1Element: printSheetRef.current,
        page2Element: includeInsidePage ? insideSheetRef.current : null,
        paperSize,
        orientation: layoutFormat === 'half-fold-side' ? 'landscape' : 'portrait',
        font: cardData.font,
      });
    } catch (err) {
      addToast(err.message || 'Could not initiate direct printing.', 'error');
    }
  };

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Structured Data (JSON-LD) for SEO
  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://birthdaywishly.com/printable-birthday-cards/#app',
        name: 'Free Printable Birthday Cards Maker',
        url: 'https://birthdaywishly.com/printable-birthday-cards/',
        description: 'Free printable birthday card creator. Personalize names, messages, ages, and photos, preview in real time, and download print-ready 300 DPI PDF files for US Letter and A4 paper.',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://birthdaywishly.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Printable Birthday Cards',
            item: 'https://birthdaywishly.com/printable-birthday-cards/',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 overflow-x-hidden">
      {/* ── SEO HEAD ──────────────────────────────────────────────────────── */}
      <SEOHead
        title="Free Printable Birthday Cards | Download & Print PDF"
        description="Explore free printable birthday cards. Customize your favorite design, download high-quality PDF cards, and print beautiful birthday greetings at home."
        canonicalUrl="/printable-birthday-cards/"
        schemaJson={schemaJson}
      />

      {/* ── PRINT-SPECIFIC CSS RULES ───────────────────────────────────────── */}
      <style>{`
        @media print {
          /* Fallback for native Ctrl+P on the main window: hide UI and show only print target */
          body {
            visibility: hidden !important;
            background: #ffffff !important;
          }
          #printable-card-print-target-wrapper,
          #printable-card-print-target-wrapper * {
            visibility: visible !important;
          }
          #printable-card-print-target-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .printable-sheet {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .printable-sheet:not(:last-child) {
            page-break-after: always !important;
            break-after: page !important;
          }
          @page {
            size: ${paperSize === 'a4' ? 'A4' : 'letter'} ${layoutFormat === 'half-fold-side' ? 'landscape' : 'portrait'};
            margin: 0;
          }
        }
      `}</style>

      {/* ── MAIN CONTENT WRAPPER ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Card Maker', href: '/birthday-card-maker/' },
            { label: 'Printable Birthday Cards', href: '/printable-birthday-cards/' },
          ]}
        />

        {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
        <div className="relative text-center max-w-4xl mx-auto mt-8 mb-14 space-y-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[240px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, #d946ef 60%, transparent 100%)' }}
          />

          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide shadow-sm">
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>100% Free PDF Downloads • Print at Home</span>
          </div>

          <h1 className="relative text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
            Free Printable Birthday Cards –{' '}
            <span className="text-gold-foil">Customize, Download &amp; Print</span>
          </h1>

          <p className="relative text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Design beautiful, personalized printable birthday cards in seconds. Select designer layouts, customize names, ages, photos, and messages, preview in real time, and download high-resolution print-ready PDFs for US Letter or A4 paper.
          </p>

          {/* Quick Value Trust Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant PDF Download
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> US Letter &amp; A4 Supported
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Foldable &amp; 5×7" Flat Formats
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free — No Sign-Up
            </span>
          </div>
        </div>

        {/* ── INTERACTIVE PRINTABLE STUDIO (HERO WORKBENCH) ────────────────── */}
        <section
          id="printable-studio"
          className="my-10 p-5 sm:p-8 rounded-3xl bg-[#0d0f17] border border-slate-800 shadow-2xl relative scroll-mt-20"
        >
          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT / TOP COLUMN: LIVE PRINT PREVIEW WORKBENCH */}
            <div className="w-full lg:w-7/12 flex flex-col items-center space-y-4">
              
              {/* Preview Mode Bar */}
              <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setPreviewMode('sheet')}
                    className={cn(
                      "px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5",
                      previewMode === 'sheet'
                        ? "bg-amber-400 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Print Sheet View</span>
                  </button>

                  <button
                    onClick={() => setPreviewMode('folded')}
                    className={cn(
                      "px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5",
                      previewMode === 'folded'
                        ? "bg-amber-400 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Folded 3D Preview</span>
                  </button>
                </div>

                {/* Page Switcher for Foldable Cards */}
                {previewMode === 'sheet' && includeInsidePage && (
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={() => setSheetPreviewPage(1)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg transition-all",
                        sheetPreviewPage === 1 ? "bg-slate-800 text-amber-300 font-bold" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Page 1 (Cover)
                    </button>
                    <button
                      onClick={() => setSheetPreviewPage(2)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg transition-all",
                        sheetPreviewPage === 2 ? "bg-slate-800 text-amber-300 font-bold" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Page 2 (Inside Spread)
                    </button>
                  </div>
                )}

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <span>{paperSize === 'a4' ? 'A4 Paper (210×297mm)' : 'US Letter (8.5×11")'}</span>
                  <span>•</span>
                  <span className="text-emerald-400">300 DPI</span>
                </div>
              </div>

              {/* Live Preview Display Canvas */}
              <div className="w-full bg-[#06070a] rounded-3xl border border-slate-800/80 overflow-hidden relative shadow-inner p-4 sm:p-6">
                {previewMode === 'sheet' ? (
                  /* Sheet preview: fluid width + aspect-ratio fills container perfectly */
                  <div className="w-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-slate-700/60">
                    <PrintableCardSheet
                      cardData={cardData}
                      template={template}
                      layoutFormat={layoutFormat}
                      paperSize={paperSize}
                      showGuides={showGuides}
                      page={sheetPreviewPage}
                      isPreview={true}
                    />
                  </div>
                ) : (
                  <RealisticFoldedCardPreview
                    cardData={cardData}
                    template={template}
                  />
                )}
              </div>

              {/* Helpful Print Tips Strip */}
              <div className="w-full flex items-center justify-between text-xs text-slate-400 px-2">
                <span className="flex items-center gap-1">
                  <Scissors className="w-3.5 h-3.5 text-amber-400" />
                  {layoutFormat === 'half-fold-side' || layoutFormat === 'half-fold-top'
                    ? 'Fold in half along the dashed center guideline.'
                    : 'Trim along outer corner crop lines.'}
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Template: <strong className="text-slate-300">{template.name}</strong>
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: CARD CUSTOMIZATION CONTROLS */}
            <div className="w-full lg:w-5/12">
              <PrintableCardCustomizer
                cardData={cardData}
                updateField={updateField}
                resetDefaults={handleResetDefaults}
                paperSize={paperSize}
                setPaperSize={setPaperSize}
                layoutFormat={layoutFormat}
                setLayoutFormat={setLayoutFormat}
                showGuides={showGuides}
                setShowGuides={setShowGuides}
                includeInsidePage={includeInsidePage}
                setIncludeInsidePage={setIncludeInsidePage}
                onDownloadPdf={handleDownloadPdf}
                onDirectPrint={handleDirectPrint}
                isGeneratingPdf={isGeneratingPdf}
                downloadProgress={downloadProgress}
              />
            </div>

          </div>
        </section>

        {/* ── HIDDEN PRINT-READY CAPTURE DOM ───────────────────────────────── */}
        {/* Rendered offscreen for pixel-perfect 300 DPI html2canvas capture and @media print */}
        <div
          id="printable-card-print-target-wrapper"
          style={{
            position: 'fixed',
            left: '-10000px',
            top: 0,
            pointerEvents: 'none',
            zIndex: -9999,
          }}
        >
          <div ref={printSheetRef} id="printable-card-print-target">
            <PrintableCardSheet
              cardData={cardData}
              template={template}
              layoutFormat={layoutFormat}
              paperSize={paperSize}
              showGuides={showGuides}
              page={1}
              isPrintTarget={true}
            />
          </div>
          {includeInsidePage && (
            <div ref={insideSheetRef} id="printable-card-print-target-page-2">
              <PrintableCardSheet
                cardData={cardData}
                template={template}
                layoutFormat={layoutFormat}
                paperSize={paperSize}
                showGuides={showGuides}
                page={2}
                isPrintTarget={true}
              />
            </div>
          )}
        </div>

        {/* ── PRINTABLE BIRTHDAY CARD GALLERY ──────────────────────────────── */}
        <section className="my-16 space-y-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Designer Catalog</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Explore Free Printable Birthday Cards
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Choose from over 30 hand-crafted card themes. Select any design below to customize its text, photo, and colors in the live print studio above.
              </p>
            </div>
            <Link
              to="/templates/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-all"
            >
              <span>View All 250+ Templates</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>

          <PrintableCardGallery
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleSelectTemplate}
          />
        </section>

        {/* ── SEO SECTION 1: STYLES FOR EVERY RECIPIENT ────────────────────── */}
        <section className="my-20 p-8 sm:p-12 rounded-3xl bg-[#0d0f17] border border-slate-800 space-y-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Printable Happy Birthday Cards for Every Style
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Finding the right card to print at home shouldn’t mean settling for plain clipart. Whether you need a sophisticated metallic card for a milestone 50th birthday, a playful cartoon illustration for kids, or a heartfelt romantic message for your partner, our printable collection provides tailored designs for every celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center font-bold">
                ✨
              </div>
              <h3 className="text-base font-bold text-white">Luxury &amp; Gold Foil Aesthetics</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Designed for adults, milestone celebrations (18th, 21st, 30th, 50th, 60th), and formal occasions. Features dark obsidian textures, golden typography, and classic borders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/25 text-pink-400 flex items-center justify-center font-bold">
                🌸
              </div>
              <h3 className="text-base font-bold text-white">Botanical Flora &amp; Elegant Serifs</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ideal for moms, sisters, grandmothers, and dear friends. Delicate wildflower accents, champagne gradients, and romantic script typography.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center font-bold">
                🎉
              </div>
              <h3 className="text-base font-bold text-white">Funny, Pop &amp; Playful Themes</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Bring laughter and energetic vibes with bright confetti, retro synth gradients, comic pop-art bursts, and humorous messages for best friends and brothers.
              </p>
            </div>
          </div>
        </section>

        {/* ── SEO SECTION 2: CUSTOMIZE & DOWNLOAD GUIDE ────────────────────── */}
        <section className="my-20 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Effortless Personalization
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Customize Your Printable Birthday Card
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every element on your card is fully personalizable. Type your recipient's name to see it instantly stylized in your chosen font. Add their age for a personalized touch, choose from curated heartfelt or humorous wish presets, adjust the signature name, and upload a treasured photograph directly from your camera roll.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Customizable names, ages, card titles, and subtitles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>15+ curated Google Fonts with instant web font rendering</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Upload personal photo memories with local client-side processing</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#11141e] border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Print-Ready Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Download Free Birthday Cards as PDF
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unlike screenshot-based printables that produce blurry, pixelated text, our PDF generator compiles crisp 300 DPI vector-accurate PDF documents. When printed on inkjet or laser printers, fine borders, sharp serif lettering, and metallic gradients reproduce with stunning fidelity.
              </p>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-400">
                <p className="text-white font-semibold flex items-center gap-1.5">
                  <FileDown className="w-4 h-4 text-amber-400" /> Meaningful PDF Filenames
                </p>
                <p>Downloaded files are named automatically (e.g., <code>happy-birthday-mom-luxury-gold-printable-card.pdf</code>) for simple organization on your desktop or phone.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEO SECTION 3: HOW TO PRINT AT HOME GUIDE ────────────────────── */}
        <section className="my-20 p-8 sm:p-12 rounded-3xl bg-[#0d0f17] border border-slate-800 space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              How to Print Birthday Cards at Home
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Follow these simple professional printing instructions to get boutique greeting card results from any standard desktop printer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-white">Choose Cardstock Paper</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use 65 lb to 100 lb cardstock (180–250 gsm). Matte cardstock gives an authentic luxury feel and prevents ink smearing when signing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-white">Select "Actual Size"</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In your printer settings, set Scale to <strong>100%</strong> or <strong>Actual Size</strong>. Avoid "Fit to Page" so fold lines and 5×7" crop marks stay exact.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-white">Set Quality to High</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select Photo Paper or High-Quality Print in printer preferences. This ensures deep rich blacks and vibrant color reproduction.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="text-base font-bold text-white">Score &amp; Fold</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                For a crisp fold, gently score along the dashed fold line using a ruler and a dull butter knife before creasing.
              </p>
            </div>
          </div>
        </section>

        {/* ── SEO SECTION 4: PAPER SIZES COMPARISON ────────────────────────── */}
        <section className="my-20 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Choose the Right Paper Size for Your Birthday Card
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              We engineer our templates for both North American and International paper standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#11141e] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">US Letter Paper (8.5 × 11 inches)</h3>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  USA &amp; Canada
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Standard office and home paper size across the United States. When folded in half side-by-side, your card measures 5.5 × 8.5 inches and fits into standard A9 envelopes. Our 5×7" flat card is centered on the sheet with corner guides.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 font-mono">
                <span>Width: 8.5 in (215.9 mm)</span>
                <span>•</span>
                <span>Height: 11.0 in (279.4 mm)</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#11141e] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">A4 Paper (210 × 297 mm)</h3>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                  UK, Europe, Australia &amp; Global
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                The global international standard paper size. When folded in half side-by-side, it forms an A5 card (148 × 210 mm) that fits standard C5 greeting envelopes. Layout proportions and font scalings adjust automatically.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 font-mono">
                <span>Width: 210 mm (8.27 in)</span>
                <span>•</span>
                <span>Height: 297 mm (11.69 in)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ACCORDION SECTION ────────────────────────────────────────── */}
        <section className="my-20 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Frequently Asked Questions About Printable Birthday Cards
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Everything you need to know about customizing, downloading, and printing cards at home.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#11141e] border border-slate-800 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-white hover:text-amber-300 font-semibold text-sm sm:text-base transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0",
                        isOpen && "rotate-180 text-amber-400"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── BOTTOM CALL TO ACTION ────────────────────────────────────────── */}
        <section className="my-16 p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#121624] via-[#0d0f17] to-[#07080d] border border-amber-400/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #f59e0b 0%, transparent 60%)',
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Ready to Print a Memorable Birthday Card?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Start customizing your favorite design right now. Instant, free, and designed for celebration joy.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                document.getElementById('printable-studio')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/25 transition-all"
            >
              Back to Studio Customizer ↑
            </button>
            <Link
              to="/birthday-card-maker/"
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all border border-slate-700"
            >
              Explore Digital Birthday Cards
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PrintableBirthdayCardsPage;
