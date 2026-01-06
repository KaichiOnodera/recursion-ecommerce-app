import React, { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = React.memo(
  ({ currentPage, totalPages, onPageChange }) => {
    const pages = useMemo(
      () => Array.from({ length: totalPages }, (_, i) => i + 1),
      [totalPages],
    );

    const handlePrevious = () => onPageChange(currentPage - 1);
    const handleNext = () => onPageChange(currentPage + 1);
    const handlePageClick = (page: number) => onPageChange(page);

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          前へ
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
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
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          次へ
        </button>
      </div>
    );
  },
);

Pagination.displayName = 'Pagination';
