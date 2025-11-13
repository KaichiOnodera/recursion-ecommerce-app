import axios from 'axios';
import { Item } from '@shared/schemas/item';
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
}
