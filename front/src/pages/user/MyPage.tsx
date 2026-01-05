import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useUser } from '../../contexts/UserContext';
import {
  CubeIcon,
  ClipboardDocumentListIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { OrderHistoryPreview } from '../../components/user/OrderHistoryPreview';
import { ORDER_HISTORY_PREVIEW_LIMIT } from '../../constants/order';
import { ResignationModal } from '../../components/user/ResignationModal';
import { resign } from '../../services/api/users';
import { logout } from '../../services/api/auth';

export const MyPage: React.FC = () => {
  const { user, isAdmin, clearUser } = useUser();
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [isResignationModalOpen, setIsResignationModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">マイページ</h1>

      {/* ユーザー情報セクション */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">ユーザー情報</h2>
        <div className="space-y-2">
          <div>
            <span className="text-gray-600">名前: </span>
            <span className="font-medium">
              {user.lastName || '-'} {user.firstName || '-'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">メールアドレス: </span>
            <span className="font-medium">{user.email || '-'}</span>
          </div>
          {isAdmin() && (
            <div>
              <span className="text-gray-600">権限: </span>
              <span className="font-medium text-gray-900">管理者</span>
            </div>
          )}
        </div>
      </div>

      {/* 購入履歴セクション */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">購入履歴</h2>
          {totalOrderCount > ORDER_HISTORY_PREVIEW_LIMIT && (
            <Link
              to="/orders"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
            >
              すべて表示 →
            </Link>
          )}
        </div>
        <OrderHistoryPreview onTotalCountChange={setTotalOrderCount} />
      </div>

      {/* 管理者セクション */}
      {isAdmin() && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">
            管理者メニュー
          </h2>
          <div className="space-y-1">
            <Link
              to="/admin/products"
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <CubeIcon className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
                <span className="text-gray-900 font-medium">商品管理</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <ClipboardDocumentListIcon className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
                <span className="text-gray-900 font-medium">
                  すべての購入管理
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
            <Link
              to="/admin/orders/shipping"
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <ClipboardDocumentListIcon className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
                <span className="text-gray-900 font-medium">配送管理</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
          </div>
        </div>
      )}

      {/* 退会セクション */}
      <div className="bg-white rounded-lg shadow-md p-6 border-t-2 border-red-100">
        <div className="flex items-start space-x-3 mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              アカウント設定
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              アカウントを削除すると、すべてのデータが永久に削除され、復元できません。
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsResignationModalOpen(true)}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
        >
          アカウントを退会する
        </button>
      </div>

      {/* 退会確認モーダル */}
      <ResignationModal
        isOpen={isResignationModalOpen}
        onClose={() => setIsResignationModalOpen(false)}
        onConfirm={async () => {
          await resign();
          // 退会成功後、ログアウト処理を試みる（失敗しても続行）
          try {
            await logout();
          } catch (error) {
            // ログアウトが失敗しても、退会は完了しているので続行
            console.warn('Logout failed after resignation:', error);
          }
          clearUser();
          navigate('/products');
        }}
      />
    </div>
  );
};
