import React from 'react';
import { useNavigate } from 'react-router';
import { Wishlist } from '@shared/schemas/wishlist';
import {
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  GlobeAltIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { ShareWishlistButton } from './ShareWishlistButton';

interface WishlistCardProps {
  wishlist: Wishlist;
  onEdit: (wishlist: Wishlist) => void;
  onDelete: (wishlist: Wishlist) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  wishlist,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleDetailClick = (): void => {
    navigate(`/wishlist/${wishlist.id}`);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onEdit(wishlist);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onDelete(wishlist);
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {wishlist.name || '無題のウィッシュリスト'}
              </h3>
              <div className="flex items-center gap-2">
                {wishlist.isPublic ? (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    <GlobeAltIcon className="w-3 h-3" />
                    公開
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    <LockClosedIcon className="w-3 h-3" />
                    非公開
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(wishlist.updatedAt).toLocaleDateString('ja-JP')} 更新
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <ShareWishlistButton
              wishlistId={wishlist.id}
              wishlistName={wishlist.name}
              isPublic={wishlist.isPublic}
            />
            <button
              onClick={handleDetailClick}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="詳細を見る"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleEditClick}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="編集"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="削除"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
