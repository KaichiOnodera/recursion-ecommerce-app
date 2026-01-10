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
      className={`flex flex-col h-full bg-white border border-gray-200 rounded-sm transition-all duration-200 ${
        !isAdmin ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* 商品画像 */}
      <div className="bg-gray-50 h-80 flex items-center justify-center overflow-hidden flex-shrink-0 rounded-t-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
      <div className="flex flex-col flex-grow pt-5 pb-6 px-4">
        {/* 商品タイトル */}
        <h2 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {item.name}
          {'displayStatus' in item && item.displayStatus === 'private' && (
            <span className="text-xs text-red-600 font-normal ml-2">
              (非公開)
            </span>
          )}
        </h2>

        {/* 商品説明 */}
        {item.description && (
          <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* 価格とボタンエリア */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          {/* 価格 */}
          <p className="text-lg font-bold text-gray-900 mb-4">
            ¥
            {typeof item.price === 'number'
              ? item.price.toLocaleString()
              : item.price}
          </p>

          {/* 管理者用の編集ボタン */}
          {isAdmin ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/products/${item.id}/edit`);
              }}
              className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              編集
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={item.inventoryStatus === InventoryStatus.OUT_OF_STOCK}
              className="w-full border-b-2 border-gray-900 text-gray-900 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              {item.inventoryStatus === InventoryStatus.OUT_OF_STOCK
                ? '在庫なし'
                : 'カートに追加'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
