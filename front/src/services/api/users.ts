import { apiClient } from './apiClient';
import { PostReq, PostRes } from '@shared/types/posts';

export async function signup(
  data: PostReq['users/signup'],
): Promise<PostRes['users/signup']> {
  const response = await apiClient.post<PostRes['users/signup']>(
    '/users/signup',
    data,
  );

  return response.data;
}
