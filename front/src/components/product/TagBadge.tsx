import React from 'react';
import { Tag } from '@shared/schemas/tag';

interface TagBadgeProps {
  tag: Tag;
  className?: string;
  onClick?: (tagId: number) => void;
  isClickable?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  className = '',
  onClick,
  isClickable = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>): void => {
    if (onClick && isClickable) {
      e.stopPropagation(); // イベントの伝播を止める
      onClick(tag.id);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 transition-all duration-200 hover:bg-gray-100 hover:border-gray-300 ${
        isClickable && onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {tag.name}
    </span>
  );
};

interface TagBadgeListProps {
  tags?: Tag[];
  className?: string;
  onTagClick?: (tagId: number) => void;
  isClickable?: boolean;
}

export const TagBadgeList: React.FC<TagBadgeListProps> = ({
  tags,
  className = '',
  onTagClick,
  isClickable = false,
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <TagBadge
          key={tag.id}
          tag={tag}
          onClick={onTagClick}
          isClickable={isClickable}
        />
      ))}
    </div>
  );
};
