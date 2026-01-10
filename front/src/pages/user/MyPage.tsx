import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useUser } from '../../contexts/UserContext';
import {
  CubeIcon,
  ClipboardDocumentListIcon,
  ChevronRightIcon,
  LockClosedIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { OrderHistoryPreview } from '../../components/user/OrderHistoryPreview';
import { FavoritesPreview } from '../../components/user/FavoritesPreview';
import { ORDER_HISTORY_PREVIEW_LIMIT } from '../../constants/order';
import { ResignationModal } from '../../components/user/ResignationModal';
import { resign } from '../../services/api/users';
import { logout } from '../../services/api/auth';

export const MyPage: React.FC = () => {
  const { user, isAdmin, clearUser, isLoggedIn } = useUser();
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [isResignationModalOpen, setIsResignationModalOpen] = useState(false);
  const navigate = useNavigate();

  if (!isLoggedIn()) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-4">
              <LockClosedIcon className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            マイページにアクセスするには
            <br />
            ログインが必要です
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            ログインすると、購入履歴やお気に入り商品を確認できます
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/user/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              ログイン
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/auth/user/signup"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              新規登録
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      {/* お気に入りセクション */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">お気に入り</h2>
        </div>
        <FavoritesPreview />
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

      {/* アカウント設定セクション */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">アカウント設定</h2>
        <div className="flex flex-col space-y-3 mb-6">
          <button
            onClick={() => {
              // ハリボテ実装: 将来的にプロフィール編集モーダルを表示
              alert('プロフィール編集機能は準備中です');
            }}
            className="self-start flex items-center space-x-2 py-2 text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <UserIcon className="w-5 h-5 text-gray-500" />
            <span>プロフィールを編集</span>
          </button>
          <button
            onClick={() => {
              // ハリボテ実装: 将来的にメールアドレス変更モーダルを表示
              alert('メールアドレス変更機能は準備中です');
            }}
            className="self-start flex items-center space-x-2 py-2 text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <EnvelopeIcon className="w-5 h-5 text-gray-500" />
            <span>メールアドレスを変更</span>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-red-200 pt-6 mt-6">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-red-600">
                アカウントの削除
              </h3>
            </div>
            <p className="text-gray-600 text-sm ml-7">
              アカウントを削除すると、すべてのデータが永久に削除され、復元できません。
            </p>
          </div>
          <button
            onClick={() => setIsResignationModalOpen(true)}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm whitespace-nowrap"
          >
            退会する
          </button>
        </div>
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
