import React from 'react';
import './App.css';
import Header from './components/layout/Header';
import { ProductList } from './pages/ProductList';

function App(): React.JSX.Element {
  return (
    <div className="bg-blue-100 min-h-screen">
      <Header />
      <div className="container mx-auto p-4">
        <ProductList />
      </div>
    </div>
  );
}

export default App;
