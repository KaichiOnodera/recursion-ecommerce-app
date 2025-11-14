import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router';
import './App.css';

// レイアウト関係
import Header from './components/layout/Header';

// ページ関係
import { Home } from './pages/Home';
import { ProductList } from './pages/ProductList';
import { UserLogin } from './pages/auth/UserLogin';
import { UserSignup } from './pages/auth/UserSignup';
import { AdminLogin } from './pages/auth/AdminLogin';
import { AdminSignup } from './pages/auth/AdminSignup';
import { AdminProductList } from './pages/admin/AdminProductList';
import { AdminProductDelete } from './pages/admin/AdminProductDelete';

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <div className="bg-blue-100 min-h-screen">
        <Header />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/auth/user/login" element={<UserLogin />} />
            <Route path="/auth/user/signup" element={<UserSignup />} />
            <Route path="/auth/admin/login" element={<AdminLogin />} />
            <Route path="/auth/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/products" element={<AdminProductList />} />
            <Route
              path="/admin/products/:id/delete"
              element={<AdminProductDelete />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
