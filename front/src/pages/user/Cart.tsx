import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getCart, updateCartItem } from '../../services/api/cart';
import { CartItem } from '@shared/schemas/cart';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../contexts/UserContext';

export const Cart: React.FC = () => {
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoggedIn()) {
        navigate('/auth/user/login');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getCart();
        setCartItems(response.items);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError('カートの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [isLoggedIn, navigate]);

  const handleAmountChange = async (itemId: number, newAmount: number) => {
    if (newAmount < 0) {
      return;
    }

    try {
      setIsUpdating(itemId);
      // 現在のカートアイテムを { id, amount } 形式に変換
      const currentItems = cartItems.map((item) => ({
        id: item.id,
        amount: item.amount,
      }));
      const response = await updateCartItem(currentItems, itemId, newAmount);
      setCartItems(response.items);
    } catch (err) {
      console.error('Failed to update cart item:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const formatPrice = (price: number): string => {
    return `¥${price.toLocaleString()}`;
  };

  const getTotalPrice = (): number => {
    return cartItems.reduce((sum, item) => sum + item.price * item.amount, 0);
  };

  const getTotalAmount = (): number => {
    return cartItems.reduce((sum, item) => sum + item.amount, 0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">カート</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">カート</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">カート</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">カートに商品がありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* カートアイテム一覧 */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow p-6 flex items-center justify-between ${
                  isUpdating === item.id ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAmountChange(item.id, item.amount - 1)}
                    className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    disabled={isUpdating === item.id}
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {item.amount}
                  </span>
                  <button
                    onClick={() => handleAmountChange(item.id, item.amount + 1)}
                    className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    disabled={isUpdating === item.id}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 注文概要 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">注文概要</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>商品数</span>
                  <span>{cartItems.length}点</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>合計数量</span>
                  <span>{getTotalAmount()}個</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>合計金額</span>
                    <span className="text-blue-600">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold transition-colors"
                  onClick={() => {
                    // TODO: チェックアウト処理を実装
                    window.alert('チェックアウト機能は今後実装予定です');
                  }}
                >
                  レジに進む
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
