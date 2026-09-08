import { useState, useCallback } from 'react';
import { templateService } from '../services/templateService';

export const useCardEditor = (initialTemplateId, initialCardData = null) => {
  const template = templateService.getTemplateById(initialTemplateId);

  const [cardData, setCardData] = useState(() => {
    if (initialCardData) {
      return { ...initialCardData };
    }
    let prefilledMessage = template.defaultData.message || '';
    try {
      const stored = sessionStorage.getItem('aurawish_prefill_message');
      if (stored) {
        prefilledMessage = stored;
        sessionStorage.removeItem('aurawish_prefill_message');
      }
    } catch (e) {}

    return {
      templateId: template.templateId,
      recipientName: template.defaultData.recipientName || '',
      age: template.defaultData.age || '',
      title: template.defaultData.title || 'Happy Birthday',
      subtitle: template.defaultData.subtitle || '',
      message: prefilledMessage,
      senderName: template.defaultData.senderName || '',
      photoUrl: template.defaultData.photoUrl || '',
      effect: template.defaultEffect || 'sparkles',
      font: template.fontFamily || 'Playfair Display',
      language: template.language || 'en',
      direction: template.direction || 'ltr',
      themeColor: template.accentColor || '#E5C07B',
      musicTrack: template.defaultMusic || 'lofi-birthday',
      isDraft: false,
    };

  });

  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback((field, value) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  }, []);

  const resetToTemplateDefaults = useCallback(() => {
    setCardData({
      templateId: template.templateId,
      recipientName: template.defaultData.recipientName || '',
      age: template.defaultData.age || '',
      title: template.defaultData.title || 'Happy Birthday',
      subtitle: template.defaultData.subtitle || '',
      message: template.defaultData.message || '',
      senderName: template.defaultData.senderName || '',
      photoUrl: template.defaultData.photoUrl || '',
      effect: template.defaultEffect || 'sparkles',
      font: template.fontFamily || 'Playfair Display',
      language: template.language || 'en',
      direction: template.direction || 'ltr',
      themeColor: template.accentColor || '#E5C07B',
      musicTrack: template.defaultMusic || 'lofi-birthday',
      isDraft: false,
    });
    setIsDirty(false);
  }, [template]);

  return {
    cardData,
    setCardData,
    template,
    updateField,
    resetToTemplateDefaults,
    isDirty,
  };
};
