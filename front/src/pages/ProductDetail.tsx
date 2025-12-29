import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { Item } from '@shared/schemas/item';
import { getItem, InventoryStatus } from '../services/api/items';
import { addToCart } from '../services/api/cart';
import { useCart } from '../contexts/CartContext';
import { BackLink } from '../components/product/BackLink';
import { LoadingState } from '../components/product/LoadingState';
import { ErrorState } from '../components/product/ErrorState';
import { QuantitySelector } from '../components/product/QuantitySelector';
import { ActionButtons } from '../components/product/ActionButtons';
import { ReviewSection } from '../components/product/ReviewSection';

const MIN_QUANTITY = 1;

type ProductDetailState = {
  item: Item | null;
  isLoading: boolean;
  error: string | null;
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { refreshCart } = useCart();
  const [state, setState] = useState<ProductDetailState>({
    item: null,
    isLoading: true,
    error: null,
  });
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

  const handleAddToWishlist = useCallback((): void => {
    // TODO: ウィッシュリスト機能の実装
    console.log('Add to wishlist:', state.item?.id);
  }, [state.item?.id]);

  const isOutOfStock = useMemo(
    () => state.item?.inventoryStatus === InventoryStatus.OUT_OF_STOCK,
    [state.item?.inventoryStatus],
  );

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
          <div className="relative aspect-square w-full bg-green-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500 text-lg">画像</span>
            </div>
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
            onAddToWishlist={handleAddToWishlist}
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
      <div className="mt-12">
        <ReviewSection />
      </div>
    </div>
  );
};
