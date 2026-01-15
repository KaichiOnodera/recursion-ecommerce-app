import React from 'react';
import { Modal } from '../ui/Modal';
import { TagFilter } from './TagFilter';

interface TagFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTagIds: number[];
  onTagToggle: (tagId: number) => void;
  onClearAll: () => void;
  resultCount?: number;
}

export const TagFilterModal: React.FC<TagFilterModalProps> = ({
  isOpen,
  onClose,
  selectedTagIds,
  onTagToggle,
  onClearAll,
  resultCount,
}) => {
  const handleApply = (): void => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="フィルター"
      closeOnOverlayClick={true}
    >
      <div className="space-y-4">
        <TagFilter
          selectedTagIds={selectedTagIds}
          onTagToggle={onTagToggle}
          onClearAll={onClearAll}
          resultCount={resultCount}
        />
        {/* 適用ボタン */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleApply}
            className="w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors active:scale-95"
          >
            適用
          </button>
        </div>
      </div>
    </Modal>
  );
};
