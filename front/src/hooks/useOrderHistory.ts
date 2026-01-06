import { useEffect, useState, useCallback } from 'react';
import { getOrders } from '../services/api/orders';
import { sortOrdersByDateDesc } from '../utils/order';
import { GetRes } from '@shared/types/gets';

type Order = GetRes['/orders']['orders'][0];

interface UseOrderHistoryResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

/**
 * 購入履歴を取得するカスタムフック
 */
export const useOrderHistory = (): UseOrderHistoryResult => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      const sortedOrders = sortOrdersByDateDesc(data.orders);
      setTotalCount(sortedOrders.length);
      setOrders(sortedOrders);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '購入履歴の取得に失敗しました';
      setError(errorMessage);
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, totalCount };
};
