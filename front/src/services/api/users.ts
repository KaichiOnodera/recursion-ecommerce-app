import { apiClient } from './apiClient';
import { PostReq, PostRes } from '@shared/types/posts';
import { PatchReq, PatchRes } from '@shared/types/patches';

export async function signup(
  data: PostReq['users/signup'],
): Promise<PostRes['users/signup']> {
  const response = await apiClient.post<PostRes['users/signup']>(
    '/users/signup',
    data,
  );

  return response.data;
}

export async function updateProfile(
  data: PatchReq['users/profile'],
): Promise<PatchRes['users/profile']> {
  const response = await apiClient.put<PatchRes['users/profile']>(
    '/users/profile',
    data,
  );
  return response.data;
}
