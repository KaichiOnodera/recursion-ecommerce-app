import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getFavorites } from '../../services/api/favorites';
import { FavoriteItem } from '@shared/schemas/favorite';
import { API_BASE_URL } from '../../services/api/config';

const FAVORITES_PREVIEW_LIMIT = 3;

export const FavoritesPreview: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFavorites();
        setFavorites(response.favorites);
        setTotal(response.total);
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
        setError('お気に入りの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <div className="text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (favorites.length === 0) {
    return <div className="text-gray-500">お気に入りがありません</div>;
  }

  const previewFavorites = favorites.slice(0, FAVORITES_PREVIEW_LIMIT);
  const hasMoreFavorites = total > FAVORITES_PREVIEW_LIMIT;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {previewFavorites.map((favorite) => {
          const firstImage = favorite.item.images[0];
          const imageUrl = firstImage
            ? `${API_BASE_URL}${firstImage.src}`
            : null;

          return (
            <div
              key={favorite.id}
              className="cursor-pointer"
              onClick={() => navigate(`/products/${favorite.itemId}`)}
            >
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
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
                          '<span class="text-gray-500 text-sm flex items-center justify-center h-full">画像なし</span>';
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">画像なし</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700 truncate">
                {favorite.item.name}
              </p>
              <p className="text-sm font-bold text-gray-900">
                ¥{favorite.item.price.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
      {hasMoreFavorites && (
        <div className="text-center">
          <button
            onClick={() => navigate('/favorites')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            全件見る ({total}件)
          </button>
        </div>
      )}
    </div>
  );
};
