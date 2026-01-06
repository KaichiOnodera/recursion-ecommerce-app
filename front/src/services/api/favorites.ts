import { apiClient } from './apiClient';
import { GetRes } from '@shared/types/gets';
import { PostReq, PostRes } from '@shared/types/posts';
import { DeleteRes } from '@shared/types/delete';

/**
 * お気に入り一覧を取得
 */
export async function getFavorites(): Promise<GetRes['/favorites']> {
  const response = await apiClient.get<GetRes['/favorites']>('/favorites');
  return response.data;
}

/**
 * お気に入りに追加
 */
export async function addFavorite(
  itemId: number,
): Promise<PostRes['/favorites']> {
  const data: PostReq['/favorites'] = { itemId };
  const response = await apiClient.post<PostRes['/favorites']>(
    '/favorites',
    data,
  );
  return response.data;
}

/**
 * お気に入りから削除
 */
export async function removeFavorite(
  itemId: number,
): Promise<DeleteRes['/favorites/:itemId']> {
  const response = await apiClient.delete<DeleteRes['/favorites/:itemId']>(
    `/favorites/${itemId}`,
  );
  return response.data;
}
