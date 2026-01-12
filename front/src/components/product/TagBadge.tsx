import React from 'react';
import { Tag } from '@shared/schemas/tag';

interface TagBadgeProps {
  tag: Tag;
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 transition-all duration-200 hover:bg-gray-100 hover:border-gray-300 ${className}`}
    >
      {tag.name}
    </span>
  );
};

interface TagBadgeListProps {
  tags?: Tag[];
  className?: string;
}

export const TagBadgeList: React.FC<TagBadgeListProps> = ({
  tags,
  className = '',
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
    </div>
  );
};
