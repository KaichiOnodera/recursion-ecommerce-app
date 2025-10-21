import React from 'react';
import { Item } from '@shared/schemas/item';

interface ProductCardProps {
  item: Item;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
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
        <p>値段</p>
      </div>
    </div>
  );
};

export default ProductCard;
