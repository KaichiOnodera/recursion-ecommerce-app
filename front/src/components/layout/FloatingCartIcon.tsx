import React from 'react';
import { Link } from 'react-router';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';

export const FloatingCartIcon: React.FC = () => {
  const { totalQuantity } = useCart();

  return (
    <Link
      to="/cart"
      className="fixed bottom-6 right-6 z-50 bg-white rounded-full shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
      aria-label="カートを見る"
    >
      <div className="relative">
        <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
        {totalQuantity > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {totalQuantity}
          </span>
        )}
      </div>
    </Link>
  );
};
