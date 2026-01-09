import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export interface ActionButtonsProps {
  isOutOfStock: boolean;
  isAddingToCart: boolean;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  isTogglingFavorite: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isOutOfStock,
  isAddingToCart,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  isTogglingFavorite,
}) => (
  <div className="flex gap-3">
    <button
      onClick={onAddToCart}
      disabled={isOutOfStock || isAddingToCart}
      className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-lg hover:bg-gray-800 text-base font-medium disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 transition-colors"
    >
      {isAddingToCart
        ? '追加中...'
        : isOutOfStock
          ? '在庫なし'
          : 'カートに追加'}
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
  </div>
);
