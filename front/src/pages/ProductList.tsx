import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import ProductCard from '../components/ui/ProductCard';
import { Item } from '@shared/schemas/item';
import { getItems, searchItems } from '../services/api/items';

export const ProductList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    const fetchItems = async (): Promise<void> => {
      setIsLoading(true);
      try {
        if (searchQuery && searchQuery.trim()) {
          const response = await searchItems({ q: searchQuery.trim() });
          setItems(response.items);
        } else {
          const response = await getItems();
          setItems(response.items);
        }
      } catch (error) {
        console.error('商品の取得に失敗しました:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [searchQuery]);

  return (
    <div className="w-full max-w-[1600px] mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12">
      <h1 className="text-3xl font-bold mb-6">
        {searchQuery ? `「${searchQuery}」の検索結果` : '商品一覧'}
      </h1>
      {isLoading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? '検索結果が見つかりませんでした' : '商品がありません'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-fr">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
