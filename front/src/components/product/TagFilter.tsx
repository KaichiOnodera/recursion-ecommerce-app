import React, { useState, useEffect, useMemo } from 'react';
import { Tag } from '@shared/schemas/tag';
import { getTags } from '../../services/api/tags';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface TagFilterProps {
  selectedTagIds: number[];
  onTagToggle: (tagId: number) => void;
  onClearAll: () => void;
  resultCount?: number;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  selectedTagIds,
  onTagToggle,
  onClearAll,
  resultCount,
}) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        setAllTags(response.tags);
      } catch (error) {
        console.error('タグの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  // 検索フィルタリング
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTags;
    }
    const query = searchQuery.toLowerCase();
    return allTags.filter((tag) => tag.name.toLowerCase().includes(query));
  }, [allTags, searchQuery]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="text-sm text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">タグで絞り込み</h3>
        {selectedTagIds.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
            aria-label="すべてのフィルターをクリア"
          >
            すべてクリア
          </button>
        )}
      </div>

      {/* 検索バー */}
      {allTags.length > 5 && (
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="タグを検索..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* タグリスト */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {filteredTags.length === 0 ? (
          <div className="text-sm text-gray-500 py-4 text-center">
            該当するタグが見つかりませんでした
          </div>
        ) : (
          filteredTags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id);
            return (
              <label
                key={tag.id}
                className={`flex items-center space-x-2 cursor-pointer p-2 rounded transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onTagToggle(tag.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  aria-label={`${tag.name}でフィルター`}
                />
                <span
                  className={`text-sm ${
                    isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {tag.name}
                </span>
              </label>
            );
          })
        )}
      </div>

      {/* 選択状態の表示 */}
      {selectedTagIds.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              選択中:{' '}
              <span className="font-medium">{selectedTagIds.length}</span>個
            </p>
            {resultCount !== undefined && (
              <p className="text-xs text-gray-600">
                該当商品: <span className="font-medium">{resultCount}</span>件
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
