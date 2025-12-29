import React, { useState, useMemo } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

const REVIEWS_PER_PAGE = 5;

const mockReviews: Review[] = [
  {
    id: 1,
    userName: '山田太郎',
    rating: 5,
    comment: 'とても良い商品でした。品質も良く、満足しています。',
    date: '2024-01-15',
  },
  {
    id: 2,
    userName: '佐藤花子',
    rating: 4.5,
    comment: '期待通りでした。また購入したいと思います。',
    date: '2024-01-10',
  },
  {
    id: 3,
    userName: '鈴木一郎',
    rating: 5,
    comment: '素晴らしい商品です。おすすめします！',
    date: '2024-01-05',
  },
  {
    id: 4,
    userName: '田中次郎',
    rating: 3.7,
    comment: 'まあまあです。もう少し安いと良いですね。',
    date: '2024-01-01',
  },
  {
    id: 5,
    userName: '高橋三郎',
    rating: 5,
    comment: '最高です！',
    date: '2023-12-28',
  },
  {
    id: 6,
    userName: '伊藤四郎',
    rating: 4,
    comment: '良い商品だと思います。',
    date: '2023-12-25',
  },
  {
    id: 7,
    userName: '渡辺五郎',
    rating: 5,
    comment: '期待以上でした。',
    date: '2023-12-20',
  },
];

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'md',
  showNumber = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= Math.round(rating) ? (
            <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
          ) : (
            <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
          )}
        </span>
      ))}
      {showNumber && (
        <span className="ml-2 text-sm text-gray-600">{Math.round(rating)}</span>
      )}
    </div>
  );
};

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => (
  <div className="border-b border-gray-200 pb-4 mb-4 last:border-0 last:mb-0">
    <div className="flex items-start justify-between mb-2">
      <div>
        <p className="font-medium text-gray-900">{review.userName}</p>
        <StarRating rating={Math.round(review.rating)} size="sm" />
      </div>
      <span className="text-sm text-gray-500">{review.date}</span>
    </div>
    <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
  </div>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        前へ
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded text-sm ${
            currentPage === page
              ? 'bg-gray-900 text-white border-gray-900'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        次へ
      </button>
    </div>
  );
};

export const ReviewSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const averageRating = useMemo(() => {
    const sum = mockReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round(sum / mockReviews.length);
  }, []);

  const totalReviews = mockReviews.length;
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    return mockReviews.slice(startIndex, endIndex);
  }, [currentPage]);

  const handleWriteReview = (): void => {
    // TODO: レビュー作成機能の実装
    alert('レビュー作成機能は今後実装予定です');
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">レビュー</h2>
          <div className="flex items-center gap-4">
            <StarRating rating={averageRating} size="lg" showNumber />
            <span className="text-sm text-gray-600">
              {totalReviews}件のレビュー
            </span>
          </div>
        </div>
        <button
          onClick={handleWriteReview}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          レビューを書く
        </button>
      </div>

      {paginatedReviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <p className="text-gray-500 text-center py-8">レビューがありません</p>
      )}
    </div>
  );
};
