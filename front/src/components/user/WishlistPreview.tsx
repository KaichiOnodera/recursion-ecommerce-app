import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getWishlists } from '../../services/api/wishlist';
import { Wishlist } from '@shared/schemas/wishlist';
import {
  BookmarkIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const WISHLIST_PREVIEW_LIMIT = 3;

export const WishlistPreview: React.FC = () => {
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getWishlists();
        setWishlists(response.wishlists);
      } catch (err) {
        console.error('Failed to fetch wishlists:', err);
        setError('ウィッシュリストの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  if (loading) {
    return <div className="text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (wishlists.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 mb-2">ウィッシュリストがありません</p>
        <button
          onClick={() => navigate('/wishlist')}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
        >
          ウィッシュリストを作成
        </button>
      </div>
    );
  }

  const previewWishlists = wishlists.slice(0, WISHLIST_PREVIEW_LIMIT);
  const hasMoreWishlists = wishlists.length > WISHLIST_PREVIEW_LIMIT;

  return (
    <div>
      <div className="space-y-3 mb-4">
        {previewWishlists.map((wishlist) => (
          <div
            key={wishlist.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/wishlist/${wishlist.id}`)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <BookmarkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {wishlist.name || '無題のウィッシュリスト'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {wishlist.isPublic ? (
                    <span className="flex items-center gap-1 text-xs text-blue-600">
                      <GlobeAltIcon className="w-3 h-3" />
                      公開
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <LockClosedIcon className="w-3 h-3" />
                      非公開
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(wishlist.updatedAt).toLocaleDateString('ja-JP')}{' '}
                    更新
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasMoreWishlists && (
        <div className="text-center">
          <button
            onClick={() => navigate('/wishlist')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            すべて見る ({wishlists.length}件)
          </button>
        </div>
      )}
      {!hasMoreWishlists && (
        <div className="text-center">
          <button
            onClick={() => navigate('/wishlist')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            ウィッシュリスト一覧を見る
          </button>
        </div>
      )}
    </div>
  );
};
