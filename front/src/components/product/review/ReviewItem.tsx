import React, { useMemo } from 'react';
import { Review } from '@shared/schemas/review';
import { StarRating } from './StarRating';

interface ReviewItemProps {
  review: Review;
  currentUserId: number | null;
}

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const ReviewItem: React.FC<ReviewItemProps> = React.memo(
  ({ review, currentUserId }) => {
    const formattedDate = useMemo(
      () => formatDate(review.postedAt),
      [review.postedAt],
    );

    const isOwnReview =
      currentUserId !== null && review.userId === currentUserId;

    return (
      <div
        className={`pb-4 mb-4 last:mb-0 ${
          isOwnReview
            ? 'bg-blue-50 border-l-4 border-l-blue-500 rounded-r-lg pl-4 pr-4 pt-3'
            : 'border-b border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
            {isOwnReview && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                あなたのレビュー
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        {review.title && (
          <h3 className="font-medium text-gray-900 mb-1">{review.title}</h3>
        )}
        <p className="text-gray-600 text-sm mt-2">{review.body}</p>
      </div>
    );
  },
);

ReviewItem.displayName = 'ReviewItem';
