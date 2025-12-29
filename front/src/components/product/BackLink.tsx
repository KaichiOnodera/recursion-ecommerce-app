import React from 'react';
import { Link } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const BackLink: React.FC = () => (
  <div className="mb-8">
    <Link
      to="/products"
      className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
    >
      <ArrowLeftIcon className="w-5 h-5 mr-2" />
      <span className="text-sm font-medium">商品一覧に戻る</span>
    </Link>
  </div>
);
