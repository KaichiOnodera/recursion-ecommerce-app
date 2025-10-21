import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { Item } from '@shared/schemas/item';

export const ProductList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async (): Promise<void> => {
      const response = await fetch('http://localhost:8000/items');
      const data = await response.json();
      setItems(data.items);
    };

    fetchItems();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">商品一覧</h1>
      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
