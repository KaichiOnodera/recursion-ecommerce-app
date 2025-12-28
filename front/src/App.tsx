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
import { UserLogin } from './pages/auth/UserLogin';
import { UserSignup } from './pages/auth/UserSignup';
import { AdminLogin } from './pages/auth/AdminLogin';
import { AdminSignup } from './pages/auth/AdminSignup';
import { AdminProductList } from './pages/admin/AdminProductList';
import { AdminProductCreate } from './pages/admin/AdminProductCreate';
import { AdminProductEdit } from './pages/admin/AdminProductEdit';
import { AdminProductDelete } from './pages/admin/AdminProductDelete';
import { Cart } from './pages/user/Cart';
import { OrderComplete } from './pages/OrderComplete';

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
          <div className="bg-blue-100 min-h-screen">
            <Header ref={headerRef} />
            <div className="container mx-auto p-4">
              <Routes>
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/auth/user/login" element={<UserLogin />} />
                <Route path="/auth/user/signup" element={<UserSignup />} />
                <Route path="/cart" element={<Cart />} />
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
