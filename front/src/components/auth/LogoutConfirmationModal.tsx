import React, { useState } from 'react';
import {
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const LogoutConfirmationModal: React.FC<
  LogoutConfirmationModalProps
> = ({ isOpen, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onConfirm();
    } catch (err: any) {
      setError(
        err.message ||
          'ログアウトできませんでした。しばらく時間をおいて再度お試しください。',
      );
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
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
              <ArrowRightOnRectangleIcon className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              ログアウトしますか？
            </h2>
          </div>

          {/* メッセージ */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              ログアウトすると、ゲストに切り替わります。
            </p>
            <p className="text-gray-600 text-sm">
              再度ご利用になる場合は、ログイン画面からメールアドレスとパスワードを入力してください。
            </p>
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
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'ログアウトしています...' : 'ログアウト'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
