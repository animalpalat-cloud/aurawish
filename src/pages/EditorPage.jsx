import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Share2, Bookmark, Eye } from 'lucide-react';
import { templateService } from '../services/templateService';
import { cardService } from '../services/cardService';
import { soundService } from '../services/soundService';
import { useCardEditor } from '../hooks/useCardEditor';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { LivePreviewPane } from '../components/editor/LivePreviewPane';
import { SuccessScreen } from '../components/sharing/SuccessScreen';
import { ShareModal } from '../components/sharing/ShareModal';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';

export const EditorPage = () => {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const editCardId = searchParams.get('edit');
  const existingCard = editCardId ? cardService.getCardById(editCardId) : null;

  // Resolve valid template
  const resolvedTemplate = templateService.getTemplateById(
    templateId || existingCard?.templateId || 'velvet-luxury'
  );

  const {
    cardData,
    setCardData,
    template,
    updateField,
    resetToTemplateDefaults,
    isDirty,
  } = useCardEditor(resolvedTemplate.templateId, existingCard);

  const [isSaving, setIsSaving] = useState(false);
  const [createdCard, setCreatedCard] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Stop all editor audio when the user leaves the editor (navigate away, back button, etc.)
  useEffect(() => {
    return () => {
      soundService.stopMusic();
    };
  }, []);

  // Handle generating the card & saving
  const handleGenerateCard = async () => {
    if (!cardData.recipientName?.trim()) {
      addToast('Please enter the recipient’s name before sharing!', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...cardData,
        templateId: template.templateId,
        isDraft: false,
      };

      const saved = await cardService.saveCard(payload);
      // Stop all editor audio immediately upon successful card generation
      soundService.stopMusic();
      setCreatedCard(saved);
      addToast('Card generated successfully!', 'success');
    } catch (e) {
      console.error('Failed to save card:', e);
      addToast('Failed to save card. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle saving as draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...cardData,
        templateId: template.templateId,
        isDraft: true,
      };
      await cardService.saveCard(payload);
      addToast('Card saved as draft in your dashboard!', 'success');
    } catch (e) {
      console.error('Failed to save draft:', e);
      addToast('Failed to save draft.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // If card generation is complete, show the success screen
  if (createdCard) {
    return (
      <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <SuccessScreen
          card={createdCard}
          onShareAgain={() => setIsShareModalOpen(true)}
        />
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareId={createdCard.shareId}
          recipientName={createdCard.recipientName}
        />
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/templates"
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                AuraWish Studio: {template.name}
              </h1>
              {existingCard && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Editing
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Personalize birthday wishes, celebrator photos, typography, celebration music & animated effects.
            </p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Bookmark}
            onClick={handleSaveDraft}
            disabled={isSaving}
          >
            Save Draft
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={handleGenerateCard}
            loading={isSaving}
            className="shadow-lg shadow-brand-500/20"
          >
            Generate Card
          </Button>
        </div>
      </div>

      {/* Main Studio Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Controls Sidebar */}
        <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1 h-[720px] max-h-[85vh]">
          <EditorSidebar
            cardData={cardData}
            updateField={updateField}
            template={template}
            resetToTemplateDefaults={resetToTemplateDefaults}
          />
        </div>

        {/* Right Column: Real-Time Live Preview Pane */}
        <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 h-[720px] max-h-[85vh]">
          <LivePreviewPane
            cardData={cardData}
            template={template}
            onGenerateCard={handleGenerateCard}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
