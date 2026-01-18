import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Item } from '@shared/schemas/item';
import { getItem, InventoryStatus } from '../services/api/items';
import { addToCart } from '../services/api/cart';
import { addFavorite, removeFavorite } from '../services/api/favorites';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { BackLink } from '../components/product/BackLink';
import { LoadingState } from '../components/product/LoadingState';
import { ErrorState } from '../components/product/ErrorState';
import { QuantitySelector } from '../components/product/QuantitySelector';
import { ActionButtons } from '../components/product/ActionButtons';
import { ReviewSection } from '../components/product/ReviewSection';
import { TagBadgeList } from '../components/product/TagBadge';
import { AddToWishlistModal } from '../components/user/AddToWishlistModal';
import { getImageUrl } from '../utils/imageUrl';

const MIN_QUANTITY = 1;

type ProductDetailState = {
  item: Item | null;
  isLoading: boolean;
  error: string | null;
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const { isLoggedIn } = useUser();
  const [state, setState] = useState<ProductDetailState>({
    item: null,
    isLoading: true,
    error: null,
  });
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);

  const itemId = useMemo(() => {
    if (!id) return null;
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }, [id]);

  useEffect(() => {
    if (!itemId) {
      setState({
        item: null,
        isLoading: false,
        error: 'Invalid item ID',
      });
      return;
    }

    let isCancelled = false;

    const fetchItem = async (): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await getItem(itemId);
        if (!isCancelled) {
          setState({
            item: response.item,
            isLoading: false,
            error: null,
          });
          // 商品が変わったら数量をリセット
          setQuantity(MIN_QUANTITY);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('商品の取得に失敗しました:', error);
          setState({
            item: null,
            isLoading: false,
            error: '商品の取得に失敗しました',
          });
        }
      }
    };

    fetchItem();

    return () => {
      isCancelled = true;
    };
  }, [itemId]);

  const handleQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= MIN_QUANTITY) {
        setQuantity(value);
      }
    },
    [],
  );

  const handleDecreaseQuantity = useCallback((): void => {
    setQuantity((prev) => Math.max(MIN_QUANTITY, prev - 1));
  }, []);

  const handleIncreaseQuantity = useCallback((): void => {
    setQuantity((prev) => prev + 1);
  }, []);

  const handleAddToCart = useCallback(async (): Promise<void> => {
    if (!state.item) return;

    setIsAddingToCart(true);
    try {
      await addToCart(state.item.id, quantity);
      await refreshCart();
      alert('カートに追加しました');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('カートへの追加に失敗しました');
    } finally {
      setIsAddingToCart(false);
    }
  }, [state.item, quantity, refreshCart]);

  const handleToggleFavorite = useCallback(async (): Promise<void> => {
    if (!state.item) return;

    if (isTogglingFavorite) return;

    // ログインしていない場合はログインページにリダイレクト
    if (!isLoggedIn() || state.item.isFavorite === null) {
      navigate('/auth/login');
      return;
    }

    setIsTogglingFavorite(true);
    try {
      if (state.item.isFavorite) {
        await removeFavorite(state.item.id);
        setState((prev) => {
          if (!prev.item) return prev;
          return {
            ...prev,
            item: {
              ...prev.item,
              isFavorite: false,
            },
          };
        });
      } else {
        await addFavorite(state.item.id);
        setState((prev) => {
          if (!prev.item) return prev;
          return {
            ...prev,
            item: {
              ...prev.item,
              isFavorite: true,
            },
          };
        });
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      alert('お気に入りの操作に失敗しました');
    } finally {
      setIsTogglingFavorite(false);
    }
  }, [state.item, isLoggedIn, navigate]);

  const isOutOfStock = useMemo(
    () => state.item?.inventoryStatus === InventoryStatus.OUT_OF_STOCK,
    [state.item?.inventoryStatus],
  );

  const images = useMemo(() => state.item?.images || [], [state.item?.images]);
  const currentImage = images[selectedImageIndex] || null;
  const currentImageUrl = currentImage ? getImageUrl(currentImage.src) : null;

  const handleImageSelect = useCallback((index: number): void => {
    setSelectedImageIndex(index);
  }, []);

  // タグクリック時の処理
  const handleTagClick = useCallback(
    (tagId: number): void => {
      navigate(`/products?tagIds=${tagId}`);
    },
    [navigate],
  );

  // 商品が変わったら画像インデックスをリセット
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [state.item?.id]);

  if (state.isLoading) {
    return <LoadingState />;
  }

  if (!state.item || state.error) {
    return <ErrorState />;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <BackLink />

      <div className="md:flex md:gap-12 md:items-start">
        {/* 商品画像エリア（カルーセル対応） */}
        <div className="md:w-1/2 mb-8 md:mb-0 md:sticky md:top-8">
          <div className="space-y-4">
            {/* メイン画像 */}
            <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={state.item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 画像読み込みエラー時のフォールバック
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      const fallback = document.createElement('div');
                      fallback.className =
                        'absolute inset-0 flex items-center justify-center';
                      fallback.innerHTML =
                        '<span class="text-gray-500 text-lg">画像なし</span>';
                      target.parentElement.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">画像なし</span>
                </div>
              )}
            </div>

            {/* サムネイル画像一覧 */}
            {images.length > 1 && state.item && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => handleImageSelect(index)}
                    className={`relative aspect-square w-full rounded overflow-hidden border-2 transition ${
                      selectedImageIndex === index
                        ? 'border-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={getImageUrl(image.src) || ''}
                      alt={`${state.item?.name || '商品'} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 商品情報 */}
        <div className="md:w-1/2 space-y-8">
          {/* 商品名 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {state.item.name}
            </h1>
          </div>

          {/* タグ */}
          <TagBadgeList
            tags={state.item.tags}
            onTagClick={handleTagClick}
            isClickable={true}
          />

          {/* 金額と在庫有無（横並び） */}
          <div className="flex items-baseline gap-4">
            <p className="text-2xl font-bold text-gray-900">
              ¥{state.item.price.toLocaleString()}
            </p>
            <p
              className={`text-sm font-medium ${
                isOutOfStock ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              {isOutOfStock ? '在庫なし' : '在庫あり'}
            </p>
          </div>

          {/* 区切り線 */}
          <hr className="border-0 border-b border-gray-400 w-full m-0" />

          {/* 数量選択 */}
          {!isOutOfStock && (
            <QuantitySelector
              quantity={quantity}
              onDecrease={handleDecreaseQuantity}
              onIncrease={handleIncreaseQuantity}
              onChange={handleQuantityChange}
              disabled={isAddingToCart}
            />
          )}

          {/* アクションボタン */}
          <ActionButtons
            isOutOfStock={isOutOfStock}
            isAddingToCart={isAddingToCart}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={state.item.isFavorite ?? false}
            isTogglingFavorite={isTogglingFavorite}
            onAddToWishlist={
              isLoggedIn() ? () => setIsWishlistModalOpen(true) : undefined
            }
          />

          {/* 説明文 */}
          <div className="pt-4">
            <h2 className="mb-3 pb-2">
              <span className="text-sm font-medium text-gray-700 border-b border-gray-400">
                商品説明
              </span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mt-3">
              {state.item.description}
            </p>
          </div>
        </div>
      </div>

      {/* レビューセクション */}
      {itemId && (
        <div className="mt-12">
          <ReviewSection itemId={itemId} />
        </div>
      )}

      {/* ウィッシュリスト追加モーダル */}
      {itemId && (
        <AddToWishlistModal
          isOpen={isWishlistModalOpen}
          onClose={() => setIsWishlistModalOpen(false)}
          itemId={itemId}
        />
      )}
    </div>
  );
};
