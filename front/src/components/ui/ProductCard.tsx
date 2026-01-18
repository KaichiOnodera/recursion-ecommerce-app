import React from 'react';
import { useNavigate } from 'react-router';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Item, AdminItem } from '@shared/schemas/item';
import { InventoryStatus } from '../../services/api/items';
import { addToCart } from '../../services/api/cart';
import { useCart } from '../../contexts/CartContext';
import { getImageUrl } from '../../utils/imageUrl';
import { TagBadgeList } from '../product/TagBadge';

interface ProductCardProps {
  item: Item | AdminItem;
  isAdmin?: boolean;
  onDelete?: (itemId: number) => void;
  onTagClick?: (tagId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  isAdmin = false,
  onDelete,
  onTagClick,
}) => {
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

  const isInStock = item.inventoryStatus !== InventoryStatus.OUT_OF_STOCK;

  return (
    <div
      className={`group flex flex-col h-full bg-white border border-gray-200 rounded-lg transition-shadow duration-300 ${
        !isAdmin ? 'cursor-pointer hover:shadow-md' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* 商品画像 */}
      <div className="relative bg-gray-50 h-80 flex items-center justify-center overflow-hidden flex-shrink-0 rounded-t-lg">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
            {/* グラデーションオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <span className="text-gray-500">画像なし</span>
        )}
        {/* 在庫状況バッジ */}
        {!isAdmin && (
          <div
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              isInStock
                ? 'bg-green-500/90 text-white'
                : 'bg-gray-500/90 text-white'
            }`}
          >
            {isInStock ? '在庫あり' : '在庫なし'}
          </div>
        )}
      </div>

      {/* 商品情報 */}
      <div className="flex flex-col flex-grow pt-6 pb-6 px-5">
        {/* 商品タイトル */}
        <h2 className="text-[15px] font-semibold text-gray-900 mb-2.5 line-clamp-2 leading-snug tracking-tight">
          {item.name}
          {'displayStatus' in item && item.displayStatus === 'private' && (
            <span className="text-xs text-red-600 font-normal ml-2">
              (非公開)
            </span>
          )}
        </h2>

        {/* タグ */}
        {'tags' in item && !isAdmin && (
          <TagBadgeList
            tags={item.tags}
            className="mb-2"
            onTagClick={onTagClick}
            isClickable={!!onTagClick}
          />
        )}
        {'tags' in item && isAdmin && (
          <TagBadgeList tags={item.tags} className="mb-2" />
        )}

        {/* 商品説明 */}
        {item.description && (
          <p className="text-xs text-gray-600 mb-5 line-clamp-2 leading-relaxed font-light">
            {item.description}
          </p>
        )}

        {/* 価格とボタンエリア */}
        <div className="mt-auto pt-5 border-t border-gray-200">
          {/* 価格 */}
          <p className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
            ¥
            {typeof item.price === 'number'
              ? item.price.toLocaleString()
              : item.price}
          </p>

          {/* 管理者用のボタン */}
          {isAdmin ? (
            <div className="space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/products/${item.id}/edit`);
                }}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors active:scale-95 rounded-md"
              >
                編集
              </button>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 hover:border-red-400 transition-all duration-200 active:scale-95 group"
                >
                  <TrashIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>削除</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={item.inventoryStatus === InventoryStatus.OUT_OF_STOCK}
              className={`w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                isInStock
                  ? 'border-2 border-gray-900 text-gray-900 hover:bg-gray-50 hover:border-orange-400'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300'
              }`}
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
