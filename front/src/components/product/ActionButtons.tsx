import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

export interface ActionButtonsProps {
  isOutOfStock: boolean;
  isAddingToCart: boolean;
  isAddedToCart?: boolean;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  isTogglingFavorite: boolean;
  onAddToWishlist?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isOutOfStock,
  isAddingToCart,
  isAddedToCart = false,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  isTogglingFavorite,
  onAddToWishlist,
}) => {
  const getButtonContent = () => {
    if (isAddingToCart) {
      return '追加中...';
    }
    if (isAddedToCart) {
      return (
        <span className="flex items-center justify-center gap-2">
          <CheckIcon className="w-5 h-5" />
          追加済み
        </span>
      );
    }
    if (isOutOfStock) {
      return '在庫なし';
    }
    return 'カートに追加';
  };

  const getButtonClassName = () => {
    if (isOutOfStock || isAddingToCart) {
      return 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300';
    }
    if (isAddedToCart) {
      return 'bg-green-500 text-white border-2 border-green-500 hover:bg-green-600';
    }
    return 'border-2 border-gray-900 text-gray-900 hover:bg-gray-50 hover:border-orange-400';
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={onAddToCart}
        disabled={isOutOfStock || isAddingToCart}
        className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 ${getButtonClassName()} ${
          isAddedToCart ? 'animate-pulse-scale' : ''
        }`}
      >
        {getButtonContent()}
      </button>
      <button
        onClick={onToggleFavorite}
        className={`px-4 py-4 border rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
          isFavorite
            ? 'border-red-300 bg-red-50 hover:bg-red-100'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        } ${isTogglingFavorite ? 'opacity-50' : ''}`}
        aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
      >
        {isFavorite ? (
          <HeartIconSolid className="w-5 h-5 text-red-500" />
        ) : (
          <HeartIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {onAddToWishlist && (
        <button
          onClick={onAddToWishlist}
          className="px-4 py-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer"
          aria-label="ウィッシュリストに追加"
        >
          <BookmarkIcon className="w-5 h-5 text-gray-500" />
        </button>
      )}
    </div>
  );
};
