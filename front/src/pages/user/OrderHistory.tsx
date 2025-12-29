import React from 'react';
import { Link } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { OrderHistoryList } from '../../components/user/OrderHistoryList';

export const OrderHistory: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/mypage"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">マイページに戻る</span>
        </Link>
        <h1 className="text-3xl font-bold">購入履歴</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <OrderHistoryList />
      </div>
    </div>
  );
};
