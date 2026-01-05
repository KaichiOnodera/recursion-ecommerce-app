import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { OrderItem } from './OrderItem';
import { ORDER_HISTORY_PREVIEW_LIMIT } from '../../constants/order';
import { useOrderHistory } from '../../hooks/useOrderHistory';

interface OrderHistoryPreviewProps {
  onTotalCountChange?: (total: number) => void;
}

export const OrderHistoryPreview: React.FC<OrderHistoryPreviewProps> = ({
  onTotalCountChange,
}) => {
  const { orders: allOrders, loading, error, totalCount } = useOrderHistory();
  const onTotalCountChangeRef = useRef(onTotalCountChange);

  // 最新N件のみ取得
  const previewOrders = allOrders.slice(0, ORDER_HISTORY_PREVIEW_LIMIT);

  // 親コンポーネントに全件数を通知
  useEffect(() => {
    onTotalCountChangeRef.current = onTotalCountChange;
  }, [onTotalCountChange]);

  useEffect(() => {
    if (onTotalCountChangeRef.current) {
      onTotalCountChangeRef.current(totalCount);
    }
  }, [totalCount]);

  if (loading) {
    return <div className="text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (previewOrders.length === 0) {
    return <div className="text-gray-500">購入履歴がありません</div>;
  }

  const hasMoreOrders = totalCount > ORDER_HISTORY_PREVIEW_LIMIT;
  const isLastItem = (index: number) =>
    index === previewOrders.length - 1 && hasMoreOrders;

  return (
    <div className="relative">
      <div className="space-y-3">
        {previewOrders.map((order, index) => (
          <div key={order.id} className={isLastItem(index) ? 'opacity-60' : ''}>
            <OrderItem order={order} />
          </div>
        ))}
      </div>
      {hasMoreOrders && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
          <Link
            to="/orders"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            他 {totalCount - ORDER_HISTORY_PREVIEW_LIMIT} 件の購入履歴があります
          </Link>
        </div>
      )}
    </div>
  );
};
