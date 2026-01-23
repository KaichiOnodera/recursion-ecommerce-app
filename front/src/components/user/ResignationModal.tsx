import React, { useState } from 'react';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface ResignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ResignationModal: React.FC<ResignationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!isConfirmed) return;

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm();
    } catch (err: any) {
      setError(
        err.message ||
          '退会できませんでした。しばらく時間をおいて再度お試しください。',
      );
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setIsConfirmed(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* モーダル */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* 閉じるボタン */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* アイコンとタイトル */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">退会しますか？</h2>
          </div>

          {/* 警告メッセージ */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              退会すると、以下の情報はすべて削除され、元に戻すことはできません：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4 ml-4">
              <li>あなたのアカウント情報</li>
              <li>これまでの購入履歴</li>
              <li>お気に入り商品</li>
              <li>カートに入れた商品</li>
            </ul>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium text-sm">
                この操作は取り消せません。本当に退会してよろしいですか？
              </p>
            </div>
          </div>

          {/* 確認チェックボックス */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50 flex-shrink-0"
              />
              <span className="text-gray-700 text-sm">
                上記の内容を理解しました
              </span>
            </label>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* ボタン */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isConfirmed || isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? '退会しています...' : '退会する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
