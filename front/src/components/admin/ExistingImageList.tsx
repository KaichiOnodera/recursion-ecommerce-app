import React from 'react';
import { ItemImage } from '@shared/schemas/item';
import { getImageUrl } from '../../utils/imageUrl';
import {
  XMarkIcon,
  ArrowPathIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

interface ImageItem {
  imageId: number;
  isDeleted: boolean;
}

interface ExistingImageListProps {
  existingImages: ItemImage[];
  orderedImageIds: ImageItem[];
  onMoveImage: (imageId: number, direction: 'up' | 'down') => void;
  onDeleteImage: (imageId: number) => void;
  onRestoreImage: (imageId: number) => void;
}

export const ExistingImageList: React.FC<ExistingImageListProps> = ({
  existingImages,
  orderedImageIds,
  onMoveImage,
  onDeleteImage,
  onRestoreImage,
}) => {
  if (existingImages.length === 0) {
    return null;
  }

  const activeItems = orderedImageIds.filter((i) => !i.isDeleted);

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">既存の画像</p>
      <div className="grid grid-cols-4 gap-4">
        {orderedImageIds.map((item, index) => {
          const image = existingImages.find((img) => img.id === item.imageId);
          if (!image) return null;

          const activeIndex = activeItems.findIndex(
            (i) => i.imageId === item.imageId,
          );

          return (
            <div key={image.id} className="relative group cursor-pointer">
              <img
                src={getImageUrl(image.src) || ''}
                alt={`既存画像 ${index + 1}`}
                className={`w-full h-32 object-cover rounded border transition-opacity ${
                  item.isDeleted
                    ? 'opacity-50 grayscale'
                    : 'group-hover:opacity-90'
                }`}
              />
              {!item.isDeleted && (
                <>
                  <button
                    type="button"
                    onClick={() => onMoveImage(item.imageId, 'up')}
                    disabled={activeIndex === 0}
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-green-500/90 backdrop-blur-sm text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-green-600 disabled:opacity-0 disabled:cursor-not-allowed"
                    aria-label="左に移動"
                  >
                    <ChevronUpIcon className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveImage(item.imageId, 'down')}
                    disabled={activeIndex === activeItems.length - 1}
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-green-500/90 backdrop-blur-sm text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-green-600 disabled:opacity-0 disabled:cursor-not-allowed"
                    aria-label="右に移動"
                  >
                    <ChevronDownIcon className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteImage(image.id)}
                    className="absolute top-1 right-1 z-10 bg-red-500/90 backdrop-blur-sm text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                    aria-label="画像を削除"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded">
                    {activeIndex + 1}
                  </div>
                </>
              )}
              {item.isDeleted && (
                <>
                  <button
                    type="button"
                    onClick={() => onRestoreImage(image.id)}
                    className="absolute top-1 right-1 z-10 bg-green-500/90 backdrop-blur-sm text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-green-600"
                    aria-label="画像を復元"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded">
                    削除済
                  </div>
                  <div className="absolute inset-0 z-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                    <span className="text-white text-sm font-bold">
                      削除予定
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
