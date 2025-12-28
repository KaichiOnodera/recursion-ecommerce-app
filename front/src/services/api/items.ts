import { apiClient } from './apiClient';
import { SearchItemsParams } from '@shared/schemas/item';
import { DeleteRes } from '@shared/types/delete';
import { PostReq, PostRes } from '@shared/types/posts';
import { PatchReq, PatchRes } from '@shared/types/patches';
import { GetRes } from '@shared/types/gets';

// Export InventoryStatus to avoid @shared path alias issues
/* eslint-disable no-redeclare */
export const InventoryStatus = {
  IN_STOCK: 'inStock',
  OUT_OF_STOCK: 'outOfStock',
} as const;

export type InventoryStatus =
  (typeof InventoryStatus)[keyof typeof InventoryStatus];
/* eslint-enable no-redeclare */

export async function getItems(): Promise<GetRes['/items']> {
  const response = await apiClient.get<GetRes['/items']>('/items');

  return response.data;
}

export async function getAdminItems(): Promise<GetRes['/admin/items']> {
  const response = await apiClient.get<GetRes['/admin/items']>('/admin/items');

  return response.data;
}

export async function createItem(
  data: PostReq['/admin/items'],
): Promise<PostRes['/admin/items']> {
  const response = await apiClient.post<PostRes['/admin/items']>(
    '/admin/items',
    data,
  );

  return response.data;
}

export async function updateItem(
  id: number,
  data: PatchReq['/admin/items/:id'],
): Promise<PatchRes['/admin/items/:id']> {
  const response = await apiClient.patch<PatchRes['/admin/items/:id']>(
    `/admin/items/${id}`,
    data,
  );
  return response.data;
}

export async function deleteItem(
  id: number,
): Promise<DeleteRes['/admin/items/:id']> {
  const response = await apiClient.delete<DeleteRes['/admin/items/:id']>(
    `/admin/items/${id}`,
  );

  return response.data;
}

export async function getAdminItem(
  id: number,
): Promise<GetRes['/admin/items/:id']> {
  const response = await apiClient.get<GetRes['/admin/items/:id']>(
    `/admin/items/${id}`,
  );
  return response.data;
}

export async function getItem(id: number): Promise<GetRes['/items/:id']> {
  const response = await apiClient.get<GetRes['/items/:id']>(`/item/${id}`);
  return response.data;
}

export async function searchItems(
  params: SearchItemsParams,
): Promise<GetRes['/items/search']> {
  const queryParams = new URLSearchParams();
  if (params.q) {
    queryParams.append('q', params.q);
  }
  if (params.sort) {
    queryParams.append('sort', params.sort);
  }
  if (params.page) {
    queryParams.append('page', params.page.toString());
  }

  const queryString = queryParams.toString();
  const url = `/items/search${queryString ? `?${queryString}` : ''}`;
  const response = await apiClient.get<GetRes['/items/search']>(url);

  return response.data;
}
