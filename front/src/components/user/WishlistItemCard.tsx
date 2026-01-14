import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { WishlistItem } from '@shared/schemas/wishlist';
import { removeWishlistItem } from '../../services/api/wishlist';
import { getImageUrl } from '../../utils/imageUrl';
import { TrashIcon } from '@heroicons/react/24/outline';

interface WishlistItemCardProps {
  wishlistItem: WishlistItem;
  wishlistId: number;
  onRemove: (itemId: number) => void;
}

export const WishlistItemCard: React.FC<WishlistItemCardProps> = ({
  wishlistItem,
  wishlistId,
  onRemove,
}) => {
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleCardClick = (): void => {
    navigate(`/products/${wishlistItem.itemId}`);
  };

  const handleRemoveClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.stopPropagation();

    if (isRemoving) return;

    if (!window.confirm('この商品をウィッシュリストから削除しますか？')) {
      return;
    }

    setIsRemoving(true);
    try {
      await removeWishlistItem(wishlistId, wishlistItem.itemId);
      onRemove(wishlistItem.itemId);
    } catch (err) {
      console.error('Failed to remove wishlist item:', err);
      alert('商品の削除に失敗しました');
    } finally {
      setIsRemoving(false);
    }
  };

  const firstImage = wishlistItem.item.images[0];
  const imageUrl = firstImage ? getImageUrl(firstImage.src) : null;

  return (
    <div
      className="bg-white border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
      onClick={handleCardClick}
    >
      {/* 削除ボタン */}
      <button
        onClick={handleRemoveClick}
        disabled={isRemoving}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="ウィッシュリストから削除"
      >
        <TrashIcon className="w-5 h-5 text-gray-600" />
      </button>

      {/* 商品画像 */}
      <div className="bg-gray-100 h-64 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={wishlistItem.item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML =
                  '<span class="text-gray-500">画像なし</span>';
              }
            }}
          />
        ) : (
          <span className="text-gray-500">画像なし</span>
        )}
      </div>

      {/* 商品情報 */}
      <div className="p-4">
        <h2 className="font-medium text-gray-900 mb-1">
          {wishlistItem.item.name}
        </h2>
        <p className="text-lg font-bold text-gray-900">
          ¥{wishlistItem.item.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
