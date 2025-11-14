import axios from 'axios';
import { Item } from '@shared/schemas/item';
import { DeleteRes } from '@shared/types/delete';
import { API_BASE_URL } from './config';

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
