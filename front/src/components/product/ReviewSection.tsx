import React, { useMemo } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useReviews } from './review/hooks/useReviews';
import { ReviewHeader } from './review/ReviewHeader';
import { ReviewItem } from './review/ReviewItem';
import { Pagination } from './review/Pagination';

interface ReviewSectionProps {
  itemId: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ itemId }) => {
  const { user } = useUser();
  const {
    reviews,
    total,
    averageRating,
    isLoading,
    error,
    currentPage,
    totalPages,
    changePage,
  } = useReviews(itemId);

  const handleWriteReview = () => {
    // TODO: レビュー投稿機能は別PRで実装
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-300">
      <ReviewHeader
        averageRating={averageRating}
        totalReviews={total}
        isLoading={isLoading}
        showForm={false}
        onWriteReview={handleWriteReview}
      />

      {isLoading ? (
        <p className="text-gray-500 text-center py-8">読み込み中...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-8">{error}</p>
      ) : reviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                currentUserId={user.id}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          )}
        </>
      ) : (
        <p className="text-gray-500 text-center py-8">レビューがありません</p>
      )}
    </div>
  );
};
