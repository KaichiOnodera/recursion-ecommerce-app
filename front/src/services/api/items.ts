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
}
