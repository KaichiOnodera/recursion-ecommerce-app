import { apiClient } from './apiClient';
import { PostReq, PostRes } from '@shared/types/posts';
import { PatchReq, PatchRes } from '@shared/types/patches';
import { DeleteRes } from '@shared/types/delete';

export async function signup(
  data: PostReq['/auth/signup'],
): Promise<PostRes['/auth/signup']> {
  const response = await apiClient.post<PostRes['/auth/signup']>(
    '/auth/signup',
    data,
  );

  return response.data;
}

export async function updateProfile(
  data: PatchReq['/users/profile'],
): Promise<PatchRes['/users/profile']> {
  const response = await apiClient.put<PatchRes['/users/profile']>(
    '/users/profile',
    data,
  );
  return response.data;
}

export async function resign(): Promise<DeleteRes['/auth/resign']> {
  const response =
    await apiClient.delete<DeleteRes['/auth/resign']>('/auth/resign');
  return response.data;
}
