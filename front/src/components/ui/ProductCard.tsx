import React from 'react';
import { useNavigate } from 'react-router';
import { Item, AdminItem } from '@shared/schemas/item';
import { InventoryStatus } from '../../services/api/items';
import { addToCart } from '../../services/api/cart';
import { useCart } from '../../contexts/CartContext';
import { API_BASE_URL } from '../../services/api/config';

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
  const imageUrl = thumbnailImage
    ? `${API_BASE_URL}${thumbnailImage.src}`
    : null;

  return (
    <div
      className={`bg-white border duration-200 rounded-lg overflow-hidden ${
        !isAdmin ? 'cursor-pointer hover:shadow-lg' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* 商品画像 */}
      <div className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
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
              className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
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
            className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
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
