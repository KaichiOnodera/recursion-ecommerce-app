import axios from 'axios';
import { API_BASE_URL } from './config';
import { PostReq, PostRes } from '@shared/types/posts';

export class AuthApiService {
  static async login(
    data: PostReq['auth/login'],
  ): Promise<PostRes['auth/login']> {
    const response = await axios.post<PostRes['auth/login']>(
      `${API_BASE_URL}/auth/login`,
      data,
      {
        withCredentials: true,
      },
    );

    return response.data;
  }

  static async logout(): Promise<void> {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }
}
