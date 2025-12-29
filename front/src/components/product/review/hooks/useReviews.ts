import { useState, useCallback, useEffect } from 'react';
import { Review } from '@shared/schemas/review';
import { getReviews, GetReviewsParams } from '../../../../services/api/reviews';

const DEFAULT_LIMIT = 5;

export const useReviews = (itemId: number, limit: number = DEFAULT_LIMIT) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchReviews = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const params: GetReviewsParams = {
          page,
          limit,
        };
        const response = await getReviews(itemId, params);
        setReviews(response.reviews);
        setTotal(response.total);
        setAverageRating(response.averageRating);
        setCurrentPage(page);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        setError('レビューの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    },
    [itemId, limit],
  );

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  const changePage = useCallback(
    (page: number) => {
      fetchReviews(page);
    },
    [fetchReviews],
  );

  const refetch = useCallback(() => {
    fetchReviews(currentPage);
  }, [fetchReviews, currentPage]);

  const totalPages = Math.ceil(total / limit);

  return {
    reviews,
    total,
    averageRating,
    isLoading,
    error,
    currentPage,
    totalPages,
    changePage,
    refetch,
  };
};
