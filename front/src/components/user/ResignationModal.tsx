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
      setError(err.message || '退会処理に失敗しました');
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
            <h2 className="text-2xl font-bold text-gray-900">退会の確認</h2>
          </div>

          {/* 警告メッセージ */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              退会すると、以下の情報がすべて削除され、復元できません：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4 ml-4">
              <li>アカウント情報</li>
              <li>購入履歴</li>
              <li>カート情報</li>
              <li>その他のすべてのデータ</li>
            </ul>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium text-sm">
                この操作は取り消せません。本当に退会しますか？
              </p>
            </div>
          </div>

          {/* 確認チェックボックス */}
          <div className="mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                disabled={isLoading}
                className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50"
              />
              <span className="text-gray-700 text-sm">
                上記の内容を理解し、退会することを確認しました
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
              {isLoading ? '処理中...' : '退会する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
