import { apiClient } from './apiClient';
import { PostReq, PostRes } from '@shared/types/posts';

export class AuthApiService {
  static async login(
    data: PostReq['auth/login'],
  ): Promise<PostRes['auth/login']> {
    const response = await apiClient.post<PostRes['auth/login']>(
      '/auth/login',
      data,
    );

    return response.data;
  }

  static async logout(): Promise<void> {
    await apiClient.post('/auth/logout', {});
  }
}
