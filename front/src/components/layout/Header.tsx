import React from 'react';
import { HeaderProps } from '../../types';
import { LogoutButton } from '../auth/LogoutButton';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const Header: React.FC<HeaderProps> = ({
  logo = 'ECサイト',
  navigationItems = [
    { label: 'ホーム', href: '/' },
    { label: '商品', href: '/products' },
    { label: 'ログイン', href: '/auth/user/login' },
    { label: '新規登録', href: '/auth/user/signup' },
  ],
}) => {
  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* ロゴ */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">{logo}</h1>
          </div>

          {/* ナビゲーション */}
          <nav className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <a key={item.href} href={item.href} className="text-gray-700">
                {item.label}
              </a>
            ))}
            <LogoutButton className="text-gray-500" />
          </nav>

          {/* アイコン */}
          <div className="flex items-center space-x-4">
            {/* 検索アイコン */}
            <button className="p-2 text-gray-700">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            {/* ウィッシュリストアイコン */}
            <button className="p-2 text-gray-700">
              <HeartIcon className="w-5 h-5" />
            </button>
            {/* ユーザーアイコン */}
            <button className="p-2 text-gray-700">
              <UserIcon className="w-5 h-5" />
            </button>
            {/* カートアイコン */}
            <button className="p-2 text-gray-700">
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
