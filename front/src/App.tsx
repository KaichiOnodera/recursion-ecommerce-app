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
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/auth/user/login" element={<UserLogin />} />
                <Route path="/auth/user/signup" element={<UserSignup />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/user/profile" element={<User />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/favorites" element={<FavoritesList />} />
                <Route path="/auth/admin/login" element={<AdminLogin />} />
                <Route path="/auth/admin/signup" element={<AdminSignup />} />
                <Route
                  path="/admin/products/new"
                  element={<AdminProductCreate />}
                />
                <Route path="/admin/products" element={<AdminProductList />} />
                <Route
                  path="/admin/products/:id/edit"
                  element={<AdminProductEdit />}
                />
                <Route
                  path="/admin/products/:id/delete"
                  element={<AdminProductDelete />}
                />
                <Route path="/admin/orders" element={<AdminAllOrdersList />} />
                <Route
                  path="/admin/orders/shipping"
                  element={<AdminOrderList />}
                />
              </Routes>
              <Routes>
                <Route path="/order/complete" element={<OrderComplete />} />
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
