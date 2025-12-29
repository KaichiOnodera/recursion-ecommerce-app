import React, { useState, useCallback } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useReviews } from './review/hooks/useReviews';
import { ReviewHeader } from './review/ReviewHeader';
import { ReviewItem } from './review/ReviewItem';
import { Pagination } from './review/Pagination';
import { ReviewFormModal } from './review/ReviewFormModal';

interface ReviewSectionProps {
  itemId: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ itemId }) => {
  const { user } = useUser();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const {
    reviews,
    total,
    averageRating,
    isLoading,
    error,
    currentPage,
    totalPages,
    changePage,
    refetch,
  } = useReviews(itemId);

  const handleWriteReview = useCallback(() => {
    if (!user) {
      alert('レビューを投稿するにはログインが必要です');
      return;
    }
    setShowReviewForm(true);
  }, [user]);

  const handleReviewSubmitted = useCallback(() => {
    setShowReviewForm(false);
    refetch();
  }, [refetch]);

  const handleCancelReview = useCallback(() => {
    setShowReviewForm(false);
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-gray-300">
      <ReviewHeader
        averageRating={averageRating}
        totalReviews={total}
        isLoading={isLoading}
        onWriteReview={handleWriteReview}
      />

      <ReviewFormModal
        isOpen={showReviewForm}
        onClose={handleCancelReview}
        itemId={itemId}
        onSubmit={handleReviewSubmitted}
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
