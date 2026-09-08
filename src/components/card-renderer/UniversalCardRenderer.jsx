import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ParticleOverlay } from './ParticleOverlay';
import { InteractiveWishes } from './InteractiveWishes';
import {
  LuxuryBorderedLayout,
  BotanicalFrameLayout,
  NeonCyberLayout,
  CuteBubbleLayout,
  PolaroidJournalLayout,
  RomanticVelvetLayout,
  EditorialChicLayout,
  FloralMeadowLayout,
  KineticPartyLayout,
  WarmFamilyLayout,
  GlassmorphicAuraLayout,
  ComicHeroPopLayout,
  SplitGalleryLayout,
  CorporatePrestigeLayout,
  CinemaPosterLayout
} from './TemplateDesigns';
import { PhotoFrame } from './PhotoFrame';
import { cn } from '../../utils/cn';
import { getFontFamily, loadFont, isUrduFont, containsUrduText } from '../../data/fontsData';
import { getLanguage, detectScriptAndDirection } from '../../data/languagesData';

export const UniversalCardRenderer = ({
  cardData = {},
  template = {},
  showInteractiveWish = true,
  isInteractive = true,
  className
}) => {
  const layout = template?.layoutStyle || 'luxury-bordered';
  const selectedFont = cardData.font || template?.fontFamily || 'Playfair Display';

  // Ensure font is loaded
  useEffect(() => {
    if (selectedFont) {
      loadFont(selectedFont);
    }
  }, [selectedFont]);

  const cssFontFamily = getFontFamily(selectedFont);
  const currentLang = getLanguage(cardData.language || 'en');

  // Detect script and text direction
  const textContent = `${cardData.message || ''} ${cardData.title || ''} ${cardData.recipientName || ''} ${cardData.subtitle || ''}`;
  const scriptDetection = detectScriptAndDirection(textContent, cardData.language);
  const isRtl = (cardData.direction === 'rtl') || (currentLang.direction === 'rtl') || scriptDetection.isRtl || isUrduFont(selectedFont);

  // Build inline font-family style with CSS variable --card-font
  const containerStyle = {
    fontFamily: cssFontFamily,
    '--card-font': cssFontFamily,
  };

  const renderLayoutContent = () => {
    switch (layout) {
      case 'luxury-bordered':
      case 'art-deco':
      case 'cosmic-celestial':
      case 'crown-prestige':
      case 'gold-filigree':
        return <LuxuryBorderedLayout data={cardData} />;

      case 'botanical-frame':
      case 'botanical-minimal':
      case 'vintage-script':
      case 'ivory-monarch':
        return <BotanicalFrameLayout data={cardData} />;

      case 'neon-cyber':
      case 'retro-synth':
      case 'glow-matrix':
      case 'streetwear-hype':
        return <NeonCyberLayout data={cardData} />;

      case 'cute-bubble':
      case 'kids-adventure':
      case 'sweet-candy':
      case 'kawaii-cloud':
        return <CuteBubbleLayout data={cardData} />;

      case 'polaroid-journal':
      case 'bestie-duo':
      case 'film-strip':
      case 'scrapbook-art':
        return <PolaroidJournalLayout data={cardData} />;

      case 'romantic-velvet':
      case 'crimson-passion':
      case 'candlelight':
      case 'rose-garden':
        return <RomanticVelvetLayout data={cardData} />;

      case 'editorial-chic':
      case 'monochrome-bold':
      case 'minimalist-magazine':
      case 'high-fashion':
        return <EditorialChicLayout data={cardData} />;

      case 'floral-meadow':
      case 'wildflower-delight':
      case 'sakura-blossom':
        return <FloralMeadowLayout data={cardData} />;

      case 'kinetic-party':
      case 'disco-rave':
      case 'fireworks-spectacle':
      case 'confetti-carnival':
        return <KineticPartyLayout data={cardData} />;

      case 'warm-family':
      case 'hearth-memories':
      case 'storybook-gentle':
      case 'heritage-roots':
        return <WarmFamilyLayout data={cardData} />;

      case 'glassmorphic-aura':
      case 'frosted-glass':
      case 'holographic-glow':
        return <GlassmorphicAuraLayout data={cardData} />;

      case 'comic-hero':
      case 'pop-art':
      case 'superhero-boom':
        return <ComicHeroPopLayout data={cardData} />;

      case 'split-gallery':
      case 'portrait-showcase':
      case 'magazine-split':
        return <SplitGalleryLayout data={cardData} />;

      case 'corporate-prestige':
      case 'executive-honor':
      case 'leadership-milestone':
        return <CorporatePrestigeLayout data={cardData} />;

      case 'cinema-poster':
      case 'hollywood-blockbuster':
      case 'marquee-broadway':
        return <CinemaPosterLayout data={cardData} />;

      default:
        return <LuxuryBorderedLayout data={cardData} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative w-full max-w-2xl mx-auto rounded-3xl transition-all duration-300",
        isRtl && "urdu-text",
        className
      )}
      style={containerStyle}
      dir={isRtl ? 'rtl' : undefined}
      data-card-export="true"
    >
      {/* Particle Effect Layer */}
      <ParticleOverlay effect={cardData.effect || template?.defaultEffect || 'sparkles'} />

      {/* Main Template Layout */}
      {renderLayoutContent()}

      {/* Interactive Make A Wish Candle */}
      {showInteractiveWish && (
        <InteractiveWishes recipientName={cardData.recipientName} />
      )}
    </motion.div>
  );
};

