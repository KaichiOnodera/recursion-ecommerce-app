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

// 削除用の関数
export async function deleteCartItem(
  currentItems: Array<{ id: number; amount: number }>,
  itemId: number,
): Promise<PostRes['/cart']> {
  const updatedItems = currentItems.filter((item) => item.id !== itemId);
  return updateCart(updatedItems);
}

// 全削除用の関数
export async function clearCart(): Promise<PostRes['/cart']> {
  return updateCart([]);
}
