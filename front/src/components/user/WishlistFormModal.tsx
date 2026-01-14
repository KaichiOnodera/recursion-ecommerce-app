import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Wishlist } from '@shared/schemas/wishlist';

interface WishlistFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string | null, isPublic: boolean) => Promise<void>;
  wishlist?: Wishlist | null;
}

export const WishlistFormModal: React.FC<WishlistFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  wishlist,
}) => {
  const [name, setName] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wishlist) {
      setName(wishlist.name || '');
      setIsPublic(wishlist.isPublic);
    } else {
      setName('');
      setIsPublic(false);
    }
    setError(null);
  }, [wishlist, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(name.trim() || null, isPublic);
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'ウィッシュリストの保存に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        wishlist ? 'ウィッシュリストを編集' : '新しいウィッシュリストを作成'
      }
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            名前（任意）
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例: 誕生日プレゼントリスト"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              公開する（他のユーザーも閲覧可能）
            </span>
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '保存中...' : wishlist ? '更新' : '作成'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
