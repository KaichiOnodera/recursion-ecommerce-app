import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import ProductCard from '../components/ui/ProductCard';
import { Item } from '@shared/schemas/item';
import { getItems, searchItems } from '../services/api/items';
import { TagFilter } from '../components/product/TagFilter';

export const ProductList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  // URLパラメータから選択されたタグIDを読み込む
  useEffect(() => {
    const tagIdsParam = searchParams.get('tagIds');
    if (tagIdsParam) {
      const tagIds = tagIdsParam
        .split(',')
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
      setSelectedTagIds(tagIds);
    } else {
      setSelectedTagIds([]);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchItems = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const params: {
          q?: string;
          tagIds?: number[];
        } = {};

        if (searchQuery && searchQuery.trim()) {
          params.q = searchQuery.trim();
        }

        if (selectedTagIds.length > 0) {
          params.tagIds = selectedTagIds;
        }

        if (params.q || params.tagIds) {
          const response = await searchItems(params);
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
  }, [searchQuery, selectedTagIds]);

  const handleTagToggle = (tagId: number): void => {
    const newSelectedTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    setSelectedTagIds(newSelectedTagIds);

    // URLパラメータを更新
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSelectedTagIds.length > 0) {
      newSearchParams.set('tagIds', newSelectedTagIds.join(','));
    } else {
      newSearchParams.delete('tagIds');
    }
    setSearchParams(newSearchParams);
  };

  const handleClearAll = (): void => {
    setSelectedTagIds([]);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('tagIds');
    setSearchParams(newSearchParams);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12">
      <h1 className="text-3xl font-bold mb-6">
        {searchQuery ? `「${searchQuery}」の検索結果` : '全ての商品'}
      </h1>

      {/* サイドバー型レイアウト */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* サイドバー: タグフィルター（デスクトップのみ表示） */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-8">
            <TagFilter
              selectedTagIds={selectedTagIds}
              onTagToggle={handleTagToggle}
              onClearAll={handleClearAll}
              resultCount={items.length}
            />
          </div>
        </aside>

        {/* メインコンテンツ: 商品一覧 */}
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="text-center py-8">読み込み中...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery || selectedTagIds.length > 0
                ? '検索結果が見つかりませんでした'
                : '商品がありません'}
            </div>
          ) : (
            <>
              {/* 商品数表示 */}
              <div className="mb-4 text-sm text-gray-600">
                {items.length}件の商品が見つかりました
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-fr">
                {items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
