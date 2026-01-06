import React from 'react';
import { StarRating } from './StarRating';
import { useReviewForm } from './hooks/useReviewForm';

interface ReviewFormProps {
  itemId: number;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  itemId,
  onSubmit,
  onCancel,
}) => {
  const {
    formData,
    isSubmitting,
    error,
    setRating,
    setTitle,
    setBody,
    submitReview,
  } = useReviewForm(itemId, onSubmit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitReview();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          評価 <span className="text-red-500">*</span>
        </label>
        <StarRating
          rating={formData.rating}
          size="md"
          interactive
          onRatingChange={setRating}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="review-title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          タイトル（任意）
        </label>
        <input
          id="review-title"
          type="text"
          value={formData.title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="レビューのタイトル"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="review-body"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          レビュー本文 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-body"
          value={formData.body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="商品のレビューを入力してください"
          required
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
};
