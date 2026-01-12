/* eslint-env browser */
import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Tag } from '@shared/schemas/tag';
import { getTags, createTag } from '../../services/api/tags';

interface TagSelectorProps {
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
  disabled?: boolean;
}

interface SuggestionTag extends Tag {
  isNew?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTagIds,
  onChange,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionTag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 全タグを取得（初回のみ）
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        setAllTags(response.tags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };
    fetchTags();
  }, []);

  // selectedTagIdsから選択済みタグを取得
  useEffect(() => {
    const tags = allTags.filter((tag) => selectedTagIds.includes(tag.id));
    setSelectedTags(tags);
  }, [selectedTagIds, allTags]);

  // 入力値に基づいてサジェストを更新
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setFocusedIndex(-1);
      return;
    }

    const lowerInput = inputValue.toLowerCase().trim();
    const selectedTagIdsSet = new Set(selectedTagIds);

    // 既存タグから一致するものを検索（選択済みは除外）
    const matchingTags = allTags.filter(
      (tag) =>
        !selectedTagIdsSet.has(tag.id) &&
        tag.name.toLowerCase().includes(lowerInput),
    );

    const newSuggestions: SuggestionTag[] = [];

    // 一致するタグがある場合は追加
    if (matchingTags.length > 0) {
      newSuggestions.push(...matchingTags);
    }

    // 完全一致するタグがない場合、「新規作成」オプションを追加
    const exactMatch = allTags.find(
      (tag) => tag.name.toLowerCase() === lowerInput,
    );
    if (!exactMatch && inputValue.trim().length > 0) {
      newSuggestions.push({
        id: -1, // 仮のID
        name: inputValue.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isNew: true,
      });
    }

    setSuggestions(newSuggestions);
    setFocusedIndex(-1);
  }, [inputValue, allTags, selectedTagIds]);

  // タグを選択（既存タグまたは新規作成）
  const handleSelectTag = async (suggestion: SuggestionTag) => {
    if (suggestion.isNew) {
      // 新規タグを作成
      setIsCreating(true);
      try {
        const response = await createTag({ name: suggestion.name });
        const newTag = response.tag;
        onChange([...selectedTagIds, newTag.id]);
        setAllTags([...allTags, newTag]);
      } catch (error) {
        console.error('Failed to create tag:', error);
        alert('タグの作成に失敗しました');
      } finally {
        setIsCreating(false);
      }
    } else {
      // 既存タグを選択
      onChange([...selectedTagIds, suggestion.id]);
    }

    setInputValue('');
    setShowSuggestions(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  // タグを削除
  const handleRemoveTag = (tagId: number) => {
    onChange(selectedTagIds.filter((id) => id !== tagId));
  };

  // Enterキー処理：サジェスト表示中はフォーム送信を防ぎ、選択中の候補があれば選択
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Enter') {
      // サジェストが表示されている場合
      if (showSuggestions && suggestions.length > 0) {
        e.preventDefault(); // フォーム送信を防ぐ
        // 候補が選択されている場合のみ選択処理
        if (focusedIndex >= 0) {
          handleSelectTag(suggestions[focusedIndex]);
        }
        // focusedIndex < 0 の場合は何もしない（日本語入力の確定として扱う）
      }
      // サジェストが表示されていない場合は、通常通りフォーム送信を許可
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setFocusedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        setShowSuggestions(true);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        setShowSuggestions(true);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedIndex(-1);
      inputRef.current?.blur();
    }
  };

  // 入力フィールド外クリックでサジェストを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="block mb-2 font-medium">タグ</label>

      {/* 選択済みタグバッジ */}
      {selectedTags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag.name}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="hover:text-blue-900 focus:outline-none"
                  aria-label={`${tag.name}を削除`}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* 入力フィールド */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim()) {
              setShowSuggestions(true);
            }
          }}
          disabled={disabled}
          placeholder="タグを入力..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label="タグを入力"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls="tag-suggestions"
        />

        {/* ローディング表示 */}
        {isCreating && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            作成中...
          </div>
        )}

        {/* サジェストドロップダウン */}
        {showSuggestions && suggestions.length > 0 && !disabled && (
          <div
            ref={suggestionsRef}
            id="tag-suggestions"
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id || `new-${index}`}
                onClick={() => handleSelectTag(suggestion)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                  index === focusedIndex ? 'bg-gray-100' : ''
                } ${
                  suggestion.isNew
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-900'
                }`}
                role="option"
                aria-selected={index === focusedIndex}
              >
                {suggestion.isNew ? (
                  <span>&quot;{suggestion.name}&quot;を新規作成</span>
                ) : (
                  <span>{suggestion.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-1 text-sm text-gray-500">
        タグ名を入力すると既存タグがサジェストされます。一致するタグがない場合は新規作成できます。
      </p>
    </div>
  );
};
