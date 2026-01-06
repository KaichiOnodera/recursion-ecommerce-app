import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { HeaderProps } from '../../types';
import { LogoutButton } from '../auth/LogoutButton';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      logo = 'ECサイト',
      navigationItems = [
        { label: '商品', href: '/products' },
        { label: 'ログイン', href: '/auth/user/login' },
        { label: '新規登録', href: '/auth/user/signup' },
      ],
    },
    ref,
  ) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { totalQuantity } = useCart();
    const { isLoggedIn } = useUser();

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate('/products');
      }
    };

    return (
      <header ref={ref} className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* ロゴ */}
            <div className="flex items-center">
              <Link to="/products">
                <h1 className="text-xl font-bold text-gray-900">{logo}</h1>
              </Link>
            </div>

            {/* 検索窓 */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="商品を検索..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </form>

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
              {/* お気に入りアイコン */}
              <button
                onClick={() => {
                  if (isLoggedIn()) {
                    navigate('/favorites');
                  } else {
                    navigate('/auth/user/login');
                  }
                }}
                className="p-2 text-gray-700 hover:text-gray-900"
                aria-label="お気に入り"
              >
                <HeartIcon className="w-5 h-5" />
              </button>
              {/* ユーザーアイコン */}
              <Link
                to="/mypage"
                className="p-2 text-gray-700 hover:text-gray-900"
              >
                <UserIcon className="w-5 h-5" />
              </Link>
              {/* カートアイコン */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-gray-900"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {totalQuantity > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  },
);

Header.displayName = 'Header';

export default Header;
