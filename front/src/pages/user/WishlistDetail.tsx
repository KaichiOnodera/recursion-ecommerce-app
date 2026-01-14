import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getWishlistItems } from '../../services/api/wishlist';
import { WishlistItem } from '@shared/schemas/wishlist';
import { WishlistItemCard } from '../../components/user/WishlistItemCard';

export const WishlistDetail: React.FC = () => {
  const { wishlistId } = useParams<{ wishlistId: string }>();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wishlistId) {
      setError('ウィッシュリストIDが指定されていません');
      setLoading(false);
      return;
    }

    const parsedWishlistId = parseInt(wishlistId, 10);
    if (isNaN(parsedWishlistId)) {
      setError('無効なウィッシュリストIDです');
      setLoading(false);
      return;
    }

    fetchWishlistItems(parsedWishlistId);
  }, [wishlistId]);

  const fetchWishlistItems = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWishlistItems(id);
      setWishlistItems(response.items);
    } catch (err: any) {
      console.error('Failed to fetch wishlist items:', err);
      if (err.response?.status === 404) {
        setError('ウィッシュリストが見つかりません');
      } else if (err.response?.status === 403) {
        setError('このウィッシュリストにアクセスする権限がありません');
      } else {
        setError('商品の取得に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (itemId: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  const parsedWishlistId = wishlistId ? parseInt(wishlistId, 10) : null;

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link
            to="/wishlist"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">
              ウィッシュリスト一覧に戻る
            </span>
          </Link>
          <h1 className="text-3xl font-bold">ウィッシュリスト詳細</h1>
        </div>
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link
            to="/wishlist"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">
              ウィッシュリスト一覧に戻る
            </span>
          </Link>
          <h1 className="text-3xl font-bold">ウィッシュリスト詳細</h1>
        </div>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  if (!parsedWishlistId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-8 text-red-500">
          無効なウィッシュリストIDです
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          to="/wishlist"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">
            ウィッシュリスト一覧に戻る
          </span>
        </Link>
        <h1 className="text-3xl font-bold">ウィッシュリスト詳細</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            このウィッシュリストには商品がありません
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            商品一覧を見る
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistItems.map((wishlistItem) => (
            <WishlistItemCard
              key={wishlistItem.id}
              wishlistItem={wishlistItem}
              wishlistId={parsedWishlistId}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
