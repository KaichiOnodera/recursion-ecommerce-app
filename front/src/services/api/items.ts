import axios from 'axios';
import { Item } from '@shared/schemas/item';
import { API_BASE_URL } from './config';
import { PostReq, PostRes } from '@shared/types/posts';

export interface ItemsResponse {
  items: Item[];
}

export class ItemsApiService {
  static async getItems(): Promise<ItemsResponse> {
    const response = await fetch(`${API_BASE_URL}/items`);

    return await response.json();
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
}
