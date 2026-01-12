/* eslint-env browser */
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Tag } from '@shared/schemas/tag';
import {
  getTags,
  createTag,
  deleteTag,
  getTagUsageCount,
} from '../../services/api/tags';
import { DeleteTagModal } from './DeleteTagModal';

interface TagSelectorProps {
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
  disabled?: boolean;
  initialTags?: Tag[]; // 初期タグ情報（商品編集画面などで既に取得済みのタグ）
}

interface SuggestionTag extends Tag {
  isNew?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTagIds,
  onChange,
  disabled = false,
  initialTags = [],
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionTag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [deleteTargetTag, setDeleteTargetTag] = useState<Tag | null>(null);
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const processedInitialTagIdsRef = useRef<string>('');

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

  // initialTagsが渡された場合、allTagsにマージ（重複を避ける）
  useEffect(() => {
    if (initialTags.length === 0) {
      processedInitialTagIdsRef.current = '';
      return;
    }

    // IDリストを文字列化して比較（配列参照の変更を無視）
    const currentTagIds = initialTags
      .map((tag) => tag.id)
      .sort()
      .join(',');
    if (processedInitialTagIdsRef.current === currentTagIds) {
      return; // 既に処理済みの場合は何もしない
    }

    processedInitialTagIdsRef.current = currentTagIds;

    setAllTags((prevTags) => {
      // prevTagsがまだ空の場合、initialTagsを一時的に使用
      if (prevTags.length === 0) {
        return initialTags;
      }

      // prevTagsが既に取得済みの場合、initialTagsに含まれるタグをマージ（重複を避ける）
      const existingIds = new Set(prevTags.map((tag) => tag.id));
      const newTags = initialTags.filter((tag) => !existingIds.has(tag.id));
      if (newTags.length > 0) {
        return [...prevTags, ...newTags];
      }

      return prevTags;
    });
  }, [initialTags]);

  // selectedTagIdsから選択済みタグを取得（useMemoで計算）
  const selectedTags = useMemo(() => {
    // allTagsが空でinitialTagsがある場合は、initialTagsから取得
    const sourceTags = allTags.length > 0 ? allTags : initialTags;
    return sourceTags.filter((tag) => selectedTagIds.includes(tag.id));
  }, [selectedTagIds, allTags, initialTags]);

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
  const handleSelectTag = useCallback(
    async (suggestion: SuggestionTag) => {
      if (suggestion.isNew) {
        // 新規タグを作成
        setIsCreating(true);
        try {
          const response = await createTag({ name: suggestion.name });
          const newTag = response.tag;
          onChange([...selectedTagIds, newTag.id]);
          setAllTags((prevTags) => [...prevTags, newTag]);
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
    },
    [selectedTagIds, onChange],
  );

  // タグを商品から外す（紐付け解除）
  const handleRemoveTag = useCallback(
    (tagId: number) => {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    },
    [selectedTagIds, onChange],
  );

  // タグ削除を開始（確認モーダルを表示）
  const handleDeleteTag = useCallback(async (tag: Tag) => {
    // 使用商品数を取得
    try {
      const response = await getTagUsageCount(tag.id);
      setUsageCount(response.count);
    } catch (error) {
      console.error('Failed to fetch tag usage count:', error);
      setUsageCount(null);
    }

    setDeleteTargetTag(tag);
  }, []);

  // タグ削除を確定
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTargetTag || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteTag(deleteTargetTag.id);

      // 選択済みタグから削除
      onChange(selectedTagIds.filter((id) => id !== deleteTargetTag.id));

      // 全タグリストからも削除
      setAllTags((prevTags) =>
        prevTags.filter((tag) => tag.id !== deleteTargetTag.id),
      );

      // モーダルを閉じる
      setDeleteTargetTag(null);
      setUsageCount(null);
    } catch (error) {
      console.error('Failed to delete tag:', error);
      alert('タグの削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTargetTag, isDeleting, selectedTagIds, onChange]);

  // タグ削除をキャンセル
  const handleCancelDelete = useCallback(() => {
    setDeleteTargetTag(null);
    setUsageCount(null);
  }, []);

  // 入力値が既に選択済みのタグと完全に一致するかチェック（useMemoでメモ化）
  const isInputValueAlreadySelected = useMemo(() => {
    if (!inputValue.trim()) return false;
    const lowerInput = inputValue.trim().toLowerCase();
    return selectedTags.some((tag) => tag.name.toLowerCase() === lowerInput);
  }, [inputValue, selectedTags]);

  // Enterキー処理：サジェスト表示中はフォーム送信を防ぎ、選択中の候補があれば選択
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (e.key === 'Enter') {
        // 入力値が既に選択済みのタグと完全に一致する場合はフォーム送信を防ぐ
        if (isInputValueAlreadySelected) {
          e.preventDefault();
          return;
        }

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
    },
    [
      disabled,
      isInputValueAlreadySelected,
      showSuggestions,
      suggestions,
      focusedIndex,
      handleSelectTag,
    ],
  );

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
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm group transition-all"
            >
              <span className="mr-1">{tag.name}</span>
              {!disabled && (
                <>
                  {/* 紐付け解除ボタン（常時表示） */}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="pt-1 pb-1 pl-1 pr-0 group-hover:pr-1 rounded-full hover:bg-blue-200 hover:text-blue-900 focus:outline-none flex-shrink-0 transition-all duration-200"
                    aria-label={`${tag.name}をこの商品から外す`}
                    title="この商品から外す"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  {/* タグ削除ボタン（ホバー時のみ表示、レイアウトシフトあり） */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTag(tag);
                    }}
                    className="w-0 overflow-hidden opacity-0 p-0 group-hover:w-6 group-hover:opacity-100 group-hover:ml-1 group-hover:p-1 rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none flex-shrink-0 transition-all duration-200 ease-in-out"
                    aria-label={`${tag.name}を削除`}
                    title="タグを削除（すべての商品から外れます）"
                  >
                    <TrashIcon className="w-4 h-4 flex-shrink-0" />
                  </button>
                </>
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
                className={`px-3 py-2 flex items-center justify-between group hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                  index === focusedIndex ? 'bg-gray-100' : ''
                } ${
                  suggestion.isNew
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-900'
                }`}
                role="option"
                aria-selected={index === focusedIndex}
              >
                <div
                  onClick={() => handleSelectTag(suggestion)}
                  className="flex-1 cursor-pointer"
                >
                  {suggestion.isNew ? (
                    <span>&quot;{suggestion.name}&quot;を新規作成</span>
                  ) : (
                    <span>{suggestion.name}</span>
                  )}
                </div>
                {!suggestion.isNew && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTag(suggestion);
                    }}
                    className="ml-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none"
                    aria-label={`${suggestion.name}を削除`}
                    title="タグを削除（すべての商品から外れます）"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-1 text-sm text-gray-500">
        タグ名を入力すると既存タグがサジェストされます。一致するタグがない場合は新規作成できます。
      </p>

      {/* タグ削除確認モーダル */}
      <DeleteTagModal
        isOpen={deleteTargetTag !== null}
        tag={deleteTargetTag}
        usageCount={usageCount}
        isDeleting={isDeleting}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
