import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

export interface ActionButtonsProps {
  isOutOfStock: boolean;
  isAddingToCart: boolean;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isOutOfStock,
  isAddingToCart,
  onAddToCart,
  onAddToWishlist,
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
      onClick={onAddToWishlist}
      className="px-4 py-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center"
      aria-label="ウィッシュリストに追加"
    >
      <HeartIcon className="w-5 h-5 text-gray-500" />
    </button>
  </div>
);
