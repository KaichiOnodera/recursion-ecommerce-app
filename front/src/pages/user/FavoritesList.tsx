import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getFavorites } from '../../services/api/favorites';
import { FavoriteItem } from '@shared/schemas/favorite';
import { FavoriteItemCard } from '../../components/user/FavoriteItemCard';

export const FavoritesList: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFavorites();
        setFavorites(response.favorites);
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
        setError('お気に入りの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = (itemId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.itemId !== itemId));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">お気に入り</h1>
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">お気に入り</h1>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">お気に入り</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">お気に入りがありません</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            商品一覧を見る
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((favorite) => (
            <FavoriteItemCard
              key={favorite.id}
              favorite={favorite}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
