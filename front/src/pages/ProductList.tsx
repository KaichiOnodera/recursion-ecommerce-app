import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { FunnelIcon } from '@heroicons/react/24/outline';
import ProductCard from '../components/ui/ProductCard';
import { Item } from '@shared/schemas/item';
import { getItems, searchItems } from '../services/api/items';
import { TagFilter } from '../components/product/TagFilter';
import { TagFilterModal } from '../components/product/TagFilterModal';

export const ProductList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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

  // タグクリック時の処理（商品カードや商品詳細から呼ばれる）
  const handleTagClick = (tagId: number): void => {
    // 既に選択されている場合は何もしない（またはトグル）
    if (!selectedTagIds.includes(tagId)) {
      const newSelectedTagIds = [...selectedTagIds, tagId];
      setSelectedTagIds(newSelectedTagIds);

      // URLパラメータを更新
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tagIds', newSelectedTagIds.join(','));
      setSearchParams(newSearchParams);
    }
  };

  const handleClearAll = (): void => {
    setSelectedTagIds([]);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('tagIds');
    setSearchParams(newSearchParams);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {searchQuery ? `「${searchQuery}」の検索結果` : '全ての商品'}
        </h1>
        {/* モバイル用フィルターボタン */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors relative"
          aria-label="フィルター"
        >
          <FunnelIcon className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-medium text-gray-700">フィルター</span>
          {selectedTagIds.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {selectedTagIds.length}
            </span>
          )}
        </button>
      </div>

      {/* サイドバー型レイアウト */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* サイドバー: タグフィルター（デスクトップのみ表示） */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
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
                  <ProductCard
                    key={item.id}
                    item={item}
                    onTagClick={handleTagClick}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* モバイル用フィルターモーダル */}
      <TagFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedTagIds={selectedTagIds}
        onTagToggle={handleTagToggle}
        onClearAll={handleClearAll}
        resultCount={items.length}
      />
    </div>
  );
};
