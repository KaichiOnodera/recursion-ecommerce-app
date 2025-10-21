import { Item } from '@shared/schemas/item';

const API_BASE_URL = 'http://localhost:8000';

export interface ItemsResponse {
  items: Item[];
}

export class ItemsApiService {
  static async getItems(): Promise<ItemsResponse> {
    const response = await fetch(`${API_BASE_URL}/items`);

    return await response.json();
  }
}
