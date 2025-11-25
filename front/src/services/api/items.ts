import { apiClient } from './apiClient';
import { Item } from '@shared/schemas/item';
import { DeleteRes } from '@shared/types/delete';
import { PostReq, PostRes } from '@shared/types/posts';
import { PatchReq, PatchRes } from '@shared/types/patches';

export interface ItemsResponse {
  items: Item[];
}

export async function getItems(): Promise<ItemsResponse> {
  const response = await apiClient.get<ItemsResponse>('/items');

  return response.data;
}

export async function getAdminItems(): Promise<ItemsResponse> {
  const response = await apiClient.get<ItemsResponse>('/admin/items');

  return response.data;
}

export async function createItem(
  data: PostReq['admin/items'],
): Promise<PostRes['admin/items']> {
  const response = await apiClient.post<PostRes['admin/items']>(
    '/admin/items',
    data,
  );

  return response.data;
}

export async function updateItem(
  id: number,
  data: PatchReq['admin/items/:id'],
): Promise<PatchRes['admin/items/:id']> {
  const response = await apiClient.patch<PatchRes['admin/items/:id']>(
    `/admin/items/${id}`,
    data,
  );
  return response.data;
}

export async function deleteItem(
  id: number,
): Promise<DeleteRes['admin/items/:id']> {
  const response = await apiClient.delete<DeleteRes['admin/items/:id']>(
    `/admin/items/${id}`,
  );

  return response.data;
}
