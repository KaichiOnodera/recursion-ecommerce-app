import React, { useMemo } from 'react';
import { GetRes } from '@shared/types/gets';

type Order = GetRes['/orders']['orders'][0];

interface OrderItemProps {
  order: Order;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: '処理中',
  COMPLETED: '完了',
  SHIPPED: '発送済み',
  CANCELLED: 'キャンセル',
} as const;

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
} as const;

const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status] || status;
};

const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

export const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const { formattedDate, formattedTime, totalItems } = useMemo(() => {
    const orderDate = new Date(order.createdAt);
    return {
      formattedDate: orderDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      formattedTime: orderDate.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      totalItems: order.items.reduce((sum, item) => sum + item.amount, 0),
    };
  }, [order.createdAt, order.items]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer">
      <div className="flex justify-between items-center mb-3">
        <div className="space-y-0.5">
          <div className="text-sm text-gray-500">{formattedDate}</div>
          <div className="text-xs text-gray-400">{formattedTime}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900 mb-1">
            ¥{order.totalPrice.toLocaleString()}
          </div>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              order.orderStatus,
            )}`}
          >
            {getStatusLabel(order.orderStatus)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm">
        <div className="flex items-center text-gray-600">
          <span className="text-gray-400 mr-2">商品数:</span>
          <span className="font-medium">{totalItems}点</span>
        </div>
        <div className="flex items-center text-gray-600 max-w-[60%]">
          <span className="text-gray-400 mr-2 shrink-0">配送先:</span>
          <span className="font-medium truncate">{order.address}</span>
        </div>
      </div>
    </div>
  );
};
