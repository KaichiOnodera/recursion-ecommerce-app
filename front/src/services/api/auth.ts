import { apiClient } from './apiClient';
import { PostReq, PostRes } from '@shared/types/posts';
import { GetRes } from '@shared/types/gets';

export async function login(
  data: PostReq['/auth/login'],
): Promise<PostRes['/auth/login']> {
  const response = await apiClient.post<PostRes['/auth/login']>(
    '/auth/login',
    data,
  );

  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout', {});
}

export async function getMe(): Promise<GetRes['/auth/me']> {
  const response = await apiClient.get<GetRes['/auth/me']>('/auth/me');
  return response.data;
}
