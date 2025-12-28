import React from 'react';
import { Link } from 'react-router';
import { useUser } from '../../contexts/UserContext';
import {
  CubeIcon,
  ClipboardDocumentListIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

export const MyPage: React.FC = () => {
  const { user, isAdmin } = useUser();

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
              <span className="font-medium text-blue-600">管理者</span>
            </div>
          )}
        </div>
      </div>

      {/* 購入履歴セクション */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">購入履歴</h2>
        <div className="text-gray-500">準備中</div>
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
          </div>
        </div>
      )}
    </div>
  );
};
