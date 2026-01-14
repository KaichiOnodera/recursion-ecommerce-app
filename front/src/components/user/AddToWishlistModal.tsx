import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import {
  getWishlists,
  addWishlistItem,
  createWishlist,
} from '../../services/api/wishlist';
import { WishlistFormModal } from './WishlistFormModal';
import { Wishlist } from '@shared/schemas/wishlist';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AddToWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
  onSuccess?: () => void;
}

export const AddToWishlistModal: React.FC<AddToWishlistModalProps> = ({
  isOpen,
  onClose,
  itemId,
  onSuccess,
}) => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchWishlists();
    }
  }, [isOpen]);

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

  const handleAddToWishlist = async (wishlistId: number) => {
    setIsAdding(wishlistId);
    setError(null);

    try {
      await addWishlistItem(wishlistId, itemId);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      console.error('Failed to add to wishlist:', err);
      if (err.response?.status === 409) {
        setError('この商品は既にウィッシュリストに追加されています');
      } else {
        setError('ウィッシュリストへの追加に失敗しました');
      }
    } finally {
      setIsAdding(null);
    }
  };

  const handleCreateWishlist = async (
    name: string | null,
    isPublic: boolean,
  ) => {
    try {
      const response = await createWishlist(name, isPublic);
      await addWishlistItem(response.wishlist.id, itemId);
      if (onSuccess) {
        onSuccess();
      }
      setIsCreateModalOpen(false);
      onClose();
    } catch (err: any) {
      console.error('Failed to create wishlist or add item:', err);
      if (err.response?.status === 409) {
        throw new Error('この商品は既にウィッシュリストに追加されています');
      } else {
        throw new Error('ウィッシュリストの作成または追加に失敗しました');
      }
    }
  };

  const handleClose = () => {
    if (isAdding !== null) return;
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="ウィッシュリストに追加">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      ) : (
        <>
          {wishlists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">ウィッシュリストがありません</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
              >
                <PlusIcon className="w-5 h-5" />
                新しいリストを作成して追加
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {wishlists.map((wishlist) => (
                <button
                  key={wishlist.id}
                  onClick={() => handleAddToWishlist(wishlist.id)}
                  disabled={isAdding !== null}
                  className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {wishlist.name || '無題のウィッシュリスト'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(wishlist.updatedAt).toLocaleDateString(
                          'ja-JP',
                        )}{' '}
                        更新
                      </p>
                    </div>
                    {isAdding === wishlist.id && (
                      <span className="text-sm text-blue-600">追加中...</span>
                    )}
                  </div>
                </button>
              ))}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={isAdding !== null}
                className="w-full p-4 text-left border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  新しいリストを作成して追加
                </span>
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleClose}
          disabled={isAdding !== null}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          キャンセル
        </button>
      </div>

      <WishlistFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateWishlist}
      />
    </Modal>
  );
};
