import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import ProductCard from '../../components/ui/ProductCard';
import { AdminItem, DisplayStatus } from '@shared/schemas/item';
import { getAdminItems } from '../../services/api/items';

export const AdminProductList: React.FC = () => {
  const [items, setItems] = useState<AdminItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async (): Promise<void> => {
      const response = await getAdminItems();
      setItems(response.items);
    };

    fetchItems();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">商品管理</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          新規商品作成
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id}>
            <ProductCard item={item} isAdmin={true} />
            {item.displayStatus === DisplayStatus.PRIVATE && (
              <div className="mt-1 text-xs text-red-600 font-bold">非公開</div>
            )}
            <button
              onClick={() => navigate(`/admin/products/${item.id}/delete`)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
