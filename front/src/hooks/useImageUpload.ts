/* eslint-env browser */
import React, { useState, useRef, useCallback } from 'react';

const MAX_IMAGES = 10;

interface UseImageUploadOptions {
  existingImageCount?: number;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const { existingImageCount = 0 } = options;
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newFiles = Array.from(files);
      const totalImages =
        existingImageCount + selectedImages.length + newFiles.length;

      if (totalImages > MAX_IMAGES) {
        alert(`画像は最大${MAX_IMAGES}枚まで選択できます。`);
        return;
      }

      const newPreviews: string[] = [];
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === newFiles.length) {
            setImagePreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });

      setSelectedImages((prev) => [...prev, ...newFiles]);
    },
    [existingImageCount, selectedImages.length],
  );

  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetImages = useCallback(() => {
    setSelectedImages([]);
    setImagePreviews([]);
  }, []);

  return {
    selectedImages,
    imagePreviews,
    fileInputRef,
    handleImageSelect,
    handleRemoveImage,
    resetImages,
    MAX_IMAGES,
  };
};

