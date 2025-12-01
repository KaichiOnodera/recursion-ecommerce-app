import React from 'react';
import { useNavigate } from 'react-router';
import { Item } from '@shared/schemas/item';

interface ProductCardProps {
  item: Item;
  isAdmin?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, isAdmin = false }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border duration-200 rounded-lg">
      {/* 商品画像 */}
      <div className="bg-green-100 h-48 items-center">
        <span>画像</span>
      </div>

      {/* 商品情報 */}
      <div className="p-4">
        <h2>{item.name}</h2>
        <p> {item.description} </p>
        <p> {item.price} </p>

        {/* 管理者用の編集ボタン */}
        {isAdmin && (
          <div className="mt-4">
            <button
              onClick={() => navigate(`/admin/products/${item.id}/edit`)}
              className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
            >
              編集
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
