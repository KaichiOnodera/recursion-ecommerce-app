import React from 'react';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Wishlist } from '@shared/schemas/wishlist';

interface DeleteWishlistModalProps {
  isOpen: boolean;
  wishlist: Wishlist | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteWishlistModal: React.FC<DeleteWishlistModalProps> = ({
  isOpen,
  wishlist,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !wishlist) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* モーダル */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* アイコンとタイトル */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              ウィッシュリストを削除しますか？
            </h2>
          </div>

          {/* 警告メッセージ */}
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              &quot;{wishlist.name || '無題のウィッシュリスト'}
              &quot;を削除しますか？
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium text-sm">
                この操作は取り消せません。ウィッシュリスト内のすべての商品も削除されます。
              </p>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              キャンセル
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? '削除中...' : '削除する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
