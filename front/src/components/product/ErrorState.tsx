import React from 'react';
import { Link } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { BackLink } from './BackLink';

export const ErrorState: React.FC = () => (
  <div className="container mx-auto py-8 px-4 max-w-6xl">
    <BackLink />
    <div className="text-center py-16 text-gray-500">
      <p className="mb-6 text-lg">商品が見つかりませんでした</p>
      <Link
        to="/products"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">商品一覧に戻る</span>
      </Link>
    </div>
  </div>
);
