/* eslint-env browser */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getAdminItem, updateItem } from '../../services/api/items';
import { ItemImage } from '@shared/schemas/item';
import { useImageUpload } from '../../hooks/useImageUpload';
import { ExistingImageList } from '../../components/admin/ExistingImageList';
import { NewImageUpload } from '../../components/admin/NewImageUpload';

export const AdminProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [inventoryAmount, setInventoryAmount] = useState<number>(0);
  const [displayStatus, setDisplayStatus] = useState<'public' | 'private'>(
    'private',
  );
  const [existingImages, setExistingImages] = useState<ItemImage[]>([]);
  const [orderedImageIds, setOrderedImageIds] = useState<
    Array<{ imageId: number; isDeleted: boolean }>
  >([]);
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

      if (!response.item) {
        navigate('/admin/products');
        return;
      }

      setName(item.name);
      setDescription(item.description);
      setType(item.type);
      setPrice(item.price);
      setDisplayStatus(item.displayStatus);
      const images = item.images || [];
      setExistingImages(images);
      setOrderedImageIds(
        images.map((img) => ({ imageId: img.id, isDeleted: false })),
      );
      setInventoryAmount(response.item.inventoryAmount);
    };

    fetchItem();
  }, [id, navigate]);

  const handleDeleteExistingImage = (imageId: number) => {
    setOrderedImageIds((prev) =>
      prev.map((item) =>
        item.imageId === imageId ? { ...item, isDeleted: true } : item,
      ),
    );
  };

  const handleRestoreImage = (imageId: number) => {
    setOrderedImageIds((prev) =>
      prev.map((item) =>
        item.imageId === imageId ? { ...item, isDeleted: false } : item,
      ),
    );
  };

  const handleMoveImage = (imageId: number, direction: 'up' | 'down') => {
    setOrderedImageIds((prev) => {
      const currentIndex = prev.findIndex(
        (item) => item.imageId === imageId && !item.isDeleted,
      );
      if (currentIndex === -1) return prev;

      const step = direction === 'up' ? -1 : 1;
      let targetIndex = currentIndex + step;

      while (
        targetIndex >= 0 &&
        targetIndex < prev.length &&
        prev[targetIndex].isDeleted
      ) {
        targetIndex += step;
      }

      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const newOrder = [...prev];
      [newOrder[currentIndex], newOrder[targetIndex]] = [
        newOrder[targetIndex],
        newOrder[currentIndex],
      ];
      return newOrder;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      return;
    }

    setIsSubmitting(true);

    try {
      const activeImageIds = orderedImageIds
        .filter((item) => !item.isDeleted)
        .map((item) => item.imageId);

      await updateItem(
        parseInt(id),
        {
          name,
          description,
          type,
          price,
          inventoryAmount,
          displayStatus,
        },
        selectedImages.length > 0 ? selectedImages : undefined,
        activeImageIds.length > 0 ? activeImageIds : undefined,
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

          {/* 在庫数 */}
          <div>
            <label className="block mb-2 font-medium">在庫数</label>
            <input
              type="number"
              value={inventoryAmount}
              onChange={(e) => setInventoryAmount(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="1"
              placeholder="在庫数を入力してください"
            />
            <p className="mt-1 text-sm text-gray-500">在庫数の入力</p>
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
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-700 mb-2">
                画像にマウスを合わせると、左右の矢印ボタンで並び替え、×ボタンで削除ができます
              </p>
              <p className="text-sm text-gray-700">
                新規追加する画像は、既存画像の一番最後に追加されます
              </p>
            </div>

            <ExistingImageList
              existingImages={existingImages}
              orderedImageIds={orderedImageIds}
              onMoveImage={handleMoveImage}
              onDeleteImage={handleDeleteExistingImage}
              onRestoreImage={handleRestoreImage}
            />

            <NewImageUpload
              fileInputRef={fileInputRef}
              onImageSelect={handleImageSelect}
              imagePreviews={imagePreviews}
              onRemoveImage={handleRemoveImage}
              maxImages={MAX_IMAGES}
            />
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
