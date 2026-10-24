import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Share2, Bookmark, Eye } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
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

  // State for async template loading
  const [template, setTemplate] = useState(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);

  // Load template asynchronously
  useEffect(() => {
    const loadTemplate = async () => {
      setIsLoadingTemplate(true);
      try {
        const loadedTemplate = await templateService.getTemplateById(
          templateId || existingCard?.templateId || 'velvet-obsidian-gold'
        );
        setTemplate(loadedTemplate);
      } catch (error) {
        console.error('Failed to load template:', error);
        addToast('Failed to load template', 'error');
        navigate('/templates/');
      } finally {
        setIsLoadingTemplate(false);
      }
    };
    loadTemplate();
  }, [templateId, existingCard, navigate, addToast]);

  const {
    cardData,
    setCardData,
    template: editorTemplate,
    updateField,
    resetToTemplateDefaults,
    isDirty,
  } = useCardEditor(template?.templateId || 'velvet-obsidian-gold', existingCard);

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
      addToast("Please enter the recipient's name before sharing!", 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...cardData,
        templateId: (template || editorTemplate).templateId,
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
        templateId: (template || editorTemplate).templateId,
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

  // Show loading state while template is being fetched
  if (isLoadingTemplate || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500 font-medium tracking-wide">Loading template...</p>
        </div>
      </div>
    );
  }

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
      <SEOHead
        title={`${template.name} Birthday Card Editor | Birthday Wishes`}
        description="Customize your birthday card with personal messages, photos, music and effects using the Birthday Wishes Studio editor."
        canonicalUrl={`/create/${template.templateId}`}
        noIndex={true}
      />
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/templates/"
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                Birthday Wishes Studio: {template.name}
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
        <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1 h-auto min-h-[480px] lg:h-[720px] lg:max-h-[85vh] flex flex-col">
          <EditorSidebar
            cardData={cardData}
            updateField={updateField}
            template={template}
            resetToTemplateDefaults={resetToTemplateDefaults}
          />
        </div>

        {/* Right Column: Real-Time Live Preview Pane */}
        <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 h-[520px] sm:h-[620px] lg:h-[720px] lg:max-h-[85vh] flex flex-col">
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
