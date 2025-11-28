import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Item } from '@shared/schemas/item';
import { getAdminItem } from '../../services/api/items';

export const AdminProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const response = await getAdminItem(parseInt(id));
      setItem(response.item);
    };
    fetchItem();
  }, [id]);

  if (!item)
    return <p className="text-center py-20 text-gray-500">読み込み中...</p>;

  return (
    <div className="min-h-screen bg-blue-100 py-8">
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">商品詳細</h1>
          <button
            onClick={() => navigate(`/admin/products/${item.id}/edit`)}
            className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            編集
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">{item.name}</h2>
        <p className="mb-4 text-gray-700">{item.description}</p>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">タイプ</span>
          <span className="text-sm text-gray-800">{item.type}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">価格</span>
          <span className="text-sm text-gray-800">¥{item.price}</span>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate(`/admin/products/${item.id}/delete`)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            削除
          </button>
          <button
            onClick={() => navigate('/admin/products')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            一覧に戻る
          </button>
        </div>
      </div>
    </div>
  );
};
