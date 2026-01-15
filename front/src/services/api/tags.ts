import { apiClient } from './apiClient';
import { PostReq, PostRes } from '@shared/types/posts';
import { PatchReq, PatchRes } from '@shared/types/patches';
import { DeleteRes } from '@shared/types/delete';
import { GetRes } from '@shared/types/gets';

export async function getTags(itemId?: number): Promise<GetRes['/tags']> {
  const queryParams = new URLSearchParams();
  if (itemId !== undefined) {
    queryParams.append('itemId', itemId.toString());
  }

  const queryString = queryParams.toString();
  const url = `/tags${queryString ? `?${queryString}` : ''}`;
  const response = await apiClient.get<GetRes['/tags']>(url);

  return response.data;
}

// 管理者用（認証必須）
export async function getAdminTags(
  itemId?: number,
): Promise<GetRes['/admin/tags']> {
  const queryParams = new URLSearchParams();
  if (itemId !== undefined) {
    queryParams.append('itemId', itemId.toString());
  }

  const queryString = queryParams.toString();
  const url = `/admin/tags${queryString ? `?${queryString}` : ''}`;
  const response = await apiClient.get<GetRes['/admin/tags']>(url);

  return response.data;
}

export async function createTag(
  data: PostReq['/admin/tags'],
): Promise<PostRes['/admin/tags']> {
  const response = await apiClient.post<PostRes['/admin/tags']>(
    '/admin/tags',
    data,
  );

  return response.data;
}

export async function updateTag(
  id: number,
  data: PatchReq['/admin/tags/:id'],
): Promise<PatchRes['/admin/tags/:id']> {
  const response = await apiClient.patch<PatchRes['/admin/tags/:id']>(
    `/admin/tags/${id}`,
    data,
  );

  return response.data;
}

export async function deleteTag(
  id: number,
): Promise<DeleteRes['/admin/tags/:id']> {
  const response = await apiClient.delete<DeleteRes['/admin/tags/:id']>(
    `/admin/tags/${id}`,
  );

  return response.data;
}

export async function getTagUsageCount(
  id: number,
): Promise<GetRes['/admin/tags/:id/usage-count']> {
  const response = await apiClient.get<GetRes['/admin/tags/:id/usage-count']>(
    `/admin/tags/${id}/usage-count`,
  );

  return response.data;
}
