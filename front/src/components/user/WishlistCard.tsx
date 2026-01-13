import React, { useState } from 'react';
import { Wishlist } from '@shared/schemas/wishlist';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface WishlistCardProps {
  wishlist: Wishlist;
  onEdit: (wishlist: Wishlist) => void;
  onDelete: (wishlistId: number) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  wishlist,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onEdit(wishlist);
  };

  const handleDeleteClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.stopPropagation();

    if (isDeleting) return;

    if (!window.confirm('このウィッシュリストを削除しますか？')) {
      return;
    }

    setIsDeleting(true);
    try {
      onDelete(wishlist.id);
    } catch (err) {
      console.error('Failed to delete wishlist:', err);
      alert('ウィッシュリストの削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {wishlist.name || '無題のウィッシュリスト'}
          </h3>
          {wishlist.isPublic && (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              公開
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {new Date(wishlist.updatedAt).toLocaleDateString('ja-JP')} 更新
        </p>
      </div>

      <div className="border-t border-gray-200 flex">
        {/* TODO: PR2で実装予定 - 詳細を見るボタン */}
        <div className="flex-1 px-4 py-2 text-sm text-gray-400 flex items-center justify-center">
          <EyeIcon className="w-4 h-4 mr-1" />
          詳細を見る（PR2で実装予定）
        </div>
        <button
          onClick={handleEditClick}
          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-l border-gray-200"
          title="編集"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-l border-gray-200 disabled:opacity-50"
          title="削除"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
