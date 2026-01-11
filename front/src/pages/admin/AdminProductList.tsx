import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import ProductCard from '../../components/ui/ProductCard';
import { DeleteProductModal } from '../../components/admin/DeleteProductModal';
import { AdminItem } from '@shared/schemas/item';
import { getAdminItems, deleteItem } from '../../services/api/items';

export const AdminProductList: React.FC = () => {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async (): Promise<void> => {
      const response = await getAdminItems();
      setItems(response.items);
    };

    fetchItems();
  }, []);

  const handleDeleteClick = (itemId: number): void => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedItem) return;

    await deleteItem(selectedItem.id);
    // 削除成功後、リストから削除
    setItems(items.filter((item) => item.id !== selectedItem.id));
    setDeleteModalOpen(false);
    setSelectedItem(null);
  };

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
          <ProductCard
            key={item.id}
            item={item}
            isAdmin={true}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {/* 削除確認モーダル */}
      {selectedItem && (
        <DeleteProductModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedItem(null);
          }}
          onConfirm={handleDeleteConfirm}
          productName={selectedItem.name}
        />
      )}
    </div>
  );
};
