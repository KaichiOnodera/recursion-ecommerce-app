import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getAdminItems, deleteItem } from '../../services/api/items';
import { Item } from '@shared/schemas/item';

export const AdminProductDelete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        return;
      }

      // 商品一覧から対象のIDの商品を格納
      const response = await getAdminItems();
      const foundItem = response.items.find((i) => i.id === parseInt(id));

      if (foundItem) {
        setItem(foundItem);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !item) return;

    setDeleting(true);

    try {
      await deleteItem(parseInt(id));
      navigate('/admin/products');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = (): void => {
    navigate('/admin/products');
  };

  if (!item) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-6">商品削除</h1>

        <div className="mb-6">
          <p className="text-lg text-gray-700 mb-4">以下の商品を削除します</p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="mb-2">
              <span className="font-semibold text-gray-700">商品ID:</span>
              <span className="ml-2 text-gray-900">{item.id}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">商品名:</span>
              <span className="ml-2 text-gray-900">{item.name}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">説明:</span>
              <span className="ml-2 text-gray-900">{item.description}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">商品タイプ:</span>
              <span className="ml-2 text-gray-900">{item.type}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {deleting ? '削除中' : '削除する'}
          </button>
          <button
            onClick={handleCancel}
            disabled={deleting}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};
