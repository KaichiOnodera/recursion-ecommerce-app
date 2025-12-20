import { apiClient } from './apiClient';
import { PostRes } from '@shared/types/posts';

export async function createCheckoutSession(): Promise<
  PostRes['/checkout/session']
> {
  const response =
    await apiClient.post<PostRes['/checkout/session']>('/checkout/session');
  return response.data;
}
