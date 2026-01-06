import React, { useState, useEffect } from 'react';
import {
  getOrdersNeedingShipping,
  updateOrderTracking,
} from '../../services/api/orders';
import { GetRes } from '@shared/types/gets';

type Order = GetRes['/admin/orders/shipping-needed']['orders'][0];

export const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await getOrdersNeedingShipping();
        setOrders(response.orders);
        setError(null);
      } catch (err) {
        setError('注文の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleShipOrder = async (orderId: number): Promise<void> => {
    if (!trackingNumber.trim()) {
      alert('追跡番号を入力してください');
      return;
    }

    try {
      setUpdating(true);
      await updateOrderTracking(orderId, trackingNumber.trim());
      // 注文リストを再取得
      const response = await getOrdersNeedingShipping();
      setOrders(response.orders);
      setEditingOrderId(null);
      setTrackingNumber('');
      alert('追跡番号を登録しました');
    } catch (err) {
      alert(
        err instanceof Error ? err.message : '追跡番号の登録に失敗しました',
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">配送管理</h1>
        <p className="text-sm text-gray-600">
          配送が必要な注文のみ表示されます
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-center">
            配送が必要な注文はありません
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">注文ID: {order.id}</h2>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">お名前:</span>{' '}
                      {order.lastName} {order.firstName}
                    </p>
                    <p>
                      <span className="font-medium">メールアドレス:</span>{' '}
                      {order.email}
                    </p>
                    <p>
                      <span className="font-medium">配送先:</span>{' '}
                      {order.address}
                    </p>
                    <p>
                      <span className="font-medium">注文日時:</span>{' '}
                      {new Date(order.createdAt).toLocaleString('ja-JP')}
                    </p>
                    <p>
                      <span className="font-medium">合計金額:</span> ¥
                      {order.totalPrice.toLocaleString()}
                    </p>
                    {order.trackingNumber && (
                      <p>
                        <span className="font-medium">追跡番号:</span>{' '}
                        {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.orderStatus === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : order.orderStatus === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.orderStatus === 'COMPLETED'
                      ? '配送待ち'
                      : order.orderStatus === 'SHIPPED'
                        ? '発送済み'
                        : order.orderStatus}
                  </span>
                  {order.orderStatus === 'COMPLETED' && (
                    <div>
                      {editingOrderId === order.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="追跡番号"
                            className="border rounded px-3 py-2 text-sm w-48"
                            disabled={updating}
                          />
                          <button
                            onClick={() => handleShipOrder(order.id)}
                            disabled={updating}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {updating ? '処理中...' : '発送'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingOrderId(null);
                              setTrackingNumber('');
                            }}
                            disabled={updating}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingOrderId(order.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                        >
                          発送処理
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">注文商品:</h3>
                <ul className="space-y-2">
                  {order.items.map((item: Order['items'][0]) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>
                        {item.itemName} × {item.amount}
                      </span>
                      <span className="text-gray-600">
                        ¥{(item.itemPrice * item.amount).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
