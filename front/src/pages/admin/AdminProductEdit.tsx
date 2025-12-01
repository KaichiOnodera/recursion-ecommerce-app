import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getAdminItems, updateItem } from '../../services/api/items';
import { Item } from '@shared/schemas/item';

export const AdminProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        navigate('/admin/products');
        return;
      }

      const response = await getAdminItems();
      const item = response.items.find((i: Item) => i.id === parseInt(id));

      if (!item) {
        navigate('/admin/products');
        return;
      }

      setName(item.name);
      setDescription(item.description);
      setType(item.type);
      setPrice(item.price);
    };

    fetchItem();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateItem(parseInt(id), {
        name,
        description,
        type,
        price,
      });

      navigate('/admin/products');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">商品編集</h1>

      <div className="bg-gray-slate p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 商品名 */}
          <div>
            <label className="block mb-2 font-medium">商品名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="商品名を入力してください"
            />
          </div>

          {/* 商品説明 */}
          <div>
            <label className="block mb-2 font-medium">商品説明</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              required
              placeholder="商品の説明を入力してください"
            />
          </div>

          {/* 商品タイプ */}
          <div>
            <label className="block mb-2 font-medium">商品タイプ</label>
            <select
              value={type}
              onChange={(e) => setType(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={1}>物理商品</option>
              <option value={2}>デジタル商品</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">商品タイプの選択</p>
          </div>

          {/* 価格 */}
          <div>
            <label className="block mb-2 font-medium">価格</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="1"
              placeholder="価格を入力してください"
            />
            <p className="mt-1 text-sm text-gray-500">価格の入力</p>
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black rounded-md text-white py-3 px-6 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '更新中' : '商品を更新'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="bg-gray-300 rounded-md text-gray-700 py-3 px-6 hover:bg-gray-400"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
