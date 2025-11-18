import React from 'react';
import { Link } from 'react-router';
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
            <Link to="/">
              <h1 className="text-xl font-bold text-gray-900">{logo}</h1>
            </Link>
          </div>

          {/* ナビゲーション */}
          <nav className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-700 hover:text-gray-900"
              >
                {item.label}
              </Link>
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
