import { useState, useCallback } from 'react';
import { createReview } from '../../../../services/api/reviews';

interface ReviewFormData {
  rating: number;
  title: string;
  body: string;
}

const initialFormData: ReviewFormData = {
  rating: 0,
  title: '',
  body: '',
};

export const useReviewForm = (itemId: number, onSuccess: () => void) => {
  const [formData, setFormData] = useState<ReviewFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setRating = useCallback((rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  }, []);

  const setTitle = useCallback((title: string) => {
    setFormData((prev) => ({ ...prev, title }));
  }, []);

  const setBody = useCallback((body: string) => {
    setFormData((prev) => ({ ...prev, body }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setError(null);
  }, []);

  const submitReview = useCallback(async () => {
    setError(null);

    if (formData.rating === 0) {
      setError('評価を選択してください');
      return;
    }

    if (!formData.body.trim()) {
      setError('レビュー本文を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        itemId,
        title: formData.title.trim() || undefined,
        body: formData.body.trim(),
        rating: formData.rating,
      });
      resetForm();
      onSuccess();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('この商品には既にレビューを投稿しています');
      } else if (err.response?.status === 401) {
        setError('ログインが必要です');
      } else {
        setError('レビューの投稿に失敗しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, itemId, onSuccess, resetForm]);

  return {
    formData,
    isSubmitting,
    error,
    setRating,
    setTitle,
    setBody,
    submitReview,
    resetForm,
  };
};
