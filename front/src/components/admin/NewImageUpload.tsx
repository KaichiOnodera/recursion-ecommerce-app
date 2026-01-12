import React, { RefObject } from 'react';

interface NewImageUploadProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviews: string[];
  onRemoveImage: (index: number) => void;
  maxImages: number;
}

export const NewImageUpload: React.FC<NewImageUploadProps> = ({
  fileInputRef,
  onImageSelect,
  imagePreviews,
  onRemoveImage,
  maxImages,
}) => {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onImageSelect}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />
      <p className="mt-1 text-sm text-gray-500">
        画像は最大{maxImages}枚まで選択できます（jpg, jpeg, png, gif, webp, svg,
        avif）
      </p>

      {imagePreviews.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">新規追加する画像</p>
          <div className="grid grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`プレビュー ${index + 1}`}
                  className="w-full h-32 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
                <div className="absolute bottom-1 left-1 bg-blue-500 bg-opacity-50 text-white text-xs px-1 rounded">
                  新規
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
