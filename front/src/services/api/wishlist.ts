import { apiClient } from './apiClient';
import { GetRes } from '@shared/types/gets';
import { PostReq, PostRes } from '@shared/types/posts';
import { PatchReq, PatchRes } from '@shared/types/patches';
import { DeleteRes } from '@shared/types/delete';

/**
 * ウィッシュリスト一覧を取得
 */
export async function getWishlists(): Promise<GetRes['/wishlist']> {
  const response = await apiClient.get<GetRes['/wishlist']>('/wishlist');
  return response.data;
}

/**
 * ウィッシュリストを作成
 */
export async function createWishlist(
  name?: string | null,
  isPublic?: boolean,
): Promise<PostRes['/wishlist']> {
  const data: PostReq['/wishlist'] = {
    name: name ?? null,
    isPublic: isPublic ?? false,
  };
  const response = await apiClient.post<PostRes['/wishlist']>(
    '/wishlist',
    data,
  );
  return response.data;
}

/**
 * ウィッシュリストを更新
 */
export async function updateWishlist(
  wishlistId: number,
  name?: string | null,
  isPublic?: boolean,
): Promise<PatchRes['/wishlist/:wishlistId']> {
  const data: PatchReq['/wishlist/:wishlistId'] = {};
  if (name !== undefined) {
    data.name = name;
  }
  if (isPublic !== undefined) {
    data.isPublic = isPublic;
  }
  const response = await apiClient.patch<PatchRes['/wishlist/:wishlistId']>(
    `/wishlist/${wishlistId}`,
    data,
  );
  return response.data;
}

/**
 * ウィッシュリストを削除
 */
export async function deleteWishlist(
  wishlistId: number,
): Promise<DeleteRes['/wishlist/:wishlistId']> {
  const response = await apiClient.delete<DeleteRes['/wishlist/:wishlistId']>(
    `/wishlist/${wishlistId}`,
  );
  return response.data;
}
