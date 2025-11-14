import axios from 'axios';
import { Item } from '@shared/schemas/item';
import { API_BASE_URL } from './config';
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
}
