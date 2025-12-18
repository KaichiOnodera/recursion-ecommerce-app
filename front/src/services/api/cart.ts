import { apiClient } from './apiClient';
import { GetRes } from '@shared/types/gets';
import { PostReq, PostRes } from '@shared/types/posts';

export async function getCart(): Promise<GetRes['/cart']> {
  const response = await apiClient.get<GetRes['/cart']>('/cart');
  return response.data;
}

export async function updateCart(
  items: PostReq['/cart']['items'],
): Promise<PostRes['/cart']> {
  const response = await apiClient.post<PostRes['/cart']>('/cart', { items });
  return response.data;
}

// 数量変更用の関数
export async function updateCartItem(
  currentItems: Array<{ id: number; amount: number }>,
  itemId: number,
  amount: number,
): Promise<PostRes['/cart']> {
  const updatedItems = currentItems.map((item) =>
    item.id === itemId ? { ...item, amount } : item,
  );
  return updateCart(updatedItems);
}

// カートに商品を追加する関数
export async function addToCart(
  itemId: number,
  amount = 1,
): Promise<PostRes['/cart']> {
  try {
    // 現在のカートを取得（カートが存在しない場合は空配列を返す）
    let currentItems: Array<{ id: number; amount: number }> = [];
    try {
      const currentCart = await getCart();
      currentItems = currentCart.items.map((item) => ({
        id: item.id,
        amount: item.amount,
      }));
    } catch (error) {
      // カートが存在しない場合（404など）は空のカートとして扱う
      console.log('Cart not found, creating new cart');
      currentItems = [];
    }

    // 既にカートにある商品かチェック
    const existingItemIndex = currentItems.findIndex(
      (item) => item.id === itemId,
    );

    if (existingItemIndex >= 0) {
      // 既にある場合は数量を増やす
      currentItems[existingItemIndex].amount += amount;
    } else {
      // 新規追加
      currentItems.push({ id: itemId, amount });
    }

    return updateCart(currentItems);
  } catch (error) {
    console.error('Error in addToCart:', error);
    throw error;
  }
}
