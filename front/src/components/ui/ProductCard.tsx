import React from 'react';
import { useNavigate } from 'react-router';
import { Item, AdminItem } from '@shared/schemas/item';
import { InventoryStatus } from '../../services/api/items';
import { addToCart } from '../../services/api/cart';
import { useCart } from '../../contexts/CartContext';
import { getImageUrl } from '../../utils/imageUrl';

interface ProductCardProps {
  item: Item | AdminItem;
  isAdmin?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, isAdmin = false }) => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const handleAddToCart = async (): Promise<void> => {
    try {
      await addToCart(item.id, 1);
      await refreshCart();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleCardClick = (): void => {
    if (!isAdmin) {
      navigate(`/products/${item.id}`);
    }
  };

  // 最初の画像をサムネイルとして使用
  const images = 'images' in item ? item.images : [];
  const thumbnailImage = images && images.length > 0 ? images[0] : null;
  const imageUrl = thumbnailImage ? getImageUrl(thumbnailImage.src) : null;

  return (
    <div
      className={`overflow-hidden ${!isAdmin ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      {/* 商品画像 */}
      <div className="bg-gray-100 h-64 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // 画像読み込みエラー時のフォールバック
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
        <h2>
          {item.name}
          {'displayStatus' in item && item.displayStatus === 'private' && (
            <span className="text-xs text-red-600 font-normal ml-2">
              (非公開)
            </span>
          )}
        </h2>
        <p> {item.description} </p>
        <p> {item.price} </p>

        {/* 管理者用の編集ボタン */}
        {isAdmin ? (
          <div className="mt-4">
            <button
              onClick={() => navigate(`/admin/products/${item.id}/edit`)}
              className="w-full border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-50 text-sm"
            >
              編集
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={item.inventoryStatus === InventoryStatus.OUT_OF_STOCK}
            className="w-full border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-50 text-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
          >
            {item.inventoryStatus === InventoryStatus.OUT_OF_STOCK
              ? '在庫なし'
              : 'カートに追加'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
