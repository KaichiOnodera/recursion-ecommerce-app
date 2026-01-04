/* eslint-env browser */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getAdminItem, updateItem } from '../../services/api/items';
import { ItemImage } from '@shared/schemas/item';
import { API_BASE_URL } from '../../services/api/config';
import { useImageUpload } from '../../hooks/useImageUpload';

export const AdminProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [displayStatus, setDisplayStatus] = useState<'public' | 'private'>(
    'private',
  );
  const [existingImages, setExistingImages] = useState<ItemImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    selectedImages,
    imagePreviews,
    fileInputRef,
    handleImageSelect,
    handleRemoveImage,
    MAX_IMAGES,
  } = useImageUpload({ existingImageCount: existingImages.length });

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        navigate('/admin/products');
        return;
      }

      const response = await getAdminItem(parseInt(id));
      const item = response.item;

      if (!item) {
        navigate('/admin/products');
        return;
      }

      setName(item.name);
      setDescription(item.description);
      setType(item.type);
      setPrice(item.price);
      setDisplayStatus(item.displayStatus);
      setExistingImages(item.images || []);
    };

    fetchItem();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateItem(
        parseInt(id),
        {
          name,
          description,
          type,
          price,
          displayStatus,
        },
        selectedImages.length > 0 ? selectedImages : undefined,
      );

      navigate('/admin/products');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">商品編集</h1>

      <div className="bg-gray-slate p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 商品名 */}
          <div>
            <label className="block mb-2 font-medium">商品名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="商品名を入力してください"
            />
          </div>

          {/* 商品説明 */}
          <div>
            <label className="block mb-2 font-medium">商品説明</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              required
              placeholder="商品の説明を入力してください"
            />
          </div>

          {/* 商品タイプ */}
          <div>
            <label className="block mb-2 font-medium">商品タイプ</label>
            <select
              value={type}
              onChange={(e) => setType(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={1}>物理商品</option>
              <option value={2}>デジタル商品</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">商品タイプの選択</p>
          </div>

          {/* 価格 */}
          <div>
            <label className="block mb-2 font-medium">価格</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="1"
              placeholder="価格を円単位で入力してください"
            />
            <p className="mt-1 text-sm text-gray-500">価格の入力</p>
          </div>

          {/* 公開状態 */}
          <div>
            <label className="block mb-2 font-medium">公開状態</label>
            <select
              value={displayStatus}
              onChange={(e) =>
                setDisplayStatus(e.target.value as 'public' | 'private')
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="public">公開</option>
              <option value="private">非公開</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              公開: 一般ユーザーに表示 / 非公開: 管理者のみ表示
            </p>
          </div>

          {/* 商品画像 */}
          <div>
            <label className="block mb-2 font-medium">商品画像</label>

            {/* 既存画像の表示 */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">既存の画像</p>
                <div className="grid grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={image.id} className="relative">
                      <img
                        src={`${API_BASE_URL}${image.src}`}
                        alt={`既存画像 ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {image.order}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 新規画像のアップロード */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              画像は最大{MAX_IMAGES}枚まで選択できます（jpg, jpeg, png, gif,
              webp, svg, avif）
            </p>

            {/* 新規画像のプレビュー */}
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
                        onClick={() => handleRemoveImage(index)}
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
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black rounded-md text-white py-3 px-6 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '更新中' : '商品を更新'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="bg-gray-300 rounded-md text-gray-700 py-3 px-6 hover:bg-gray-400"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
