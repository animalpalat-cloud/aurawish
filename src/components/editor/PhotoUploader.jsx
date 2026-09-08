import React, { useState, useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useToast } from '../common/Toast';

export const PhotoUploader = ({ cardData, updateField }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { addToast } = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');

    // Immediate local preview URL while uploading
    let localPreviewUrl = null;
    try {
      storageService.validateImageFile(file);
      localPreviewUrl = storageService.createLocalPreviewUrl(file);
      // Immediately display local preview
      updateField('photoUrl', localPreviewUrl);
    } catch (validationErr) {
      setErrorMessage(validationErr.message);
      addToast(validationErr.message, 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Keep track of previous uploaded photo to clean up
    const previousPhotoUrl = cardData.photoUrl;
    const previousStoragePath = cardData.storagePath;

    try {
      setIsUploading(true);
      setUploadProgress(15);

      const cardId = cardData.id || 'card_' + Date.now();
      const result = await storageService.uploadCardPhoto(
        file,
        cardId,
        (progress) => setUploadProgress(progress)
      );

      // Clean up local blob URL
      if (localPreviewUrl && localPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(localPreviewUrl);
      }

      // Update card data with the live Supabase Storage URL & storage path
      updateField('photoUrl', result.downloadUrl);
      if (typeof updateField === 'function') {
        updateField('storagePath', result.storagePath);
      }

      addToast('Photo uploaded successfully to Supabase Storage!', 'success');

      // Clean up previous image in Supabase Storage if it was uploaded there
      if (previousStoragePath || (previousPhotoUrl && previousPhotoUrl.includes('supabase.co/storage'))) {
        storageService.deleteCardPhoto(previousStoragePath || previousPhotoUrl);
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errMsg = err.message || 'Image upload is temporarily unavailable. Please try again.';
      setErrorMessage(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    const currentUrl = cardData.photoUrl;
    const currentPath = cardData.storagePath;

    updateField('photoUrl', '');
    if (cardData.storagePath) {
      updateField('storagePath', '');
    }
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Asynchronously delete from Supabase Storage if it was a stored file
    if (currentPath || (currentUrl && currentUrl.includes('supabase.co/storage'))) {
      storageService.deleteCardPhoto(currentPath || currentUrl);
    }

    addToast('Photo removed', 'info');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Recipient / Memory Photo
        </label>
        {cardData.photoUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="text-xs text-rose-400 hover:text-rose-300 disabled:opacity-50 inline-flex items-center gap-1 font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove Photo
          </button>
        )}
      </div>

      {/* Error Alert Display */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold block mb-0.5">Upload notice</span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isUploading
            ? 'border-brand-500/60 bg-brand-500/5 cursor-wait'
            : 'border-slate-700 hover:border-brand-500 bg-slate-900/50 hover:bg-brand-500/5 group'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={isUploading}
          onChange={handleFileChange}
        />

        {isUploading ? (
          <div className="flex flex-col items-center py-3">
            <div className="relative mb-3">
              <span className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin inline-block" />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-brand-400">
                {uploadProgress}%
              </span>
            </div>
            <p className="text-sm font-semibold text-white">Uploading to Supabase Storage...</p>
            <div className="w-48 bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className="bg-brand-500 h-full transition-all duration-200 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : cardData.photoUrl ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-brand-500 shadow-md shrink-0 bg-slate-800">
              <img
                src={cardData.photoUrl}
                alt="Selected preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-white">Custom photo loaded</p>
              <p className="text-xs text-slate-400 mt-0.5">Click to replace with another photo</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-400 group-hover:scale-110 transition-all mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">Click to upload photo</p>
            <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP (up to 10MB)</p>
          </div>
        )}
      </div>

      {/* Preset Samples */}
      <div>
        <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Or pick a sample portrait:
        </p>
        <div className="grid grid-cols-5 gap-2">
          {storageService.PRESET_PHOTOS.map((preset, idx) => {
            const isSelected = cardData.photoUrl === preset.url;
            return (
              <button
                key={idx}
                type="button"
                disabled={isUploading}
                onClick={() => {
                  setErrorMessage('');
                  updateField('photoUrl', preset.url);
                  if (cardData.storagePath) updateField('storagePath', '');
                  addToast('Sample portrait selected', 'info');
                }}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-brand-500 ring-2 ring-brand-500/40 scale-105'
                    : 'border-slate-700 hover:border-slate-500 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-brand-500/30 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white drop-shadow" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
