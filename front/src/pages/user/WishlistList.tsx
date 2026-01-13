import React, { useState, useEffect } from 'react';
import {
  getWishlists,
  createWishlist,
  updateWishlist,
  deleteWishlist,
} from '../../services/api/wishlist';
import { Wishlist } from '@shared/schemas/wishlist';
import { WishlistCard } from '../../components/user/WishlistCard';
import { WishlistFormModal } from '../../components/user/WishlistFormModal';
import { PlusIcon } from '@heroicons/react/24/outline';

export const WishlistList: React.FC = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState<Wishlist | null>(null);

  useEffect(() => {
    fetchWishlists();
  }, []);

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

  const handleCreate = async (name: string | null, isPublic: boolean) => {
    await createWishlist(name, isPublic);
    await fetchWishlists();
  };

  const handleUpdate = async (name: string | null, isPublic: boolean) => {
    if (!editingWishlist) return;
    await updateWishlist(editingWishlist.id, name, isPublic);
    await fetchWishlists();
    setEditingWishlist(null);
  };

  const handleDelete = async (wishlistId: number) => {
    try {
      await deleteWishlist(wishlistId);
      await fetchWishlists();
    } catch (err) {
      console.error('Failed to delete wishlist:', err);
      alert('ウィッシュリストの削除に失敗しました');
    }
  };

  const handleEdit = (wishlist: Wishlist) => {
    setEditingWishlist(wishlist);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">ウィッシュリスト</h1>
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">ウィッシュリスト</h1>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ウィッシュリスト</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          新しいリストを作成
        </button>
      </div>

      {wishlists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">ウィッシュリストがありません</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            最初のリストを作成
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlists.map((wishlist) => (
            <WishlistCard
              key={wishlist.id}
              wishlist={wishlist}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <WishlistFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      <WishlistFormModal
        isOpen={editingWishlist !== null}
        onClose={() => setEditingWishlist(null)}
        onSubmit={handleUpdate}
        wishlist={editingWishlist}
      />
    </div>
  );
};
