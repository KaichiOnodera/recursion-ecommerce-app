import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router';
import './App.css';

import { UserContextProvider } from './contexts/UserContext';
import { CartContextProvider } from './contexts/CartContext';

// レイアウト関係
import Header from './components/layout/Header';
import { FloatingCartIcon } from './components/layout/FloatingCartIcon';

// ページ関係
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { UserLogin } from './pages/auth/UserLogin';
import { UserSignup } from './pages/auth/UserSignup';
import { AdminLogin } from './pages/auth/AdminLogin';
import { AdminSignup } from './pages/auth/AdminSignup';
import { AdminProductList } from './pages/admin/AdminProductList';
import { AdminProductCreate } from './pages/admin/AdminProductCreate';
import { AdminProductEdit } from './pages/admin/AdminProductEdit';
import { AdminProductDelete } from './pages/admin/AdminProductDelete';
import { AdminAllOrdersList } from './pages/admin/AdminAllOrdersList';
import { AdminOrderList } from './pages/admin/AdminOrderList';
import { Cart } from './pages/user/Cart';
import { MyPage } from './pages/user/MyPage';
import { OrderHistory } from './pages/user/OrderHistory';
import { FavoritesList } from './pages/user/FavoritesList';
import { WishlistList } from './pages/user/WishlistList';
import { WishlistDetail } from './pages/user/WishlistDetail';
import { OrderComplete } from './pages/OrderComplete';
import { User } from './pages/auth/UserProfile';

function App(): React.JSX.Element {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom =
          headerRef.current.offsetTop + headerRef.current.offsetHeight;
        setIsHeaderVisible(window.scrollY < headerBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初回チェック

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <UserContextProvider>
      <CartContextProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <Header ref={headerRef} />
            <div className="container mx-auto p-4">
              <Routes>
                {/* 
                  Note: ルートの順序について
                  React Routerは上から順にマッチングを行うため、より具体的なルートを先に定義する必要がある。
                  
                  ルール：
                  1. 固定パス（例: /admin/products/new）はパラメータ付きルート（例: /admin/products/:id）より前に定義
                  2. より具体的なパス（例: /admin/products/:id/edit）は汎用的なパス（例: /admin/products）より前に定義
                  3. 全体として、固定パス → パラメータ付きパス → 汎用パスの順に定義
                  
                  順序を間違えると、意図しないルートにマッチしてしまい、"No routes matched location"の警告が発生します。
                */}
                {/* 特殊ルート */}
                <Route path="/" element={<Navigate to="/products" replace />} />

                {/* ========== 固定パス ========== */}
                <Route path="/products" element={<ProductList />} />
                <Route path="/auth/user/login" element={<UserLogin />} />
                <Route path="/auth/user/signup" element={<UserSignup />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/user/profile" element={<User />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/favorites" element={<FavoritesList />} />
                <Route path="/wishlist" element={<WishlistList />} />
                <Route path="/order/complete" element={<OrderComplete />} />
                <Route path="/auth/admin/login" element={<AdminLogin />} />
                <Route path="/auth/admin/signup" element={<AdminSignup />} />
                <Route
                  path="/admin/products/new"
                  element={<AdminProductCreate />}
                />
                <Route
                  path="/admin/orders/shipping"
                  element={<AdminOrderList />}
                />

                {/* ========== パラメータ付きパス ========== */}
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route
                  path="/wishlist/:wishlistId"
                  element={<WishlistDetail />}
                />
                <Route
                  path="/admin/products/:id/edit"
                  element={<AdminProductEdit />}
                />
                <Route
                  path="/admin/products/:id/delete"
                  element={<AdminProductDelete />}
                />

                {/* ========== 汎用パス ========== */}
                <Route path="/admin/products" element={<AdminProductList />} />
                <Route path="/admin/orders" element={<AdminAllOrdersList />} />
              </Routes>
            </div>
            {!isHeaderVisible && <FloatingCartIcon />}
          </div>
        </BrowserRouter>
      </CartContextProvider>
    </UserContextProvider>
  );
}

export default App;
