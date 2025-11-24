import { apiClient } from './apiClient';
import { PostReq, PostRes } from '@shared/types/posts';
import { GetRes } from '@shared/types/gets';

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

  static async getMe(): Promise<GetRes['/auth/me']> {
    const response = await apiClient.get<GetRes['/auth/me']>('/auth/me');
    return response.data;
  }
}
