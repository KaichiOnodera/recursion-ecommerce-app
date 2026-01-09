import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FavoriteItem } from '@shared/schemas/favorite';
import { removeFavorite } from '../../services/api/favorites';
import { getImageUrl } from '../../utils/imageUrl';
import { TrashIcon } from '@heroicons/react/24/outline';

interface FavoriteItemCardProps {
  favorite: FavoriteItem;
  onRemove: (itemId: number) => void;
}

export const FavoriteItemCard: React.FC<FavoriteItemCardProps> = ({
  favorite,
  onRemove,
}) => {
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleCardClick = (): void => {
    navigate(`/products/${favorite.itemId}`);
  };

  const handleRemoveClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.stopPropagation();

    if (isRemoving) return;

    if (!window.confirm('お気に入りから削除しますか？')) {
      return;
    }

    setIsRemoving(true);
    try {
      await removeFavorite(favorite.itemId);
      onRemove(favorite.itemId);
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      alert('お気に入りの削除に失敗しました');
    } finally {
      setIsRemoving(false);
    }
  };

  const firstImage = favorite.item.images[0];
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
        aria-label="お気に入りから削除"
      >
        <TrashIcon className="w-5 h-5 text-gray-600" />
      </button>

      {/* 商品画像 */}
      <div className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={favorite.item.name}
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
        <h2 className="font-medium text-gray-900 mb-1">{favorite.item.name}</h2>
        <p className="text-lg font-bold text-gray-900">
          ¥{favorite.item.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
