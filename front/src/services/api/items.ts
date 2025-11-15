import axios from 'axios';
import { Item } from '@shared/schemas/item';
import { DeleteRes } from '@shared/types/delete';
import { API_BASE_URL } from './config';
import { PostReq, PostRes } from '@shared/types/posts';
import { PatchReq, PatchRes } from '@shared/types/patches';

export interface ItemsResponse {
  items: Item[];
}

export class ItemsApiService {
  static async getItems(): Promise<ItemsResponse> {
    const response = await fetch(`${API_BASE_URL}/items`);

    return await response.json();
  }

  static async getAdminItems(): Promise<ItemsResponse> {
    const response = await axios.get<ItemsResponse>(
      `${API_BASE_URL}/admin/items`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  }

  static async createItem(
    data: PostReq['admin/items'],
  ): Promise<PostRes['admin/items']> {
    const response = await axios.post<PostRes['admin/items']>(
      `${API_BASE_URL}/admin/items`,
      data,
      {
        withCredentials: true,
      },
    );

    return response.data;
  }

  static async updateItem(
    id: number,
    data: PatchReq['admin/items/:id'],
  ): Promise<PatchRes['admin/items/:id']> {
    const response = await axios.patch<PatchRes['admin/items/:id']>(
      `${API_BASE_URL}/admin/items/${id}`,
      data,
      { withCredentials: true },
    );
    return response.data;
  }

  static async deleteItem(id: number): Promise<DeleteRes['admin/items/:id']> {
    const response = await axios.delete<DeleteRes['admin/items/:id']>(
      `${API_BASE_URL}/admin/items/${id}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  }
}
