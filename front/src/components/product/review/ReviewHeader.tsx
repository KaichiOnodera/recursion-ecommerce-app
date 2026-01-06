import React from 'react';
import { StarRating } from './StarRating';

interface ReviewHeaderProps {
  averageRating: number;
  totalReviews: number;
  isLoading: boolean;
  onWriteReview: () => void;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = React.memo(
  ({ averageRating, totalReviews, isLoading, onWriteReview }) => {
    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">レビュー</h2>
          {!isLoading && (
            <div className="flex items-center gap-4">
              {totalReviews > 0 ? (
                <>
                  <StarRating rating={averageRating} size="lg" showNumber />
                  <span className="text-sm text-gray-600">
                    {totalReviews}件のレビュー
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-600">
                  レビューはまだありません
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onWriteReview}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          レビューを書く
        </button>
      </div>
    );
  },
);

ReviewHeader.displayName = 'ReviewHeader';
