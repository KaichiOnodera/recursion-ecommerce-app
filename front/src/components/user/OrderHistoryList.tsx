import React from 'react';
import { OrderItem } from './OrderItem';
import { useOrderHistory } from '../../hooks/useOrderHistory';

export const OrderHistoryList: React.FC = () => {
  const { orders, loading, error } = useOrderHistory();

  if (loading) {
    return <div className="text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-gray-500">購入履歴がありません</div>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
};
