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
    const loggedIn = isLoggedIn();

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate('/products');
      }
    };

    // ログイン状態に応じたナビゲーションアイテムをフィルタリング
    const filteredNavigationItems = navigationItems.filter((item) => {
      // ログイン状態の場合はログイン/新規登録を非表示
      if (loggedIn) {
        return (
          item.href !== '/auth/user/login' && item.href !== '/auth/user/signup'
        );
      }
      // ゲスト状態の場合は全て表示
      return true;
    });

    // 共通スタイル定義
    const navLinkBaseStyles =
      'relative inline-block text-gray-700 hover:text-gray-900 transition-all duration-200 whitespace-nowrap';
    const navLinkHoverStyles =
      'hover:[text-shadow:0.15px_0_0_currentColor,0_0.15px_0_currentColor,-0.15px_0_0_currentColor,0_-0.15px_0_currentColor]';
    const navLinkUnderlineStyles =
      'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 after:transition-all after:duration-300 hover:after:w-full';
    const navLinkClassName = `${navLinkBaseStyles} ${navLinkHoverStyles} ${navLinkUnderlineStyles}`;

    const iconBaseStyles =
      'p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 hover:scale-110 active:scale-95';
    const iconClassName = 'w-5 h-5 transition-transform duration-200';

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
            <nav className="flex items-center">
              {filteredNavigationItems.map((item, index) => (
                <React.Fragment key={item.href}>
                  {index > 0 && (
                    <span
                      className="h-4 w-px bg-gray-300 mx-3"
                      aria-hidden="true"
                    />
                  )}
                  <Link to={item.href} className={navLinkClassName}>
                    {item.label}
                  </Link>
                </React.Fragment>
              ))}
              {/* ログイン状態の場合のみログアウトボタンを表示 */}
              {loggedIn && (
                <>
                  {filteredNavigationItems.length > 0 && (
                    <span
                      className="h-4 w-px bg-gray-300 mx-3"
                      aria-hidden="true"
                    />
                  )}
                  <LogoutButton
                    className={`${navLinkClassName} cursor-pointer`}
                  />
                </>
              )}
            </nav>

            {/* アイコン */}
            <div className="flex items-center space-x-4">
              {/* お気に入りアイコン（ログイン状態の場合のみ表示） */}
              {loggedIn && (
                <button
                  onClick={() => navigate('/favorites')}
                  className={iconBaseStyles}
                  aria-label="お気に入り"
                >
                  <HeartIcon className={iconClassName} />
                </button>
              )}
              {/* ユーザーアイコン */}
              <Link to="/mypage" className={iconBaseStyles}>
                <UserIcon className={iconClassName} />
              </Link>
              {/* カートアイコン */}
              <Link to="/cart" className={`relative ${iconBaseStyles}`}>
                <ShoppingCartIcon className={iconClassName} />
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
