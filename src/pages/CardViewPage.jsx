import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import { cardService } from '../services/cardService';
import { templateService } from '../services/templateService';
import { EnvelopeUnbox } from '../components/public/EnvelopeUnbox';
import { CardRecipientView } from '../components/public/CardRecipientView';
import { Button } from '../components/common/Button';
import { loadFont } from '../data/fontsData';

export const CardViewPage = () => {
  const { shareId } = useParams();
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [card, setCard] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCardData = async () => {
      try {
        // Look up card by share ID or ID from Supabase / cache
        let foundCard = await cardService.getCardByShareId(shareId);

        // Fallback gracefully if direct link or template preview
        if (!foundCard) {
          const allTemplates = templateService.getAllTemplates();
          const matchingTemplate = allTemplates.find(t => t.templateId === shareId);
          if (matchingTemplate) {
            foundCard = {
              ...matchingTemplate.defaultData,
              id: `card_${matchingTemplate.templateId}`,
              shareId: matchingTemplate.templateId,
              templateId: matchingTemplate.templateId,
              isDraft: false,
              views: 1,
            };
          } else {
            // Fallback default demo card
            const defaultTpl = allTemplates[0];
            foundCard = {
              ...defaultTpl.defaultData,
              id: 'card_demo_default',
              shareId: shareId,
              templateId: defaultTpl.templateId,
              isDraft: false,
              views: 1,
            };
          }
        }

        if (isMounted) {
          setCard(foundCard);
          const resolvedTpl = templateService.getTemplateById(foundCard.templateId);
          setTemplate(resolvedTpl);
          
          // Ensure the specific card font is loaded for recipient view
          const fontToLoad = foundCard.font || resolvedTpl?.fontFamily || 'Playfair Display';
          if (fontToLoad) {
            loadFont(fontToLoad);
          }

          // Dynamic document title for recipient
          if (foundCard.recipientName) {
            document.title = `Happy Birthday ${foundCard.recipientName}! 🎂 | AuraWish`;
          }

          setLoading(false);
        }
      } catch (e) {
        console.warn('Error loading card view:', e);
        if (isMounted) setLoading(false);
      }
    };

    loadCardData();

    return () => {
      isMounted = false;
    };
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090b10] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-display tracking-widest text-amber-300 uppercase">
          Preparing Birthday Surprise...
        </p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-[#090b10] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Greeting Card Not Found</h1>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          This card link may have expired or was removed by its creator.
        </p>
        <Link to="/templates">
          <Button variant="primary" size="md" icon={Sparkles}>
            Explore Birthday Templates
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 relative">
      <AnimatePresence mode="wait">
        {!isEnvelopeOpened ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <EnvelopeUnbox
              cardData={card}
              onOpen={() => setIsEnvelopeOpened(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="card-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Replay unboxing button */}
            <div className="absolute top-4 right-4 z-40">
              <button
                onClick={() => setIsEnvelopeOpened(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-slate-400 hover:text-white text-xs backdrop-blur-md transition-all"
                title="Replay Envelope Opening Animation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Replay Envelope</span>
              </button>
            </div>

            <CardRecipientView cardData={card} template={template} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardViewPage;
