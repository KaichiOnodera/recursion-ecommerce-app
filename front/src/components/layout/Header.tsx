import React from 'react';
import { HeaderProps } from '../../types';
import { FaShoppingCart, FaSearch, FaHeart, FaUser } from 'react-icons/fa';

const Header: React.FC<HeaderProps> = ({
  logo = 'ECサイト',
  navigationItems = [
    { label: 'ホーム', href: '/' },
    { label: '商品', href: '/products' },
    { label: 'ログイン', href: '/login' },
    { label: '新規登録', href: '/register' },
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
          </nav>

          {/* アイコン */}
          <div className="flex items-center space-x-4">
            {/* 検索アイコン */}
            <button className="p-2 text-gray-700">
              <FaSearch className="w-5 h-5" />
            </button>
            {/* ウィッシュリストアイコン */}
            <button className="p-2 text-gray-700">
              <FaHeart className="w-5 h-5" />
            </button>
            {/* ユーザーアイコン */}
            <button className="p-2 text-gray-700">
              <FaUser className="w-5 h-5" />
            </button>
            {/* カートアイコン */}
            <button className="p-2 text-gray-700">
              <FaShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
